export function RunwayChart() {
  return (
    <section className="section" id="runway-proof">
      <div className="container">
        <div className="kicker">What This Looks Like</div>
        <h2 className="h-xl">The math that drives the memo.</h2>
        <p className="lede" style={{ marginBottom: 56 }}>
          Every signal starts here — a deterministic calculation over your real data, with thresholds derived from first-principle finance, not opinion. This is one of 38 signals the engine runs on every data sync.
        </p>

        <div style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
          padding: 24,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--c-text)',
                marginBottom: 4,
              }}>Cash Runway</div>
              <div style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 12,
                letterSpacing: '0.1em',
                color: 'var(--c-text-dim)',
                textTransform: 'uppercase',
              }}>S7 · Sample · Severity bands 14 / 9 / 6 months</div>
            </div>
            <div style={{
              padding: '5px 11px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid var(--c-warning-border)',
              background: 'var(--c-warning-trace)',
              fontFamily: 'var(--f-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--c-warning)',
              fontWeight: 500,
            }}>Projected Breach · 42 days</div>
          </div>

          <svg viewBox="0 0 1000 340" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Severity bands */}
            <rect x="70" y="30" width="900" height="95" fill="var(--c-positive-trace)" />
            <rect x="70" y="125" width="900" height="90" fill="var(--c-warning-trace)" />
            <rect x="70" y="215" width="900" height="85" fill="var(--c-critical-trace)" />

            {/* Threshold lines */}
            <line x1="70" y1="125" x2="970" y2="125" stroke="var(--c-positive)" strokeWidth="1" strokeDasharray="4 5" opacity="0.55" />
            <line x1="70" y1="215" x2="970" y2="215" stroke="var(--c-warning)" strokeWidth="1" strokeDasharray="4 5" opacity="0.55" />

            {/* Threshold labels */}
            <text x="965" y="122" textAnchor="end" fill="var(--c-positive)" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="0.05em">14 MO · SAFE</text>
            <text x="965" y="212" textAnchor="end" fill="var(--c-warning)" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="0.05em">9 MO · CAUTION</text>
            <text x="965" y="297" textAnchor="end" fill="var(--c-critical)" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="0.05em">6 MO · CRITICAL</text>

            {/* Axes */}
            <line x1="70" y1="30" x2="70" y2="300" stroke="var(--grid)" strokeWidth="1" />
            <line x1="70" y1="300" x2="970" y2="300" stroke="var(--grid)" strokeWidth="1" />

            {/* Y-axis labels */}
            <text x="60" y="35" textAnchor="end" fill="var(--c-text-dim)" fontFamily="JetBrains Mono, monospace" fontSize="11">16 mo</text>
            <text x="60" y="130" textAnchor="end" fill="var(--c-text-dim)" fontFamily="JetBrains Mono, monospace" fontSize="11">10 mo</text>
            <text x="60" y="220" textAnchor="end" fill="var(--c-text-dim)" fontFamily="JetBrains Mono, monospace" fontSize="11">7 mo</text>
            <text x="60" y="300" textAnchor="end" fill="var(--c-text-dim)" fontFamily="JetBrains Mono, monospace" fontSize="11">0 mo</text>

            {/* X-axis */}
            {['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'].map((month, i) => (
              <text key={month} x={130 + i * 140} y="325" textAnchor="middle" fill="var(--c-text-dim)" fontFamily="JetBrains Mono, monospace" fontSize="11">{month}</text>
            ))}

            {/* Actual history */}
            <polyline fill="none" stroke="var(--viz-1)" strokeWidth="2.5" points="130,62 270,78 410,102 550,135" />
            {/* Forecast */}
            <polyline fill="none" stroke="var(--viz-1)" strokeWidth="2.5" strokeDasharray="7 5" opacity="0.75" points="550,135 690,175 830,215 940,250" />

            {/* Data points */}
            <circle cx="130" cy="62" r="4" fill="var(--viz-1)" />
            <circle cx="270" cy="78" r="4" fill="var(--viz-1)" />
            <circle cx="410" cy="102" r="4" fill="var(--viz-1)" />
            <circle cx="550" cy="135" r="5" fill="var(--viz-1)" stroke="var(--c-surface)" strokeWidth="2" />

            {/* Today marker */}
            <line x1="550" y1="30" x2="550" y2="300" stroke="var(--c-text-faint)" strokeWidth="1" opacity="0.4" />
            <text x="556" y="45" fill="var(--c-text-faint)" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="0.1em">TODAY</text>

            {/* Breach marker */}
            <circle cx="830" cy="215" r="5" fill="var(--c-warning)" stroke="var(--c-surface)" strokeWidth="2" />
            <line x1="830" y1="215" x2="830" y2="260" stroke="var(--c-warning)" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="765" y="262" width="130" height="24" rx="4" fill="var(--c-surface)" stroke="var(--c-warning-border)" />
            <text x="830" y="278" fill="var(--c-warning)" fontFamily="JetBrains Mono, monospace" fontSize="11" textAnchor="middle" letterSpacing="0.05em">BREACH · MAR 12</text>
          </svg>

          <div style={{
            marginTop: 20,
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            color: 'var(--c-text-dim)',
            paddingTop: 16,
            borderTop: '1px solid var(--c-border)',
          }}>
            <LegendItem color="var(--viz-1)" type="line" label="Actual runway" />
            <LegendItem color="var(--viz-1)" type="dashed" label="12-month forecast" />
            <LegendItem color="var(--c-positive-trace)" border="var(--c-positive-border)" type="box" label="Safe > 14 mo" />
            <LegendItem color="var(--c-warning-trace)" border="var(--c-warning-border)" type="box" label="Caution 9–14 mo" />
            <LegendItem color="var(--c-critical-trace)" border="var(--c-critical-border)" type="box" label="Critical < 6 mo" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LegendItem({ color, border, type, label }: { color: string; border?: string; type: 'line' | 'dashed' | 'box'; label: string }) {
  const swatch = type === 'box' ? (
    <span style={{
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: 2,
      background: color,
      border: `1px solid ${border}`,
      marginRight: 6,
      verticalAlign: 'middle',
    }} />
  ) : (
    <span style={{
      display: 'inline-block',
      width: 14,
      height: 3,
      background: color,
      opacity: type === 'dashed' ? 0.7 : 1,
      marginRight: 6,
      verticalAlign: 'middle',
    }} />
  );

  return <div>{swatch}{label}</div>;
}
