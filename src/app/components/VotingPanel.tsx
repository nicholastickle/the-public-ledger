import VoteBar from './VoteBar';
import { formatBillDate } from '../lib/utils';
import type { GovVote } from '../lib/mockVotes';

interface Props {
  forLabel: string;
  againstLabel: string;
  isOpen: boolean;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  citizenFor: number;
  citizenAgainst: number;
  gov: GovVote;
  closedNote?: string;
}

export default function VotingPanel({
  forLabel,
  againstLabel,
  isOpen,
  voted,
  onVote,
  citizenFor,
  citizenAgainst,
  gov,
  closedNote,
}: Props) {
  // While a vote is open and the citizen has not yet cast theirs, no tally of
  // any kind is shown — seeing how others are voting first would anchor their
  // decision. Once they vote (or once the window has closed and the result is
  // public record anyway), the tallies open up.
  const revealed = !isOpen || voted !== null;

  const displayCitizenFor = voted === 'for' ? citizenFor + 1 : citizenFor;
  const displayCitizenAgainst = voted === 'against' ? citizenAgainst + 1 : citizenAgainst;

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

      <div className="flex flex-col gap-md">
        {revealed ? (
          <div>
            <span className="font-mono uppercase block mb-xs" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.14em' }}>
              Citizens
            </span>
            <VoteBar forCount={displayCitizenFor} againstCount={displayCitizenAgainst} forLabel={forLabel} againstLabel={againstLabel} />
          </div>
        ) : (
          <div className="voting-panel__locked">
            🔒 Cast your vote above to reveal the public tally and the AI panel&apos;s verdicts
          </div>
        )}

        <div>
          <span className="font-mono uppercase block mb-xs" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.14em' }}>
            Parliament
          </span>
          {gov.status === 'voted' && revealed ? (
            <VoteBar forCount={gov.for ?? 0} againstCount={gov.against ?? 0} forLabel={forLabel} againstLabel={againstLabel} />
          ) : gov.status === 'none' ? (
            <p className="font-mono" style={{ color: 'rgba(184,150,12,0.5)', fontSize: '11px' }}>
              No parliamentary vote recorded
            </p>
          ) : (
            <p className="voting-panel__pending font-mono" suppressHydrationWarning>
              ◷ Government vote pending
              {gov.scheduledDate
                ? ` · expected ${formatBillDate(gov.scheduledDate)}`
                : ' · date to be announced'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
