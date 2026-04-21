/**
 * Airtable client for the nightly pressure-test runs that back the
 * SystemStatus panel and the /status page.
 *
 * Tables in base appHP0GiJuiNFbdMO:
 *   Test Suite Runs     tbl5OwObOUgowIFaH  (vitest counts; mixed run types — filter to -nightly)
 *   Pressure Test Runs  tblB3xilTPHrdd70l  (nightly metadata; nightly-by-construction)
 *   Engine Test Results tblxMkcTCyjmlV6cF  (20 rows/run: per-synthetic-company)
 *   Signal Details      tblmhycJbjqvfT6n5  (~155 rows/run, paginated: per-signal-per-company)
 *   Engine Check Audit  tblCset6o4ze0wKFE  (20 rows/run: variance vs baseline)
 *
 * Run Date (ISO YYYY-MM-DD) is the universal join key. Run ID string
 * prefixes differ between Test Suite Runs and the others, so it's not
 * usable cross-table.
 */

const BASE_ID = "appHP0GiJuiNFbdMO";
const TBL_TEST_SUITE_RUNS = "tbl5OwObOUgowIFaH";
const TBL_PRESSURE_TEST_RUNS = "tblB3xilTPHrdd70l";
const TBL_ENGINE_TEST_RESULTS = "tblxMkcTCyjmlV6cF";
const TBL_SIGNAL_DETAILS = "tblmhycJbjqvfT6n5";
const TBL_ENGINE_CHECK_AUDIT = "tblCset6o4ze0wKFE";

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

function authHeaders(): Record<string, string> {
  const token = process.env.AIRTABLE_API_TOKEN;
  if (!token) throw new Error("AIRTABLE_API_TOKEN not set");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function listAll(
  tableId: string,
  params: Record<string, string | string[]>,
  maxPages = 10,
): Promise<AirtableRecord[]> {
  const all: AirtableRecord[] = [];
  let offset: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x));
      else url.searchParams.set(k, v);
    }
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url.toString(), { headers: authHeaders() });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Airtable ${tableId} ${res.status}: ${body}`);
    }
    const json = (await res.json()) as AirtableListResponse;
    all.push(...(json.records || []));
    if (!json.offset) return all;
    offset = json.offset;
  }
  return all;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
export function isIsoDate(s: string): boolean {
  return ISO_DATE.test(s);
}

/** Escape a value for safe inclusion inside an Airtable formula string. */
function quote(s: string): string {
  return `'${s.replace(/'/g, "\\'")}'`;
}

function dateFilter(isoDate: string): string {
  return `IS_SAME({Run Date},${quote(isoDate)},'day')`;
}

// ── Normalizers ─────────────────────────────────────────────────────────

export type RunSummary = {
  /** ISO date; doubles as the join key and the /run/:runDate URL param. */
  runDate: string;
  /** Pressure Test Runs Run ID (YYYY-MM-DD-NNN); null if no pressure row. */
  pressureRunId: string | null;
  durationMs: number | null;
  /** From Test Suite Runs nightly row (null if missing). */
  totalAssertions: number | null;
  passed: number | null;
  failed: number | null;
  /** "Green" | "Red" | "Partial" | null from Test Suite Runs; mapped to pass/fail/unknown. */
  result: "pass" | "fail" | "partial" | "unknown";
  gitSha: string | null;
  gitBranch: string | null;
  /** From Pressure Test Runs. */
  companyCount: number | null;
  signalsFired: number | null;
  atRisk: number | null;
  caution: number | null;
  critical: number | null;
  assertionsGenerated: number | null;
  snapshotSha: string | null;
  completed: boolean | null;
};

function mapResult(v: string | undefined): RunSummary["result"] {
  if (!v) return "unknown";
  const r = v.toLowerCase();
  if (r === "green" || r === "pass" || r === "passed" || r === "ok") return "pass";
  if (r === "red" || r === "fail" || r === "failed" || r === "error") return "fail";
  if (r === "partial") return "partial";
  return "unknown";
}

function normalizePressureRow(row: AirtableRecord) {
  const f = row.fields;
  return {
    pressureRunId: asString(f["Run ID"]) ?? null,
    runDate: asString(f["Run Date"]) ?? "",
    companyCount: asNumber(f["Company Count"]),
    signalsFired: asNumber(f["Total Signals Fired"]),
    atRisk: asNumber(f["At Risk count"]),
    caution: asNumber(f["Caution count"]),
    critical: asNumber(f["Critical count"]),
    assertionsGenerated: asNumber(f["Assertions Generated"]),
    snapshotSha: asString(f["Snapshot Commit SHA (pushed)"]) ?? null,
    completed: typeof f["Completed"] === "boolean" ? (f["Completed"] as boolean) : null,
    durationMs: (() => {
      const d = f["Duration"];
      if (typeof d === "number") return d * 1000; // Airtable duration field is seconds
      return null;
    })(),
  };
}

function normalizeTestSuiteRow(row: AirtableRecord) {
  const f = row.fields;
  return {
    runDate: asString(f["Run Date"]) ?? "",
    totalAssertions: asNumber(f["Total Assertions"]),
    passed: asNumber(f["Passed"]),
    failed: asNumber(f["Failed"]),
    durationMs: asNumber(f["Duration Ms"]),
    result: mapResult(asString(f["Result"])),
    gitSha: asString(f["Git SHA"]) ?? null,
    gitBranch: asString(f["Git Branch"]) ?? null,
  };
}

function mergeRun(
  pressure: ReturnType<typeof normalizePressureRow> | null,
  testSuite: ReturnType<typeof normalizeTestSuiteRow> | null,
): RunSummary | null {
  const runDate = pressure?.runDate || testSuite?.runDate;
  if (!runDate) return null;
  return {
    runDate,
    pressureRunId: pressure?.pressureRunId ?? null,
    durationMs: testSuite?.durationMs ?? pressure?.durationMs ?? null,
    totalAssertions: testSuite?.totalAssertions ?? null,
    passed: testSuite?.passed ?? null,
    failed: testSuite?.failed ?? null,
    result: testSuite?.result ?? "unknown",
    gitSha: testSuite?.gitSha ?? pressure?.snapshotSha ?? null,
    gitBranch: testSuite?.gitBranch ?? null,
    companyCount: pressure?.companyCount ?? null,
    signalsFired: pressure?.signalsFired ?? null,
    atRisk: pressure?.atRisk ?? null,
    caution: pressure?.caution ?? null,
    critical: pressure?.critical ?? null,
    assertionsGenerated: pressure?.assertionsGenerated ?? null,
    snapshotSha: pressure?.snapshotSha ?? null,
    completed: pressure?.completed ?? null,
  };
}

// ── Public API ──────────────────────────────────────────────────────────

/** Canonical run-ID shape for nightly Pressure Test Runs: YYYY-MM-DD-NNN.
 * Excludes VOID-/AUDIT-/-smoketest and other ad-hoc reruns. */
const PRESSURE_CANONICAL = `REGEX_MATCH({Run ID},"^\\\\d{4}-\\\\d{2}-\\\\d{2}-\\\\d{3}$")`;

export async function listRecentRuns(limit = 7): Promise<RunSummary[]> {
  const clamped = Math.min(Math.max(limit, 1), 30);

  // Pressure Test Runs: canonical nightly shape only. Over-fetch (30) to
  // absorb days with multiple legitimate reruns (-001, -002, ...), then
  // dedupe by Run Date keeping the highest sequence number per day.
  const pressureRows = await listAll(
    TBL_PRESSURE_TEST_RUNS,
    {
      pageSize: "30",
      "sort[0][field]": "Run Date",
      "sort[0][direction]": "desc",
      "sort[1][field]": "Run ID",
      "sort[1][direction]": "desc",
      filterByFormula: PRESSURE_CANONICAL,
    },
    1,
  );
  const byDate = new Map<string, ReturnType<typeof normalizePressureRow>>();
  for (const row of pressureRows) {
    const p = normalizePressureRow(row);
    if (p.runDate && !byDate.has(p.runDate)) byDate.set(p.runDate, p);
  }
  const pressures = Array.from(byDate.values()).slice(0, clamped);
  if (pressures.length === 0) return [];

  // Test Suite Runs nightly rows covering the same date window.
  const tsRows = await listAll(
    TBL_TEST_SUITE_RUNS,
    {
      pageSize: "30",
      "sort[0][field]": "Run Date",
      "sort[0][direction]": "desc",
      filterByFormula: `SEARCH("-nightly",{Run ID})>0`,
    },
    1,
  );
  const tsByDate = new Map<string, ReturnType<typeof normalizeTestSuiteRow>>();
  for (const r of tsRows) {
    const t = normalizeTestSuiteRow(r);
    if (t.runDate && !tsByDate.has(t.runDate)) tsByDate.set(t.runDate, t);
  }

  const merged = pressures
    .map((p) => mergeRun(p, tsByDate.get(p.runDate) ?? null))
    .filter((r): r is RunSummary => r !== null);
  return merged;
}

export async function getLatestRun(): Promise<RunSummary | null> {
  const runs = await listRecentRuns(1);
  return runs[0] ?? null;
}

// ── Run detail ──────────────────────────────────────────────────────────

export type SignalFired = {
  signalId: string;
  label: string | null;
  severity: "critical" | "high" | "medium" | "low" | "unknown";
  companies: string[]; // anonymized
  // Representative values (from the first occurrence). All entries share the
  // same signal ID so label/severity are stable.
  confidence: string | null;
  businessMeaning: string | null;
};

export type CompanyResult = {
  id: string; // anonymized label, e.g. "Company A"
  industry: string | null;
  revenueModel: string | null;
  employees: number | null;
  topSignal: string | null;
  critical: number;
  high: number;
  medium: number;
  low: number;
  healthScore: string | null;
};

export type AuditEntry = {
  company: string; // anonymized
  monthlyRevenueVariance: number | null;
  cashBalanceVariance: number | null;
  runwayMonthsVariance: number | null;
  grossMarginVariance: number | null;
  signalsFiredVariance: number | null;
  overallAudit: string | null;
  variancePass: boolean;
  notes: string | null;
};

export type RunDetail = {
  run: RunSummary;
  signalsFired: SignalFired[];
  companies: CompanyResult[];
  auditEntries: AuditEntry[];
  auditAllClean: boolean;
};

function mapSeverity(s: string | undefined): SignalFired["severity"] {
  if (!s) return "unknown";
  const v = s.toLowerCase();
  if (v === "critical" || v === "high" || v === "medium" || v === "low") return v;
  return "unknown";
}

/** Deterministic anonymization: A, B, ... Z, AA, AB, ... */
function anonLabel(index: number): string {
  if (index < 26) return `Company ${String.fromCharCode(65 + index)}`;
  const first = String.fromCharCode(65 + Math.floor(index / 26) - 1);
  const second = String.fromCharCode(65 + (index % 26));
  return `Company ${first}${second}`;
}

export async function getRunDetail(runDate: string): Promise<RunDetail | null> {
  if (!isIsoDate(runDate)) return null;
  const filter = dateFilter(runDate);

  const [pressureRows, tsRows, etrRows, sigRows, auditRows] = await Promise.all([
    listAll(
      TBL_PRESSURE_TEST_RUNS,
      {
        filterByFormula: `AND(${filter},${PRESSURE_CANONICAL})`,
        pageSize: "10",
        "sort[0][field]": "Run ID",
        "sort[0][direction]": "desc",
      },
      1,
    ),
    listAll(
      TBL_TEST_SUITE_RUNS,
      { filterByFormula: `AND(${filter},SEARCH("-nightly",{Run ID})>0)`, pageSize: "10" },
      1,
    ),
    listAll(TBL_ENGINE_TEST_RESULTS, { filterByFormula: filter, pageSize: "100" }, 1),
    listAll(TBL_SIGNAL_DETAILS, { filterByFormula: filter, pageSize: "100" }, 10),
    listAll(TBL_ENGINE_CHECK_AUDIT, { filterByFormula: filter, pageSize: "100" }, 1),
  ]);

  if (pressureRows.length === 0 && tsRows.length === 0) return null;

  // Pressure rows sorted Run ID desc — first is the highest sequence (-004 > -001).
  const pressure = pressureRows[0] ? normalizePressureRow(pressureRows[0]) : null;
  const testSuite = tsRows[0] ? normalizeTestSuiteRow(tsRows[0]) : null;
  const run = mergeRun(pressure, testSuite);
  if (!run) return null;
  run.runDate = runDate;

  // Build stable anonymization map from Engine Test Results, alphabetical
  // by Company Name so the mapping is deterministic across refreshes.
  const etrSorted = [...etrRows].sort((a, b) => {
    const an = asString(a.fields["Company Name"]) ?? "";
    const bn = asString(b.fields["Company Name"]) ?? "";
    return an.localeCompare(bn);
  });
  const anonMap = new Map<string, string>();
  etrSorted.forEach((row, i) => {
    const real = asString(row.fields["Company Name"]);
    if (real && !anonMap.has(real)) anonMap.set(real, anonLabel(i));
  });
  const anon = (real: string | undefined | null): string => {
    if (!real) return "Company ?";
    const known = anonMap.get(real);
    if (known) return known;
    // If a Signal Details / Audit row references a company not in ETR (rare
    // but possible), assign the next available label.
    const nextIndex = anonMap.size;
    const label = anonLabel(nextIndex);
    anonMap.set(real, label);
    return label;
  };

  // Companies (from Engine Test Results, sorted alphabetically so the A/B/C
  // ordering matches the anonMap)
  const companies: CompanyResult[] = etrSorted.map((row, i) => {
    const f = row.fields;
    return {
      id: anonLabel(i),
      industry: asString(f["Industry"]) ?? null,
      revenueModel: asString(f["Revenue Model"]) ?? null,
      employees: asNumber(f["Employees"]),
      topSignal: asString(f["Top Signal"]) ?? null,
      critical: asNumber(f["Critical"]) ?? 0,
      high: asNumber(f["High"]) ?? 0,
      medium: asNumber(f["Medium"]) ?? 0,
      low: asNumber(f["Low"]) ?? 0,
      healthScore: asString(f["Health Score"]) ?? null,
    };
  });

  // Signals fired: group by Signal ID, collect anonymized companies.
  const signalGroups = new Map<string, SignalFired>();
  // Severity ranking to preserve highest severity if duplicates disagree.
  const sevRank: Record<SignalFired["severity"], number> = {
    critical: 4, high: 3, medium: 2, low: 1, unknown: 0,
  };
  for (const row of sigRows) {
    const f = row.fields;
    const id = asString(f["Signal ID"]);
    if (!id) continue;
    const company = anon(asString(f["Company Name"]));
    const existing = signalGroups.get(id);
    const severity = mapSeverity(asString(f["Severity"]));
    if (existing) {
      if (!existing.companies.includes(company)) existing.companies.push(company);
      if (sevRank[severity] > sevRank[existing.severity]) existing.severity = severity;
    } else {
      signalGroups.set(id, {
        signalId: id,
        label: asString(f["Signal Label"]) ?? null,
        severity,
        companies: [company],
        confidence: asString(f["Confidence"]) ?? null,
        businessMeaning: asString(f["Business Meaning"]) ?? null,
      });
    }
  }
  // Sort groups: severity desc, then by count of companies desc, then by id.
  const signalsFired = Array.from(signalGroups.values()).sort((a, b) => {
    const s = sevRank[b.severity] - sevRank[a.severity];
    if (s !== 0) return s;
    const c = b.companies.length - a.companies.length;
    if (c !== 0) return c;
    return a.signalId.localeCompare(b.signalId);
  });
  // Canonicalize each group's company list in the run's A/B/C order
  for (const g of signalsFired) {
    g.companies.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  // Audit entries: variance rows, with per-company anonymization.
  const auditEntries: AuditEntry[] = auditRows.map((row) => {
    const f = row.fields;
    const company = anon(asString(f["Company Name"]));
    const overall = asString(f["Overall Audit"]) ?? null;
    return {
      company,
      monthlyRevenueVariance: asNumber(f["Monthly Revenue (Variance)"]),
      cashBalanceVariance: asNumber(f["Cash Balance (Variance)"]),
      runwayMonthsVariance: asNumber(f["Runway Months (Variance)"]),
      grossMarginVariance: asNumber(f["Gross Margin % (Variance)"]),
      signalsFiredVariance: asNumber(f["Signals Fired (Variance)"]),
      overallAudit: overall,
      variancePass: (() => {
        const nonZero = [
          asNumber(f["Monthly Revenue (Variance)"]),
          asNumber(f["Cash Balance (Variance)"]),
          asNumber(f["Runway Months (Variance)"]),
          asNumber(f["Gross Margin % (Variance)"]),
          asNumber(f["Signals Fired (Variance)"]),
        ].some((n) => n != null && Math.abs(n) > 1e-9);
        if (!nonZero) return true;
        // If variance notes / overall say pass, trust that.
        if (overall && /pass|ok|green/i.test(overall)) return true;
        return false;
      })(),
      notes: asString(f["Variance Notes"]) ?? null,
    };
  }).sort((a, b) => a.company.localeCompare(b.company, undefined, { numeric: true }));

  const auditAllClean =
    auditEntries.length > 0 && auditEntries.every((e) => e.variancePass);

  return {
    run,
    signalsFired,
    companies,
    auditEntries,
    auditAllClean,
  };
}
