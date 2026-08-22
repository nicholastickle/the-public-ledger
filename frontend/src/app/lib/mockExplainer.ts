/**
 * Demo-only plain-English explainer copy for a bill or statutory instrument.
 *
 * Generated deterministically from the item's id for the same reason the AI
 * commentary is (see `mockVotes.ts`) — hand-authoring ~60 items of prose is not
 * the point of the demo, and a seeded generator still gives each item stable,
 * distinct-feeling text across reloads.
 *
 * The copy is deliberately procedural: what the measure does, who it touches,
 * and what happens next.
 *
 * Real summaries (`ParliamentBillDetail.summary` plus the explanatory notes
 * Parliament publishes) replace this wholesale; the shape — an array of
 * paragraphs, first one standalone — is what the UI depends on.
 */

/** Bills key this by a numeric id, regulations by the Parliament API's
 *  alphanumeric string id — folds either into the same numeric seed space. */
function hashSeed(seed: number | string): number {
  if (typeof seed === 'number') return seed;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return h;
}

/** Same PRNG as `mockVotes` — kept local so neither module owns the other. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, options: T[]): T {
  return options[Math.floor(rand() * options.length) % options.length];
}

const WHAT_IT_DOES = [
  'changes the rules that public bodies and private organisations have to follow in this area, replacing a framework that has been amended piecemeal for years with a single consolidated set of duties.',
  'creates a new statutory duty, sets out who it falls on, and gives a regulator the power to enforce it — including the power to require information and to impose penalties where the duty is not met.',
  'narrows an existing exemption so that a group of organisations currently outside the regime is brought inside it, and sets out the timetable over which that happens.',
  'gives ministers a power to make detailed rules by regulation later, and sets the limits of that power on the face of the measure — the boundaries are fixed here, the detail comes afterwards.',
  'transfers a set of functions from one body to another and makes the consequential changes to every other piece of legislation that referred to the old arrangement.',
];

const WHO_IT_AFFECTS = [
  'In practice the people most directly affected are the organisations that have to comply and the individuals the duty is designed to protect. Everyone else encounters it indirectly, through the cost of compliance being carried into prices and services.',
  'The measure applies across England and Wales, with separate commencement arrangements where the subject matter is devolved. Reading the extent clause matters as much as reading the duty itself.',
  'Smaller organisations are treated the same as larger ones under the core duty, with the differences appearing in the reporting requirements rather than in the substance of what must be done.',
  'It reaches both the public and private sector, though the enforcement route differs: public bodies answer through existing accountability channels, private organisations through the regulator.',
];

const WHAT_HAPPENS_NEXT = [
  'Most of it comes into force on a day appointed by regulation rather than on passing, so the gap between it becoming law and it having practical effect can be considerable.',
  'A transition period applies before the duties bite, intended to give affected organisations time to change their systems before enforcement begins.',
  'Several of the operative provisions depend on secondary legislation that has not been published yet, so the full shape of the regime will not be visible until those regulations are laid.',
  'Once in force it is reviewed after a fixed period, with the findings laid before Parliament — the review clause is the main built-in check on whether it is working.',
];

const CAVEATS = [
  'The wording below is a plain-English summary, not the legal text. Where the two differ, the text as published by Parliament is what governs.',
  'This summary covers the substance, not the drafting. Definitions clauses often do more work than the operative provisions they sit behind, and are worth reading in full.',
  'Summaries compress. If the detail matters to you, the published text and the explanatory notes are the things to read.',
];

/**
 * A short plain-English explainer, as an array of paragraphs. The first
 * paragraph stands alone — the UI shows it collapsed and hides the rest behind
 * a "Read more" control — so it always says what the measure does before any
 * caveat or detail.
 */
export function generateExplainer(title: string, seed: number | string): string[] {
  const rand = mulberry32(hashSeed(seed) * 397 + 61);
  return [
    `"${title}" ${pick(rand, WHAT_IT_DOES)}`,
    pick(rand, WHO_IT_AFFECTS),
    pick(rand, WHAT_HAPPENS_NEXT),
    pick(rand, CAVEATS),
  ];
}
