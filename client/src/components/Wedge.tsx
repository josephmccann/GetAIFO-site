export default function Wedge() {
  return (
    <section id="wedge" className="section-padding border-t border-white/10">
      <div className="container-custom">
        <span className="text-label">THE WEDGE</span>
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl text-white leading-tight max-w-4xl">
            Turning raw financial data into continuous, decision-ready signals.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-8">
            <h3 className="text-2xl text-white font-bold font-body">Initial Focus</h3>
            <ul className="space-y-6">
              {[
                "Organizations under $50M with no full-time CFO",
                "Monthly close is done — but insight arrives too late to matter, if at all",
                "Decisions are recurring, not one-off: hiring, runway, spend, risk"
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2.5 shrink-0" />
                  <p className="text-lg text-white/80">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8 p-8 md:p-10 rounded-lg border border-accent/20 bg-accent/5">
            <h3 className="text-2xl text-accent font-bold font-body">What We're Building</h3>
            <p className="text-white font-medium text-lg">A lightweight CFO intelligence layer that:</p>
            <ul className="space-y-5">
              {[
                "Ingests GL + bank + payroll data",
                "Normalizes and reconciles across systems",
                "Produces plain-language financial narratives",
                "Surfaces early warning signals: runway, burn, variance, risk",
                "Frames decisions tied to upcoming organizational choices"
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="text-accent shrink-0 font-bold mt-0.5">✓</div>
                  <p className="text-base text-white/90">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}