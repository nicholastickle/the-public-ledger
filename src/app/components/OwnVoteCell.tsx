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
    return (
      <span className={`own-vote own-vote--${myVote} own-vote--${size}`}>
        <ThumbIcon down={myVote === 'against'} />
        {myVote === 'for' ? forLabel : againstLabel}
      </span>
    );
  }
  if (!isOpen) return <span className={`own-vote own-vote--none own-vote--${size}`}>Did not vote</span>;

  const cast = (choice: 'for' | 'against') => (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(choice);
  };

  // The thumbs carry no text, so each says on hover which way it votes. The
  // wording follows the surface — Aye/No on a bill, Approve/Annul on an
  // instrument — rather than a generic yes/no, so the tooltip matches the words
  // used everywhere else on the same screen.
  return (
    <span className={`own-vote-buttons own-vote-buttons--${size}`}>
      <button
        type="button"
        className={`own-vote-btn own-vote-btn--for own-vote-btn--${size} vote-tip`}
        data-tooltip={`Vote ${forLabel}`}
        aria-label={`Vote ${forLabel} on ${title}`}
        onClick={cast('for')}
      >
        <ThumbIcon />
        {size === 'lg' && <span className="own-vote-btn__label">{forLabel}</span>}
      </button>
      <button
        type="button"
        className={`own-vote-btn own-vote-btn--against own-vote-btn--${size} vote-tip`}
        data-tooltip={`Vote ${againstLabel}`}
        aria-label={`Vote ${againstLabel} on ${title}`}
        onClick={cast('against')}
      >
        <ThumbIcon down />
        {size === 'lg' && <span className="own-vote-btn__label">{againstLabel}</span>}
      </button>
    </span>
  );
}
