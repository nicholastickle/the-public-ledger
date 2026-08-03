import type { ParliamentBill } from '../types/parliament';
import { billStatus, isVoteOpen, billGovVote, billAiTally, billHouse, type BillVotes } from './DepartureBoardSection';
import { generateAiVerdicts } from '../lib/mockVotes';
import { generateExplainer } from '../lib/mockExplainer';
import { formatBillDate, billSourceUrl, billPublicationsUrl } from '../lib/utils';
import Modal from './Modal';
import BoardStageTimeline, { type TimelineStep } from './BoardStageTimeline';
import VoteTallyTable from './VoteTallyTable';
import AIVotePanel from './AIVotePanel';
import ReadMoreText from './ReadMoreText';
import InfoTip from './InfoTip';

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

function Divider() {
  return <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }} />;
}

export default function BillDetailModal({ bill, votes, voted, onVote, onClose }: Props) {
  const st = billStatus(bill);
  const vOpen = isVoteOpen(bill);
  const title = bill.short_title ?? bill.long_title ?? 'Untitled Bill';
  const shadowAyes = votes?.shadowAyes ?? 0;
  const shadowNoes = votes?.shadowNoes ?? 0;
  const gov = billGovVote(bill, votes);
  const aiOpinions = generateAiVerdicts(title, bill.id);
  const explainer = generateExplainer(title, bill.id);
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
      {/* 1 — the bill's number, with its status alongside it */}
      <div className="flex items-center gap-sm mb-xs">
        <span className="font-mono uppercase" style={{ color: 'rgba(184,150,12,0.75)', fontSize: '11px', letterSpacing: '0.16em' }}>
          Bill No. {bill.id}
        </span>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
        <span className="font-mono uppercase" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.08em' }}>
          {st.label}
        </span>
      </div>

      {/* 2 — the name */}
      <h2 id="bill-modal-title" className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.15 }}>
        {title}
      </h2>

      {/* 3 — when Parliament last touched it */}
      {bill.parliament_last_update && (
        <p className="font-mono mt-xs" style={{ color: 'rgba(184,150,12,0.6)', fontSize: '11px' }}>
          Last updated {formatBillDate(bill.parliament_last_update)}
        </p>
      )}

      {/* 4 — straight through to Parliament's own record */}
      <div className="flex flex-wrap items-center gap-sm mt-md">
        <a className="ledger-btn" href={billSourceUrl(bill.id)} target="_blank" rel="noopener noreferrer">
          Bill details on parliament.uk
          <span aria-hidden="true">↗</span>
        </a>
        <a className="ledger-btn" href={billPublicationsUrl(bill.id)} target="_blank" rel="noopener noreferrer">
          Full text &amp; documents
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* 5 — which House it sits in */}
      <Divider />
      <div className="flex items-center gap-sm">
        <span className="modal-meta__label inline-flex items-center">
          House
          <InfoTip
            align="left"
            label="House"
            tip="The House the bill currently sits in — Commons or Lords, or Both once it is passing between them."
          />
        </span>
        <span className="font-mono" style={{ color: '#FAF6ED', fontSize: '13px' }}>
          {billHouse(bill)}
        </span>
      </div>

      {/* 6 — where it has got to */}
      <div className="mt-lg">
        <span className="modal-section__heading">
          Stage
          <InfoTip
            align="left"
            label="Stage"
            tip="Every stage a bill passes through, in order. A filled node is a stage already completed, the highlighted node is where the bill stands now, and hollow nodes are still ahead of it."
          />
        </span>
        <BoardStageTimeline steps={buildBillTimeline(bill)} />
      </div>

      {/* 7 — the vote */}
      <Divider />
      <VoteTallyTable
        title={title}
        context="bill"
        forLabel="Aye"
        againstLabel="No"
        isOpen={vOpen}
        myVote={voted}
        onVote={onVote}
        publicVote={{ for: shadowAyes, against: shadowNoes }}
        ai={billAiTally(bill)}
        gov={gov}
        closedNote={closedNote}
      />

      {/* 8 — what the bill actually does */}
      <Divider />
      <div>
        <span className="modal-section__heading">
          About this bill
          <InfoTip
            align="left"
            label="About this bill"
            tip="A plain-English summary of what the bill does, who it affects and when it takes effect. It describes the measure only — never who brought it forward. The published text linked above is what governs."
          />
        </span>
        <ReadMoreText paragraphs={explainer} label={title} />
      </div>

      {/* 9 — the AI panel */}
      <Divider />
      <AIVotePanel opinions={aiOpinions} revealed={revealed} />
    </Modal>
  );
}
