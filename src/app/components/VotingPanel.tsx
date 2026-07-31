import VoteBar from './VoteBar';

interface Props {
  forLabel: string;
  againstLabel: string;
  isOpen: boolean;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  citizenFor: number;
  citizenAgainst: number;
  govFor: number;
  govAgainst: number;
  closedNote?: string;
  /** True once the government tally is allowed to show — either the citizen has
   *  voted this session, or the window closed (so it's already public record for
   *  everyone, same as the citizen tally already is). */
  revealed: boolean;
}

export default function VotingPanel({
  forLabel,
  againstLabel,
  isOpen,
  voted,
  onVote,
  citizenFor,
  citizenAgainst,
  govFor,
  govAgainst,
  closedNote,
  revealed,
}: Props) {
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
        <div>
          <span className="font-mono uppercase block mb-xs" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.14em' }}>
            Citizens (public, live)
          </span>
          <VoteBar forCount={displayCitizenFor} againstCount={displayCitizenAgainst} forLabel={forLabel} againstLabel={againstLabel} />
        </div>

        {revealed ? (
          <div>
            <span className="font-mono uppercase block mb-xs" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.14em' }}>
              Parliament
            </span>
            <VoteBar forCount={govFor} againstCount={govAgainst} forLabel={forLabel} againstLabel={againstLabel} />
          </div>
        ) : (
          <div className="voting-panel__locked">
            🔒 Cast your vote above to reveal how Parliament voted
          </div>
        )}
      </div>
    </div>
  );
}
