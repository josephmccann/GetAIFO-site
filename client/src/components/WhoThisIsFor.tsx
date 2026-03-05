import { motion } from "framer-motion";

export default function WhoThisIsFor() {
  const cards = [
    {
      title: "Small & Mid-Size Businesses",
      subtitle: "$1M–$50M revenue",
      desc: "You have a bookkeeper and accounting software. You don't have a CFO. You need one."
    },
    {
      title: "Venture-Backed Startups",
      subtitle: "Pre-Series B",
      desc: "Your burn rate matters more than your dashboard. You need forward-looking judgment, not backward-looking reports."
    },
    {
      title: "Nonprofits & Mission-Driven Orgs",
      subtitle: "Complex funding",
      desc: "Complex funding structures, board accountability, and limited finance staff. CFO-level clarity shouldn't require CFO-level headcount."
    }
  ];

  return (
    <section id="for-you" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">WHO THIS IS FOR</span>
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl text-white leading-tight max-w-3xl">
            Built for organizations that have outgrown their financial infrastructure.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {cards.map((card, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i} 
              className="card-dark border-t-2 border-t-accent pt-6"
            >
              <h3 className="text-white text-xl font-bold font-body tracking-normal mb-1">{card.title}</h3>
              <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-4">{card.subtitle}</p>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto py-8 px-6 border border-white/10 rounded-lg bg-white/[0.02]">
          <h3 className="text-xl md:text-2xl text-white font-body font-medium">
            "If you're making high-stakes financial decisions without a CFO in the room — AI.FO was built for you."
          </h3>
        </div>
      </div>
    </section>
  );
}