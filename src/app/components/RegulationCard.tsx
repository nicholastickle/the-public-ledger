import type { ParliamentRegulation } from '../types/parliament';
import { regulationStatus, regulationPhase, isVoteOpen, regulationGovVote, regulationAiTally, type RegulationVotes } from './RegulationBoardSection';
import VoteTallyTable from './VoteTallyTable';
import BookmarkButton from './BookmarkButton';

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
      <div className="ledger-card__top">
        <span className="ledger-card__no font-mono tabular-nums">No. {reg.id}</span>
        {/* The specific phase, not the coarser status bucket — the same word
            the table's phase band groups this card under, so it still reads
            correctly once scrolled away from that band. */}
        <span className="stage-pill" style={{ color: status.color, borderColor: `${status.color}73`, background: `${status.color}1f` }}>
          {regulationPhase(reg)}
        </span>
      </div>

      <button type="button" className="ledger-table__title" onClick={onSelect}>
        {reg.title}
      </button>
      {/* The parent Act is what makes an otherwise opaque SI title legible. */}
      <span className="ledger-table__subtitle font-mono">{reg.enabling_act}</span>

      <div className="ledger-card__meta">
        <span className="ledger-card__meta-chip font-mono">{procedureLabel(reg)} procedure</span>
      </div>

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
          gov={regulationGovVote(reg, votes)}
        />
      </div>

      <BookmarkButton title={reg.title} />
    </article>
  );
}
