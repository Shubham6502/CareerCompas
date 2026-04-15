import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Stats       from '../components/Stat.jsx';
import Features    from '../components/Features.jsx';
import Domains     from '../components/Domains.jsx';
import HowItWorks  from '../components/HowItWorks.jsx';
import CTA         from '../components/CTA.jsx';
import Footer      from '../components/Footer.jsx';

export default function HomePage() {
  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Domains />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}