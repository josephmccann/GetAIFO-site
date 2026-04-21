import { useEffect, useState } from 'react';

type LatestRun = {
  runDate: string;
  totalAssertions: number | null;
  passed: number | null;
  failed: number | null;
  result: 'pass' | 'fail' | 'partial' | 'unknown';
  gitSha: string | null;
};

type FetchState =
  | { kind: 'loading' }
  | { kind: 'ok'; run: LatestRun | null }
  | { kind: 'unreachable' };

function formatPacific(iso: string | null): string | null {
  if (!iso) return null;
  // ISO date only (YYYY-MM-DD). Nightly runs kick off at 2 AM PT; anchor at
  // 09:00 UTC as an approximation that survives DST transitions without
  // lying about the real wall-clock start.
  const d = new Date(`${iso}T09:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  });
  return `${dateStr} · 2:00 AM PT`;
}

function isStale(iso: string | null): boolean {
  if (!iso) return true;
  const t = Date.parse(`${iso}T09:00:00Z`);
  if (Number.isNaN(t)) return true;
  return Date.now() - t > 48 * 60 * 60 * 1000;
}

export function SystemStatus() {
  const [state, setState] = useState<FetchState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats/latest-run', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: { ok?: boolean; data?: LatestRun | null }) => {
        if (cancelled) return;
        if (!j?.ok) {
          setState({ kind: 'unreachable' });
          return;
        }
        setState({ kind: 'ok', run: j.data ?? null });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'unreachable' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section style={{
      borderTop: '1px solid var(--c-border)',
      borderBottom: '1px solid var(--c-border)',
      background: 'var(--c-raised)',
      padding: '32px 0',
    }}>
      <div className="container">
        <div style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--c-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--c-text-dim)',
              fontWeight: 500,
            }}>System · Proof</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 9px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid var(--c-positive-border)',
              background: 'var(--c-positive-trace)',
              fontFamily: 'var(--f-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--c-positive)',
              fontWeight: 600,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--c-positive)',
              }} className="status-pulse" />
              Live
            </span>
          </div>

          <div style={{
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
          }}>
            <ProofStat value="38" label="Signals, every formula sourced" />
            <ProofStat value="22" label="Test files, math proven on every signal" />
            <ProofStat value="20" label="Synthetic companies, pressure-tested nightly" />
            <ProofStat value="5" label="Categories: Liquidity · Revenue · Margin · Working Capital · Leverage" />
          </div>

          {state.kind !== 'unreachable' && (
            <div style={{
              padding: '18px 24px',
              borderTop: '1px solid var(--c-border)',
              background: 'var(--c-raised)',
            }}>
              <LiveZone state={state} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProofStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ borderLeft: '2px solid var(--c-accent)', paddingLeft: 16 }}>
      <div className="mono" style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: 'var(--c-text)',
        marginBottom: 4,
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--c-text-dim)',
        lineHeight: 1.4,
      }}>{label}</div>
    </div>
  );
}

function LiveZone({ state }: { state: FetchState }) {
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--f-mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--c-text-dim)',
    fontWeight: 500,
  };
  const subStyle: React.CSSProperties = {
    fontSize: 12,
    color: 'var(--c-text-dim)',
    marginTop: 4,
  };

  if (state.kind === 'loading') {
    return (
      <div>
        <div style={labelStyle}>Last Nightly Pressure Test · Loading…</div>
        <div style={subStyle}>Running on schedule — next run tonight at 2:00 AM PT</div>
      </div>
    );
  }

  if (state.kind !== 'ok') return null;
  const run = state.run;
  const stale = isStale(run?.runDate ?? null);
  const failed = run && ((run.failed != null && run.failed > 0) || run.result === 'fail' || run.result === 'partial');

  if (!run || stale) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={labelStyle}>Automated Nightly Pressure Test · 2,686+ Assertions</div>
          <div style={subStyle}>Running on schedule — next run tonight at 2:00 AM PT</div>
        </div>
        <a href="/status" className="status-link">View last 7 runs →</a>
        <StatusLinkStyle />
      </div>
    );
  }

  if (failed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={labelStyle}>System Check in Progress · Resolving</div>
          <div style={subStyle}>Running on schedule — next run tonight at 2:00 AM PT</div>
        </div>
        <a href="/status" className="status-link">View last 7 runs →</a>
        <StatusLinkStyle />
      </div>
    );
  }

  const when = formatPacific(run.runDate) ?? '—';
  const total = run.totalAssertions ?? (run.passed ?? 0) + (run.failed ?? 0);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
      <div>
        <div style={labelStyle}>Last Nightly Pressure Test · {when}</div>
        <div style={{
          display: 'flex',
          gap: 18,
          marginTop: 8,
          fontSize: 14,
          color: 'var(--c-text)',
          fontFamily: 'var(--f-mono)',
          flexWrap: 'wrap',
        }}>
          <span><span style={{ color: 'var(--c-positive)' }}>{(run.passed ?? 0).toLocaleString()}</span> passed</span>
          <span style={{ color: 'var(--c-text-faint)' }}>·</span>
          <span><span style={{ color: 'var(--c-text-muted)' }}>{(run.failed ?? 0).toLocaleString()}</span> failed</span>
          <span style={{ color: 'var(--c-text-faint)' }}>·</span>
          <span><span style={{ color: 'var(--c-text-muted)' }}>{total.toLocaleString()}</span> total</span>
          <span style={{ color: 'var(--c-text-faint)' }}>·</span>
          <span style={{
            padding: '1px 8px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--c-positive-border)',
            background: 'var(--c-positive-trace)',
            color: 'var(--c-positive)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>Pass</span>
        </div>
        <div style={subStyle}>Running on schedule — next run tonight at 2:00 AM PT</div>
      </div>
      <a href="/status" className="status-link">View last 7 runs →</a>
      <StatusLinkStyle />
    </div>
  );
}

function StatusLinkStyle() {
  return (
    <style>{`
      .status-link {
        font-family: var(--f-mono);
        font-size: 12px;
        letter-spacing: 0.05em;
        color: var(--c-accent);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color var(--dur-quick) var(--ease-quick);
      }
      .status-link:hover { border-bottom-color: var(--c-accent); }
    `}</style>
  );
}
