import { describe, it, expect } from 'vitest';
import { generateAiVerdicts, aiAggregate, mockRegulationDivision, mockPrayerTabled } from '@/app/lib/mockVotes';

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

describe('mockRegulationDivision', () => {
  it('never returns "nod" for an annulled outcome — annulment requires a carried division', () => {
    for (let seed = 0; seed < 50; seed++) {
      expect(mockRegulationDivision(seed, 'annulled').status).toBe('voted');
    }
  });

  it('an annulled division has more against than for', () => {
    const div = mockRegulationDivision(3, 'annulled');
    expect(div.against!).toBeGreaterThan(div.for!);
  });

  it('a voted approval has more for than against', () => {
    // Seed chosen (by trial) to fall into the "voted" branch rather than "nod".
    let seed = 0;
    while (mockRegulationDivision(seed, 'approved').status !== 'voted') seed++;
    const div = mockRegulationDivision(seed, 'approved');
    expect(div.for!).toBeGreaterThan(div.against!);
  });

  it('is deterministic for the same seed and outcome', () => {
    expect(mockRegulationDivision(5, 'approved')).toEqual(mockRegulationDivision(5, 'approved'));
  });

  it('a "voted" division sums to the total membership; "nod" carries no counts', () => {
    for (let seed = 0; seed < 20; seed++) {
      const div = mockRegulationDivision(seed, 'approved');
      if (div.status === 'voted') {
        expect(div.for! + div.against!).toBe(630);
      } else {
        expect(div.for).toBeUndefined();
      }
    }
  });
});

describe('mockPrayerTabled', () => {
  it('is deterministic for the same seed', () => {
    expect(mockPrayerTabled(9)).toBe(mockPrayerTabled(9));
  });

  it('is true for only a minority of seeds — a prayer is the exception, not the rule', () => {
    const seeds = Array.from({ length: 200 }, (_, i) => i);
    const tabled = seeds.filter(mockPrayerTabled).length;
    expect(tabled).toBeLessThan(seeds.length * 0.3);
    expect(tabled).toBeGreaterThan(0);
  });
});
