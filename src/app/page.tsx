import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import BillsExplorer from './components/BillsExplorer';
import LiveFeedSection from './components/LiveFeedSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import { featuredBills, bills, activityFeed } from './data';

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection featuredBills={featuredBills} />
        <StatsSection />
        <BillsExplorer bills={bills} />
        <LiveFeedSection activity={activityFeed} />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
