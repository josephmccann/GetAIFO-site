import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductVision() {
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    "Narrative insights leaders can actually use — not more charts",
    "Forward-looking risk signals before they become problems",
    "Decision framing tied to real choices: hiring, spend, runway, pricing",
    "Learns and evolves alongside the organization over time"
  ];

  const examples = [
    {
      title: "Runway Early Warning",
      text: "Cash runway has compressed from 14 months to 9 months over the past two quarters, driven primarily by a 31% increase in payroll and a slowdown in receivables collection. At the current burn rate, the organization reaches a critical threshold in Q3. Recommended actions: accelerate Q2 collections, pause two open headcount requisitions pending revenue milestone confirmation."
    },
    {
      title: "Spend Variance",
      text: "Operating expenses exceeded budget by 18% in March, concentrated in three categories: software subscriptions (+$12K), contractor spend (+$28K), and travel (+$9K). The contractor overrun is tied to the accelerated product timeline. This is a one-time variance, but if the timeline extends, a reforecast is warranted before the board meeting."
    },
    {
      title: "Hiring Decision",
      text: "Adding a senior engineer at $180K fully loaded increases monthly burn by $15K and compresses runway by approximately 6 weeks. At current revenue growth of 8% month-over-month, the breakeven on this hire is approximately 4.5 months post-ramp. Recommend proceeding if Q2 revenue lands within 10% of plan; defer if it misses by more than 15%."
    }
  ];

  return (
    <section id="vision" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">THE VISION</span>
        <div className="max-w-4xl mb-16">
          <h2 className="text-5xl md:text-6xl text-white mb-6 leading-tight">
            Augmented CFO Judgment.
          </h2>
          <p className="text-xl md:text-2xl text-white/60">
            An AI-powered CFO layer that sits above your systems of record — ingesting accounting, banking, payroll, and operational data to produce the insight your organization actually needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 pt-4">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0"></div>
                <p className="text-lg text-white/90">{cap}</p>
              </div>
            ))}
          </div>

          <div className="card-dark border-l-4 border-l-accent relative">
            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-accent font-semibold border border-accent/30 px-2 py-1 rounded bg-accent/10">
              AI.FO Analysis
            </div>
            
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`text-sm whitespace-nowrap font-medium transition-colors ${
                    activeTab === i ? "text-accent" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>

            <div className="min-h-[200px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-sm md:text-base leading-relaxed text-white/80"
                >
                  <span className="text-accent/50 mr-2">{">"}</span>
                  {examples[activeTab].text}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center border-t border-white/10 pt-16">
          <h3 className="text-2xl md:text-3xl text-white font-body">
            "A collaborative intelligence model that feels like a trusted CFO — not a dashboard, and not an automation fantasy."
          </h3>
        </div>
      </div>
    </section>
  );
}