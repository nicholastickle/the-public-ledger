import type { ParliamentBill } from '../../types/parliament';
import { mockBillPassage } from '../../lib/mockStages';
import { PassagePanel } from './PassagePanel';

interface Props {
  bill: ParliamentBill;
}

/** The bill's full passage, both Houses side by side — bills.parliament.uk's
 *  own "Bill passage" view, built on the same done/current/upcoming states
 *  the original single-line timeline used, just laid out per House instead
 *  of flattened into one run. */
export default function BillPassageDiagram({ bill }: Props) {
  const passage = mockBillPassage(bill);

  return (
    <div className="passage-diagram" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      <PassagePanel heading={`Bill started in the House of ${passage.origin}`} house={passage.origin} stages={passage.originStages} />
      <PassagePanel heading={`Bill in the House of ${passage.other}`} house={passage.other} stages={passage.otherStages} />
      <PassagePanel heading="Final stages" house="Royal Assent" stages={passage.finalStages} />
    </div>
  );
}
