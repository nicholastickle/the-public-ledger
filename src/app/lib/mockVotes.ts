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

export type AiVerdict = 'approve' | 'reject';

export interface AiModelOpinion {
  model: 'Claude' | 'ChatGPT' | 'Gemini' | 'Grok';
  vendor: string;
  color: string;
  verdict: AiVerdict;
  summary: string;
  merits: string;
  problems: string;
}

/** Small deterministic PRNG so the same id always yields the same mock content. */
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

const MODEL_META: Array<Pick<AiModelOpinion, 'model' | 'vendor' | 'color'>> = [
  { model: 'Claude',  vendor: 'Anthropic', color: '#D97757' },
  { model: 'ChatGPT', vendor: 'OpenAI',    color: '#10A37F' },
  { model: 'Gemini',  vendor: 'Google',    color: '#4C8DF6' },
  { model: 'Grok',    vendor: 'xAI',       color: '#8B8F97' },
];

export function generateAiVerdicts(title: string, seed: number): AiModelOpinion[] {
  return MODEL_META.map((meta, i) => {
    const rand = mulberry32(seed * 131 + i * 977);
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
 *  - `voted`   — the division has happened; a tally is available.
 *  - `pending` — Parliament has not voted yet. `scheduledDate` is when it is
 *                expected to (a bill's Second Reading date, or an instrument's
 *                parliamentary deadline), where that is known.
 *  - `none`    — there will be no parliamentary vote (e.g. withdrawn before one).
 */
export interface GovVote {
  status: 'voted' | 'pending' | 'none';
  scheduledDate?: string | null;
  for?: number;
  against?: number;
}

/** Deterministic mock government (parliamentary) division tally, correlated with but distinct from the citizen tally. */
export function mockGovTally(seed: number, citizenFor: number, citizenAgainst: number): { for: number; against: number } {
  const rand = mulberry32(seed * 733 + 17);
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
