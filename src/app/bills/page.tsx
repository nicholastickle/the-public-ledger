import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BillsListContent from '../components/BillsListContent';
import { fetchBills } from '../lib/api';
import type { BillStatus } from '../types/parliament';

export const metadata = {
  title: 'Parliamentary Bills — The Public Ledger',
  description:
    'Track every bill making its way through Parliament — from First Reading to Royal Assent.',
};

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; house?: string; search?: string }>;
}) {
  const { status: rawStatus, house, search } = await searchParams;
  const status = (rawStatus ?? 'active') as BillStatus;

  const bills = await fetchBills({ status, house, search, take: 100 });

  return (
    <>
      <NavBar />
      <main className="flex-1 bg-canvas-soft">
        <div className="max-w-[1400px] mx-auto px-lg py-3xl">
          <div className="mb-2xl">
            <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-xs">
              UK Parliament
            </div>
            <h1 className="text-display-lg font-semibold text-ink">
              Parliamentary Bills
            </h1>
            <p className="text-body-lg text-body mt-sm max-w-[36rem]">
              Track every bill making its way through Parliament — from First Reading to Royal Assent.
            </p>
          </div>

          <BillsListContent bills={bills} status={status} house={house ?? ''} />
        </div>
      </main>
      <Footer />
    </>
  );
}
