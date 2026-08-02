import VoteBar from './VoteBar';
import { formatBillDate } from '../lib/utils';
import type { GovVote } from '../lib/mockVotes';

export interface Tally {
  for: number;
  against: number;
}

interface Props {
  forLabel: string;
  againstLabel: string;
  /** The general public's shadow vote. Named "public" throughout the UI — the
   *  word "citizen" is reserved for eligibility, not for the tally itself. */
  publicVote: Tally;
  ai: Tally;
  gov: GovVote;
  /** False while a vote is open and the citizen has not yet cast theirs —
   *  no tally is shown so nobody's decision is anchored by the running result. */
  revealed: boolean;
  compact?: boolean;
}

function Row({ label, compact, children }: { label: string; compact?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <span
        className="font-mono uppercase block"
        style={{
          color: '#B8960C',
          fontSize: compact ? '9px' : '10px',
          letterSpacing: '0.14em',
          marginBottom: compact ? '3px' : '6px',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Locked({ compact }: { compact?: boolean }) {
  return (
    <p className="font-mono" style={{ color: 'rgba(184,150,12,0.45)', fontSize: compact ? '10px' : '11px' }}>
      🔒 Hidden until you vote
    </p>
  );
}

/** The three tallies — the public, the AI panel, and Parliament — always rendered
 *  in the same order and the same bar format, on cards and in the modal alike. */
export default function VoteTallies({ forLabel, againstLabel, publicVote, ai, gov, revealed, compact }: Props) {
  return (
    <div className="flex flex-col" style={{ gap: compact ? '8px' : '16px' }}>
      <Row label="Public" compact={compact}>
        {revealed
          ? <VoteBar forCount={publicVote.for} againstCount={publicVote.against} forLabel={forLabel} againstLabel={againstLabel} />
          : <Locked compact={compact} />}
      </Row>

      <Row label="AI Panel" compact={compact}>
        {revealed
          ? <VoteBar forCount={ai.for} againstCount={ai.against} forLabel={forLabel} againstLabel={againstLabel} />
          : <Locked compact={compact} />}
      </Row>

      <Row label="Parliament" compact={compact}>
        {gov.status === 'voted' && revealed ? (
          <VoteBar forCount={gov.for ?? 0} againstCount={gov.against ?? 0} forLabel={forLabel} againstLabel={againstLabel} />
        ) : gov.status === 'none' ? (
          <p className="font-mono" style={{ color: 'rgba(184,150,12,0.5)', fontSize: compact ? '10px' : '11px' }}>
            No parliamentary vote recorded
          </p>
        ) : (
          <p className="voting-panel__pending font-mono" suppressHydrationWarning style={compact ? { fontSize: '10px', padding: '5px 8px' } : undefined}>
            ◷ Government vote pending
            {gov.scheduledDate ? ` · expected ${formatBillDate(gov.scheduledDate)}` : ' · date to be announced'}
          </p>
        )}
      </Row>
    </div>
  );
}
