import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import MarketsExplorer from './components/MarketsExplorer';
import LiveFeedSection from './components/LiveFeedSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import { featuredMarkets, markets, activityFeed } from './data';

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection featuredMarkets={featuredMarkets} />
        <StatsSection />
        <MarketsExplorer markets={markets} />
        <LiveFeedSection activity={activityFeed} />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
