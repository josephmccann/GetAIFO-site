import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { SystemStatus } from '@/components/SystemStatus';
import { WhatExists } from '@/components/WhatExists';
import { HowItWorks } from '@/components/HowItWorks';
import { WhyThisWhyNow } from '@/components/WhyThisWhyNow';
import { RunwayChart } from '@/components/RunwayChart';
import { LiveBrief } from '@/components/LiveBrief';
import { Architecture } from '@/components/Architecture';
import { EarlyAccess } from '@/components/EarlyAccess';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SystemStatus />
        <WhatExists />
        <HowItWorks />
        <WhyThisWhyNow />
        <RunwayChart />
        <LiveBrief />
        <Architecture />
        <EarlyAccess />
      </main>
      <Footer />
    </>
  );
}
