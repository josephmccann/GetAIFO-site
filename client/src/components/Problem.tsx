import { motion } from "framer-motion";

export default function Problem() {
  const cards = [
    {
      title: "The gap is structural.",
      desc: "A full-time CFO is often unavailable, unaffordable, or premature. Founders and operators absorb CFO responsibilities by default — without the infrastructure to support them."
    },
    {
      title: "The data exists — judgment doesn't.",
      desc: "Systems accurately record activity but do not produce synthesis, prioritization, or forward-looking guidance. The accounting is accurate. Nobody is connecting the dots."
    },
    {
      title: "The cost is real.",
      desc: "High-impact decisions — hiring timing, cash runway, pricing, cost structure — are made with incomplete context. The gap shows up 9 months before anyone notices."
    }
  ];

  return (
    <section id="problem" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">THE PROBLEM</span>
        <div className="max-w-3xl mb-16">
          <h2 className="text-5xl md:text-6xl text-white mb-6 leading-tight">
            CFO-level decisions begin far earlier than CFO-level staffing.
          </h2>
          <p className="text-xl md:text-2xl text-white/60">
            Organizations under $50M face increasing financial complexity without the leadership infrastructure to manage it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {cards.map((card, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i} 
              className="card-dark"
            >
              <h3 className="text-white text-xl font-bold font-body mb-3 tracking-normal">{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl text-white">
            "Organizations outgrow their financial infrastructure before they can staff for it."
          </h3>
        </div>
      </div>
    </section>
  );
}