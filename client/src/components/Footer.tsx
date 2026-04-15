export default function Footer() {
  return (
    <footer className="py-12 border-t border-[#A8B8D8] bg-[#C8D4F0]">
      <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wide text-[#1E2761]">AI.FO</span>
            <span className="text-[#4A5578] text-sm">&copy; {new Date().getFullYear()}</span>
          </div>
          <a href="mailto:hello@getaifo.com" className="text-[#4A5578] text-sm hover:text-[#1E2761] transition-colors">
            hello@getaifo.com
          </a>
          <span className="text-[#4A5578] text-sm">
            Investors: <a href="mailto:investors@getaifo.com" className="hover:text-[#1E2761] transition-colors">investors@getaifo.com</a>
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#4A5578]">
          <a href="/privacy" className="hover:text-[#1E2761] transition-colors" data-testid="link-privacy">Privacy</a>
          <a href="/terms" className="hover:text-[#1E2761] transition-colors" data-testid="link-terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
