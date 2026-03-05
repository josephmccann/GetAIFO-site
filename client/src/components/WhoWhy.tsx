export default function WhoWhy() {
  return (
    <section className="section-padding border-t border-white/10">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <span className="text-label">WHO</span>
            <h2 className="text-4xl md:text-5xl text-white mb-6">
              Finance executive.<br />
              Operator.<br />
              Builder.
            </h2>
            <p className="text-lg">
              Joe McCann brings over 20 years of C-suite and senior leadership experience across education, nonprofits, and operating organizations. He specializes in building financial infrastructure, reporting systems, and decision frameworks in complex, fast-moving environments.
            </p>
          </div>
          <div>
            <span className="text-label">WHY</span>
            <h2 className="text-4xl md:text-5xl text-white mb-6">
              Built from repeated observation.
            </h2>
            <p className="text-lg">
              Across organizations of every size, leaders were making high-stakes decisions using backward-looking tools and incomplete synthesis. AI.FO translates seasoned CFO judgment into a scalable, responsible insight layer — improving decision quality and speed while preserving human accountability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}