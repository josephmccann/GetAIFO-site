import { motion } from "framer-motion";

export default function TechnicalChallenge() {
  return (
    <section id="technical" className="section-padding border-t border-[#A8B8D8]">
      <div className="container-custom">
        <span className="text-label">THE ARCHITECTURE</span>
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl text-[#1E2761]">Deterministic Reasoning. Generative Communication.</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <p className="text-lg text-[#1E2761] leading-relaxed">
            Every number in AI.FO is computed by formula  burn rate, runway, DSO, margin compression, signal detection thresholds. These calculations are repeatable, auditable, and identical every time.
          </p>
          <p className="text-lg text-[#1E2761] leading-relaxed">
            The AI layer (Claude) handles one job: translating those computations into plain-language guidance. It does not do math. It explains what the math means for your business.
          </p>
          <p className="text-lg text-[#1E2761] leading-relaxed">
            This architecture is deliberate. Financial trust requires deterministic foundations. AI.FO earns that trust by showing its work  every signal traces back to a formula and a data source. <strong className="font-semibold text-accent">AI never touches the math. By design, not by policy.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
