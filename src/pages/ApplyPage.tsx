import { useLang } from '../i18n';
import { Application } from '../components/Application';
import { FinalCTA } from '../components/FinalCTA';
import { PageHeader } from '../components/PageHeader';

export default function ApplyPage() {
  const { p } = useLang();
  return (
    <>
      <PageHeader label={p.applyPage.title} title={p.applyPage.title} intro={p.applyPage.intro} />
      <Application compact />
      <FinalCTA />
    </>
  );
}
