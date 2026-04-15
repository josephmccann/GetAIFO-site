export default function Footer() {
  return (
    <footer className="py-12 border-t border-[rgba(30,39,97,0.15)] bg-card text-card-foreground">
      <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wide text-white">AI.FO</span>
            <span className="text-white/55 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <a href="mailto:hello@getaifo.com" className="text-white/55 text-sm hover:text-accent transition-colors">
            hello@getaifo.com
          </a>
          <span className="text-white/55 text-sm">
            Investors: <a href="mailto:investors@getaifo.com" className="hover:text-accent transition-colors">investors@getaifo.com</a>
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/55">
          <a href="/privacy" className="hover:text-accent transition-colors" data-testid="link-privacy">Privacy</a>
          <a href="/terms" className="hover:text-accent transition-colors" data-testid="link-terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}