import type { ParliamentBill } from '../../types/parliament';
import { mockBillPassage, type PassageStage, type PassageStageState } from '../../lib/mockStages';
import HouseBadge from '../ui/HouseBadge';

interface Props {
  bill: ParliamentBill;
}

const STATE_COLOR: Record<PassageStageState, string> = {
  done: '#FAF6ED',
  current: '#D4AF37',
  upcoming: 'rgba(250,246,237,0.35)',
  'not-applicable': 'rgba(250,246,237,0.35)',
};

/** Check / hourglass / slash / hollow-circle — the same four states as
 *  bills.parliament.uk's own "Bill passage" key. */
function StateIcon({ state }: { state: PassageStageState }) {
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

function StateLabel({ state }: { state: PassageStageState }) {
  const text = state === 'not-applicable' ? 'Not applicable' : state === 'upcoming' ? 'Not yet reached' : state === 'current' ? 'In progress' : 'Complete';
  return <span className="sr-only">{text}</span>;
}

function Panel({ heading, house, stages }: { heading: string; house: string; stages: PassageStage[] }) {
  return (
    <div className="bill-passage__panel">
      <div className="bill-passage__panel-head">
        <HouseBadge house={house} size={28} />
        <span>{heading}</span>
      </div>
      <ul className="bill-passage__list">
        {stages.map(stage => (
          <li key={stage.label} className="bill-passage__row" data-state={stage.state}>
            <StateIcon state={stage.state} />
            <StateLabel state={stage.state} />
            <span>{stage.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The bill's full passage, both Houses side by side — bills.parliament.uk's
 *  own "Bill passage" view, built on the same done/current/upcoming states
 *  the original single-line timeline used, just laid out per House instead
 *  of flattened into one run. */
export default function BillPassageDiagram({ bill }: Props) {
  const passage = mockBillPassage(bill);

  return (
    <div className="bill-passage">
      <Panel heading={`Bill started in the House of ${passage.origin}`} house={passage.origin} stages={passage.originStages} />
      <Panel heading={`Bill in the House of ${passage.other}`} house={passage.other} stages={passage.otherStages} />
      <Panel heading="Final stages" house="Royal Assent" stages={passage.finalStages} />
    </div>
  );
}
