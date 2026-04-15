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
      text: (
        <>
          Cash runway has compressed from <span className="font-medium text-white">14 months to 9 months</span> over the past two quarters, driven primarily by a <span className="font-medium text-white">31% increase</span> in payroll and a slowdown in receivables collection. At the current burn rate, the organization reaches a critical threshold in <span className="font-medium text-white">Q3</span>. Recommended actions: accelerate Q2 collections, pause two open headcount requisitions pending revenue milestone confirmation.
        </>
      )
    },
    {
      title: "Spend Variance",
      text: (
        <>
          Operating expenses exceeded budget by <span className="font-medium text-white">18% in March</span>, concentrated in three categories: software subscriptions (+$12K), contractor spend (+$28K), and travel (+$9K). The contractor overrun is tied to the accelerated product timeline. This is a one-time variance, but if the timeline extends, a <span className="font-medium text-white">reforecast is warranted</span> before the board meeting.
        </>
      )
    },
    {
      title: "Hiring Decision",
      text: (
        <>
          Adding a senior engineer at <span className="font-medium text-white">$180K</span> fully loaded increases monthly burn by <span className="font-medium text-white">$15K</span> and compresses runway by approximately <span className="font-medium text-white">6 weeks</span>. At current revenue growth of 8% month-over-month, the breakeven on this hire is approximately 4.5 months post-ramp. Recommend proceeding if Q2 revenue lands within 10% of plan; defer if it misses by more than 15%.
        </>
      )
    }
  ];

  return (
    <section id="vision" className="section-padding border-t border-[rgba(30,39,97,0.12)]">
      <div className="container-custom">
        <span className="text-label">THE VISION</span>
        <div className="max-w-4xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Augmented CFO Judgment.
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-foreground">
            An AI-powered CFO layer that sits above your systems of record — ingesting accounting, banking, payroll, and operational data to produce the insight your organization actually needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 pt-4">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0"></div>
                <p className="font-body text-base md:text-lg leading-relaxed text-foreground">{cap}</p>
              </div>
            ))}
          </div>

          <div className="card-dark border-l-4 border-l-accent p-0 overflow-hidden flex flex-col">
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <span className="font-semibold text-white">AI.FO Financial Brief</span>
              <span className="text-xs text-white/55">Generated moments ago</span>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <div className="flex gap-4 mb-6 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`text-sm whitespace-nowrap font-medium transition-colors ${
                      activeTab === i ? "text-accent" : "text-white/55 hover:text-white/85"
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
                    className="font-mono text-sm md:text-base leading-relaxed text-white/85"
                  >
                    <span className="text-accent/50 mr-2">{">"}</span>
                    {examples[activeTab].text}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center border-t border-[rgba(30,39,97,0.12)] pt-16">
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            "A collaborative intelligence model that feels like a trusted CFO — not a dashboard, and not an automation fantasy."
          </h3>
        </div>
      </div>
    </section>
  );
}