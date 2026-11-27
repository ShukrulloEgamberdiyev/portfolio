import { ClientMarquee } from '../components/ClientMarquee';
import { FinalCTA } from '../components/FinalCTA';
import { HomeApply, HomeCases, HomeCrm, HomeFaq, HomeFit, HomeHero, HomeProblems, HomeProcess, HomeServices } from '../components/home/HomeSections';

/**
 * Home: who we serve and the problem → problems the owner recognises → services with clear limits →
 * CRM + Meta CAPI (the chain from ads to recorded sales) → projects (verified facts only) → process →
 * who it suits → FAQ → application → direct contacts.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <ClientMarquee />
      <HomeProblems />
      <HomeServices />
      <HomeCrm />
      <HomeCases />
      <HomeProcess />
      <HomeFit />
      <HomeFaq />
      <HomeApply />
      <FinalCTA />
    </>
  );
}
