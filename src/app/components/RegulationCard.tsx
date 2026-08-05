import type { ParliamentRegulation } from '../types/parliament';
import { regulationStatus, regulationPhase, isVoteOpen, regulationGovVote, regulationAiTally, type RegulationVotes } from './RegulationBoardSection';
import TallyHeader from './TallyHeader';
import { TallyCell, GovTallyCell } from './TallyCell';
import OwnVoteCell from './OwnVoteCell';

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
  const revealed = !vOpen || myVote != null;
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

      <div className="ledger-card__cta">
        <OwnVoteCell title={reg.title} isOpen={vOpen} myVote={myVote} onVote={onVote} forLabel="Approve" againstLabel="Annul" size="lg" />
      </div>

      <div className="ledger-card__tallies">
        <div className="ledger-card__tally-row">
          <TallyHeader kind="public" context="regulation" />
          <TallyCell
            tally={{ for: votes?.shadowApprove ?? 0, against: votes?.shadowAnnul ?? 0 }}
            revealed={revealed}
            forLabel="Approve"
            againstLabel="Annul"
          />
        </div>
        <div className="ledger-card__tally-row--split">
          <div className="ledger-card__tally-row">
            <TallyHeader kind="ai" context="regulation" />
            <TallyCell tally={regulationAiTally(reg)} revealed={revealed} forLabel="Approve" againstLabel="Annul" />
          </div>
          <div className="ledger-card__tally-row">
            <TallyHeader kind="government" context="regulation" align="right" />
            <GovTallyCell gov={regulationGovVote(reg, votes)} revealed={revealed} forLabel="Approve" againstLabel="Annul" />
          </div>
        </div>
      </div>
    </article>
  );
}
