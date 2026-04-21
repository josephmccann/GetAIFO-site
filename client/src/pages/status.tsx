import { useEffect, useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

type Run = {
  id: string;
  runDate: string | null;
  runTime: string | null;
  durationMs: number | null;
  totalAssertions: number | null;
  passed: number | null;
  failed: number | null;
  result: 'pass' | 'fail' | 'unknown';
  gitSha: string | null;
};

type RunDetail = {
  run: Run;
  signalsFired: Array<{ id: string; name: string | null; severity: string | null; category: string | null }>;
  companies: string[];
  auditLog: Array<{ signal: string | null; value: number | null; threshold: number | null; pass: boolean | null }>;
};

type ListState =
  | { kind: 'loading' }
  | { kind: 'ok'; runs: Run[] }
  | { kind: 'error' };

function pacificDate(iso: string | null): string {
  if (!iso) return 'No run recorded';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'No run recorded';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' });
}

function pacificFull(iso: string | null, time: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  if (time && /^\d{1,2}:\d{2}/.test(time)) {
    const [h, m] = time.split(':').map(Number);
    if (Number.isFinite(h) && Number.isFinite(m)) d.setHours(h, m, 0, 0);
  }
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });
  const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
  return `${date} · ${t} PT`;
}

// Pad the run list to 7 slots with null "gap" entries for honest display.
function padToSeven(runs: Run[]): Array<Run | null> {
  const padded: Array<Run | null> = runs.slice(0, 7);
  while (padded.length < 7) padded.push(null);
  return padded;
}

// Countdown to next 2:00 AM PT
function useCountdownToNextRun() {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);
  // Compute next 2 AM PT in local wall-clock
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

  const toggle = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (!(id in details)) {
      setDetails((d) => ({ ...d, [id]: 'loading' }));
      fetch(`/api/stats/run/${encodeURIComponent(id)}`, { headers: { Accept: 'application/json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((j: { ok?: boolean } & RunDetail) => {
          if (!j?.ok) return setDetails((d) => ({ ...d, [id]: 'error' }));
          setDetails((d) => ({ ...d, [id]: j as RunDetail }));
        })
        .catch(() => setDetails((d) => ({ ...d, [id]: 'error' })));
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
                  <StatusBar key={r?.id ?? `gap-${i}`} run={r} />
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
                  gridTemplateColumns: '1.3fr 0.9fr 0.9fr 0.7fr 0.7fr 0.8fr 1fr',
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
                    key={r.id}
                    run={r}
                    expanded={expanded === r.id}
                    detail={details[r.id]}
                    onToggle={() => toggle(r.id)}
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
  const unknown = run.result === 'unknown';
  const color = fail ? 'var(--c-critical)' : unknown ? 'var(--c-text-faint)' : 'var(--c-positive)';
  const trace = fail ? 'var(--c-critical-trace)' : unknown ? 'var(--c-overlay)' : 'var(--c-positive-trace)';
  const border = fail ? 'var(--c-critical-border)' : unknown ? 'var(--c-border)' : 'var(--c-positive-border)';
  return (
    <div title={fail ? 'Run failed' : unknown ? 'Result unknown' : 'All assertions passed'} style={{
      height: 56,
      borderRadius: 'var(--r)',
      background: trace,
      border: `1px solid ${border}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    }}>
      <span style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 10,
        color,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}>{pacificDate(run.runDate)}</span>
      <span style={{ color, fontSize: 13, lineHeight: 1 }}>{fail ? '✕' : unknown ? '—' : '✓'}</span>
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
  const resultPill = (
    <span style={{
      padding: '2px 8px',
      borderRadius: 'var(--r-pill)',
      fontFamily: 'var(--f-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: fail ? 'var(--c-critical)' : run.result === 'unknown' ? 'var(--c-text-dim)' : 'var(--c-positive)',
      background: fail ? 'var(--c-critical-trace)' : run.result === 'unknown' ? 'var(--c-overlay)' : 'var(--c-positive-trace)',
      border: `1px solid ${fail ? 'var(--c-critical-border)' : run.result === 'unknown' ? 'var(--c-border)' : 'var(--c-positive-border)'}`,
    }}>{fail ? 'Fail' : run.result === 'unknown' ? '—' : 'Pass'}</span>
  );
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: '1.3fr 0.9fr 0.9fr 0.7fr 0.7fr 0.8fr 1fr',
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
        <span>{pacificFull(run.runDate, run.runTime)}</span>
        <span>{duration}</span>
        <span>{(run.totalAssertions ?? 0).toLocaleString()}</span>
        <span style={{ color: 'var(--c-positive)' }}>{(run.passed ?? 0).toLocaleString()}</span>
        <span style={{ color: fail ? 'var(--c-critical)' : 'var(--c-text-dim)' }}>{(run.failed ?? 0).toLocaleString()}</span>
        <span>{resultPill}</span>
        <span style={{ color: 'var(--c-text-dim)', fontSize: 12 }}>{run.gitSha ? run.gitSha.slice(0, 7) : '—'}</span>
      </button>
      {expanded && (
        <div style={{
          padding: '18px 20px 22px',
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
  if (!detail || detail === 'loading') return <div style={{ fontSize: 13, color: 'var(--c-text-dim)' }}>Loading run detail…</div>;
  if (detail === 'error') return <div style={{ fontSize: 13, color: 'var(--c-critical)' }}>Could not load run detail.</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 32 }}>
      <div>
        <SectionHeader>Signals fired</SectionHeader>
        {detail.signalsFired.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--c-text-dim)' }}>No signals recorded for this run.</div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {detail.signalsFired.slice(0, 20).map((s, i) => (
              <li key={`${s.id}-${i}`} style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 12,
                color: 'var(--c-text-muted)',
                display: 'flex',
                gap: 10,
                alignItems: 'baseline',
              }}>
                <span style={{ color: 'var(--c-accent)', minWidth: 48 }}>{s.id}</span>
                <span>{s.name ?? '—'}</span>
                {s.severity && (
                  <span style={{
                    marginLeft: 'auto',
                    padding: '1px 6px',
                    borderRadius: 'var(--r-pill)',
                    border: '1px solid var(--c-border)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--c-text-dim)',
                  }}>{s.severity}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <SectionHeader>Audit log</SectionHeader>
        {detail.auditLog.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--c-text-dim)' }}>No audit entries.</div>
        ) : (
          <div style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            color: 'var(--c-text-muted)',
            maxHeight: 200,
            overflowY: 'auto',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r)',
            padding: 12,
            background: 'var(--c-surface)',
          }}>
            {detail.auditLog.slice(0, 50).map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '3px 0' }}>
                <span style={{ color: 'var(--c-text-dim)', minWidth: 48 }}>{a.signal ?? '—'}</span>
                <span style={{ minWidth: 80 }}>{a.value != null ? a.value.toLocaleString() : '—'}</span>
                <span style={{ color: 'var(--c-text-faint)' }}>vs {a.threshold != null ? a.threshold.toLocaleString() : '—'}</span>
                <span style={{
                  marginLeft: 'auto',
                  color: a.pass === false ? 'var(--c-critical)' : a.pass === true ? 'var(--c-positive)' : 'var(--c-text-dim)',
                }}>{a.pass === false ? 'fail' : a.pass === true ? 'pass' : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader>Synthetic companies</SectionHeader>
        {detail.companies.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--c-text-dim)' }}>No company data recorded.</div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
          }}>
            {detail.companies.map((c) => (
              <span key={c} style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 11,
                letterSpacing: '0.03em',
                padding: '2px 8px',
                borderRadius: 'var(--r-pill)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text-dim)',
              }}>{c}</span>
            ))}
          </div>
        )}
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--c-text-faint)', lineHeight: 1.5 }}>
          Synthetic company identifiers are anonymized for transparency without exposure.
        </div>

        {detail.run.gitSha && (
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
            }}>{detail.run.gitSha}</div>
          </>
        )}
      </div>
    </div>
  );
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
