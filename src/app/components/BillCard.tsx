import type { Bill, BillCategory } from '../types';
import { formatVotes, formatBillDate } from '../lib/utils';

const CATEGORY_LABELS: Record<BillCategory, string> = {
  health: 'HEALTH',
  economy: 'ECONOMY',
  housing: 'HOUSING',
  environment: 'ENVIRONMENT',
  education: 'EDUCATION',
  justice: 'JUSTICE',
  immigration: 'IMMIGRATION',
};

interface Props {
  bill: Bill;
  variant?: 'default' | 'featured';
}

export default function BillCard({ bill, variant = 'default' }: Props) {
  const isFeatured = variant === 'featured';

  return (
    <article className="bg-canvas rounded-lg flex flex-col shadow-level-2 hover:shadow-level-3 transition-shadow overflow-hidden">
      <div className={`flex flex-col gap-md ${isFeatured ? 'p-xl' : 'p-lg'}`}>
        {/* Header: category + parliament vote badge */}
        <div className="flex items-center justify-between gap-sm">
          <span className="text-caption-mono font-mono text-mute uppercase tracking-wider">
            {CATEGORY_LABELS[bill.category]}
          </span>
          <ParliamentBadge vote={bill.parliamentVote} />
        </div>

        {/* Question */}
        <h3
          className={
            isFeatured
              ? 'text-display-sm font-semibold text-ink leading-snug'
              : 'text-body-md font-medium text-ink leading-snug'
          }
        >
          {bill.question}
        </h3>

        {/* Public opinion */}
        <div className="flex flex-col gap-xs">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-xs">
              <span className="text-display-sm font-semibold text-link">
                {bill.yesPercent}%
              </span>
              <span className="text-caption-mono font-mono text-link">YES</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="text-caption-mono font-mono text-highlight-pink">NO</span>
              <span className="text-display-sm font-semibold text-highlight-pink">
                {bill.noPercent}%
              </span>
            </div>
          </div>

          {/* Opinion bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden bg-canvas-soft-2">
            <div
              className="bg-link transition-all duration-300"
              style={{ width: `${bill.yesPercent}%` }}
            />
            <div
              className="bg-highlight-pink transition-all duration-300"
              style={{ width: `${bill.noPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between border-t border-hairline ${
          isFeatured ? 'px-xl py-md' : 'px-lg py-sm'
        }`}
      >
        <div className="flex flex-col gap-xxs">
          <span className="text-caption font-mono text-mute">
            {formatVotes(bill.totalVotes)} votes cast
          </span>
          <span className="text-caption font-mono text-mute">
            Debate {formatBillDate(bill.debateDate)}
          </span>
        </div>
        <a href={`/bills/${bill.id}`} className="btn-primary-sm flex-shrink-0">
          Vote →
        </a>
      </div>
    </article>
  );
}

function ParliamentBadge({
  vote,
}: {
  vote: Bill['parliamentVote'];
}) {
  if (!vote || vote === 'pending') {
    return (
      <span className="text-caption-mono font-mono text-success uppercase tracking-wider">
        ● In Session
      </span>
    );
  }
  if (vote === 'passed') {
    return (
      <span className="inline-flex items-center gap-xxs text-caption font-mono bg-primary text-on-primary px-xs rounded-full">
        ✓ Parliament passed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-xxs text-caption font-mono text-error">
      ✗ Parliament rejected
    </span>
  );
}
