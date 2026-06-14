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
  variant?: 'default' | 'featured' | 'feed';
}

export default function BillCard({ bill, variant = 'default' }: Props) {
  if (variant === 'feed') {
    return (
      <article className="bg-canvas rounded-lg flex flex-col shadow-level-2 hover:shadow-level-3 transition-shadow overflow-hidden border border-hairline">
        <div className="flex flex-col gap-md p-lg">
          {/* Header */}
          <div className="flex items-start justify-between gap-sm">
            <span className="text-caption-mono font-mono text-mute uppercase tracking-wider">
              {CATEGORY_LABELS[bill.category]}
            </span>
            <ParliamentBadge vote={bill.parliamentVote} />
          </div>

          {/* Question */}
          <h3 className="text-body-md font-medium text-ink leading-snug">
            {bill.question}
          </h3>

          {/* YES / NO action buttons — Polymarket style */}
          <div className="grid grid-cols-2 gap-sm">
            <a
              href={`/bills/${bill.id}?vote=yes`}
              className="flex flex-col items-center gap-xxs bg-link/10 hover:bg-link/15 border border-link/25 rounded-md py-md transition-colors"
            >
              <span className="text-caption-mono font-mono text-link uppercase tracking-wider">
                Yes
              </span>
              <span className="text-display-sm font-semibold text-link">
                {bill.yesPercent}%
              </span>
            </a>
            <a
              href={`/bills/${bill.id}?vote=no`}
              className="flex flex-col items-center gap-xxs bg-highlight-pink/10 hover:bg-highlight-pink/15 border border-highlight-pink/25 rounded-md py-md transition-colors"
            >
              <span className="text-caption-mono font-mono text-highlight-pink uppercase tracking-wider">
                No
              </span>
              <span className="text-display-sm font-semibold text-highlight-pink">
                {bill.noPercent}%
              </span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-lg py-sm border-t border-hairline">
          <span className="text-caption font-mono text-mute">
            {formatVotes(bill.totalVotes)} votes cast
          </span>
          <span className="text-caption font-mono text-mute">
            Debate {formatBillDate(bill.debateDate)}
          </span>
        </div>
      </article>
    );
  }

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
