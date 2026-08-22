import { useState } from 'react';
import type { ParliamentRegulation } from '../../types/parliament';
import { regulationStatus, isVoteOpen, regulationGovVote, regulationAiTally, type RegulationVotes } from '../board/RegulationBoardSection';
import { generateAiVerdicts } from '../../lib/mockVotes';
import { generateExplainer } from '../../lib/mockExplainer';
import { formatBillDate, regulationYear, regulationSourceUrl, regulationMemorandumUrl } from '../../lib/utils';
import Modal from '../ui/Modal';
import VoteTallyTable from '../board/VoteTallyTable';
import AIVotePanel from '../voting/AIVotePanel';
import ReadMoreText from './ReadMoreText';
import RegulationPassageDiagram from './RegulationPassageDiagram';
import RegulationStagesTab from './RegulationStagesTab';
import InfoTip from '../ui/InfoTip';

interface Props {
  regulation: ParliamentRegulation;
  votes?: RegulationVotes;
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

/** What ended the instrument's passage and where, for the banner under the
 *  passage diagram. Null while it is still live or has been made. */
function regulationOutcome(reg: ParliamentRegulation): string | null {
  if (reg.status !== 'annulled' && reg.status !== 'withdrawn') return null;
  const phase = reg.procedure === 'affirmative' ? 'at the approval stage' : 'during the objection period';
  return `${reg.status === 'annulled' ? 'Annulled' : 'Withdrawn'} ${phase}`;
}

/** What the two procedures actually mean for a citizen deciding how to vote —
 *  the difference determines whether the instrument needs Parliament's approval
 *  or merely its silence, which is the single most consequential fact about it. */
const PROCEDURE_TIP: Record<'affirmative' | 'negative', string> = {
  affirmative:
    'An affirmative instrument cannot be made until both Houses have actively approved it. Parliament must vote for it; doing nothing stops it.',
  negative:
    'A negative instrument becomes law automatically unless either House votes to annul it within the objection period. Parliament must vote against it; doing nothing lets it through.',
};

function Divider() {
  return <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(168,114,47,0.15)' }} />;
}

export default function RegulationDetailModal({ regulation, votes, voted, onVote, onClose }: Props) {
  const [tab, setTab] = useState<TabKey>('details');
  const st = regulationStatus(regulation);
  const vOpen = isVoteOpen(regulation);
  const shadowApprove = votes?.shadowApprove ?? 0;
  const shadowAnnul = votes?.shadowAnnul ?? 0;
  const gov = regulationGovVote(regulation);
  const aiOpinions = generateAiVerdicts(regulation.title, regulation.id);
  const explainer = generateExplainer(regulation.title, regulation.id);
  const outcome = regulationOutcome(regulation);

  const isAffirmative = regulation.procedure === 'affirmative';
  const procedureLabel = isAffirmative ? 'Affirmative' : 'Negative';
  const year = regulationYear(regulation);

  let closedNote: string | undefined;
  if (!vOpen) {
    if (regulation.status === 'made' || regulation.status === 'approved') closedNote = 'This instrument has been approved — voting has closed.';
    else if (regulation.status === 'annulled') closedNote = 'This instrument was annulled — voting has closed.';
    else if (regulation.status === 'withdrawn') closedNote = 'This instrument was withdrawn before a public vote could be cast.';
  }

  return (
    <Modal onClose={onClose} labelledBy="regulation-modal-title" theme="bronze">
      {/* 1 — the instrument's number, with its status alongside it */}
      <div className="flex items-center gap-sm mb-xs flex-wrap">
        <span className="font-mono uppercase" style={{ color: 'rgba(168,114,47,0.75)', fontSize: '11px', letterSpacing: '0.16em' }}>
          SI No. {regulation.paper_number ?? regulation.id}
        </span>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
        <span className="font-mono uppercase" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.08em' }}>
          {st.label}
        </span>
      </div>

      {/* 2 — the name */}
      <h2 id="regulation-modal-title" className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', lineHeight: 1.2 }}>
        {regulation.title}
      </h2>

      {/* 3 — when Parliament last touched it */}
      {regulation.last_update && (
        <p className="font-mono mt-xs" style={{ color: 'rgba(168,114,47,0.6)', fontSize: '11px' }}>
          Last updated {formatBillDate(regulation.last_update)}
        </p>
      )}

      {/* 4 — straight through to the instrument as published. Real data carries
          its own canonical legislation.gov.uk link from Parliament; demo data
          never had one, so it falls back to the same guessed year/number URL
          this used before. */}
      <div className="flex flex-wrap items-center gap-sm mt-md">
        {regulation.detail_url ? (
          <a className="ledger-btn" href={regulation.detail_url} target="_blank" rel="noopener noreferrer">
            Instrument on legislation.gov.uk
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <>
            <a className="ledger-btn" href={regulationSourceUrl(year, Number(regulation.id) || 0)} target="_blank" rel="noopener noreferrer">
              Instrument on legislation.gov.uk
              <span aria-hidden="true">↗</span>
            </a>
            <a className="ledger-btn" href={regulationMemorandumUrl(year, Number(regulation.id) || 0)} target="_blank" rel="noopener noreferrer">
              Explanatory memorandum
              <span aria-hidden="true">↗</span>
            </a>
          </>
        )}
      </div>

      {/* 5 — the divide line, then tabs for everything below it */}
      <Divider />

      <div className="modal-tabs" role="tablist" aria-label="Regulation sections">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`regulation-tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`regulation-panel-${t.key}`}
            className="modal-tab"
            data-active={tab === t.key ? 'true' : undefined}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* See BillDetailModal for why only the active panel is in the layout. */}
      <div className="modal-tab-panels">
        {/* ── Details ────────────────────────────────────────────────── */}
        <div role="tabpanel" id="regulation-panel-details" aria-labelledby="regulation-tab-details" inert={tab !== 'details'} className="modal-tab-panel">
          <dl className="modal-meta mt-lg">
            <div className="modal-meta__row">
              <dt className="modal-meta__label inline-flex items-center">
                Procedure
                <InfoTip align="left" label="Procedure" tip={PROCEDURE_TIP[isAffirmative ? 'affirmative' : 'negative']} />
              </dt>
              <dd className="modal-meta__value font-mono">{procedureLabel}</dd>
            </div>

            <div className="modal-meta__row">
              <dt className="modal-meta__label inline-flex items-center">
                House
                <InfoTip
                  align="left"
                  label="House"
                  tip="Which House the instrument is before. Most are laid before both, and both must be satisfied before it can be made or after it has been."
                />
              </dt>
              <dd className="modal-meta__value font-mono">{regulation.house ?? '—'}</dd>
            </div>

            {/* The parent Act is what makes an otherwise opaque SI title legible —
                an instrument can only do what the Act it is made under allows. */}
            <div className="modal-meta__row">
              <dt className="modal-meta__label inline-flex items-center">
                Made under
                <InfoTip
                  align="left"
                  label="Made under"
                  tip="The Act of Parliament that granted the power this instrument is made with. An instrument cannot go beyond what its enabling Act permits, so the Act sets the limits of what it can do."
                />
              </dt>
              <dd className="modal-meta__value font-mono">{regulation.enabling_act ?? 'Not recorded'}</dd>
            </div>
          </dl>

          <Divider />
          <div>
            <span className="modal-section__heading">
              Instrument passage
              <InfoTip
                align="left"
                label="Instrument passage"
                tip="Every step the instrument has reached in each House it's laid before. Complete steps are ticked, the current one is marked in progress, and — for a negative instrument, most of the time — the prayer step reads not applicable, because nobody tabled one."
              />
            </span>
            <RegulationPassageDiagram regulation={regulation} />
            {outcome && (
              <p className="stage-outcome">
                <span className="stage-outcome__dot" aria-hidden="true" />
                {outcome}
              </p>
            )}
          </div>

          <Divider />
          <VoteTallyTable
            title={regulation.title}
            context="regulation"
            forLabel="Approve"
            againstLabel="Annul"
            isOpen={vOpen}
            myVote={voted}
            onVote={onVote}
            publicVote={{ for: shadowApprove, against: shadowAnnul }}
            ai={regulationAiTally(regulation)}
            gov={gov}
            closedNote={closedNote}
            forceRevealed
          />

          <Divider />
          <div>
            <span className="modal-section__heading">
              About this instrument
              <InfoTip
                align="left"
                label="About this instrument"
                tip="A plain-English summary of what the instrument does, who it affects and when it takes effect. It describes the measure only — never who brought it forward. The text published on legislation.gov.uk is what governs."
              />
            </span>
            <ReadMoreText paragraphs={explainer} label={regulation.title} />
          </div>

          <Divider />
          <AIVotePanel opinions={aiOpinions} revealed />
        </div>

        {/* ── Stages ─────────────────────────────────────────────────── */}
        <div role="tabpanel" id="regulation-panel-stages" aria-labelledby="regulation-tab-stages" inert={tab !== 'stages'} className="modal-tab-panel mt-lg">
          <RegulationStagesTab regulation={regulation} />
        </div>

        {/* ── Publications ───────────────────────────────────────────── */}
        <div role="tabpanel" id="regulation-panel-publications" aria-labelledby="regulation-tab-publications" inert={tab !== 'publications'} className="modal-tab-panel mt-lg">
          <p className="text-body-sm" style={{ color: 'rgba(250,246,237,0.72)' }}>
            The instrument&rsquo;s full text and explanatory memorandum as published are held on legislation.gov.uk — not restated here, so there is always one canonical copy.
          </p>
          {regulation.detail_url ? (
            <a className="ledger-btn mt-md" href={regulation.detail_url} target="_blank" rel="noopener noreferrer">
              Instrument on legislation.gov.uk
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <a className="ledger-btn mt-md" href={regulationMemorandumUrl(year, Number(regulation.id) || 0)} target="_blank" rel="noopener noreferrer">
              Explanatory memorandum
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
