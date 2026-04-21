import { useEffect, useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

type Run = {
  runDate: string;
  pressureRunId: string | null;
  durationMs: number | null;
  totalAssertions: number | null;
  passed: number | null;
  failed: number | null;
  result: 'pass' | 'fail' | 'partial' | 'unknown';
  gitSha: string | null;
  gitBranch: string | null;
  companyCount: number | null;
  signalsFired: number | null;
  atRisk: number | null;
  caution: number | null;
  critical: number | null;
  assertionsGenerated: number | null;
  snapshotSha: string | null;
  completed: boolean | null;
};

type SignalFired = {
  signalId: string;
  label: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  companies: string[];
  confidence: string | null;
  businessMeaning: string | null;
};

type CompanyResult = {
  id: string;
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

type AuditEntry = {
  company: string;
  monthlyRevenueVariance: number | null;
  cashBalanceVariance: number | null;
  runwayMonthsVariance: number | null;
  grossMarginVariance: number | null;
  signalsFiredVariance: number | null;
  overallAudit: string | null;
  variancePass: boolean;
  notes: string | null;
};

type RunDetail = {
  run: Run;
  signalsFired: SignalFired[];
  companies: CompanyResult[];
  auditEntries: AuditEntry[];
  auditAllClean: boolean;
};

type ListState =
  | { kind: 'loading' }
  | { kind: 'ok'; runs: Run[] }
  | { kind: 'error' };

function pacificDate(iso: string | null): string {
  if (!iso) return 'No run recorded';
  const d = new Date(`${iso}T12:00:00Z`); // midday anchor avoids TZ edge cases
  if (Number.isNaN(d.getTime())) return 'No run recorded';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' });
}

function pacificFull(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(`${iso}T09:00:00Z`); // 2 AM PT nightly run ≈ 09:00 UTC (DST-agnostic approximation)
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });
}

function padToSeven(runs: Run[]): Array<Run | null> {
  const padded: Array<Run | null> = runs.slice(0, 7);
  while (padded.length < 7) padded.push(null);
  return padded;
}

function useCountdownToNextRun() {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);
  const now = new Date();
  const ptNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const next = new Date(ptNow);
  next.setHours(2, 0, 0, 0);
  if (ptNow >= next) next.setDate(next.getDate() + 1);
  const deltaMs = next.getTime() - ptNow.getTime();
  const h = Math.floor(deltaMs / 3_600_000);
  const m = Math.floor((deltaMs % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export default function Status() {
  const [list, setList] = useState<ListState>({ kind: 'loading' });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, RunDetail | 'loading' | 'error'>>({});
  const countdown = useCountdownToNextRun();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats/runs?limit=7', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: { ok?: boolean; runs?: Run[] }) => {
        if (cancelled) return;
        if (!j?.ok) return setList({ kind: 'error' });
        setList({ kind: 'ok', runs: j.runs ?? [] });
      })
      .catch(() => { if (!cancelled) setList({ kind: 'error' }); });
    return () => { cancelled = true; };
  }, []);

  const toggle = (runDate: string) => {
    if (expanded === runDate) {
      setExpanded(null);
      return;
    }
    setExpanded(runDate);
    if (!(runDate in details)) {
      setDetails((d) => ({ ...d, [runDate]: 'loading' }));
      fetch(`/api/stats/run/${encodeURIComponent(runDate)}`, { headers: { Accept: 'application/json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((j: { ok?: boolean } & RunDetail) => {
          if (!j?.ok) return setDetails((d) => ({ ...d, [runDate]: 'error' }));
          setDetails((d) => ({ ...d, [runDate]: j as RunDetail }));
        })
        .catch(() => setDetails((d) => ({ ...d, [runDate]: 'error' })));
    }
  };

  const runs = list.kind === 'ok' ? list.runs : [];
  const padded = padToSeven(runs);
  const totals = runs.reduce(
    (a, r) => {
      a.runs += 1;
      a.failed += r.result === 'fail' ? 1 : 0;
      return a;
    },
    { runs: 0, failed: 0 },
  );
  const passRate = totals.runs > 0
    ? `${Math.round(((totals.runs - totals.failed) / totals.runs) * 100)}%`
    : '—';

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 96 }}>
        <section className="section" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div className="container">
            <div className="kicker">System Transparency</div>
            <h1 className="h-xl">Last 7 nightly pressure tests.</h1>
            <p className="lede">
              Every night at 2:00 AM PT, the deterministic financial engine runs against 20 synthetic companies.
              This page shows the last seven runs — honestly, including any failures.
            </p>

            {/* Zone 1 — at-a-glance bars */}
            <div style={{ marginTop: 40 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: 8,
              }}>
                {padded.map((r, i) => (
                  <StatusBar key={r?.runDate ?? `gap-${i}`} run={r} />
                ))}
              </div>
              <div style={{
                marginTop: 20,
                fontFamily: 'var(--f-mono)',
                fontSize: 13,
                color: 'var(--c-text-muted)',
                letterSpacing: '0.02em',
              }}>
                {list.kind === 'loading' && 'Loading runs…'}
                {list.kind === 'error' && 'Could not load recent runs.'}
                {list.kind === 'ok' && (
                  <>
                    <span style={{ color: 'var(--c-positive)' }}>{passRate}</span> pass rate ·{' '}
                    <span>{totals.runs}</span> runs ·{' '}
                    <span style={{ color: totals.failed > 0 ? 'var(--c-critical)' : 'var(--c-text-muted)' }}>{totals.failed}</span> failures
                  </>
                )}
              </div>
            </div>

            {/* Zone 2 — detail table */}
            <div style={{ marginTop: 56, borderTop: '1px solid var(--c-border)', paddingTop: 40 }}>
              <h2 className="h-lg">Run detail</h2>
              <div style={{
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                marginTop: 24,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 0.8fr 0.9fr 0.7fr 0.7fr 0.8fr 0.9fr',
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--c-border)',
                  background: 'var(--c-raised)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--c-text-dim)',
                  fontWeight: 500,
                }}>
                  <span>Date</span>
                  <span>Duration</span>
                  <span>Assertions</span>
                  <span>Passed</span>
                  <span>Failed</span>
                  <span>Result</span>
                  <span>Commit</span>
                </div>
                {list.kind === 'ok' && runs.length === 0 && (
                  <div style={{ padding: 32, color: 'var(--c-text-dim)', fontSize: 14 }}>No runs recorded yet.</div>
                )}
                {runs.map((r) => (
                  <RunRow
                    key={r.runDate}
                    run={r}
                    expanded={expanded === r.runDate}
                    detail={details[r.runDate]}
                    onToggle={() => toggle(r.runDate)}
                  />
                ))}
              </div>
            </div>

            <div style={{
              marginTop: 40,
              fontFamily: 'var(--f-mono)',
              fontSize: 12,
              color: 'var(--c-text-dim)',
              letterSpacing: '0.05em',
            }}>
              Updated every night at 2 AM PT · Next run in {countdown}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatusBar({ run }: { run: Run | null }) {
  if (!run) {
    return (
      <div title="No run recorded" style={{
        height: 56,
        borderRadius: 'var(--r)',
        background: 'var(--c-overlay)',
        border: '1px solid var(--c-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        <span style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          color: 'var(--c-text-faint)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>—</span>
      </div>
    );
  }
  const fail = run.result === 'fail';
  const partial = run.result === 'partial';
  const unknown = run.result === 'unknown';
  const color = fail
    ? 'var(--c-critical)'
    : partial
    ? 'var(--c-warning)'
    : unknown
    ? 'var(--c-text-faint)'
    : 'var(--c-positive)';
  const trace = fail
    ? 'var(--c-critical-trace)'
    : partial
    ? 'var(--c-warning-trace)'
    : unknown
    ? 'var(--c-overlay)'
    : 'var(--c-positive-trace)';
  const border = fail
    ? 'var(--c-critical-border)'
    : partial
    ? 'var(--c-warning-border)'
    : unknown
    ? 'var(--c-border)'
    : 'var(--c-positive-border)';
  return (
    <div
      title={fail ? 'Run failed' : partial ? 'Run partial' : unknown ? 'Result unknown' : 'All assertions passed'}
      style={{
        height: 56,
        borderRadius: 'var(--r)',
        background: trace,
        border: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 10,
        color,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}>{pacificDate(run.runDate)}</span>
      <span style={{ color, fontSize: 13, lineHeight: 1 }}>{fail ? '✕' : partial ? '◐' : unknown ? '—' : '✓'}</span>
    </div>
  );
}

function RunRow({ run, expanded, detail, onToggle }: {
  run: Run;
  expanded: boolean;
  detail: RunDetail | 'loading' | 'error' | undefined;
  onToggle: () => void;
}) {
  const duration = run.durationMs != null ? `${(run.durationMs / 1000).toFixed(2)}s` : '—';
  const fail = run.result === 'fail';
  const partial = run.result === 'partial';
  const pillColor = fail ? 'var(--c-critical)' : partial ? 'var(--c-warning)' : run.result === 'unknown' ? 'var(--c-text-dim)' : 'var(--c-positive)';
  const pillBg = fail ? 'var(--c-critical-trace)' : partial ? 'var(--c-warning-trace)' : run.result === 'unknown' ? 'var(--c-overlay)' : 'var(--c-positive-trace)';
  const pillBorder = fail ? 'var(--c-critical-border)' : partial ? 'var(--c-warning-border)' : run.result === 'unknown' ? 'var(--c-border)' : 'var(--c-positive-border)';
  const pillLabel = fail ? 'Fail' : partial ? 'Partial' : run.result === 'unknown' ? '—' : 'Pass';
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: '1fr 0.8fr 0.9fr 0.7fr 0.7fr 0.8fr 0.9fr',
          padding: '14px 20px',
          borderBottom: expanded ? '1px solid var(--c-border)' : '1px solid transparent',
          alignItems: 'center',
          fontSize: 13,
          color: 'var(--c-text)',
          fontFamily: 'var(--f-mono)',
          transition: 'background var(--dur-quick) var(--ease-quick)',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-raised)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ''; }}
      >
        <span>{pacificFull(run.runDate)}</span>
        <span>{duration}</span>
        <span>{(run.totalAssertions ?? 0).toLocaleString()}</span>
        <span style={{ color: 'var(--c-positive)' }}>{(run.passed ?? 0).toLocaleString()}</span>
        <span style={{ color: (run.failed ?? 0) > 0 ? 'var(--c-critical)' : 'var(--c-text-dim)' }}>{(run.failed ?? 0).toLocaleString()}</span>
        <span>
          <span style={{
            padding: '2px 8px',
            borderRadius: 'var(--r-pill)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: pillColor,
            background: pillBg,
            border: `1px solid ${pillBorder}`,
          }}>{pillLabel}</span>
        </span>
        <span style={{ color: 'var(--c-text-dim)', fontSize: 12 }}>{run.gitSha ? run.gitSha.slice(0, 7) : '—'}</span>
      </button>
      {expanded && (
        <div style={{
          padding: '20px 20px 24px',
          borderBottom: '1px solid var(--c-border)',
          background: 'var(--c-raised)',
        }}>
          <RunDetailBody detail={detail} />
        </div>
      )}
    </>
  );
}

function RunDetailBody({ detail }: { detail: RunDetail | 'loading' | 'error' | undefined }) {
  if (!detail || detail === 'loading') {
    return <div style={{ fontSize: 13, color: 'var(--c-text-dim)' }}>Loading run detail…</div>;
  }
  if (detail === 'error') {
    return <div style={{ fontSize: 13, color: 'var(--c-critical)' }}>Could not load run detail.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 28 }} className="detail-grid">
      <div>
        <SectionHeader>Signals fired ({detail.signalsFired.length})</SectionHeader>
        {detail.signalsFired.length === 0 ? (
          <EmptyLine>No signals fired this run — clean engine pass.</EmptyLine>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {detail.signalsFired.slice(0, 20).map((s) => (
              <SignalRow key={s.signalId} signal={s} />
            ))}
            {detail.signalsFired.length > 20 && (
              <li style={{ fontSize: 12, color: 'var(--c-text-faint)', fontFamily: 'var(--f-mono)' }}>
                … and {detail.signalsFired.length - 20} more signal groups.
              </li>
            )}
          </ul>
        )}

        <SectionHeader>Audit log</SectionHeader>
        {detail.auditEntries.length === 0 ? (
          <EmptyLine>No audit entries recorded for this run.</EmptyLine>
        ) : detail.auditAllClean ? (
          <div style={{
            fontSize: 13,
            fontFamily: 'var(--f-mono)',
            color: 'var(--c-positive)',
            padding: '10px 12px',
            background: 'var(--c-positive-trace)',
            border: '1px solid var(--c-positive-border)',
            borderRadius: 'var(--r)',
          }}>
            ✓ All {detail.auditEntries.length} companies within expected bounds — no anomalies.
          </div>
        ) : (
          <AuditTable entries={detail.auditEntries} />
        )}
      </div>

      <div>
        <SectionHeader>Synthetic companies ({detail.companies.length})</SectionHeader>
        {detail.companies.length === 0 ? (
          <EmptyLine>No company data recorded.</EmptyLine>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {detail.companies.map((c) => (
              <CompanyRow key={c.id} company={c} />
            ))}
          </ul>
        )}
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--c-text-faint)', lineHeight: 1.5 }}>
          Company identifiers are anonymized within each run for transparency without exposure.
          The A / B / C order is stable across signals, audit log, and this list.
        </div>

        {detail.run.snapshotSha && (
          <>
            <SectionHeader>Snapshot commit</SectionHeader>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 12,
              color: 'var(--c-text-muted)',
              padding: '6px 10px',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r)',
              display: 'inline-block',
              background: 'var(--c-surface)',
            }}>{detail.run.snapshotSha}</div>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const SEV_COLOR: Record<SignalFired['severity'], { fg: string; bg: string; br: string }> = {
  critical: { fg: 'var(--c-critical)', bg: 'var(--c-critical-trace)', br: 'var(--c-critical-border)' },
  high: { fg: 'var(--c-warning)', bg: 'var(--c-warning-trace)', br: 'var(--c-warning-border)' },
  medium: { fg: 'var(--c-info)', bg: 'var(--c-info-trace)', br: 'var(--c-info-border)' },
  low: { fg: 'var(--c-text-dim)', bg: 'var(--c-overlay)', br: 'var(--c-border)' },
  unknown: { fg: 'var(--c-text-dim)', bg: 'var(--c-overlay)', br: 'var(--c-border)' },
};

function SignalRow({ signal }: { signal: SignalFired }) {
  const sev = SEV_COLOR[signal.severity];
  return (
    <li style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      padding: '10px 12px',
      border: '1px solid var(--c-border)',
      borderRadius: 'var(--r)',
      background: 'var(--c-surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--c-accent)',
          fontWeight: 600,
        }}>{signal.signalId}</span>
        <span style={{ fontSize: 13, color: 'var(--c-text)', fontWeight: 500 }}>{signal.label ?? '—'}</span>
        <span style={{
          marginLeft: 'auto',
          padding: '1px 8px',
          borderRadius: 'var(--r-pill)',
          border: `1px solid ${sev.br}`,
          background: sev.bg,
          color: sev.fg,
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>{signal.severity}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--c-text-dim)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {signal.companies.map((c) => (
          <span key={c} style={{
            fontFamily: 'var(--f-mono)',
            padding: '1px 6px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--c-border)',
            background: 'var(--c-canvas)',
            color: 'var(--c-text-muted)',
            letterSpacing: '0.03em',
          }}>{c}</span>
        ))}
      </div>
    </li>
  );
}

function CompanyRow({ company }: { company: CompanyResult }) {
  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      border: '1px solid var(--c-border)',
      borderRadius: 'var(--r)',
      background: 'var(--c-surface)',
    }}>
      <span style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--c-text)',
        minWidth: 90,
      }}>{company.id}</span>
      <span style={{ fontSize: 12, color: 'var(--c-text-muted)', flex: 1, minWidth: 0 }}>
        {[company.industry, company.revenueModel].filter(Boolean).join(' · ')}
      </span>
      <span style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        color: 'var(--c-text-dim)',
        letterSpacing: '0.04em',
      }}>
        <Sev n={company.critical} kind="critical" />{' '}
        <Sev n={company.high} kind="high" />{' '}
        <Sev n={company.medium} kind="medium" />{' '}
        <Sev n={company.low} kind="low" />
      </span>
    </li>
  );
}

function Sev({ n, kind }: { n: number; kind: 'critical' | 'high' | 'medium' | 'low' }) {
  const c = SEV_COLOR[kind];
  return (
    <span style={{ color: n > 0 ? c.fg : 'var(--c-text-faint)' }}>{kind[0].toUpperCase()}:{n}</span>
  );
}

function AuditTable({ entries }: { entries: AuditEntry[] }) {
  const failing = entries.filter((e) => !e.variancePass);
  return (
    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: 12,
      color: 'var(--c-text-muted)',
      border: '1px solid var(--c-border)',
      borderRadius: 'var(--r)',
      background: 'var(--c-surface)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 0.8fr',
        padding: '8px 12px',
        borderBottom: '1px solid var(--c-border)',
        background: 'var(--c-raised)',
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--c-text-dim)',
      }}>
        <span>Company</span>
        <span>Revenue Δ</span>
        <span>Cash Δ</span>
        <span>Runway Δ</span>
        <span>Overall</span>
      </div>
      {failing.slice(0, 40).map((e) => (
        <div key={e.company} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 0.8fr',
          padding: '6px 12px',
          borderBottom: '1px solid var(--c-border)',
          fontSize: 11,
        }}>
          <span>{e.company}</span>
          <span style={{ color: variantColor(e.monthlyRevenueVariance) }}>{fmtVar(e.monthlyRevenueVariance)}</span>
          <span style={{ color: variantColor(e.cashBalanceVariance) }}>{fmtVar(e.cashBalanceVariance)}</span>
          <span style={{ color: variantColor(e.runwayMonthsVariance) }}>{fmtVar(e.runwayMonthsVariance)}</span>
          <span style={{ color: 'var(--c-text-dim)' }}>{e.overallAudit ?? '—'}</span>
        </div>
      ))}
      {failing.length > 40 && (
        <div style={{ padding: '6px 12px', fontSize: 11, color: 'var(--c-text-faint)' }}>
          … and {failing.length - 40} more rows.
        </div>
      )}
    </div>
  );
}

function fmtVar(n: number | null): string {
  if (n == null) return '—';
  if (Math.abs(n) < 1e-9) return '0';
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function variantColor(n: number | null): string {
  if (n == null) return 'var(--c-text-dim)';
  if (Math.abs(n) < 1e-9) return 'var(--c-positive)';
  return 'var(--c-critical)';
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--c-text-dim)',
      fontWeight: 500,
      marginTop: 20,
      marginBottom: 10,
    }}>{children}</div>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 13,
      color: 'var(--c-text-dim)',
      fontFamily: 'var(--f-mono)',
      padding: '6px 0',
    }}>{children}</div>
  );
}
