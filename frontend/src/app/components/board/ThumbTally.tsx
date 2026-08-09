import { formatVotes } from '../../lib/utils';

const FOR_COLOR = '#10B981';
const AGAINST_COLOR = '#EF4444';

/** Single filled thumb. `down` is the same glyph rotated, so both read as one pair. */
export function ThumbIcon({ down }: { down?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="12"
      height="12"
      aria-hidden="true"
      style={{ transform: down ? 'rotate(180deg)' : undefined, flexShrink: 0 }}
    >
      <path d="M2 20h3.2V9H2v11Zm19.8-9.6c0-.9-.72-1.6-1.6-1.6h-5.05l.76-3.66a1.2 1.2 0 0 0-.32-1.1L14.5 2.9 8.55 8.86c-.29.29-.45.68-.45 1.09v8.45c0 .88.72 1.6 1.6 1.6h7.2c.66 0 1.26-.4 1.5-1.01l2.42-5.65c.07-.18.11-.37.11-.57v-2.37Z" />
    </svg>
  );
}

interface Props {
  forCount: number;
  againstCount: number;
  forLabel: string;
  againstLabel: string;
}

/** A for/against tally rendered as a green thumbs-up and a red thumbs-down with
 *  exact counts. Never abbreviated — a shadow vote is a count of real people.
 *
 *  The winning side is chipped and the losing side dimmed, so the public, AI and
 *  government columns can be compared by scanning across a row: three green
 *  chips means all three agreed, a red one in the middle means the panel broke
 *  with the other two. A dead heat chips neither side.
 *  The pair sits side by side, stacking below the tablet breakpoint via CSS. */
export default function ThumbTally({ forCount, againstCount, forLabel, againstLabel }: Props) {
  const winner = forCount > againstCount ? 'for' : againstCount > forCount ? 'against' : null;

  return (
    <span className="thumb-tally">
      <span
        className="thumb-tally__side thumb-tally__side--for"
        style={{ color: FOR_COLOR }}
        data-outcome={winner === null ? undefined : winner === 'for' ? 'won' : 'lost'}
      >
        <ThumbIcon />
        <span className="thumb-tally__count tabular-nums">{formatVotes(forCount)}</span>
        <span className="sr-only">{winner === 'for' ? `${forLabel} — carried` : forLabel}</span>
      </span>
      <span
        className="thumb-tally__side thumb-tally__side--against"
        style={{ color: AGAINST_COLOR }}
        data-outcome={winner === null ? undefined : winner === 'against' ? 'won' : 'lost'}
      >
        <ThumbIcon down />
        <span className="thumb-tally__count tabular-nums">{formatVotes(againstCount)}</span>
        <span className="sr-only">{winner === 'against' ? `${againstLabel} — carried` : againstLabel}</span>
      </span>
    </span>
  );
}
