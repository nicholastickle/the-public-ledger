import type { ParliamentRegulation } from '../../types/parliament';
import { regulationStatus, regulationPhase, isVoteOpen, regulationGovVote, regulationAiTally, type RegulationVotes } from '../board/RegulationBoardSection';
import VoteTallyTable from '../board/VoteTallyTable';
import BookmarkButton from './BookmarkButton';
import HouseBadge from '../ui/HouseBadge';
import { StageIcon, ProcedureIcon, NumberIcon } from './CardMetaIcons';

interface Props {
  reg: ParliamentRegulation;
  votes?: RegulationVotes;
  myVote?: 'for' | 'against';
  onSelect: () => void;
  onVote: (choice: 'for' | 'against') => void;
}

function procedureLabel(reg: ParliamentRegulation): string {
  return reg.procedure === 'affirmative' ? 'Affirmative' : 'Negative';
}

/** RegulationRow reshaped into a card for phones — see BillCard for the Bill
 *  Board's equivalent and the rationale for the layout. */
export default function RegulationCard({ reg, votes, myVote, onSelect, onVote }: Props) {
  const vOpen = isVoteOpen(reg);
  const status = regulationStatus(reg);

  return (
    <article className="ledger-card" onClick={onSelect}>
      <div className="flex items-center gap-xs">
        {reg.house === 'Both' ? (
          <span className="inline-flex items-center gap-xxs">
            <HouseBadge house="Commons" size={20} />
            <HouseBadge house="Lords" size={20} />
          </span>
        ) : (
          <HouseBadge house={reg.house} size={20} />
        )}
        <button type="button" className="ledger-table__title" onClick={onSelect}>
          {reg.title}
        </button>
      </div>
      {/* The parent Act is what makes an otherwise opaque SI title legible. */}
      <span className="ledger-table__subtitle font-mono">{reg.enabling_act}</span>

      <div className="ledger-card__vote">
        <VoteTallyTable
          title={reg.title}
          context="regulation"
          forLabel="Approve"
          againstLabel="Annul"
          isOpen={vOpen}
          myVote={myVote ?? null}
          onVote={onVote}
          publicVote={{ for: votes?.shadowApprove ?? 0, against: votes?.shadowAnnul ?? 0 }}
          ai={regulationAiTally(reg)}
          gov={regulationGovVote(reg)}
          forceRevealed
        />
      </div>

      <div className="ledger-card__footer">
        <div className="ledger-card__footer-items">
          {/* The specific phase, not the coarser status bucket — the same word
              the table's phase band groups this card under, so it still reads
              correctly once scrolled away from that band. */}
          <span className="ledger-card__footer-item" style={{ color: status.color }}>
            <StageIcon />
            {regulationPhase(reg)}
          </span>
          <span className="ledger-card__footer-item">
            <ProcedureIcon />
            {procedureLabel(reg)}
          </span>
          <span className="ledger-card__footer-item font-mono tabular-nums">
            <NumberIcon />
            No. {reg.paper_number ?? reg.id}
          </span>
        </div>

        <BookmarkButton title={reg.title} />
      </div>
    </article>
  );
}
