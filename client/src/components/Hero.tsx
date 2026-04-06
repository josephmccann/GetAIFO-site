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
          <p className="text-xs font-semibold tracking-[0.2em] text-[#8A9CC5] uppercase mb-6">
            AI.FO • Early Access
          </p>
          <div className="mb-6">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-2" data-testid="hero-heading">
              Financial judgment that works while you sleep.
            </h1>
            <div className="w-24 h-1 bg-accent rounded-full mt-6"></div>
          </div>
          <p className="font-body text-base md:text-lg leading-relaxed text-[#CADCFC] mb-2 max-w-xl" data-testid="hero-subhead">
            AI.FO connects to your accounting system, detects 26+ financial signals in real time, and produces the kind of forward-looking guidance you'd expect from a CFO — continuously, not quarterly.
          </p>
          <p className="font-body text-base md:text-lg leading-relaxed text-[#8A9CC5] mb-10 max-w-xl">
            No dashboards. No spreadsheets. Decision-ready intelligence, every month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#early-access" className="btn-primary" data-testid="hero-btn-primary">
              Join Early Access
            </a>
            <a href="#early-access" className="btn-secondary" data-testid="hero-btn-demo">
              Try the Live Demo
            </a>
          </div>
        </motion.div>

        {/* Abstract Visual Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[300px] lg:h-[500px] w-full"
        >
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center rounded-lg border border-[rgba(202,220,252,0.1)]" style={{ background: "linear-gradient(145deg, #070E1A 0%, #0C1829 40%, #111E33 100%)" }}>
            {/* SVG Grid */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-[0.08]">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(140,180,255,0.5)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Subtle corner glow */}
            <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#60A5FA]/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-[200px] h-[200px] bg-accent/[0.03] rounded-full blur-[60px] pointer-events-none" />

            {/* Smooth abstract curves */}
            <svg viewBox="0 0 500 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trend" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                  <stop offset="40%" stopColor="#60A5FA" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#CC6600" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#CC6600" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="trendFill" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                  <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#CC6600" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path d="M-50,350 Q150,300 250,200 T550,50" fill="none" stroke="url(#trend)" strokeWidth="3" />
              <path d="M-50,350 Q150,300 250,200 T550,50 L550,450 L-50,450 Z" fill="url(#trendFill)" />
            </svg>

            {/* Floating metric chips */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-[15%] left-[5%] lg:top-[20%] lg:left-[10%] bg-[#0A1A2F]/90 backdrop-blur border border-[#4ADE80]/30 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 shadow-lg shadow-[#4ADE80]/5"
            >
              <span className="text-[#4ADE80] font-semibold text-xs lg:text-sm">Runway: 11 months</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-[35%] right-[5%] lg:top-[40%] lg:right-[15%] bg-[#0A1A2F]/90 backdrop-blur border border-[#F87171]/30 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 shadow-lg shadow-[#F87171]/5"
            >
              <span className="text-[#F87171] font-semibold text-xs lg:text-sm">Burn ↑ 22%</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[30%] left-[20%] lg:left-[30%] bg-[#0A1A2F]/90 backdrop-blur border border-[#60A5FA]/30 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 shadow-lg shadow-[#60A5FA]/5"
            >
              <span className="text-[#60A5FA] font-semibold text-xs lg:text-sm">Margin: 38%</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[10%] right-[10%] lg:bottom-[15%] lg:right-[25%] bg-[#0A1A2F]/90 backdrop-blur border border-[#FBBF24]/30 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 flex items-center gap-2 shadow-lg shadow-[#FBBF24]/5"
            >
              <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
              <span className="text-[#FBBF24] font-semibold text-xs lg:text-sm">Variance detected</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}