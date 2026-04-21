/**
 * Airtable client for the nightly pressure-test runs that power the
 * Status page and SystemStatus panel on the home page.
 */

const STATS_BASE_ID = "appHP0GiJuiNFbdMO";
const RUNS_TABLE_ID = "tbl5OwObOUgowIFaH"; // Test Suite Runs
const AUDIT_TABLE_ID = "tblCset6o4ze0wKFE"; // Engine Check Audit

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
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function fetchTable(
  tableId: string,
  params: Record<string, string | string[]> = {},
): Promise<AirtableRecord[]> {
  const url = new URL(`https://api.airtable.com/v0/${STATS_BASE_ID}/${tableId}`);
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x));
    else url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${tableId} ${res.status}: ${body}`);
  }
  const json = (await res.json()) as AirtableListResponse;
  return json.records || [];
}

/** Pull a field value tolerantly across common name variants. */
function pickField(rec: AirtableRecord, names: string[]): unknown {
  for (const n of names) {
    if (n in rec.fields) return rec.fields[n];
  }
  return undefined;
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

export type RunSummary = {
  id: string;
  runDate: string | null;
  runTime: string | null;
  durationMs: number | null;
  totalAssertions: number | null;
  passed: number | null;
  failed: number | null;
  result: "pass" | "fail" | "unknown";
  gitSha: string | null;
};

function normalizeRun(rec: AirtableRecord): RunSummary {
  const runDate =
    asString(pickField(rec, ["Run Date", "runDate", "Date", "date"])) ??
    rec.createdTime ??
    null;
  const runTime = asString(pickField(rec, ["Run Time", "runTime", "Time"])) ?? null;
  const durationMs = asNumber(
    pickField(rec, ["Duration", "Duration (ms)", "durationMs", "duration"]),
  );
  const totalAssertions = asNumber(
    pickField(rec, ["Total Assertions", "totalAssertions", "Assertions"]),
  );
  const passed = asNumber(pickField(rec, ["Passed", "passed"]));
  const failed = asNumber(pickField(rec, ["Failed", "failed"]));
  const resultRaw = asString(
    pickField(rec, ["Result", "result", "Status", "status"]),
  );
  const result: RunSummary["result"] = (() => {
    if (!resultRaw) {
      if (failed != null && failed > 0) return "fail";
      if (passed != null && totalAssertions != null && passed === totalAssertions)
        return "pass";
      return "unknown";
    }
    const r = resultRaw.toLowerCase();
    if (r.includes("pass") || r === "ok" || r === "success") return "pass";
    if (r.includes("fail") || r === "error") return "fail";
    return "unknown";
  })();
  const gitSha = asString(
    pickField(rec, ["Git SHA", "gitSha", "Commit SHA", "commitSha", "SHA"]),
  ) ?? null;
  return {
    id: rec.id,
    runDate,
    runTime,
    durationMs,
    totalAssertions,
    passed,
    failed,
    result,
    gitSha,
  };
}

export async function listRecentRuns(limit = 7): Promise<RunSummary[]> {
  // Airtable sort: attempt Run Date desc first; fall back to created time.
  const records = await fetchTable(RUNS_TABLE_ID, {
    pageSize: String(Math.min(Math.max(limit, 1), 100)),
    "sort[0][field]": "Run Date",
    "sort[0][direction]": "desc",
  }).catch(async () => {
    // Fallback: no sort spec — Airtable returns records in arbitrary order.
    return fetchTable(RUNS_TABLE_ID, { pageSize: String(Math.min(Math.max(limit, 1), 100)) });
  });
  const runs = records.map(normalizeRun);
  // Defensive client-side sort (newest first by runDate).
  runs.sort((a, b) => {
    const at = a.runDate ? Date.parse(a.runDate) : 0;
    const bt = b.runDate ? Date.parse(b.runDate) : 0;
    return bt - at;
  });
  return runs.slice(0, limit);
}

export async function getLatestRun(): Promise<RunSummary | null> {
  const runs = await listRecentRuns(1);
  return runs[0] ?? null;
}

export type RunDetail = {
  run: RunSummary;
  signalsFired: Array<{ id: string; name: string | null; severity: string | null; category: string | null }>;
  companies: string[]; // anonymized
  auditLog: Array<{ signal: string | null; value: number | null; threshold: number | null; pass: boolean | null }>;
};

/** Anonymize a list of synthetic company names into "Company A", "B", ... */
function anonymizeCompanies(names: string[]): string[] {
  const unique = Array.from(new Set(names));
  return unique.map((_, i) => `Company ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ""}`);
}

export async function getRunDetail(runId: string): Promise<RunDetail | null> {
  // Fetch the run itself.
  const res = await fetch(
    `https://api.airtable.com/v0/${STATS_BASE_ID}/${RUNS_TABLE_ID}/${runId}`,
    { headers: authHeaders() },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Airtable run fetch ${res.status}`);
  const rec = (await res.json()) as AirtableRecord;
  const run = normalizeRun(rec);

  // Fetch linked audit rows, if this base exposes them and the run record
  // links to them. We use filterByFormula to match on a likely foreign-key
  // field; if the field doesn't exist or returns zero rows we degrade gracefully.
  let auditRows: AirtableRecord[] = [];
  try {
    auditRows = await fetchTable(AUDIT_TABLE_ID, {
      filterByFormula: `OR({Run}="${runId}",{Run ID}="${runId}",{runId}="${runId}")`,
      pageSize: "100",
    });
  } catch {
    auditRows = [];
  }

  const signalsFired = auditRows.map((row) => ({
    id:
      asString(pickField(row, ["Signal", "Signal ID", "signal", "signalId"])) ??
      row.id,
    name: asString(pickField(row, ["Signal Name", "Name", "name"])) ?? null,
    severity: asString(pickField(row, ["Severity", "severity"])) ?? null,
    category: asString(pickField(row, ["Category", "category"])) ?? null,
  }));

  const companyNames = auditRows
    .map((row) => asString(pickField(row, ["Company", "Company Name", "company"])))
    .filter((x): x is string => !!x);

  const auditLog = auditRows.map((row) => ({
    signal:
      asString(pickField(row, ["Signal", "Signal ID", "signal", "signalId"])) ??
      null,
    value: asNumber(pickField(row, ["Value", "value", "Actual"])),
    threshold: asNumber(pickField(row, ["Threshold", "threshold"])),
    pass: (() => {
      const v = pickField(row, ["Pass", "Passed", "pass"]);
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return /true|pass|1/i.test(v);
      return null;
    })(),
  }));

  return {
    run,
    signalsFired,
    companies: anonymizeCompanies(companyNames),
    auditLog,
  };
}
