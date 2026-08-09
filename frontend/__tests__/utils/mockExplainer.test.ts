import { describe, it, expect } from 'vitest';
import { generateExplainer } from '@/app/lib/mockExplainer';

describe('generateExplainer', () => {
  it('returns the same paragraphs for the same id every time', () => {
    expect(generateExplainer('Test Reform Bill', 7)).toEqual(generateExplainer('Test Reform Bill', 7));
  });

  it('gives different items different copy', () => {
    const a = generateExplainer('Test Reform Bill', 7).join(' ');
    const b = generateExplainer('Other Bill', 12).join(' ');
    expect(a).not.toEqual(b);
  });

  it('opens with a standalone paragraph naming the measure', () => {
    const [first] = generateExplainer('Test Reform Bill', 3);
    expect(first).toContain('Test Reform Bill');
    expect(first.length).toBeGreaterThan(80);
  });

  it('returns several paragraphs so there is something behind the read-more', () => {
    expect(generateExplainer('Test Reform Bill', 3).length).toBeGreaterThan(1);
  });

  it('never names a sponsor, party or originating House', () => {
    const banned = /\b(sponsor|sponsored|party|Labour|Conservative|Liberal Democrat|Reform UK|Green Party|minister for|introduced by|brought forward by|originating house)\b/i;
    for (let id = 1; id <= 60; id++) {
      expect(generateExplainer(`Bill ${id}`, id).join(' ')).not.toMatch(banned);
    }
  });
});
