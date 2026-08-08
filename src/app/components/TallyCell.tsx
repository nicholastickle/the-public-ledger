import ThumbTally from './ThumbTally';
import { formatDateNumeric } from '../lib/utils';
import type { GovVote } from '../lib/mockVotes';
import type { Tally } from '../types/votes';

interface CellProps {
  forLabel: string;
  againstLabel: string;
  /** False while a vote is open and the citizen has not yet cast theirs — no
   *  tally is shown so nobody's decision is anchored by the running result. */
  revealed: boolean;
}

/** Placeholder shown in place of a tally the citizen has not yet earned sight of. */
export function LockedTally() {
  return (
    <span className="tally-cell__locked" title="Hidden until you vote">
      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
        <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
      </svg>
      <span className="sr-only">Hidden until you vote</span>
    </span>
  );
}

export function TallyCell({ tally, revealed, forLabel, againstLabel }: CellProps & { tally: Tally }) {
  if (!revealed) return <LockedTally />;
  return (
    <ThumbTally
      forCount={tally.for}
      againstCount={tally.against}
      forLabel={forLabel}
      againstLabel={againstLabel}
    />
  );
}

/** Parliament's own division. Until it has happened, the sitting date is shown
 *  (or TBD) — a scheduled date is not division data, so it may be shown freely. */
export function GovTallyCell({ gov, revealed, forLabel, againstLabel }: CellProps & { gov: GovVote }) {
  if (gov.status === 'none') {
    return <span className="tally-cell__none" title="No parliamentary vote recorded">—</span>;
  }
  if (gov.status === 'pending') {
    return (
      <span className="tally-cell__pending font-mono tabular-nums" suppressHydrationWarning>
        {gov.scheduledDate ? formatDateNumeric(gov.scheduledDate) : 'TBD'}
      </span>
    );
  }
  if (!revealed) return <LockedTally />;
  return (
    <ThumbTally
      forCount={gov.for ?? 0}
      againstCount={gov.against ?? 0}
      forLabel={forLabel}
      againstLabel={againstLabel}
    />
  );
}
