import { useState } from 'react';

const BRIEF_CONTENT: Record<number, { signalRef: string; prose: string }> = {
  0: {
    signalRef: 'S7',
    prose: 'Cash runway has compressed from 14 months to 9 months over the past two quarters, driven primarily by a 31% increase in payroll and a slowdown in receivables collection. At the current burn rate, the organization reaches a critical threshold in Q3. Recommended actions: accelerate Q2 collections, pause two open headcount requisitions pending revenue milestone confirmation.',
  },
  1: {
    signalRef: 'S14',
    prose: 'Operating expenses exceeded budget by 18% in March, concentrated in three categories: software subscriptions (+$12K), contractor spend (+$28K), and travel (+$9K). The contractor overrun is tied to the accelerated product timeline. This is a one-time variance, but if the timeline extends, a reforecast is warranted before the board meeting.',
  },
  2: {
    signalRef: 'S9',
    prose: 'Adding a senior engineer at $180K fully loaded increases monthly burn by $15K and compresses runway by approximately 6 weeks. At current revenue growth of 8% month-over-month, the breakeven on this hire is approximately 4.5 months post-ramp. Recommend proceeding if Q2 revenue lands within 10% of plan; defer if it misses by more than 15%.',
  },
};

export function LiveBrief() {
  const [activeTab, setActiveTab] = useState(0);
  const content = BRIEF_CONTENT[activeTab];

  return (
    <section className="section" id="brief">
      <div className="container">
        <div className="kicker">Live Brief</div>
        <h2 className="h-xl">Augmented CFO judgment.<br />Not another dashboard.</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
          gap: 64,
          marginTop: 56,
        }} className="brief-grid">
          <div>
            <p style={{
              fontSize: 15,
              color: 'var(--c-text-muted)',
              marginBottom: 20,
              lineHeight: 1.55,
            }}>What AI.FO produces when you connect your books:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <BriefPoint text="A narrative brief leaders can read in five minutes" />
              <BriefPoint text="Forward-looking risk signals before they become problems" />
              <BriefPoint text="Decision framing tied to real choices: hiring, spend, runway, pricing" />
              <BriefPoint text="Guidance that evolves as your numbers change month to month" />
            </div>
          </div>

          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              gap: 20,
              padding: '16px 20px',
              borderBottom: '1px solid var(--c-border)',
              overflowX: 'auto',
            }}>
              {['Runway Early Warning', 'Spend Variance', 'Hiring Decision'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(i)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === i ? '2px solid var(--c-accent)' : '2px solid transparent',
                    padding: '6px 0',
                    fontSize: 13,
                    fontFamily: 'var(--f-sans)',
                    fontWeight: 500,
                    color: activeTab === i ? 'var(--c-accent)' : 'var(--c-text-dim)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >{label}</button>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--c-text-muted)',
                margin: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: 12,
                  color: 'var(--c-accent)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  marginRight: 4,
                }}>{content.signalRef} ·</span>
                {content.prose}
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .brief-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function BriefPoint({ text }: { text: string }) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      fontSize: 15,
      color: 'var(--c-text-muted)',
      lineHeight: 1.55,
      paddingLeft: 16,
      borderLeft: '2px solid var(--c-accent)',
    }}>{text}</div>
  );
}
