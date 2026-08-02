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
}

/** The citizen's own position: the vote buttons while the window is open, their
 *  recorded choice once cast, and "Did not vote" once it has shut. Clicks are
 *  kept off the surrounding row so voting never also opens the detail modal. */
export default function OwnVoteCell({ title, isOpen, myVote, onVote, forLabel, againstLabel }: Props) {
  if (myVote) {
    return (
      <span className={`own-vote own-vote--${myVote}`}>
        <ThumbIcon down={myVote === 'against'} />
        {myVote === 'for' ? forLabel : againstLabel}
      </span>
    );
  }
  if (!isOpen) return <span className="own-vote own-vote--none">Did not vote</span>;

  const cast = (choice: 'for' | 'against') => (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(choice);
  };

  return (
    <span className="own-vote-buttons">
      <button type="button" className="own-vote-btn own-vote-btn--for" aria-label={`Vote ${forLabel} on ${title}`} onClick={cast('for')}>
        <ThumbIcon />
      </button>
      <button type="button" className="own-vote-btn own-vote-btn--against" aria-label={`Vote ${againstLabel} on ${title}`} onClick={cast('against')}>
        <ThumbIcon down />
      </button>
    </span>
  );
}
