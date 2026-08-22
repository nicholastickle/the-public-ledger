import type { PassageStage, PassageStageState } from '../../lib/mockStages';
import HouseBadge from '../ui/HouseBadge';

const STATE_COLOR: Record<PassageStageState, string> = {
  done: '#FAF6ED',
  current: '#D4AF37',
  upcoming: 'rgba(250,246,237,0.35)',
  'not-applicable': 'rgba(250,246,237,0.35)',
};

/** Check / hourglass / slash / hollow-circle — shared by the Bill and
 *  Regulation passage diagrams, matching bills.parliament.uk's own "Bill
 *  passage" key. */
export function StateIcon({ state }: { state: PassageStageState }) {
  const color = STATE_COLOR[state];
  const common = { viewBox: '0 0 16 16', width: 15, height: 15, 'aria-hidden': true as const };

  if (state === 'done') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.3" />
        <path d="M5 8.2 7.1 10.2 11 5.8" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === 'current') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.3" />
        <path
          d="M5.6 4.9h4.8M5.6 11.1h4.8M6.1 5.1 6.1 6.2 8 8 6.1 9.8 6.1 10.9M9.9 5.1 9.9 6.2 8 8 9.9 9.8 9.9 10.9"
          stroke={color}
          strokeWidth="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  if (state === 'not-applicable') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.3" opacity="0.6" />
        <path d="M4.2 11.8 11.8 4.2" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.1" />
    </svg>
  );
}

export function StateLabel({ state }: { state: PassageStageState }) {
  const text = state === 'not-applicable' ? 'Not applicable' : state === 'upcoming' ? 'Not yet reached' : state === 'current' ? 'In progress' : 'Complete';
  return <span className="sr-only">{text}</span>;
}

/** One House's (or the final-stages) column in a passage diagram — shared by
 *  `BillPassageDiagram` and `RegulationPassageDiagram` so the two boards
 *  render the same component rather than two copies of the same markup. */
export function PassagePanel({ heading, house, stages }: { heading: string; house: string; stages: PassageStage[] }) {
  return (
    <div className="passage-diagram__panel">
      <div className="passage-diagram__panel-head">
        <HouseBadge house={house} size={28} />
        <span>{heading}</span>
      </div>
      <ul className="passage-diagram__list">
        {stages.map(stage => (
          <li key={stage.label} className="passage-diagram__row" data-state={stage.state}>
            <StateIcon state={stage.state} />
            <StateLabel state={stage.state} />
            <span>{stage.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
