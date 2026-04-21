import { useState, useEffect } from 'react';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('aifo-theme') as 'dark' | 'light' | null;
    const initial = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aifo-theme', next);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'color-mix(in srgb, var(--c-canvas) 85%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--c-border)' : '1px solid transparent',
      }}
    >
      <div className="container flex items-center justify-between" style={{ height: 64 }}>
        <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--f-sans)',
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
        </a>

        <div className="hidden md:flex items-center" style={{ gap: 28 }}>
          <a href="/#live" className="nav-link">What Exists</a>
          <a href="/#how" className="nav-link">How It Works</a>
          <a href="/#architecture" className="nav-link">Architecture</a>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              background: 'transparent',
              border: '1px solid var(--c-border-strong)',
              borderRadius: 'var(--r-pill)',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--c-text-muted)',
              fontFamily: 'var(--f-mono)',
              letterSpacing: '0.05em',
            }}
          >
            {theme === 'dark' ? '☾' : '☀'}
          </button>
          <a href="/#early-access" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
            Early Access →
          </a>
        </div>
      </div>

      <style>{`
        .nav-link {
          font-size: 14px;
          color: var(--c-text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--dur-quick) var(--ease-quick);
          position: relative;
        }
        .nav-link:hover { color: var(--c-text); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0; right: 0;
          height: 1px;
          background: var(--c-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--dur-quick) var(--ease-quick);
        }
        .nav-link:hover::after { transform: scaleX(1); }
      `}</style>
    </nav>
  );
}
