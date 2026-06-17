import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import DepartureBoardSection from './components/DepartureBoardSection';
import LiveFeedSection from './components/LiveFeedSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import { activityFeed } from './data';
import { fetchBills } from './lib/api';

export default async function Home() {
  const bills = await fetchBills({ status: 'active', take: 24 });
  const featuredBills = bills.slice(0, 3);

  return (
    <>
      <NavBar />
      <main>
        <HeroSection featuredBills={featuredBills} />
        <StatsSection />
        <DepartureBoardSection bills={bills} />
        <LiveFeedSection activity={activityFeed} />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
