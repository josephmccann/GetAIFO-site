export function Architecture() {
  return (
    <section className="section" id="architecture">
      <div className="container">
        <div className="kicker">Architecture</div>
        <h2 className="h-xl">Two systems, one seam.</h2>
        <p className="lede" style={{ marginBottom: 56 }}>
          A deterministic financial engine handles every calculation. A language model writes the memo. The seam between them is where trust lives — because AI never touches the math.
        </p>

        <div style={{
          padding: 32,
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1.2fr) auto minmax(0, 1fr)',
            gap: 16,
            alignItems: 'center',
          }} className="arch-grid">
            <Stage
              label="Stage 1"
              name="Data ingestion"
              desc="QuickBooks, banking, payroll via 7 report-type parsers"
            />
            <Arrow />
            <Stage
              label="Stage 2 · Core"
              name="Deterministic engine"
              desc="38 signals · v20 · formula-based, auditable, repeatable"
              primary
            />
            <Arrow />
            <Stage
              label="Stage 3"
              name="Narrative layer"
              desc="Claude synthesizes the memo · never recalculates math"
            />
          </div>

          <div style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: '1px solid var(--c-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div style={{
              fontSize: 13,
              color: 'var(--c-text-dim)',
              maxWidth: '52ch',
              lineHeight: 1.55,
            }}>
              Every signal traces back to a formula, a data source, and a methodology citation — Altman, Damodaran, FASB, IAASB.{' '}
              <a href="#" style={{
                color: 'var(--c-accent)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}>Read the methodology →</a>
            </div>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--c-text-faint)',
            }}>80KB · 38 signals documented</div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .arch-grid { grid-template-columns: 1fr !important; }
            .arch-grid > [data-arrow] { transform: rotate(90deg); margin: 0 auto; }
          }
        `}</style>
      </div>
    </section>
  );
}

function Stage({ label, name, desc, primary }: { label: string; name: string; desc: string; primary?: boolean }) {
  return (
    <div style={{
      padding: 20,
      background: primary ? 'var(--c-raised)' : 'transparent',
      border: `1px solid ${primary ? 'var(--c-accent-border)' : 'var(--c-border)'}`,
      borderRadius: 'var(--r)',
    }}>
      <div style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: primary ? 'var(--c-accent)' : 'var(--c-text-dim)',
        marginBottom: 8,
        fontWeight: 600,
      }}>{label}</div>
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--c-text)',
        marginBottom: 6,
        letterSpacing: '-0.01em',
      }}>{name}</div>
      <div style={{
        fontSize: 13,
        color: 'var(--c-text-muted)',
        lineHeight: 1.5,
      }}>{desc}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div data-arrow style={{
      fontSize: 20,
      color: 'var(--c-text-faint)',
      textAlign: 'center',
    }}>→</div>
  );
}
