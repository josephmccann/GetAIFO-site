import { useEffect, useRef, useState } from 'react';

const BRIEF_HEADLINE_LINE_1 = "Runway compressed 2.4 months this quarter.";
const BRIEF_HEADLINE_LINE_2 = "Your P&L didn't show it.";

export function Hero() {
  const [typedText, setTypedText] = useState('');
  const [line2Started, setLine2Started] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTypedText(BRIEF_HEADLINE_LINE_1 + '\n' + BRIEF_HEADLINE_LINE_2);
      setTypingDone(true);
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let i = 0;
    const fullText = BRIEF_HEADLINE_LINE_1 + '\n' + BRIEF_HEADLINE_LINE_2;

    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i >= fullText.length) {
          clearInterval(interval);
          setTypingDone(true);
          return;
        }
        setTypedText(fullText.slice(0, i + 1));
        if (i === BRIEF_HEADLINE_LINE_1.length) setLine2Started(true);
        i++;
      }, 30);

      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startDelay);
  }, []);

  const displayLines = typedText.split('\n');

  return (
    <section style={{ paddingTop: 128, paddingBottom: 96 }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 64,
        alignItems: 'center',
      }}>
        <div className="hero-copy">
          <div className="kicker"><span className="accent">●</span> AI.FO · Early Access</div>
          <h1 className="h-display">Financial judgment,<br />without the CFO headcount.</h1>
          <p className="lede">
            AI.FO turns accounting data into the kind of forward-looking guidance you'd expect from a seasoned CFO.
            A deterministic engine detects 38 financial signals. Claude synthesizes them into a memo you can actually act on.{' '}
            <strong style={{ color: 'var(--c-text)', fontWeight: 500 }}>
              AI never touches the math. By design, not by policy.
            </strong>
          </p>
          <p className="sub-lede">
            The product is built. The engine runs nightly against 20 synthetic companies. We're onboarding our first cohort of real organizations now.
            <br />
            <span style={{ color: 'var(--c-text-muted)' }}>One hour of a fractional CFO costs more than a month of AI.FO.</span>
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#early-access" className="btn btn-primary">Join Early Access →</a>
            <a href="https://demo.getaifo.com" className="btn btn-secondary">Try the Live Demo</a>
          </div>
        </div>

        <div className="hero-brief">
          <div className="hero-brief-head">
            <span className="hero-brief-title">AI.FO · Intelligence Brief</span>
            <span className="hero-brief-stamp">Sample output</span>
          </div>

          <div className="hero-brief-body">
            <h3 className="hero-brief-headline" aria-label={`${BRIEF_HEADLINE_LINE_1} ${BRIEF_HEADLINE_LINE_2}`}>
              {displayLines[0]}
              {!line2Started && !typingDone && <span className="headline-cursor" aria-hidden="true" />}
              {line2Started && <br />}
              {displayLines[1]}
              {line2Started && !typingDone && <span className="headline-cursor" aria-hidden="true" />}
            </h3>
            <p className="hero-brief-prose">
              Cash on hand looks stable, but three compounding factors moved in the same direction — payroll growth outpacing revenue, receivables slowing, and upcoming renewals committed against a smaller cash base.
            </p>
            <p className="hero-brief-prose">
              The shift is invisible to standard reporting. AI.FO detected it across four signals and surfaced a corrective action path this week.
            </p>
          </div>

          <div className="hero-brief-foot">
            <span className="hero-brief-signal">RUNWAY COMPRESSION</span>
            <span className="hero-brief-meta">4 signals · <span className="mono">94%</span> confidence</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-brief {
          display: flex; flex-direction: column;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        [data-theme="light"] .hero-brief { box-shadow: var(--shadow-md); }

        .hero-brief-head {
          padding: 16px 24px;
          border-bottom: 1px solid var(--c-border);
          display: flex; justify-content: space-between; align-items: center;
          background: var(--c-raised);
        }
        [data-theme="light"] .hero-brief-head { background: var(--c-canvas); }

        .hero-brief-title {
          font-size: var(--t-sm); font-weight: 500; color: var(--c-text-muted);
          letter-spacing: 0.02em;
        }
        .hero-brief-stamp {
          font-family: var(--f-mono); font-size: var(--t-xs);
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-accent); font-weight: 500;
        }

        .hero-brief-body {
          padding: 32px 28px 24px;
          flex: 1; display: flex; flex-direction: column; gap: 18px;
        }

        .hero-brief-headline {
          font-size: 28px; font-weight: 600;
          letter-spacing: -0.02em; line-height: 1.2;
          color: var(--c-text);
          margin: 0 0 6px;
          min-height: 2.4em;
        }

        .headline-cursor {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          margin-left: 2px;
          background: var(--c-accent);
          vertical-align: text-bottom;
          animation: cursor-blink 900ms var(--ease-quick) infinite;
        }

        @keyframes cursor-blink {
          0%, 45% { opacity: 1; }
          50%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }

        .hero-brief-prose {
          font-size: var(--t-md); line-height: 1.65;
          color: var(--c-text-muted);
          margin: 0;
        }

        .hero-brief-foot {
          margin-top: auto;
          padding: 16px 24px; border-top: 1px solid var(--c-border);
          display: flex; justify-content: space-between; align-items: center;
          background: var(--c-raised);
        }
        [data-theme="light"] .hero-brief-foot { background: var(--c-canvas); }

        .hero-brief-signal {
          font-family: var(--f-mono); font-size: var(--t-xs);
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-accent); font-weight: 600;
        }

        .hero-brief-meta {
          font-size: var(--t-xs); color: var(--c-text-dim);
          letter-spacing: 0.05em;
        }
        .hero-brief-meta .mono { color: var(--c-text-muted); font-weight: 500; }

        @media (max-width: 900px) {
          .hero-copy + .hero-brief { grid-column: 1; }
        }
      `}</style>
    </section>
  );
}
