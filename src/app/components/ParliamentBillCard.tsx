import type { ParliamentBill } from '../types/parliament';
import { formatBillDate } from '../lib/utils';

function billStatus(bill: ParliamentBill): { label: string; className: string } {
  if (bill.is_act) return { label: '✓ Act', className: 'text-success' };
  if (bill.is_defeated) return { label: '✗ Defeated', className: 'text-error' };
  if (bill.bill_withdrawn) return { label: 'Withdrawn', className: 'text-warning' };
  return { label: '● Active', className: 'text-success' };
}

interface Props {
  bill: ParliamentBill;
  variant?: 'default' | 'featured';
}

export default function ParliamentBillCard({ bill, variant = 'default' }: Props) {
  const isFeatured = variant === 'featured';
  const status = billStatus(bill);

  return (
    <article className="bg-canvas rounded-lg flex flex-col shadow-level-2 hover:shadow-level-3 transition-shadow overflow-hidden">
      <div className={`flex flex-col gap-md ${isFeatured ? 'p-xl' : 'p-lg'}`}>
        {/* Header: house + status */}
        <div className="flex items-center justify-between gap-sm">
          <span className="text-caption-mono font-mono text-mute uppercase tracking-wider">
            {bill.current_house ?? bill.originating_house ?? 'Parliament'}
          </span>
          <span className={`text-caption-mono font-mono uppercase tracking-wider ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h3
          className={
            isFeatured
              ? 'text-display-sm font-semibold text-ink leading-snug'
              : 'text-body-md font-medium text-ink leading-snug'
          }
        >
          {bill.short_title ?? 'Untitled Bill'}
        </h3>

        {/* Current stage */}
        {bill.current_stage_name && (
          <div className="flex items-center gap-xs">
            <span className="text-caption font-mono text-mute">Stage:</span>
            <span className="text-caption font-mono text-body">{bill.current_stage_name}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between border-t border-hairline mt-auto ${
          isFeatured ? 'px-xl py-md' : 'px-lg py-sm'
        }`}
      >
        <span className="text-caption font-mono text-mute">
          {bill.parliament_last_update
            ? `Updated ${formatBillDate(bill.parliament_last_update)}`
            : 'Parliament Bill'}
        </span>
        <a href={`/bills/${bill.id}`} className="btn-primary-sm flex-shrink-0">
          View →
        </a>
      </div>
    </article>
  );
}
