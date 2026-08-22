/**
 * Demo-only AI panel + mock government tally generation.
 *
 * The AI verdict/tally and the government (parliamentary) tally are both kept
 * out of static demo-data objects and generated deterministically from a seed
 * (the bill/regulation id) instead — avoids hand-authoring ~60 items worth of
 * commentary while still giving each item stable, distinct-feeling content.
 *
 * Real model integration ("we'll hook up their APIs later") replaces
 * `generateAiVerdicts` with an actual call per model; the shape is designed
 * to be a drop-in swap.
 */

import type { ModelBrand } from '../components/voting/ModelLogo';

export type AiVerdict = 'approve' | 'reject';

export interface AiModelOpinion {
  /** The product family the verdict came from — what a reader recognises. */
  model: ModelBrand;
  /** The exact model version that cast this vote. Shown alongside the family
   *  name so a verdict is always attributable to a specific model rather than
   *  to "an AI" — a panel is only auditable if you know what was asked. */
  modelVersion: string;
  vendor: string;
  color: string;
  verdict: AiVerdict;
  summary: string;
  merits: string;
  problems: string;
}

/** Bills key this by a numeric id, regulations by the Parliament API's
 *  alphanumeric string id — folds either into the same numeric seed space. */
export function hashSeed(seed: number | string): number {
  if (typeof seed === 'number') return seed;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return h;
}

/** Small deterministic PRNG so the same id always yields the same mock content. */
export function mulberry32(seed: number): () => number {
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

const MERITS = [
  'closes a genuine gap in the current framework without adding much administrative overhead.',
  'is well-targeted — the impact assessment shows benefits concentrated where the problem is worst.',
  'brings the UK in line with comparable jurisdictions that have already legislated on this.',
  'has cross-party support in committee evidence, which usually correlates with durable implementation.',
  'includes a sensible transition period, reducing compliance shock for affected parties.',
];

const PROBLEMS = [
  'the enforcement mechanism is left largely to secondary legislation, which limits scrutiny now.',
  'the cost estimates in the impact assessment look optimistic given past delivery timelines.',
  'smaller organisations may struggle with the compliance burden relative to larger ones.',
  'several definitions are broader than needed, risking unintended scope creep.',
  'the consultation period was short relative to the complexity of what is being changed.',
];

const SUMMARY_OPENERS = [
  'On balance, a measured piece of legislation that does roughly what it says.',
  'A reasonable response to a real problem, though the drafting could be tighter.',
  'Directionally sound, with implementation risk being the main open question.',
  'Solves for a narrow but genuine issue without much collateral complexity.',
];

/** The panel, and the exact model version each seat votes with. Pinning the
 *  version here rather than saying "the latest" keeps a recorded verdict
 *  attributable: the panel's composition is part of the record, so bumping a
 *  model is a deliberate edit to this list, not something that happens to a
 *  historic vote behind the reader's back. */
const MODEL_META: Array<Pick<AiModelOpinion, 'model' | 'modelVersion' | 'vendor' | 'color'>> = [
  { model: 'Claude',  modelVersion: 'Claude Opus 5', vendor: 'Anthropic', color: '#D97757' },
  { model: 'ChatGPT', modelVersion: 'GPT-5.1',       vendor: 'OpenAI',    color: '#10A37F' },
  { model: 'Gemini',  modelVersion: 'Gemini 3 Pro',  vendor: 'Google',    color: '#4C8DF6' },
  { model: 'Grok',    modelVersion: 'Grok 4.1',      vendor: 'xAI',       color: '#8B8F97' },
];

export function generateAiVerdicts(title: string, seed: number | string): AiModelOpinion[] {
  const numericSeed = hashSeed(seed);
  return MODEL_META.map((meta, i) => {
    const rand = mulberry32(numericSeed * 131 + i * 977);
    const verdict: AiVerdict = rand() > 0.35 ? 'approve' : 'reject';
    const merit = pick(rand, MERITS);
    const problem = pick(rand, PROBLEMS);
    const opener = pick(rand, SUMMARY_OPENERS);
    return {
      ...meta,
      verdict,
      summary: `${opener} Reading of "${title}" suggests the core aim is achievable within the stated timeline.`,
      merits: `Merit: ${merit}`,
      problems: `Concern: ${problem}`,
    };
  });
}

export function aiAggregate(opinions: AiModelOpinion[]): { approve: number; reject: number } {
  return {
    approve: opinions.filter(o => o.verdict === 'approve').length,
    reject: opinions.filter(o => o.verdict === 'reject').length,
  };
}

/**
 * Where the government's own vote has got to.
 *  - `voted`   — a division has happened; a tally is available.
 *  - `nod`     — the stage was agreed without a division ("on the nod") — used
 *                only for bills, which have no scheduled division to wait on.
 *  - `pending` — Parliament has not voted yet. `scheduledDate` is when it is
 *                expected to (a regulation's parliamentary deadline) — bills no
 *                longer use this status, since their vote is open for the whole
 *                of their passage rather than closing at a scheduled division.
 *  - `none`    — there will be no parliamentary vote (e.g. withdrawn before one,
 *                or no stage has concluded yet).
 */
export interface GovVote {
  status: 'voted' | 'nod' | 'pending' | 'none';
  scheduledDate?: string | null;
  for?: number;
  against?: number;
}

/** Deterministic mock "last division or nod" for a bill's most recently
 *  concluded stage — roughly 40% of stage transitions in Parliament happen
 *  without a recorded division at all. */
export function mockLastDivision(seed: number | string): { status: 'voted' | 'nod'; for?: number; against?: number } {
  const rand = mulberry32(hashSeed(seed) * 421 + 5);
  if (rand() < 0.4) return { status: 'nod' };
  const total = 630; // approx combined Commons + Lords voting membership, for flavour only
  const margin = 0.04 + rand() * 0.4;
  const forCount = Math.round(total * (0.5 + margin / 2));
  return { status: 'voted', for: forCount, against: total - forCount };
}

/** Deterministic mock government (parliamentary) division tally, correlated with but distinct from the citizen tally. */
export function mockGovTally(seed: number | string, citizenFor: number, citizenAgainst: number): { for: number; against: number } {
  const rand = mulberry32(hashSeed(seed) * 733 + 17);
  const citizenLeansFor = citizenFor >= citizenAgainst;
  // ~70% of the time Parliament's result agrees in direction with the citizen result; otherwise it diverges.
  const govLeansFor = rand() < 0.7 ? citizenLeansFor : !citizenLeansFor;
  const total = 630; // approx combined Commons + Lords voting membership, for flavour only
  const margin = 0.04 + rand() * 0.4;
  const forCount = govLeansFor
    ? Math.round(total * (0.5 + margin / 2))
    : Math.round(total * (0.5 - margin / 2));
  return { for: forCount, against: total - forCount };
}
