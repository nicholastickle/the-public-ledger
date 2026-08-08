import type { ParliamentBill } from '../types/parliament';
import { billHouse, billStatus, stageLabel, isVoteOpen, billGovVote, billAiTally, type BillVotes } from './DepartureBoardSection';
import VoteTallyTable from './VoteTallyTable';
import BookmarkButton from './BookmarkButton';

interface Props {
  bill: ParliamentBill;
  votes?: BillVotes;
  myVote?: 'for' | 'against';
  onSelect: () => void;
  onVote: (choice: 'for' | 'against') => void;
}

/** BillRow reshaped into a card for phones, where the table's own column fold
 *  leaves the header a full scroll away from anything past the first couple of
 *  rows. Tapping anywhere on the card opens the same detail modal as the row;
 *  VoteTallyTable already keeps its own clicks from bubbling into that — it is
 *  the same vote-tally table the detail modal uses, just narrower. */
export default function BillCard({ bill, votes, myVote, onSelect, onVote }: Props) {
  const vOpen = isVoteOpen(bill);
  const title = bill.short_title ?? bill.long_title ?? 'Untitled Bill';
  const status = billStatus(bill);

  return (
    <article className="ledger-card" onClick={onSelect}>
      <div className="ledger-card__top">
        <span className="ledger-card__no font-mono tabular-nums">No. {bill.id}</span>
        {/* The specific stage, not the coarser status bucket — the same word
            the table's stage band groups this card under, so it still reads
            correctly once scrolled away from that band. */}
        <span className="stage-pill" style={{ color: status.color, borderColor: `${status.color}73`, background: `${status.color}1f` }}>
          {stageLabel(bill)}
        </span>
      </div>

      <button type="button" className="ledger-table__title" onClick={onSelect}>
        {title}
      </button>

      <div className="ledger-card__meta">
        <span className="ledger-card__meta-chip font-mono">{billHouse(bill)}</span>
      </div>

      <div className="ledger-card__vote">
        <VoteTallyTable
          title={title}
          context="bill"
          forLabel="Aye"
          againstLabel="No"
          isOpen={vOpen}
          myVote={myVote ?? null}
          onVote={onVote}
          publicVote={{ for: votes?.shadowAyes ?? 0, against: votes?.shadowNoes ?? 0 }}
          ai={billAiTally(bill)}
          gov={billGovVote(bill, votes)}
        />
      </div>

      <BookmarkButton title={title} />
    </article>
  );
}
