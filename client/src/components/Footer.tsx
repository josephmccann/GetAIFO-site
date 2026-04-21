export function Footer() {
  return (
    <footer style={{
      padding: '48px 0 32px',
      borderTop: '1px solid var(--c-border)',
      background: 'var(--c-raised)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--c-text)',
          }}>AI.FO</span>
          <span style={{
            display: 'inline-block',
            width: 16,
            height: 2,
            background: 'var(--c-accent)',
            borderRadius: 1,
          }} />
          <span style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--c-text-dim)',
            marginLeft: 8,
          }}>Financial intelligence</span>
        </div>

        <div style={{
          display: 'flex',
          gap: 32,
          fontSize: 13,
          color: 'var(--c-text-dim)',
          flexWrap: 'wrap',
        }}>
          <a href="mailto:sales@getaifo.com" style={{ color: 'inherit', textDecoration: 'none' }}>sales@getaifo.com</a>
          <a href="https://demo.getaifo.com" style={{ color: 'inherit', textDecoration: 'none' }}>Live Demo</a>
          <a href="/status" style={{ color: 'inherit', textDecoration: 'none' }}>Status</a>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="https://linkedin.com/in/jpmccann" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
        </div>

        <div style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 12,
          color: 'var(--c-text-faint)',
          letterSpacing: '0.05em',
        }}>© 2026 AI.FO</div>
      </div>
    </footer>
  );
}
