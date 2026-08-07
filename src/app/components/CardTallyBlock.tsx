import TallyHeader from './TallyHeader';
import ThumbTally from './ThumbTally';
import TapInfo from './TapInfo';
import { formatDateNumeric } from '../lib/utils';
import type { GovVote } from '../lib/mockVotes';
import type { Tally } from '../types/votes';

interface Props {
  context: 'bill' | 'regulation';
  forLabel: string;
  againstLabel: string;
  /** Same `revealed` rule as the table: true once the citizen has voted, or
   *  once the window has closed regardless. */
  revealed: boolean;
  publicTally: Tally;
  aiTally: Tally;
  gov: GovVote;
}

const LOCK_MESSAGE =
  'Hidden until you vote. Cast your vote above to reveal it now, or wait until this is settled and the result becomes public.';

const GOV_DATE_MESSAGE: Record<'bill' | 'regulation', string> = {
  bill: "Parliament divides on this bill at Second Reading. Until then, this is the sitting date it's expected — not a result.",
  regulation:
    "Parliament hasn't settled this yet. Shown is the deadline it must be settled by — an approval vote for an affirmative instrument, or the end of the objection period for a negative one.",
};

function Locked({ align }: { align: 'left' | 'center' | 'right' }) {
  return (
    <TapInfo message={LOCK_MESSAGE} align={align} srLabel="Hidden until you vote">
      <span className="ledger-card__lock" aria-hidden="true">🔒</span>
    </TapInfo>
  );
}

/** The Public/AI/Government tallies for a board card: one row of icons, and
 *  beneath each icon — in the same column — its value: a thumbs pair once
 *  revealed, a tap-to-explain padlock while hidden, or (Government only) a
 *  tap-to-explain TBD/date chip while Parliament hasn't voted yet. Icons
 *  carry the same hover/focus InfoTip as the desktop table; the padlock and
 *  the date chip additionally open on tap, since a touchscreen has no hover. */
export default function CardTallyBlock({ context, forLabel, againstLabel, revealed, publicTally, aiTally, gov }: Props) {
  return (
    <div className="ledger-card__tallies">
      <div className="ledger-card__tally-icons">
        <TallyHeader kind="public" context={context} />
        <TallyHeader kind="ai" context={context} />
        <TallyHeader kind="government" context={context} />
      </div>
      <div className="ledger-card__tally-values">
        <span className="ledger-card__tally-value">
          {revealed ? (
            <ThumbTally forCount={publicTally.for} againstCount={publicTally.against} forLabel={forLabel} againstLabel={againstLabel} />
          ) : (
            <Locked align="left" />
          )}
        </span>
        <span className="ledger-card__tally-value">
          {revealed ? (
            <ThumbTally forCount={aiTally.for} againstCount={aiTally.against} forLabel={forLabel} againstLabel={againstLabel} />
          ) : (
            <Locked align="center" />
          )}
        </span>
        <span className="ledger-card__tally-value">
          {gov.status === 'none' && (
            <span className="tally-cell__none" title="No parliamentary vote recorded">—</span>
          )}
          {gov.status === 'pending' && (
            <TapInfo
              message={GOV_DATE_MESSAGE[context]}
              align="right"
              srLabel={`Government vote: ${gov.scheduledDate ? formatDateNumeric(gov.scheduledDate) : 'TBD'}`}
            >
              <span className="tally-cell__pending font-mono tabular-nums" suppressHydrationWarning>
                {gov.scheduledDate ? formatDateNumeric(gov.scheduledDate) : 'TBD'}
              </span>
            </TapInfo>
          )}
          {gov.status === 'voted' &&
            (revealed ? (
              <ThumbTally forCount={gov.for ?? 0} againstCount={gov.against ?? 0} forLabel={forLabel} againstLabel={againstLabel} />
            ) : (
              <Locked align="right" />
            ))}
        </span>
      </div>
    </div>
  );
}
