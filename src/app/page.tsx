import HeroSection from './components/HeroSection';
import DepartureBoardSection from './components/DepartureBoardSection';
import RegulationBoardSection from './components/RegulationBoardSection';
import Footer from './components/Footer';
import { fetchBills, fetchRegulations } from './lib/api';

export default async function Home() {
  const [bills, regulations] = await Promise.all([
    fetchBills({ status: 'active', take: 24 }),
    fetchRegulations({ status: 'pending', take: 24 }),
  ]);

  return (
    <>
      <main>
        <HeroSection />
        <DepartureBoardSection bills={bills} />
        <RegulationBoardSection regulations={regulations} />
      </main>
      <Footer />
    </>
  );
}
