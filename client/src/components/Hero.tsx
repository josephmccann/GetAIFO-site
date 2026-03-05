import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center min-h-[90vh]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[100px] z-0 pointer-events-none" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <a
            href="#"
            className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
            data-testid="link-nextjs-conf"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
            Next.js Conf 2026 is here. Claim your ticket
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          data-testid="text-hero-title"
        >
          The React Framework for the Web
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          data-testid="text-hero-subtitle"
        >
          Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button
            size="lg"
            className="h-12 px-8 rounded-full font-medium text-base transition-all hover:scale-105 bg-primary text-primary-foreground"
            data-testid="button-get-started"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-full font-medium text-base transition-all hover:bg-secondary"
            data-testid="button-learn-more"
          >
            Learn Next.js
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col items-center justify-center space-y-4"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold" data-testid="text-trusted-by">Trusted By</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale contrast-200">
            {/* Mocking logos with text since we don't have SVGs handy */}
            {['Vercel', 'Netflix', 'Notion', 'Twitch', 'TikTok', 'Hulu'].map((brand) => (
              <div key={brand} className="text-xl font-bold tracking-tighter" data-testid={`logo-${brand.toLowerCase()}`}>
                {brand}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}