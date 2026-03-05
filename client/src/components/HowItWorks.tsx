import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Ingest", desc: "Connect accounting, banking, payroll, and operational signals." },
    { num: "02", title: "Normalize", desc: "Reconcile messy schemas and link relationships across datasets." },
    { num: "03", title: "Reason", desc: "Generate narrative guidance tied to hiring, runway, pricing, and risk." }
  ];

  return (
    <section id="how-it-works" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">HOW IT WORKS</span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-16">
          From raw data to decision-ready judgment.
        </h2>

        <div className="relative">
          {/* Subtle line for desktop arrows behind cards */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                key={step.num} 
                className="bg-white/[0.04] border border-white/10 rounded-lg p-6 md:p-8 relative bg-black"
              >
                <div className="text-accent font-display text-2xl mb-4">{step.num}</div>
                <h3 className="text-white text-xl font-bold font-body mb-3">{step.title}</h3>
                <p className="text-white/70 text-base leading-relaxed">{step.desc}</p>
                
                {/* Desktop Arrow Connector */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 text-white/20 -translate-y-1/2 translate-x-1/2 bg-[#0a0a0a] rounded-full items-center justify-center border border-white/10 z-20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}