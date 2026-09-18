import { useLang } from '../i18n';
import { Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';

export default function NotFound() {
  const { p } = useLang();
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center pt-32">
      <Label>404</Label>
      <Headline as="h1" immediate lines={[{ t: p.notFound.title, accent: true }]} className="display-md mt-8" />
      <p className="lead mt-6">{p.notFound.text}</p>
      <div className="mt-10"><Button to="/">{p.common.backHome}</Button></div>
    </section>
  );
}
