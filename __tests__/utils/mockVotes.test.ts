import { describe, it, expect } from 'vitest';
import { generateAiVerdicts, aiAggregate, mockGovTally } from '@/app/lib/mockVotes';

describe('generateAiVerdicts', () => {
  it('returns one opinion per AI model, including Claude, ChatGPT, Gemini, and Grok', () => {
    const opinions = generateAiVerdicts('Test Bill', 1);
    const models = opinions.map(o => o.model);
    expect(models).toEqual(['Claude', 'ChatGPT', 'Gemini', 'Grok']);
  });

  it('is deterministic for the same title and seed', () => {
    const a = generateAiVerdicts('Test Bill', 42);
    const b = generateAiVerdicts('Test Bill', 42);
    expect(a).toEqual(b);
  });

  it('produces different verdicts for different seeds (not all identical)', () => {
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8];
    const firstModelVerdicts = new Set(seeds.map(s => generateAiVerdicts('Test Bill', s)[0].verdict));
    expect(firstModelVerdicts.size).toBeGreaterThan(1);
  });

  it('every opinion includes a summary, a merit, and a problem', () => {
    const opinions = generateAiVerdicts('Test Bill', 7);
    for (const op of opinions) {
      expect(op.summary.length).toBeGreaterThan(0);
      expect(op.merits).toMatch(/^Merit:/);
      expect(op.problems).toMatch(/^Concern:/);
    }
  });
});

describe('aiAggregate', () => {
  it('counts approve and reject verdicts', () => {
    const opinions = generateAiVerdicts('Test Bill', 3);
    const agg = aiAggregate(opinions);
    expect(agg.approve + agg.reject).toBe(opinions.length);
  });
});

describe('mockGovTally', () => {
  it('returns for/against counts that sum to the total membership', () => {
    const tally = mockGovTally(1, 100, 50);
    expect(tally.for + tally.against).toBe(630);
    expect(tally.for).toBeGreaterThan(0);
    expect(tally.against).toBeGreaterThan(0);
  });

  it('is deterministic for the same seed and citizen counts', () => {
    const a = mockGovTally(5, 200, 100);
    const b = mockGovTally(5, 200, 100);
    expect(a).toEqual(b);
  });
});
