import type { ParliamentRegulation } from '../../types/parliament';
import { regulationStatus, isVoteOpen, regulationGovVote, regulationAiTally, type RegulationVotes } from '../board/RegulationBoardSection';
import { generateAiVerdicts } from '../../lib/mockVotes';
import { generateExplainer } from '../../lib/mockExplainer';
import { formatBillDate, regulationYear, regulationSourceUrl, regulationMemorandumUrl } from '../../lib/utils';
import Modal from '../ui/Modal';
import BoardStageTimeline, { type TimelineStep } from '../board/BoardStageTimeline';
import VoteTallyTable from '../board/VoteTallyTable';
import AIVotePanel from '../voting/AIVotePanel';
import ReadMoreText from './ReadMoreText';
import InfoTip from '../ui/InfoTip';

interface Props {
  regulation: ParliamentRegulation;
  votes?: RegulationVotes;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  onClose: () => void;
}

/** The four stages every instrument passes through, worded for its procedure.
 *  An affirmative instrument must be approved before it can be made; a negative
 *  one survives an objection period instead. */
function regulationStages(reg: ParliamentRegulation): string[] {
  const isAffirmative = reg.procedure === 'affirmative';
  return [
    'Laid',
    isAffirmative ? 'Pending Approval' : 'Annul Window Open',
    isAffirmative ? 'Approved' : 'Objection Window Closed',
    'Made',
  ];
}

/** The stage at which an instrument that did not survive stopped. Both annulment
 *  and withdrawal happen while it is before Parliament — the second stage. */
const STOPPED_AT = 1;

/** The full run of stages, always. An annulled instrument stopped one stage into
 *  four, and truncating the timeline there loses exactly that. "Annulled" and
 *  "Withdrawn" are not stages and get no node of their own; `regulationOutcome`
 *  states them in words under the timeline instead. */
function buildRegulationTimeline(reg: ParliamentRegulation): TimelineStep[] {
  const labels = regulationStages(reg);

  if (reg.status === 'annulled' || reg.status === 'withdrawn') {
    return labels.map((label, i) => ({
      label,
      state: i < STOPPED_AT ? 'done' : i === STOPPED_AT ? 'stopped' : 'unreached',
    }));
  }

  const currentIdx = { pending: 1, approved: 2, made: 3 }[reg.status];
  return labels.map((label, i) => ({
    label,
    state: i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'upcoming',
  }));
}

/** What ended the instrument's passage and where, for the banner under the
 *  timeline. Null while it is still live or has been made. */
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
  const st = regulationStatus(regulation);
  const vOpen = isVoteOpen(regulation);
  const shadowApprove = votes?.shadowApprove ?? 0;
  const shadowAnnul = votes?.shadowAnnul ?? 0;
  const gov = regulationGovVote(regulation, votes);
  const aiOpinions = generateAiVerdicts(regulation.title, regulation.id);
  const explainer = generateExplainer(regulation.title, regulation.id);
  const outcome = regulationOutcome(regulation);
  const revealed = !vOpen || voted !== null;

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
          SI No. {regulation.id}
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

      {/* 4 — straight through to the instrument as published */}
      <div className="flex flex-wrap items-center gap-sm mt-md">
        <a className="ledger-btn" href={regulationSourceUrl(year, regulation.id)} target="_blank" rel="noopener noreferrer">
          Instrument on legislation.gov.uk
          <span aria-hidden="true">↗</span>
        </a>
        <a className="ledger-btn" href={regulationMemorandumUrl(year, regulation.id)} target="_blank" rel="noopener noreferrer">
          Explanatory memorandum
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* 5 — the procedure, which House it sits before, and the enabling Act.
          Stacked rather than laid out inline so the three read as one list of
          facts about the instrument, in descending order of how much they
          change a citizen's reading of it. */}
      <Divider />
      <dl className="modal-meta">
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

      {/* 6 — where it has got to */}
      <div className="mt-lg">
        <span className="modal-section__heading">
          Stage
          <InfoTip
            align="left"
            label="Stage"
            tip="Every stage the instrument passes through, in order. A filled node is a stage already completed, the highlighted node is where it stands now, and hollow nodes are still ahead of it."
          />
        </span>
        <BoardStageTimeline steps={buildRegulationTimeline(regulation)} />
        {outcome && (
          <p className="stage-outcome">
            <span className="stage-outcome__dot" aria-hidden="true" />
            {outcome}
          </p>
        )}
      </div>

      {/* 7 — the vote */}
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
      />

      {/* 8 — what the instrument actually does */}
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

      {/* 9 — the AI panel */}
      <Divider />
      <AIVotePanel opinions={aiOpinions} revealed={revealed} />
    </Modal>
  );
}
