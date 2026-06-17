import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import BillsExplorer from './components/BillsExplorer';
import LiveFeedSection from './components/LiveFeedSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import { activityFeed } from './data';
import { fetchBills } from './lib/api';

export default async function Home() {
  const bills = await fetchBills({ status: 'active', take: 9 });
  const featuredBills = bills.slice(0, 3);

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
