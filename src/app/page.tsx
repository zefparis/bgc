import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Business } from '@/components/sections/Business';
import { Approach } from '@/components/sections/Approach';
import { Execution } from '@/components/sections/Execution';
import { Network } from '@/components/sections/Network';
import { Closing } from '@/components/sections/Closing';
import { PartnersBar } from '@/components/sections/PartnersBar';
import { ContactModal } from '@/components/contact/ContactModal';
import { AfricaMapDefs } from '@/components/shared/AfricaMap';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

// CSP nonces require per-request rendering — the proxy stamps a fresh nonce
// into every response, so this page must not be served as a static shell.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <AfricaMapDefs />
      <Header />
      <main>
        <Hero />
        <About />
        <Business />
        <Approach />
        <Execution />
        <Network />
        <Closing />
      </main>
      <PartnersBar />
      <Footer />
      <ContactModal />
      <ScrollReveal />
    </>
  );
}
