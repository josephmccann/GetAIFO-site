import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhoWhy from "@/components/WhoWhy";
import Problem from "@/components/Problem";
import ExistingTools from "@/components/ExistingTools";
import WhyNow from "@/components/WhyNow";
import ProductVision from "@/components/ProductVision";
import TechnicalChallenge from "@/components/TechnicalChallenge";
import Wedge from "@/components/Wedge";
import EarlyAccess from "@/components/EarlyAccess";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1E2761] text-white selection:bg-accent selection:text-white font-body font-light">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <WhoWhy />
        <Problem />
        <ExistingTools />
        <WhyNow />
        <ProductVision />
        <TechnicalChallenge />
        <Wedge />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}