/**
 * Demo-only per-house stage history for a bill's Stages tab.
 *
 * Real data (`fetchBillStages`, already wired to the backend's `/bills/{id}/stages`
 * endpoint) replaces this wholesale — the shape mirrors `ParliamentBillStage` so
 * the swap is drop-in. Only the stages a bill has actually reached are built,
 * most-recent first, matching how bills.parliament.uk lists them.
 */

import type { ParliamentBill } from '../types/parliament';
import { hashSeed, mulberry32, mockLastDivision } from './mockVotes';

export interface MockStageEntry {
  id: string;
  stageName: string;
  /** null for Royal Assent, which belongs to neither House. */
  house: 'Commons' | 'Lords' | null;
  date: string;
  division: { status: 'voted' | 'nod'; for?: number; against?: number };
}

// Parliament's own wording (bills.parliament.uk uses the ordinal form, not
// "First Reading" spelled out) — matched loosely below since the live API
// varies casing and sometimes spells the ordinal out in full.
const READING_STAGES = ['1st reading', '2nd reading', 'Committee stage', 'Report stage', '3rd reading'];

function matchReadingIndex(stageName: string): number {
  const s = stageName.toLowerCase();
  if (s.includes('1st reading') || s.includes('first reading')) return 0;
  if (s.includes('2nd reading') || s.includes('second reading')) return 1;
  if (s.includes('committee')) return 2;
  if (s.includes('report')) return 3;
  if (s.includes('3rd reading') || s.includes('third reading')) return 4;
  return -1;
}

export function mockStageHistory(bill: ParliamentBill): MockStageEntry[] {
  const origin: 'Commons' | 'Lords' = bill.originating_house === 'Lords' ? 'Lords' : 'Commons';
  const other: 'Commons' | 'Lords' = origin === 'Commons' ? 'Lords' : 'Commons';
  const rand = mulberry32(hashSeed(bill.id) * 911 + 3);

  const currentStageName = bill.current_stage_name ?? '';
  const isPingPong = /ping-pong|consideration of/i.test(currentStageName);
  const currentIdx = matchReadingIndex(currentStageName);

  const raw: { stageName: string; house: 'Commons' | 'Lords' }[] = [];

  if (bill.is_act || isPingPong) {
    for (const house of [origin, other] as const) {
      for (const stageName of READING_STAGES) raw.push({ stageName, house });
    }
    if (isPingPong) raw.push({ stageName: currentStageName, house: other });
  } else if (bill.current_house != null && bill.current_house !== origin) {
    // Crossed over into the second House — the first House's full run is behind it.
    for (const stageName of READING_STAGES) raw.push({ stageName, house: origin });
    const idx = currentIdx === -1 ? 0 : currentIdx;
    for (let i = 0; i <= idx; i++) {
      // The current stage keeps the bill's own exact wording rather than the
      // canonical label, so it reads identically to the board's Stage column.
      raw.push({ stageName: i === idx ? currentStageName : READING_STAGES[i], house: other });
    }
  } else {
    // Still in the House it started in.
    const idx = currentIdx === -1 ? 0 : currentIdx;
    for (let i = 0; i <= idx; i++) {
      raw.push({ stageName: i === idx ? currentStageName : READING_STAGES[i], house: origin });
    }
  }

  const lastDate = bill.parliament_last_update ? new Date(bill.parliament_last_update) : new Date();
  const entries: MockStageEntry[] = [];
  let cursor = lastDate;

  for (let i = raw.length - 1; i >= 0; i--) {
    const { stageName, house } = raw[i];
    const isFirstReading = /1st reading|first reading/i.test(stageName);
    const division = isFirstReading
      ? ({ status: 'nod' } as const)
      : mockLastDivision(`${bill.id}:${house}:${stageName}`);
    entries.unshift({ id: `${bill.id}-${i}`, stageName, house, date: cursor.toISOString().slice(0, 10), division });
    cursor = new Date(cursor.getTime() - (5 + Math.floor(rand() * 14)) * 86_400_000);
  }

  if (bill.is_act) {
    entries.push({ id: `${bill.id}-ra`, stageName: 'Royal Assent', house: null, date: lastDate.toISOString().slice(0, 10), division: { status: 'nod' } });
  }

  return entries.reverse(); // most-recent first, matching bills.parliament.uk
}

/* ── Bill passage diagram ──────────────────────────────────────────────── */

export type PassageStageState = 'done' | 'current' | 'upcoming' | 'not-applicable';

export interface PassageStage {
  label: string;
  state: PassageStageState;
}

export interface BillPassage {
  origin: 'Commons' | 'Lords';
  other: 'Commons' | 'Lords';
  originStages: PassageStage[];
  otherStages: PassageStage[];
  /** [Consideration of amendments, Royal Assent] */
  finalStages: PassageStage[];
}

/** Per-house reading-stage status for the "Bill passage" diagram — mirrors
 *  bills.parliament.uk's own three-panel view (started-in House, other House,
 *  final stages), each stage marked done / current / upcoming / not
 *  applicable (occasionally a House skips Report stage, most often when a
 *  bill was committed to a Committee of the whole House). */
export function mockBillPassage(bill: ParliamentBill): BillPassage {
  const origin: 'Commons' | 'Lords' = bill.originating_house === 'Lords' ? 'Lords' : 'Commons';
  const other: 'Commons' | 'Lords' = origin === 'Commons' ? 'Lords' : 'Commons';

  const currentStageName = bill.current_stage_name ?? '';
  const isPingPong = /ping-pong|consideration of/i.test(currentStageName);
  const currentIdx = matchReadingIndex(currentStageName);

  function leg(legKey: string, allDone: boolean, currentAt: number | null): PassageStage[] {
    return READING_STAGES.map((label, i) => {
      const skipRand = mulberry32(hashSeed(`${bill.id}:${legKey}:${label}`))();
      const skippable = label === 'Report stage' && i !== currentAt;
      if (skippable && skipRand < 0.12) return { label, state: 'not-applicable' };
      if (allDone) return { label, state: 'done' };
      if (currentAt === null) return { label, state: 'upcoming' };
      if (i < currentAt) return { label, state: 'done' };
      if (i === currentAt) return { label, state: 'current' };
      return { label, state: 'upcoming' };
    });
  }

  if (bill.is_act) {
    return {
      origin,
      other,
      originStages: leg('origin', true, null),
      otherStages: leg('other', true, null),
      finalStages: [
        { label: 'Consideration of amendments', state: 'done' },
        { label: 'Royal Assent', state: 'done' },
      ],
    };
  }
  if (isPingPong) {
    return {
      origin,
      other,
      originStages: leg('origin', true, null),
      otherStages: leg('other', true, null),
      finalStages: [
        { label: 'Consideration of amendments', state: 'current' },
        { label: 'Royal Assent', state: 'upcoming' },
      ],
    };
  }
  const finalStages: PassageStage[] = [
    { label: 'Consideration of amendments', state: 'upcoming' },
    { label: 'Royal Assent', state: 'upcoming' },
  ];
  if (bill.current_house != null && bill.current_house !== origin) {
    const idx = currentIdx === -1 ? 0 : currentIdx;
    return { origin, other, originStages: leg('origin', true, null), otherStages: leg('other', false, idx), finalStages };
  }
  const idx = currentIdx === -1 ? 0 : currentIdx;
  return { origin, other, originStages: leg('origin', false, idx), otherStages: leg('other', false, null), finalStages };
}
