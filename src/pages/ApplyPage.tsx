import { useLang } from '../i18n';
import { FinalCTA } from '../components/FinalCTA';
import { HomeApply } from '../components/home/HomeSections';
import { PageHeader } from '../components/PageHeader';

export default function ApplyPage() {
  const { p } = useLang();
  return (
    <>
      <PageHeader label={p.applyPage.title} title={p.applyPage.title} intro={p.applyPage.intro} />
      <HomeApply compact />
      <FinalCTA />
    </>
  );
}
