import type { ParliamentRegulation } from '../../types/parliament';
import { mockRegulationStageHistory } from '../../lib/mockStages';
import { generateAiVerdicts, aiAggregate } from '../../lib/mockVotes';
import { formatBillDate } from '../../lib/utils';
import HouseBadge from '../ui/HouseBadge';

interface Props {
  regulation: ParliamentRegulation;
}

function DivisionLine({ division }: { division: NonNullable<ReturnType<typeof mockRegulationStageHistory>[number]['division']> }) {
  if (division.status === 'silent') {
    return <p className="stages-tab__division font-mono">No vote — the objection period lapsed without a division</p>;
  }
  if (division.status === 'nod') {
    return <p className="stages-tab__division font-mono">Agreed without a division</p>;
  }
  return (
    <p className="stages-tab__division font-mono">
      Division — {division.for} for · {division.against} against
    </p>
  );
}

/** Every step the instrument has reached, most-recent first — matching how
 *  bills.parliament.uk's own passage view lists a bill's stages, adapted to
 *  the affirmative/negative procedure steps statutoryinstruments-api.parliament.uk
 *  actually records (see the doc comment on `mockRegulationStageHistory`).
 *  Only steps that carry a division (or its deliberate absence) show a result
 *  line — most steps, like being laid before a House, carry neither. */
export default function RegulationStagesTab({ regulation }: Props) {
  const history = mockRegulationStageHistory(regulation);

  return (
    <ol className="stages-tab">
      {history.map(step => {
        const opinions = generateAiVerdicts(regulation.title, `${regulation.id}:${step.id}`);
        const agg = aiAggregate(opinions);
        return (
          <li key={step.id} className="stages-tab__entry">
            <div className="stages-tab__badge">
              <HouseBadge house={step.house ?? 'Made'} size={30} />
            </div>
            <div className="stages-tab__body">
              <div className="stages-tab__row">
                <span className="stages-tab__name">{step.stepName}</span>
                <span className="stages-tab__date font-mono">{formatBillDate(step.date)}</span>
              </div>
              {step.division && <DivisionLine division={step.division} />}
              <p className="stages-tab__ai">
                AI panel at this step: {agg.approve} approve · {agg.reject} reject — &ldquo;{opinions[0].summary}&rdquo;
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
