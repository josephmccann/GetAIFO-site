export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="kicker">How It Works</div>
        <h2 className="h-xl">Three stages. Deterministic by design.</h2>
        <p className="lede" style={{ marginBottom: 72 }}>
          Every signal traces back to formula, source, and methodology. AI writes the memo at the end — it never recalculates the math.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 40,
        }}>
          <Step
            num="01 · CONNECT"
            title="Your books, safely ingested."
            body="QuickBooks Online integration or CSV upload. Seven report-type parsers normalize P&L, balance sheet, A/R, A/P, sales, bank, and transaction detail."
          />
          <Step
            num="02 · DETECT"
            title="38 signals, running continuously."
            body="The deterministic engine runs 38 financial signals across five categories: Liquidity, Revenue, Margin, Working Capital, and Leverage. Every metric is formula-based, auditable, and repeatable."
          />
          <Step
            num="03 · ACT"
            title="Narrative you can send to a board."
            body="Claude synthesizes the signal outputs into a narrative brief with decision framing. Export as board memo, founder update, or investor email. Raw data never touches the LLM."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 12,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--c-accent)',
        marginBottom: 16,
        fontWeight: 600,
      }}>{num}</div>
      <h3 className="h-lg">{title}</h3>
      <p className="body">{body}</p>
    </div>
  );
}
