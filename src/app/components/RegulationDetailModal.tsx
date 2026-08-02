import type { ParliamentRegulation } from '../types/parliament';
import { regulationStatus, isVoteOpen, regulationGovVote, regulationAiTally, type RegulationVotes } from './RegulationBoardSection';
import { generateAiVerdicts } from '../lib/mockVotes';
import { formatBillDate } from '../lib/utils';
import Modal from './Modal';
import BoardStageTimeline, { type TimelineStep } from './BoardStageTimeline';
import VotingPanel from './VotingPanel';
import AIVotePanel from './AIVotePanel';

interface Props {
  regulation: ParliamentRegulation;
  votes?: RegulationVotes;
  voted: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  onClose: () => void;
}

function buildRegulationTimeline(reg: ParliamentRegulation): TimelineStep[] {
  if (reg.status === 'annulled') {
    return [
      { label: 'Laid', state: 'done' },
      { label: reg.procedure === 'affirmative' ? 'Pending Approval' : 'Annul Window Open', state: 'done' },
      { label: 'Annulled', state: 'stopped' },
    ];
  }
  if (reg.status === 'withdrawn') {
    return [
      { label: 'Laid', state: 'done' },
      { label: 'Withdrawn', state: 'stopped' },
    ];
  }

  const isAffirmative = reg.procedure === 'affirmative';
  const labels = ['Laid', isAffirmative ? 'Pending Approval' : 'Annul Window Open', isAffirmative ? 'Approved' : 'Objection Window Closed', 'Made'];
  const currentIdx = { pending: 1, approved: 2, made: 3 }[reg.status];
  return labels.map((label, i) => ({
    label,
    state: i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'upcoming',
  }));
}

export default function RegulationDetailModal({ regulation, votes, voted, onVote, onClose }: Props) {
  const st = regulationStatus(regulation);
  const vOpen = isVoteOpen(regulation);
  const shadowApprove = votes?.shadowApprove ?? 0;
  const shadowAnnul = votes?.shadowAnnul ?? 0;
  const gov = regulationGovVote(regulation, votes);
  const aiOpinions = generateAiVerdicts(regulation.title, regulation.id);
  const revealed = !vOpen || voted !== null;

  let closedNote: string | undefined;
  if (!vOpen) {
    if (regulation.status === 'made' || regulation.status === 'approved') closedNote = 'This instrument has been approved — voting has closed.';
    else if (regulation.status === 'annulled') closedNote = 'This instrument was annulled — voting has closed.';
    else if (regulation.status === 'withdrawn') closedNote = 'This instrument was withdrawn before a public vote could be cast.';
  }

  return (
    <Modal onClose={onClose} labelledBy="regulation-modal-title" theme="bronze">
      <div className="flex items-center gap-sm mb-xs flex-wrap">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
        {regulation.house && (
          <span className="font-mono uppercase" style={{ color: '#A8722F', fontSize: '11px', letterSpacing: '0.12em', opacity: 0.7 }}>
            {regulation.house}
          </span>
        )}
        <span
          className="font-mono uppercase"
          style={{
            color: regulation.procedure === 'affirmative' ? '#A78BFA' : '#C9944F',
            fontSize: '10px',
            letterSpacing: '0.1em',
            border: `1px solid ${regulation.procedure === 'affirmative' ? 'rgba(167,139,250,0.35)' : 'rgba(201,148,79,0.35)'}`,
            padding: '1px 6px',
            borderRadius: '2px',
          }}
        >
          {regulation.procedure === 'affirmative' ? 'Affirmative' : 'Negative'}
        </span>
      </div>

      <h2 id="regulation-modal-title" className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', lineHeight: 1.2 }}>
        {regulation.title}
      </h2>

      <p className="font-mono mt-xs" style={{ color: 'rgba(168,114,47,0.6)', fontSize: '11px' }}>
        {regulation.enabling_act ?? 'Enabling Act not recorded'}
        {regulation.last_update ? ` · updated ${formatBillDate(regulation.last_update)}` : ''}
      </p>

      <div className="mt-lg">
        <span className="font-mono uppercase block mb-sm" style={{ color: '#A8722F', fontSize: '11px', letterSpacing: '0.16em' }}>
          Progress
        </span>
        <BoardStageTimeline steps={buildRegulationTimeline(regulation)} />
      </div>

      <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(168,114,47,0.15)' }}>
        <VotingPanel
          forLabel="Approve"
          againstLabel="Annul"
          isOpen={vOpen}
          voted={voted}
          onVote={onVote}
          publicVote={{ for: shadowApprove, against: shadowAnnul }}
          ai={regulationAiTally(regulation)}
          gov={gov}
          closedNote={closedNote}
        />
      </div>

      <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgba(168,114,47,0.15)' }}>
        <AIVotePanel opinions={aiOpinions} revealed={revealed} />
      </div>
    </Modal>
  );
}
