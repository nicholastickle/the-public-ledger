/**
 * Demo-only per-house stage history for a bill's Stages tab.
 *
 * Real data (`fetchBillStages`, already wired to the backend's `/bills/{id}/stages`
 * endpoint) replaces this wholesale — the shape mirrors `ParliamentBillStage` so
 * the swap is drop-in. Only the stages a bill has actually reached are built,
 * most-recent first, matching how bills.parliament.uk lists them.
 */

import type { ParliamentBill, ParliamentRegulation } from '../types/parliament';
import { hashSeed, mulberry32, mockLastDivision, mockRegulationDivision, mockPrayerTabled } from './mockVotes';

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

/* ── Regulation (statutory instrument) stage history & passage ──────────── */

/**
 * The step vocabulary and ordering below is taken from real responses of
 * statutoryinstruments-api.parliament.uk's `/StatutoryInstrument/{id}/BusinessItems`
 * endpoint (checked directly against the live API, not documentation) —
 * "Laid before the House of Commons", "Delegated Legislation Committee (DLC)
 * debate", "Motion (prayer) to stop the instrument being law tabled",
 * "Objection period ends", etc. are its own step names, simplified here to
 * the handful that matter for a citizen deciding how to vote.
 *
 * The API exposes no division/vote-count field on any step — that data comes
 * from the separate Commons/Lords Votes APIs, matched by title and date the
 * same way `division_sync.py` already does for bill stages. Until that sync
 * exists for instruments, this stays demo-only.
 */

/** Which House(s) an instrument is laid before. Falls back to both when the
 *  API hasn't recorded one — most instruments requiring public tracking go
 *  before both Houses in practice. */
function regulationHouses(reg: ParliamentRegulation): ('Commons' | 'Lords')[] {
  if (reg.house === 'Commons') return ['Commons'];
  if (reg.house === 'Lords') return ['Lords'];
  return ['Commons', 'Lords'];
}

export interface MockRegulationStageEntry {
  id: string;
  stepName: string;
  /** null for a step that belongs to neither House (e.g. the objection
   *  window simply elapsing); 'Made' for the instrument being signed into
   *  law, which — like Royal Assent for a bill — belongs to neither House. */
  house: 'Commons' | 'Lords' | 'Made' | null;
  date: string;
  division?: { status: 'voted' | 'nod' | 'silent'; for?: number; against?: number };
}

/** Every step the instrument has reached, most-recent first. An affirmative
 *  instrument must be actively approved in each House it's laid before —
 *  usually by a Delegated Legislation Committee, whose floor motion is
 *  typically agreed without a division. A negative instrument becomes law by
 *  Parliament's silence unless a "prayer" against it is tabled and carried —
 *  the common case has no vote in its history at all. */
export function mockRegulationStageHistory(reg: ParliamentRegulation): MockRegulationStageEntry[] {
  const houses = regulationHouses(reg);
  const isAffirmative = reg.procedure === 'affirmative' || reg.procedure === 'super-affirmative';
  const laidDate = reg.laid_date ? new Date(reg.laid_date) : new Date();
  const settled = reg.status !== 'pending';
  const entries: MockRegulationStageEntry[] = [];
  let seq = 0;

  function push(stepName: string, house: MockRegulationStageEntry['house'], date: Date, division?: MockRegulationStageEntry['division']) {
    entries.push({ id: `${reg.id}-${seq++}`, stepName, house, date: date.toISOString().slice(0, 10), division });
  }

  if (isAffirmative) {
    for (const house of houses) {
      push(`Laid before the House of ${house}`, house, laidDate);
      if (!settled) continue;
      const rand = mulberry32(hashSeed(`${reg.id}:${house}`) * 331 + 7);
      const debateName = rand() < 0.8 ? 'Delegated Legislation Committee (DLC) debate' : 'Chamber debate';
      const debateDate = new Date(laidDate.getTime() + (10 + Math.floor(rand() * 14)) * 86_400_000);
      push(debateName, house, debateDate);
      const div = mockRegulationDivision(`${reg.id}:${house}`, reg.status === 'annulled' ? 'annulled' : 'approved');
      push('Motion to approve the instrument', house, new Date(debateDate.getTime() + 5 * 86_400_000), div);
    }
    if (reg.status === 'made' || reg.status === 'approved') {
      push('Instrument made (signed into law)', 'Made', reg.made_date ? new Date(reg.made_date) : laidDate);
    }
  } else {
    // Negative instruments are ordinarily signed into law before they are
    // even laid — laying starts the objection window running, it doesn't
    // gate the making of the instrument the way affirmative approval does.
    if (reg.made_date) push('Instrument made (signed into law)', 'Made', new Date(reg.made_date));
    for (const house of houses) push(`Laid before the House of ${house}`, house, laidDate);

    const prayed = reg.status === 'annulled' || mockPrayerTabled(reg.id);
    if (prayed) {
      const debateDate = new Date(laidDate.getTime() + 21 * 86_400_000);
      push('Motion (prayer) to annul the instrument tabled', houses[0], debateDate);
      if (settled) {
        const div = mockRegulationDivision(reg.id, reg.status === 'annulled' ? 'annulled' : 'approved');
        push(reg.status === 'annulled' ? 'Instrument annulled' : 'Instrument remains law', houses[0], new Date(debateDate.getTime() + 10 * 86_400_000), div);
      }
    } else if (settled) {
      const endDate = reg.deadline ? new Date(reg.deadline) : new Date(laidDate.getTime() + 40 * 86_400_000);
      push('Objection period ends — no prayer tabled', null, endDate, { status: 'silent' });
    }
  }

  return entries.reverse(); // most-recent first, matching the Stages tab convention
}

export interface RegulationPassagePanel {
  heading: string;
  /** 'Made' renders the same neutral badge as a bill's Royal Assent panel —
   *  belongs to neither House. */
  house: 'Commons' | 'Lords' | 'Made';
  stages: PassageStage[];
}

/** The instrument's passage, one panel per House it's laid before plus an
 *  outcome panel — mirrors `mockBillPassage`'s shape, but built from actual
 *  affirmative/negative procedure rather than a five-reading run, since
 *  instruments don't have one. */
export function mockRegulationPassage(reg: ParliamentRegulation): RegulationPassagePanel[] {
  const houses = regulationHouses(reg);
  const isAffirmative = reg.procedure === 'affirmative' || reg.procedure === 'super-affirmative';
  const settled = reg.status !== 'pending';
  const panels: RegulationPassagePanel[] = [];

  if (isAffirmative) {
    for (const house of houses) {
      panels.push({
        heading: `Before the House of ${house}`,
        house,
        stages: [
          { label: 'Laid before the House', state: 'done' },
          { label: 'Committee or Chamber debate', state: settled ? 'done' : 'current' },
          { label: 'Motion to approve', state: settled ? 'done' : 'upcoming' },
        ],
      });
    }
    panels.push({
      heading: 'Final stages',
      house: 'Made',
      stages: [
        { label: 'Instrument made', state: reg.status === 'made' ? 'done' : 'upcoming' },
        { label: 'Comes into force', state: reg.status === 'made' ? 'done' : 'upcoming' },
      ],
    });
  } else {
    const prayed = reg.status === 'annulled' || mockPrayerTabled(reg.id);
    for (const house of houses) {
      panels.push({
        heading: `Before the House of ${house}`,
        house,
        stages: [
          { label: 'Laid before the House', state: 'done' },
          { label: 'Prayer tabled to annul it', state: prayed ? 'done' : 'not-applicable' },
        ],
      });
    }
    // Withdrawal happens mid-window — the objection period never runs to a
    // conclusion, so it reads "not applicable" rather than falsely "done".
    panels.push({
      heading: 'Outcome',
      house: 'Made',
      stages: reg.status === 'withdrawn'
        ? [
          { label: 'Objection period ends', state: 'not-applicable' },
          { label: 'Withdrawn', state: 'done' },
        ]
        : [
          { label: 'Objection period ends', state: settled ? 'done' : 'current' },
          { label: reg.status === 'annulled' ? 'Annulled' : 'Remains law', state: settled ? 'done' : 'upcoming' },
        ],
    });
  }

  return panels;
}
