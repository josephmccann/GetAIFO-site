export function WhatExists() {
  return (
    <section className="section" id="live">
      <div className="container">
        <div className="kicker">What Exists</div>
        <h2 className="h-xl">
          Not a waitlist. Not a demo request.<br />
          The product works — and the first cohort opens soon.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 48,
          marginTop: 56,
        }} className="wedge-grid">
          <div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {[
                'Intelligence briefs with 38-signal detection across 5 categories',
                'Cash & runway analysis with A/R aging and binding constraints',
                'Expense intelligence with subscription overlap detection',
                'Interactive scenario modeling with pre-built stress tests',
                'CFO narrative memos (Founder + Board formats)',
                'AI assistant for financial Q&A',
                'QuickBooks Online integration',
                'CSV upload for any accounting system',
              ].map((item) => (
                <li key={item} style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  fontSize: 15,
                  color: 'var(--c-text-muted)',
                  lineHeight: 1.55,
                }}>
                  <span style={{
                    color: 'var(--c-positive)',
                    fontFamily: 'var(--f-mono)',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="body" style={{ marginBottom: 24 }}>
              The demo runs today on simulated data you can try at{' '}
              <a
                href="https://demo.getaifo.com"
                style={{
                  color: 'var(--c-accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                demo.getaifo.com
              </a>
              . The engine runs nightly against 20 synthetic companies and every run is logged — see the last seven at{' '}
              <a
                href="/status"
                style={{
                  color: 'var(--c-accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                /status
              </a>
              . The next step is real customer books — the first cohort will work directly with us on what we build next.
            </p>

            <h4 style={{
              fontSize: 13,
              fontFamily: 'var(--f-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--c-text-dim)',
              marginBottom: 12,
              marginTop: 24,
            }}>Coming next</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {[
                'First cohort onboarding against real QuickBooks exports',
                'Board packet Excel export',
                'Plaid banking integration',
                'Multi-company portfolio view',
              ].map((item) => (
                <li key={item} style={{
                  fontSize: 14,
                  color: 'var(--c-text-muted)',
                  paddingLeft: 14,
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: 'var(--c-text-faint)',
                  }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .wedge-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
