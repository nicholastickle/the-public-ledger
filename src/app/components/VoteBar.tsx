import { formatVotes } from '../lib/utils';

interface Props {
  forCount: number;
  againstCount: number;
  forLabel: string;
  againstLabel: string;
}

/** Aggregate, anonymised shadow-vote split — never used for parliamentary division data. */
export default function VoteBar({ forCount, againstCount, forLabel, againstLabel }: Props) {
  const total = forCount + againstCount;
  const forPct = total > 0 ? Math.round((forCount / total) * 100) : 50;
  const forWins = forCount >= againstCount;

  return (
    <div className="flex flex-col gap-xxs w-full">
      <div className="kanban-vote-bar" role="presentation">
        <div style={{ width: `${forPct}%`, background: '#10B981' }} />
        <div style={{ width: `${100 - forPct}%`, background: '#EF4444' }} />
      </div>
      <div className="flex items-center justify-between gap-xs">
        <span className="font-mono tabular-nums truncate" style={{ color: '#10B981', fontSize: '11px', letterSpacing: '0.02em' }}>
          {forWins ? '✓ ' : ''}{forLabel} {formatVotes(forCount)}
        </span>
        <span className="font-mono tabular-nums truncate" style={{ color: '#EF4444', fontSize: '11px', letterSpacing: '0.02em' }}>
          {!forWins ? '✓ ' : ''}{againstLabel} {formatVotes(againstCount)}
        </span>
      </div>
    </div>
  );
}
