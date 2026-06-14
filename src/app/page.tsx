import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import LiveFeedSection from './components/LiveFeedSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import { bills, activityFeed } from './data';

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection bills={bills} />
        <StatsSection />
        <LiveFeedSection activity={activityFeed} />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
