import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/lib/pageMeta";

export default function Terms() {
  usePageMeta({
    title: "Terms of Use  AI.FO",
    description: "Terms governing your use of the AI.FO marketing website and early access waitlist.",
    canonical: "https://getaifo.com/terms",
  });
  return (
    <div className="min-h-screen bg-[#C8D4F0] text-[#1E2761] font-body font-light">
      <Nav />
      <main className="pt-32 pb-20">
        <div className="container-custom max-w-3xl">
          <span className="text-label">LEGAL</span>
          <h1 className="font-display text-5xl md:text-6xl text-[#1E2761] mb-8" data-testid="heading-terms">
            Terms of Use
          </h1>
          <div className="space-y-6 text-[#1E2761] leading-relaxed">
            <p className="text-[#4A5578]">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            <p>
              By accessing or using the AI.FO website, you agree to be bound by these terms. If you do not agree, please do not use our website.
            </p>
            <h2 className="font-display text-2xl text-[#1E2761] pt-4">Use of Website</h2>
            <p>
              This website is provided for informational purposes and to allow you to join the AI.FO early access waitlist. You agree to provide accurate information when submitting forms on our site.
            </p>
            <h2 className="font-display text-2xl text-[#1E2761] pt-4">Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and design, is the property of AI.FO and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
            <h2 className="font-display text-2xl text-[#1E2761] pt-4">Disclaimer</h2>
            <p>
              This website and its content are provided "as is" without warranties of any kind. AI.FO does not guarantee the accuracy, completeness, or usefulness of any information on the site.
            </p>
            <h2 className="font-display text-2xl text-[#1E2761] pt-4">Limitation of Liability</h2>
            <p>
              AI.FO shall not be liable for any damages arising from your use of this website or reliance on its content.
            </p>
            <h2 className="font-display text-2xl text-[#1E2761] pt-4">Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@getaifo.com" className="text-accent hover:text-[#1E2761] transition-colors">hello@getaifo.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
