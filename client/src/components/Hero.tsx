import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase mb-6">
            AI.FO • Early Access
          </p>
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-2" data-testid="hero-heading">
              Turning financial data into decision-ready judgment.
            </h1>
            <div className="w-24 h-1 bg-accent rounded-full mt-6"></div>
          </div>
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl" data-testid="hero-subhead">
            An AI-powered CFO layer that translates messy financial signals into narrative, forward-looking decisions while preserving human accountability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#early-access" className="btn-primary" data-testid="hero-btn-primary">
              Join Early Access
            </a>
            <a href="#wedge" className="btn-secondary" data-testid="hero-btn-secondary">
              See the wedge →
            </a>
          </div>
        </motion.div>

        {/* Abstract Visual Panel */}
        <motion.div
          initial={{ opacity: 0, opacity: 0 }}
          animate={{ opacity: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:block relative h-[500px] w-full"
        >
          <div className="absolute inset-0 card-dark overflow-hidden flex items-center justify-center border-white/5">
            {/* SVG Grid */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Smooth abstract curves */}
            <svg viewBox="0 0 500 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trend" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#CC6600" stopOpacity="0" />
                  <stop offset="50%" stopColor="#CC6600" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#CC6600" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M-50,350 Q150,300 250,200 T550,50" fill="none" stroke="url(#trend)" strokeWidth="4" />
              <path d="M-50,350 Q150,300 250,200 T550,50 L550,450 L-50,450 Z" fill="url(#trend)" opacity="0.1" />
            </svg>

            {/* Floating metric chips */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-[20%] left-[10%] bg-black/80 backdrop-blur border border-accent/30 rounded-full px-4 py-2"
            >
              <span className="text-accent font-medium text-sm">Runway: 11 months</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-[40%] right-[15%] bg-black/80 backdrop-blur border border-accent/30 rounded-full px-4 py-2"
            >
              <span className="text-accent font-medium text-sm">Burn ↑ 22%</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[30%] left-[30%] bg-black/80 backdrop-blur border border-accent/30 rounded-full px-4 py-2"
            >
              <span className="text-accent font-medium text-sm">Margin: 38%</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[15%] right-[25%] bg-black/80 backdrop-blur border border-accent/30 rounded-full px-4 py-2 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent font-medium text-sm">Variance detected</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}