import HeroSection from './components/hero/HeroSection';
import DepartureBoardSection from './components/board/DepartureBoardSection';
import RegulationBoardSection from './components/board/RegulationBoardSection';
import Footer from './components/navigation/Footer';
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
