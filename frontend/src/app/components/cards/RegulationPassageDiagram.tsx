import type { ParliamentRegulation } from '../../types/parliament';
import { mockRegulationPassage } from '../../lib/mockStages';
import { PassagePanel } from './PassagePanel';

interface Props {
  regulation: ParliamentRegulation;
}

/** The instrument's passage — one panel per House it's laid before, plus an
 *  outcome panel — built on the same shared diagram the Bill Board uses, but
 *  from real affirmative/negative procedure rather than a run of readings:
 *  an affirmative instrument needs an active approval motion in each House;
 *  a negative one needs nothing at all unless a prayer against it is tabled,
 *  which is why "not applicable" is its own state here rather than an edge
 *  case — it's the default outcome for most negative instruments. */
export default function RegulationPassageDiagram({ regulation }: Props) {
  const panels = mockRegulationPassage(regulation);

  return (
    <div className="passage-diagram" style={{ gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))` }}>
      {panels.map(panel => (
        <PassagePanel key={panel.heading} heading={panel.heading} house={panel.house} stages={panel.stages} />
      ))}
    </div>
  );
}
