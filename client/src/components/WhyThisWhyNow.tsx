export function WhyThisWhyNow() {
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="kicker">Why This / Why Now</div>
        <h2 className="h-xl">CFO-level decisions begin<br />far earlier than CFO-level staffing.</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 64,
          marginTop: 56,
        }} className="why-grid">
          <div className="why-left">
            <h3 className="h-lg">The gap is structural.</h3>
            <p className="body">
              Organizations under $50M face increasing financial complexity without the leadership infrastructure to manage it. A full-time CFO is often unavailable, unaffordable, or premature. Founders and operators absorb those responsibilities by default.
            </p>
            <p className="body">
              The accounting is accurate. Nobody is connecting the dots. High-impact decisions on hiring, cash, pricing, and cost structure get made with incomplete context — and the gap shows up nine months before anyone notices.
            </p>

            <div style={{
              marginTop: 24,
              padding: 20,
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderLeft: '3px solid var(--c-accent)',
              borderRadius: 'var(--r)',
            }}>
              <div style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--c-accent)',
                marginBottom: 6,
                fontWeight: 600,
              }}>Who this is for</div>
              <div style={{ fontSize: 13, color: 'var(--c-text-muted)', lineHeight: 1.55 }}>
                AI.FO is built for companies <em>without</em> a CFO. Existing FP&A and finance platforms assume you already have a finance team. We assume you don't — and we fill the gap until you do.
              </div>
            </div>
          </div>

          <div className="why-right" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <WhyCard
              num="1"
              title="Dashboards surface metrics without context."
              body="Knowing your gross margin dropped 4 points isn't the same as knowing what to do about it. Metrics without prioritization create the illusion of insight."
            />
            <WhyCard
              num="2"
              title="Fractional help is episodic, not continuous."
              body="A monthly call with a fractional CFO is useful. It is not the same as having financial judgment resident in the business every day."
            />
            <WhyCard
              num="3"
              title="Accounting systems are backward-looking by design."
              body="QuickBooks tells you what happened. It will not tell you what's about to happen, or what you should do about it."
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .why-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function WhyCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div style={{
      padding: 24,
      background: 'var(--c-surface)',
      border: '1px solid var(--c-border)',
      borderRadius: 'var(--r-lg)',
    }}>
      <div style={{
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}>
        <div className="mono" style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 20,
          fontWeight: 500,
          color: 'var(--c-accent)',
          lineHeight: 1,
          flexShrink: 0,
        }}>{num}</div>
        <div>
          <h4 style={{
            fontSize: 16,
            fontWeight: 600,
            margin: '0 0 8px',
            color: 'var(--c-text)',
            letterSpacing: '-0.01em',
          }}>{title}</h4>
          <p style={{
            fontSize: 14,
            color: 'var(--c-text-muted)',
            margin: 0,
            lineHeight: 1.6,
          }}>{body}</p>
        </div>
      </div>
    </div>
  );
}
