import type { ParliamentBill } from '../types/parliament';
import ParliamentBillCard from './ParliamentBillCard';

interface Props {
  bills: ParliamentBill[];
}

export default function BillsExplorer({ bills }: Props) {
  return (
    <section className="bg-canvas-soft py-3xl md:py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Section header */}
        <div className="flex items-end justify-between mb-2xl">
          <div>
            <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-xs">
              Active Bills
            </div>
            <h2 className="text-display-lg font-semibold text-ink">
              Bills before Parliament.
            </h2>
          </div>
          <a href="/bills" className="btn-secondary hidden sm:inline-flex">
            All bills →
          </a>
        </div>

        {/* Bills grid */}
        {bills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {bills.map((bill) => (
              <ParliamentBillCard key={bill.id} bill={bill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4xl text-mute text-body-md">
            Live bill data will appear here once the database is connected.
          </div>
        )}

        <div className="mt-xl sm:hidden">
          <a href="/bills" className="btn-secondary w-full text-center">
            All bills →
          </a>
        </div>
      </div>
    </section>
  );
}
