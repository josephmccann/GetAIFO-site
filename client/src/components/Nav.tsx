import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Problem", href: "#problem" },
    { name: "Tools", href: "#tools" },
    { name: "Why Now", href: "#why-now" },
    { name: "Vision", href: "#vision" },
    { name: "Technical", href: "#technical" },
    { name: "Wedge", href: "#wedge" },
    { name: "For You", href: "#for-you" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          <a href="#" className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm" data-testid="link-logo" aria-label="AI.FO Home">
            <span className="font-display text-3xl leading-none">AI.FO</span>
            <div className="h-[2px] w-full bg-accent mt-1 rounded-full"></div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 lg:gap-6">
              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm lg:text-base font-medium text-white/60 hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1"
                  data-testid={`link-nav-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <a href="#early-access" className="bg-accent text-black font-semibold rounded px-4 py-2 text-sm hover:bg-accent-hover transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black" data-testid="btn-nav-early-access">
              Join Early Access
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            data-testid="btn-mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10 overflow-hidden absolute w-full"
            >
              <div className="flex flex-col p-6 space-y-6">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-white/80 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="#early-access" 
                  className="btn-primary w-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Join Early Access
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden h-screen"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}