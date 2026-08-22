import { useState } from 'react';
import type { ParliamentBill } from '../../types/parliament';
import { billStatus, isVoteOpen, billGovVote, billAiTally, billHouse, type BillVotes } from '../board/DepartureBoardSection';
import { generateAiVerdicts } from '../../lib/mockVotes';
import { generateExplainer } from '../../lib/mockExplainer';
import { formatBillDate, billSourceUrl, billPublicationsUrl } from '../../lib/utils';
import Modal from '../ui/Modal';
import VoteTallyTable from '../board/VoteTallyTable';
import AIVotePanel from '../voting/AIVotePanel';
import ReadMoreText from './ReadMoreText';
import BillStagesTab from './BillStagesTab';
import BillPassageDiagram from './BillPassageDiagram';
import InfoTip from '../ui/InfoTip';

interface Props {
  bill: ParliamentBill;
  votes?: BillVotes;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  onClose: () => void;
}

type TabKey = 'details' | 'stages' | 'publications';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'stages', label: 'Stages' },
  { key: 'publications', label: 'Publications' },
];

function Divider() {
  return <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }} />;
}

export default function BillDetailModal({ bill, votes, voted, onVote, onClose }: Props) {
  const [tab, setTab] = useState<TabKey>('details');
  const st = billStatus(bill);
  const vOpen = isVoteOpen(bill);
  const title = bill.short_title ?? bill.long_title ?? 'Untitled Bill';
  const shadowAyes = votes?.shadowAyes ?? 0;
  const shadowNoes = votes?.shadowNoes ?? 0;
  const gov = billGovVote(bill);
  const aiOpinions = generateAiVerdicts(title, bill.id);
  const explainer = generateExplainer(title, bill.id);

  let closedNote: string | undefined;
  if (!vOpen) {
    if (bill.is_act) closedNote = 'This bill received Royal Assent — voting has closed.';
    else if (bill.is_defeated) closedNote = 'This bill was defeated — voting has closed.';
    else closedNote = 'This bill was withdrawn before a public vote could be cast.';
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

      {/* 5 — the divide line, then tabs for everything below it */}
      <Divider />

      <div className="modal-tabs" role="tablist" aria-label="Bill sections">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`bill-tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`bill-panel-${t.key}`}
            className="modal-tab"
            data-active={tab === t.key ? 'true' : undefined}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Only the active panel is in the layout — the modal keeps a fixed
          on-screen height across tabs via `.ledger-modal-panel`'s own
          `height: 88vh`, not by forcing panels to a shared height, so a short
          tab gets blank space below it instead of an empty scrollable area
          the height of the Details tab. `inert` pulls inactive panels out of
          focus, hit-testing and the a11y tree; CSS pairs it with
          `display: none` so they don't affect layout either. */}
      <div className="modal-tab-panels">
        {/* ── Details ────────────────────────────────────────────────── */}
        <div role="tabpanel" id="bill-panel-details" aria-labelledby="bill-tab-details" inert={tab !== 'details'} className="modal-tab-panel">
          <div className="mt-lg flex flex-wrap items-center gap-x-xl gap-y-xs">
            <span className="inline-flex items-center gap-sm">
              <span className="modal-meta__label inline-flex items-center">
                Currently in
                <InfoTip
                  align="left"
                  label="Currently in"
                  tip="The House the bill currently sits in — Commons or Lords, or Both once it is passing between them."
                />
              </span>
              <span className="font-mono" style={{ color: '#FAF6ED', fontSize: '13px' }}>
                {billHouse(bill)}
              </span>
            </span>
            <span className="inline-flex items-center gap-sm">
              <span className="modal-meta__label inline-flex items-center">
                Introduced in
                <InfoTip align="left" label="Introduced in" tip="The House the bill was first introduced in." />
              </span>
              <span className="font-mono" style={{ color: '#FAF6ED', fontSize: '13px' }}>
                {bill.originating_house ?? '—'}
              </span>
            </span>
          </div>

          <Divider />
          <div>
            <span className="modal-section__heading">
              Bill passage
              <InfoTip
                align="left"
                label="Bill passage"
                tip="Every reading and stage in both Houses. Complete stages are ticked, the current one is marked in progress, a skipped one reads not applicable, and anything ahead is still to come."
              />
            </span>
            <BillPassageDiagram bill={bill} />
          </div>

          <Divider />
          <VoteTallyTable
            title={title}
            context="bill"
            forLabel="Aye"
            againstLabel="No"
            forTallyLabel="Ayes"
            againstTallyLabel="Noes"
            isOpen={vOpen}
            myVote={voted}
            onVote={onVote}
            publicVote={{ for: shadowAyes, against: shadowNoes }}
            ai={billAiTally(bill)}
            gov={gov}
            closedNote={closedNote}
            forceRevealed
          />

          <Divider />
          <div>
            <span className="modal-section__heading">
              About this bill
              <InfoTip
                align="left"
                label="About this bill"
                tip="A plain-English summary of what the bill does, who it affects and when it takes effect. It describes the measure only. The published text linked above is what governs."
              />
            </span>
            <ReadMoreText paragraphs={explainer} label={title} />
          </div>

          <Divider />
          <AIVotePanel opinions={aiOpinions} revealed />
        </div>

        {/* ── Stages ─────────────────────────────────────────────────── */}
        <div role="tabpanel" id="bill-panel-stages" aria-labelledby="bill-tab-stages" inert={tab !== 'stages'} className="modal-tab-panel mt-lg">
          <BillStagesTab bill={bill} />
        </div>

        {/* ── Publications ───────────────────────────────────────────── */}
        <div role="tabpanel" id="bill-panel-publications" aria-labelledby="bill-tab-publications" inert={tab !== 'publications'} className="modal-tab-panel mt-lg">
          <p className="text-body-sm" style={{ color: 'rgba(250,246,237,0.72)' }}>
            The bill&rsquo;s full text, explanatory notes and amendment papers as published are held on Parliament&rsquo;s own site — not restated here, so there is always one canonical copy.
          </p>
          <a className="ledger-btn mt-md" href={billPublicationsUrl(bill.id)} target="_blank" rel="noopener noreferrer">
            Full text &amp; documents
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </Modal>
  );
}
