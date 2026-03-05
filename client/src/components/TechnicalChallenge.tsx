import { motion } from "framer-motion";

export default function TechnicalChallenge() {
  return (
    <section id="technical" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">THE TECHNICAL CHALLENGE</span>
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl text-white">Reasoning, Not Reporting.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-1 mb-16 rounded-xl overflow-hidden shadow-2xl">
          {/* Left Panel */}
          <div className="bg-accent p-10 md:p-14">
            <h3 className="text-black font-display tracking-wide text-3xl mb-8">Constraints of the Real World</h3>
            <ul className="space-y-6">
              {[
                "Financial data is fragmented across inconsistent systems and schemas",
                "Signal lives in the relationships between datasets — not inside them",
                "CFO judgment is contextual, probabilistic, and narrative-driven",
                "Accuracy, explainability, and trust matter more than novelty"
              ].map((item, i) => (
                <li key={i} className="flex gap-4 text-black/90 font-medium text-lg leading-snug">
                  <span className="block mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel */}
          <div className="bg-accent-hover p-10 md:p-14">
            <h3 className="text-black font-display tracking-wide text-3xl mb-8">Technical Requirements</h3>
            <ul className="space-y-6">
              {[
                "Normalize messy, real-world financial data across sources",
                "Reason across time, entities, and uncertainty",
                "Produce outputs humans trust — not just outputs that are correct",
                "Support iterative refinement as data and context evolve"
              ].map((item, i) => (
                <li key={i} className="flex gap-4 text-black/90 font-medium text-lg leading-snug">
                  <span className="block mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-white/80 font-medium">
            This product lives or dies on system design, not surface UX.
          </p>
        </div>
      </div>
    </section>
  );
}