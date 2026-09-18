import { Hero } from '../components/Hero';
import { AuthorityStrip } from '../components/AuthorityStrip';
import { ClientMarquee } from '../components/ClientMarquee';
import { Problem } from '../components/Problem';
import { GrowthSystem } from '../components/GrowthSystem';
import { Expertise } from '../components/Expertise';
import { SelectedWork } from '../components/SelectedWork';
import { WhyFazo } from '../components/WhyFazo';
import { Process } from '../components/Process';
import { Insights } from '../components/Insights';
import { Engagement } from '../components/Engagement';
import { Application } from '../components/Application';
import { FinalCTA } from '../components/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <AuthorityStrip />
      <ClientMarquee />
      <Problem />
      <GrowthSystem />
      <Expertise />
      <SelectedWork />
      <WhyFazo />
      <Process />
      <Insights />
      <Engagement />
      <Application />
      <FinalCTA />
    </>
  );
}
