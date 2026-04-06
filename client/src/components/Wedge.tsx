import { motion } from "framer-motion";

export default function Wedge() {
  const liveItems = [
    "Intelligence briefs with 26+ signal detection across 5 categories",
    "Cash & runway analysis with A/R aging and binding constraints",
    "Expense intelligence with subscription overlap detection",
    "Interactive scenario modeling with pre-built stress tests",
    "CFO narrative memos (Founder + Board formats)",
    "AI assistant for financial Q&A",
    "QuickBooks Online integration",
    "CSV upload for any accounting system"
  ];

  const comingNext = [
    "Board packet Excel export",
    "Plaid banking integration",
    "Multi-company portfolio view"
  ];

  return (
    <section id="wedge" className="section-padding border-t border-[rgba(202,220,252,0.12)]">
      <div className="container-custom">
        <span className="text-label">WHAT'S LIVE</span>
        <div className="mb-16">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-tight max-w-4xl">
            What's live today.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8 p-8 md:p-10 rounded-lg border border-accent/20 bg-accent/5"
          >
            <ul className="space-y-5">
              {liveItems.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="text-accent shrink-0 font-bold mt-0.5">&#10003;</div>
                  <p className="text-base text-white">{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-8"
          >
            <h3 className="text-2xl text-white font-bold font-body">Coming next:</h3>
            <ul className="space-y-6">
              {comingNext.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-[#6B7DB0] rounded-full mt-2.5 shrink-0" />
                  <p className="text-lg text-[#8A9CC5]">{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
