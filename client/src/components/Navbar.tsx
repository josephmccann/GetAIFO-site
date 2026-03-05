import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Github, Search, Command } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass-nav">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            {/* Mock Next.js Logo */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <mask
                id="mask0_408_134"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="180"
                height="180"
              >
                <circle cx="90" cy="90" r="90" fill="black" />
              </mask>
              <g mask="url(#mask0_408_134)">
                <circle cx="90" cy="90" r="90" fill="black" />
                <path
                  d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                  fill="url(#paint0_linear_408_134)"
                />
                <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)" />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_408_134"
                  x1="109"
                  y1="116.5"
                  x2="144.5"
                  y2="160.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_408_134"
                  x1="121"
                  y1="54"
                  x2="120.799"
                  y2="106.875"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-xl hidden sm:inline-block">Next.js</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-showcase">Showcase</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-docs">Docs</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-blog">Blog</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-analytics">Analytics</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-templates">Templates</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-enterprise">Enterprise</a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center relative group">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="bg-secondary/50 border border-border rounded-full py-1.5 pl-9 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 w-64 transition-all focus:bg-secondary"
              data-testid="input-search"
            />
            <div className="absolute right-3 flex items-center gap-1 text-xs text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded border border-border/50">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex" data-testid="button-github">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Button>
          <Button className="hidden md:inline-flex bg-white text-black hover:bg-white/90 rounded-full font-medium" data-testid="button-deploy">
            Deploy
          </Button>
          <Button variant="outline" className="hidden md:inline-flex rounded-full bg-transparent border-white/20 hover:bg-white/10" data-testid="button-learn">
            Learn
          </Button>
        </div>
      </div>
    </header>
  );
}