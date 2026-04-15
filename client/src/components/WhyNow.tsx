import { motion } from "framer-motion";

export default function WhyNow() {
  const points = [
    "Financial complexity is increasing faster than leadership infrastructure can scale.",
    "Financial data is increasingly accessible via APIs, exports, and open banking.",
    "Modern LLM reasoning now enables narrative synthesis across fragmented, inconsistent datasets."
  ];

  return (
    <section id="why-now" className="section-padding border-t border-[#A8B8D8]">
      <div className="container-custom">
        <span className="text-label">WHY NOW</span>
        <div className="max-w-3xl mb-16">
          <h2 className="text-5xl md:text-6xl text-[#1E2761] leading-tight">
            The CFO coverage gap is widening  while AI capability has crossed a threshold.
          </h2>
        </div>

        <div className="space-y-6 max-w-3xl">
          {points.map((point, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i}
              className="flex gap-6 items-start"
            >
              <div className="mt-1 w-8 h-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center shrink-0">
                <span className="text-accent font-display font-bold text-lg">{i + 1}</span>
              </div>
              <p className="text-xl md:text-2xl text-[#1E2761] font-body">
                {point}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
