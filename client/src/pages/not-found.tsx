import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#C8D4F0] text-[#1E2761] flex flex-col">
      <nav className="py-5">
        <div className="container-custom">
          <a href="/" className="flex flex-col w-fit" data-testid="link-404-logo">
            <span className="font-display text-3xl leading-none text-[#1E2761]">AI.FO</span>
            <div className="h-[2px] w-full bg-accent mt-1 rounded-full"></div>
          </a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center px-6"
        >
          <p className="text-accent font-display text-8xl md:text-9xl mb-4" data-testid="text-404-code">404</p>
          <h1 className="font-display text-3xl md:text-5xl text-[#1E2761] mb-4" data-testid="text-404-heading">
            Page not found.
          </h1>
          <p className="text-[#4A5578] text-lg mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a href="/" className="btn-primary" data-testid="link-404-home">
            Back to Home
          </a>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-[#A8B8D8]">
        <div className="container-custom text-center">
          <span className="text-[#4A5578] text-sm">AI.FO &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
