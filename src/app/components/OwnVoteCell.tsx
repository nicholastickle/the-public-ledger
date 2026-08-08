import { ThumbIcon } from './ThumbTally';

interface Props {
  /** Names the item being voted on, for the buttons' accessible labels. */
  title: string;
  isOpen: boolean;
  myVote?: 'for' | 'against';
  onVote: (choice: 'for' | 'against') => void;
  /** "Aye"/"No" on the Bill Board, "Approve"/"Annul" on the Regulation Board. */
  forLabel: string;
  againstLabel: string;
  /** 'sm' (default) is the icon-only table cell. 'lg' is the board card's
   *  primary action — full-width buttons with their label alongside the
   *  thumb, since a card has no column header to carry the words instead. */
  size?: 'sm' | 'lg';
}

/** The citizen's own position: the vote buttons while the window is open, their
 *  recorded choice once cast, and "Did not vote" once it has shut. Clicks are
 *  kept off the surrounding row so voting never also opens the detail modal. */
export default function OwnVoteCell({ title, isOpen, myVote, onVote, forLabel, againstLabel, size = 'sm' }: Props) {
  if (myVote) {
    if (size === 'sm') {
      return (
        <span className={`own-vote own-vote--${myVote} own-vote--${size}`}>
          <ThumbIcon down={myVote === 'against'} />
          {myVote === 'for' ? forLabel : againstLabel}
        </span>
      );
    }
    // The card keeps the choice as a button rather than collapsing to a row
    // of text — dropping only the option not taken, and muting the one that
    // was, so the CTA still reads as "a button, now settled" rather than a
    // label that could be confused for a static status line.
    const label = myVote === 'for' ? forLabel : againstLabel;
    return (
      <span className={`own-vote-buttons own-vote-buttons--${size}`}>
        <button
          type="button"
          className={`own-vote-btn own-vote-btn--${myVote} own-vote-btn--${size} own-vote-btn--muted`}
          disabled
          aria-label={`You voted ${label} on ${title}`}
        >
          <ThumbIcon down={myVote === 'against'} />
          <span className="own-vote-btn__label">{label}</span>
        </button>
      </span>
    );
  }
  if (!isOpen) {
    if (size === 'sm') return <span className={`own-vote own-vote--none own-vote--${size}`}>Did not vote</span>;
    return (
      <span className={`own-vote-buttons own-vote-buttons--${size}`}>
        <button
          type="button"
          className={`own-vote-btn own-vote-btn--none own-vote-btn--${size}`}
          disabled
          aria-label={`Did not vote on ${title}`}
        >
          <span className="own-vote-btn__label">Did not vote</span>
        </button>
      </span>
    );
  }

  const cast = (choice: 'for' | 'against') => (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(choice);
  };

  // The small table buttons carry no text, so each says on hover which way
  // it votes — the wording follows the surface (Aye/No on a bill, Approve/
  // Annul on an instrument) rather than a generic yes/no. The card's large
  // buttons already print that same label on the button itself, so they skip
  // the tooltip: on a touchscreen a long-press on the button reads as a
  // hover, popping up a tooltip that just repeats what's already printed.
  const tipClass = size === 'sm' ? ' vote-tip' : '';

  return (
    <span className={`own-vote-buttons own-vote-buttons--${size}`}>
      <button
        type="button"
        className={`own-vote-btn own-vote-btn--for own-vote-btn--${size}${tipClass}`}
        data-tooltip={size === 'sm' ? `Vote ${forLabel}` : undefined}
        aria-label={`Vote ${forLabel} on ${title}`}
        onClick={cast('for')}
      >
        <ThumbIcon />
        {size === 'lg' && <span className="own-vote-btn__label">{forLabel}</span>}
      </button>
      <button
        type="button"
        className={`own-vote-btn own-vote-btn--against own-vote-btn--${size}${tipClass}`}
        data-tooltip={size === 'sm' ? `Vote ${againstLabel}` : undefined}
        aria-label={`Vote ${againstLabel} on ${title}`}
        onClick={cast('against')}
      >
        <ThumbIcon down />
        {size === 'lg' && <span className="own-vote-btn__label">{againstLabel}</span>}
      </button>
    </span>
  );
}
