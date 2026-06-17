import { notFound } from 'next/navigation';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import StageTimeline from '../../components/StageTimeline';
import { fetchBill, fetchBillStages } from '../../lib/api';

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const billId = parseInt(id, 10);
  if (isNaN(billId)) notFound();

  const [bill, stages] = await Promise.all([
    fetchBill(billId),
    fetchBillStages(billId),
  ]);

  if (!bill) notFound();

  const status = bill.is_act
    ? { label: 'Act of Parliament', className: 'text-success' }
    : bill.is_defeated
    ? { label: 'Defeated', className: 'text-error' }
    : bill.bill_withdrawn
    ? { label: 'Withdrawn', className: 'text-warning' }
    : { label: '● Active', className: 'text-success' };

  return (
    <>
      <NavBar />
      <main className="flex-1 bg-canvas">
        <div className="max-w-[900px] mx-auto px-lg py-3xl">
          {/* Breadcrumb */}
          <div className="mb-lg">
            <a href="/bills" className="link text-body-sm">
              ← All Bills
            </a>
          </div>

          {/* Bill header */}
          <div className="mb-3xl">
            <div className="flex items-center gap-md flex-wrap mb-sm">
              <span className="text-caption-mono font-mono text-mute uppercase tracking-wider">
                {bill.originating_house ?? 'Parliament'} Bill
              </span>
              <span className={`text-caption-mono font-mono uppercase tracking-wider ${status.className}`}>
                {status.label}
              </span>
            </div>
            <h1 className="text-display-lg font-semibold text-ink mb-md">
              {bill.short_title ?? 'Bill'}
            </h1>
            {bill.long_title && (
              <p className="text-body-md text-body">{bill.long_title}</p>
            )}
            {bill.current_stage_name && (
              <div className="flex items-center gap-xs mt-md">
                <span className="text-body-sm text-mute">Current stage:</span>
                <span className="text-body-sm font-medium text-ink">
                  {bill.current_stage_name}
                </span>
              </div>
            )}
          </div>

          {/* Summary */}
          {bill.summary && (
            <div className="bg-canvas-soft rounded-lg p-lg shadow-level-1 mb-3xl">
              <h2 className="text-display-sm font-semibold text-ink mb-sm">Summary</h2>
              <p className="text-body-md text-body">{bill.summary}</p>
            </div>
          )}

          {/* Stage timeline */}
          <div>
            <h2 className="text-display-sm font-semibold text-ink mb-xl">
              Legislative Journey
            </h2>
            <StageTimeline stages={stages} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
