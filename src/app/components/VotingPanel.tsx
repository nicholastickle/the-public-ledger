import VoteTallies, { type Tally } from './VoteTallies';
import type { GovVote } from '../lib/mockVotes';

interface Props {
  forLabel: string;
  againstLabel: string;
  isOpen: boolean;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  publicVote: Tally;
  ai: Tally;
  gov: GovVote;
  closedNote?: string;
}

export default function VotingPanel({
  forLabel,
  againstLabel,
  isOpen,
  voted,
  onVote,
  publicVote,
  ai,
  gov,
  closedNote,
}: Props) {
  // While a vote is open and the citizen has not yet cast their own, no tally of
  // any kind is shown — seeing how others are voting first would anchor their
  // decision. Once they vote (or once the window has closed and the result is
  // public record anyway), the tallies open up.
  const revealed = !isOpen || voted !== null;

  const publicDisplay: Tally = {
    for: voted === 'for' ? publicVote.for + 1 : publicVote.for,
    against: voted === 'against' ? publicVote.against + 1 : publicVote.against,
  };

  return (
    <div>
      {isOpen && !voted && (
        <div className="flex gap-sm mb-md">
          <button type="button" className="voting-panel__btn voting-panel__btn--for" onClick={() => onVote('for')}>
            {forLabel}
          </button>
          <button type="button" className="voting-panel__btn voting-panel__btn--against" onClick={() => onVote('against')}>
            {againstLabel}
          </button>
        </div>
      )}
      {isOpen && voted && (
        <p className="font-mono uppercase mb-md" style={{ color: '#D4AF37', fontSize: '12px', letterSpacing: '0.08em' }}>
          ✓ You voted {voted === 'for' ? forLabel : againstLabel}
        </p>
      )}
      {!isOpen && closedNote && (
        <p className="font-mono uppercase mb-md" style={{ color: 'rgba(184,150,12,0.6)', fontSize: '12px', letterSpacing: '0.06em' }}>
          {closedNote}
        </p>
      )}

      <VoteTallies
        forLabel={forLabel}
        againstLabel={againstLabel}
        publicVote={publicDisplay}
        ai={ai}
        gov={gov}
        revealed={revealed}
      />
    </div>
  );
}
