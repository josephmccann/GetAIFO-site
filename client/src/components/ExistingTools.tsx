import { motion } from "framer-motion";

export default function ExistingTools() {
  const comparisons = [
    {
      existing: "Dashboards surface metrics",
      aifo: "AI.FO surfaces constraints — ranked, explained, with time horizons"
    },
    {
      existing: "Fractional advisory is episodic",
      aifo: "AI.FO runs continuously — every data sync, every month"
    },
    {
      existing: "Accounting systems are backward-looking",
      aifo: "AI.FO projects forward — runway, scenarios, risk windows"
    },
    {
      existing: "FP&A tools are heavyweight and slow",
      aifo: "AI.FO needs one CSV upload or QuickBooks connection"
    }
  ];

  return (
    <section id="tools" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">THE GAP</span>
        <div className="max-w-3xl mb-16">
          <h2 className="text-5xl md:text-6xl text-white leading-tight">
            Today's finance stack optimizes for reporting and compliance — not decision-making.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {comparisons.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i}
              className="card-dark space-y-4"
            >
              <p className="text-lg text-white/50 line-through decoration-white/20">
                {item.existing}
              </p>
              <p className="text-lg">
                <strong className="text-accent font-body">{item.aifo}</strong>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
