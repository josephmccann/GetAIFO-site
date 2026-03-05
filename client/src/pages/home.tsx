import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhoWhy from "@/components/WhoWhy";
import Problem from "@/components/Problem";
import ExistingTools from "@/components/ExistingTools";
import WhyNow from "@/components/WhyNow";
import ProductVision from "@/components/ProductVision";
import TechnicalChallenge from "@/components/TechnicalChallenge";
import Wedge from "@/components/Wedge";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import EarlyAccess from "@/components/EarlyAccess";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-black font-body font-light">
      <Nav />
      <main>
        <Hero />
        <WhoWhy />
        <Problem />
        <ExistingTools />
        <WhyNow />
        <ProductVision />
        <TechnicalChallenge />
        <Wedge />
        <WhoThisIsFor />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}