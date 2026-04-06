export default function Footer() {
  return (
    <footer className="py-12 border-t border-[rgba(202,220,252,0.12)] bg-[#1E2761]">
      <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wide text-white">AI.FO</span>
            <span className="text-[#8A9CC5] text-sm">© {new Date().getFullYear()}</span>
          </div>
          <a href="mailto:hello@getaifo.com" className="text-[#8A9CC5] text-sm hover:text-white transition-colors">
            hello@getaifo.com
          </a>
          <span className="text-[#8A9CC5] text-sm">
            Investors: <a href="mailto:investors@getaifo.com" className="hover:text-white transition-colors">investors@getaifo.com</a>
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-[#8A9CC5]">
          <a href="/privacy" className="hover:text-white transition-colors" data-testid="link-privacy">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors" data-testid="link-terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}