import Navbar from './Navbar';
import Hero from './Hero';
import Intro from './Intro';
import ProjectWorld from './ProjectWorld';
import VideoWork from './VideoWork';
import Creative from './Creative';
import Brands from './Brands';
import Resume from './Resume';
import About from './About';
import Contact from './Contact';
import RevealObserver from './RevealObserver';
import Cursor from './Cursor';
import { site, contacts } from './content';

/** Avazbek Meliqoziyev personal portfolio — fazodigital.uz/avazbek. FAZO header/footer ishlatilmaydi. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Marketing & SMM Specialist',
  url: site.url,
  image: 'https://www.fazodigital.uz/avazbek/images/hero.jpg',
  email: contacts.email.href,
  telephone: '+998910107566',
  sameAs: [contacts.telegram.href],
  address: { '@type': 'PostalAddress', addressLocality: 'Tashkent', addressCountry: 'UZ' },
};

export default function AvazbekApp() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <ProjectWorld />
        <VideoWork />
        <Creative />
        <Brands />
        <Resume />
        <About />
        <Contact />
      </main>
      <RevealObserver />
      <Cursor />
    </>
  );
}
