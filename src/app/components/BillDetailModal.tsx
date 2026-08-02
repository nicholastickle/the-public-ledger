import type { ParliamentBill } from '../types/parliament';
import { billStatus, isVoteOpen, billGovVote, billAiTally, type BillVotes } from './DepartureBoardSection';
import { generateAiVerdicts } from '../lib/mockVotes';
import { formatBillDate } from '../lib/utils';
import Modal from './Modal';
import BoardStageTimeline, { type TimelineStep } from './BoardStageTimeline';
import VotingPanel from './VotingPanel';
import AIVotePanel from './AIVotePanel';

interface Props {
  bill: ParliamentBill;
  votes?: BillVotes;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  onClose: () => void;
}

const BILL_STAGE_ORDER = [
  { key: 'first reading', label: 'First Reading' },
  { key: 'second reading', label: 'Second Reading' },
  { key: 'committee stage', label: 'Committee Stage' },
  { key: 'report stage', label: 'Report Stage' },
  { key: 'third reading', label: 'Third Reading' },
  { key: 'consideration of amendments', label: 'Consideration of Amendments' },
  { key: 'ping-pong', label: 'Ping-Pong' },
  { key: 'royal assent', label: 'Royal Assent' },
];

function rawStageIndex(stageName: string | null): number {
  const s = (stageName ?? '').toLowerCase();
  const idx = BILL_STAGE_ORDER.findIndex(({ key }) => s.includes(key));
  return idx === -1 ? 1 : idx;
}

function buildBillTimeline(bill: ParliamentBill): TimelineStep[] {
  if (bill.is_act) {
    return BILL_STAGE_ORDER.map(s => ({ label: s.label, state: 'done' }));
  }
  const idx = rawStageIndex(bill.current_stage_name);
  if (bill.is_defeated || bill.bill_withdrawn) {
    const steps: TimelineStep[] = BILL_STAGE_ORDER.slice(0, idx + 1).map((s, i) => ({
      label: s.label,
      state: i < idx ? 'done' : 'stopped',
    }));
    steps.push({ label: bill.is_defeated ? 'Defeated' : 'Withdrawn', state: 'stopped' });
    return steps;
  }
  return BILL_STAGE_ORDER.map((s, i) => ({
    label: s.label,
    state: i < idx ? 'done' : i === idx ? 'current' : 'upcoming',
  }));
}

export default function BillDetailModal({ bill, votes, voted, onVote, onClose }: Props) {
  const st = billStatus(bill);
  const vOpen = isVoteOpen(bill);
  const shadowAyes = votes?.shadowAyes ?? 0;
  const shadowNoes = votes?.shadowNoes ?? 0;
  const gov = billGovVote(bill, votes);
  const aiOpinions = generateAiVerdicts(bill.short_title ?? bill.long_title ?? 'this bill', bill.id);
  const revealed = !vOpen || voted !== null;

  let closedNote: string | undefined;
  if (!vOpen) {
    if (bill.is_act) closedNote = 'This bill received Royal Assent — voting has closed.';
    else if (bill.is_defeated) closedNote = 'This bill was defeated — voting has closed.';
    else if (bill.bill_withdrawn) closedNote = 'This bill was withdrawn before a public vote could be cast.';
    else closedNote = 'The Second Reading voting window has closed for this bill.';
  }

  return (
    <Modal onClose={onClose} labelledBy="bill-modal-title">
      <div className="flex items-center gap-sm mb-xs">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
        {bill.current_house && (
          <span className="font-mono uppercase" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.12em', opacity: 0.7 }}>
            {bill.current_house}
          </span>
        )}
        <span className="font-mono uppercase" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.08em' }}>
          {bill.is_defeated || bill.bill_withdrawn || bill.is_act ? st.label : bill.current_stage_name}
        </span>
      </div>

      <h2 id="bill-modal-title" className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.15 }}>
        {bill.short_title ?? bill.long_title ?? 'Untitled Bill'}
      </h2>

      {bill.parliament_last_update && (
        <p className="font-mono mt-xs" style={{ color: 'rgba(184,150,12,0.6)', fontSize: '11px' }}>
          Last updated {formatBillDate(bill.parliament_last_update)}
        </p>
      )}

      <div className="mt-lg">
        <span className="font-mono uppercase block mb-sm" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.16em' }}>
          Progress
        </span>
        <BoardStageTimeline steps={buildBillTimeline(bill)} />
      </div>

      <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }}>
        <VotingPanel
          forLabel="Aye"
          againstLabel="No"
          isOpen={vOpen}
          voted={voted}
          onVote={onVote}
          publicVote={{ for: shadowAyes, against: shadowNoes }}
          ai={billAiTally(bill)}
          gov={gov}
          closedNote={closedNote}
        />
      </div>

      <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }}>
        <AIVotePanel opinions={aiOpinions} revealed={revealed} />
      </div>
    </Modal>
  );
}
