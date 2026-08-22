import type { ParliamentBill } from '../../types/parliament';
import { mockStageHistory } from '../../lib/mockStages';
import { generateAiVerdicts, aiAggregate } from '../../lib/mockVotes';
import { formatBillDate } from '../../lib/utils';
import HouseBadge from '../ui/HouseBadge';

interface Props {
  bill: ParliamentBill;
}

/** Every stage the bill has reached, most-recent first — matching how
 *  bills.parliament.uk lists them at bills.parliament.uk/bills/{id}/stages —
 *  each carrying the division (or "on the nod") that closed it out, and the
 *  AI panel's verdict as it stood at that point in the bill's passage. */
export default function BillStagesTab({ bill }: Props) {
  const title = bill.short_title ?? bill.long_title ?? 'Untitled Bill';
  const history = mockStageHistory(bill);

  return (
    <ol className="stages-tab">
      {history.map(stage => {
        const opinions = generateAiVerdicts(title, `${bill.id}:${stage.id}`);
        const agg = aiAggregate(opinions);
        return (
          <li key={stage.id} className="stages-tab__entry">
            <div className="stages-tab__badge">
              <HouseBadge house={stage.house ?? 'Royal Assent'} size={30} />
            </div>
            <div className="stages-tab__body">
              <div className="stages-tab__row">
                <span className="stages-tab__name">{stage.stageName}</span>
                <span className="stages-tab__date font-mono">{formatBillDate(stage.date)}</span>
              </div>
              <p className="stages-tab__division font-mono">
                {stage.division.status === 'nod'
                  ? 'Agreed without a division'
                  : `Division — ${stage.division.for} Ayes · ${stage.division.against} Noes`}
              </p>
              <p className="stages-tab__ai">
                AI panel at this stage: {agg.approve} approve · {agg.reject} reject — &ldquo;{opinions[0].summary}&rdquo;
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
