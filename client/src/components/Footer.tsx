export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-black">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wide text-white">AI.FO</span>
          <span className="text-white/40 text-sm">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="mailto:hello@getaifo.com" className="hover:text-accent transition-colors">hello@getaifo.com</a>
        </div>
      </div>
    </footer>
  );
}