import { motion } from "framer-motion";

export default function ExistingTools() {
  const cards = [
    {
      title: "Dashboards surface metrics",
      desc: "— but lack context, prioritization, and the \"so what.\""
    },
    {
      title: "Fractional advisory is episodic",
      desc: "— not continuous. Insight arrives between decisions, not during them."
    },
    {
      title: "Accounting systems are backward-looking",
      desc: "— they record what happened; they don't interpret it."
    },
    {
      title: "FP&A tools are heavyweight and slow",
      desc: "— built for finance teams that don't exist yet at this stage."
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
          {cards.map((card, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i} 
              className="card-dark"
            >
              <p className="text-lg">
                <strong className="text-white font-body">{card.title}</strong> {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full bg-accent/10 border-y border-accent/20 py-8">
        <div className="container-custom text-center">
          <h3 className="text-2xl md:text-3xl text-accent font-body font-medium">
            Net effect: more data — less clarity when it matters most.
          </h3>
        </div>
      </div>
    </section>
  );
}