export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <span className="font-medium text-white flex items-center gap-2" data-testid="text-footer-vercel">
            <svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor"/></svg>
            Vercel
          </span>
          <span>© 2026 Vercel, Inc.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors" data-testid="link-github-footer">GitHub</a>
          <a href="#" className="hover:text-white transition-colors" data-testid="link-twitter-footer">Twitter</a>
          <a href="#" className="hover:text-white transition-colors" data-testid="link-discord-footer">Discord</a>
        </div>
      </div>
    </footer>
  );
}