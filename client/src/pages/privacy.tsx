import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/lib/pageMeta";

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy — AI.FO",
    description: "How AI.FO collects, uses, and protects the information you share when joining our early access waitlist.",
    canonical: "https://getaifo.com/privacy",
  });
  return (
    <div className="min-h-screen bg-background text-foreground font-body font-light">
      <Nav />
      <main className="pt-32 pb-20">
        <div className="container-custom max-w-3xl">
          <span className="text-label">LEGAL</span>
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-8" data-testid="heading-privacy">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-foreground leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            <p>
              AI.FO ("we," "our," or "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information when you visit our website or join our waitlist.
            </p>
            <h2 className="font-display text-2xl text-foreground pt-4">Information We Collect</h2>
            <p>
              When you join our early access waitlist, we collect the information you provide: your name, email address, and optionally your organization's annual revenue range and accounting system. We do not collect any information automatically beyond what is standard for web hosting (such as server access logs).
            </p>
            <h2 className="font-display text-2xl text-foreground pt-4">How We Use Your Information</h2>
            <p>
              We use the information you provide solely to communicate with you about AI.FO, including early access invitations and product updates. We do not sell, share, or rent your personal information to third parties.
            </p>
            <h2 className="font-display text-2xl text-foreground pt-4">Data Storage</h2>
            <p>
              Your waitlist information is stored securely using industry-standard practices. We retain your data only as long as necessary to fulfill the purposes described in this policy.
            </p>
            <h2 className="font-display text-2xl text-foreground pt-4">Contact</h2>
            <p>
              If you have questions about this privacy policy or your data, contact us at{" "}
              <a href="mailto:hello@getaifo.com" className="text-accent hover:text-accent-hover transition-colors">hello@getaifo.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
