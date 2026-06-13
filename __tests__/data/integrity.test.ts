import { describe, it, expect } from 'vitest';
import { markets, featuredMarkets, activityFeed } from '@/app/data';

describe('markets data integrity', () => {
  it('every market has all required fields', () => {
    for (const market of markets) {
      expect(market.id).toBeTruthy();
      expect(market.question).toBeTruthy();
      expect(market.category).toBeTruthy();
      expect(typeof market.yesPrice).toBe('number');
      expect(typeof market.noPrice).toBe('number');
      expect(typeof market.volume).toBe('number');
      expect(market.endsAt).toBeTruthy();
    }
  });

  it('yes and no prices sum to 100 for every market', () => {
    for (const market of markets) {
      expect(market.yesPrice + market.noPrice).toBe(100);
    }
  });

  it('prices are in the range 0–100', () => {
    for (const market of markets) {
      expect(market.yesPrice).toBeGreaterThanOrEqual(0);
      expect(market.yesPrice).toBeLessThanOrEqual(100);
      expect(market.noPrice).toBeGreaterThanOrEqual(0);
      expect(market.noPrice).toBeLessThanOrEqual(100);
    }
  });

  it('market ids are unique', () => {
    const ids = markets.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('volume is positive for every market', () => {
    for (const market of markets) {
      expect(market.volume).toBeGreaterThan(0);
    }
  });

  it('featuredMarkets are a subset of markets', () => {
    const allIds = new Set(markets.map((m) => m.id));
    for (const m of featuredMarkets) {
      expect(allIds.has(m.id)).toBe(true);
    }
  });

  it('there are at least 3 featured markets for the hero', () => {
    expect(featuredMarkets.length).toBeGreaterThanOrEqual(3);
  });
});

describe('activity feed integrity', () => {
  it('every activity item has all required fields', () => {
    for (const item of activityFeed) {
      expect(item.id).toBeTruthy();
      expect(item.user).toBeTruthy();
      expect(['YES', 'NO']).toContain(item.position);
      expect(item.market).toBeTruthy();
      expect(typeof item.amount).toBe('number');
      expect(item.timestamp).toBeTruthy();
    }
  });

  it('activity item ids are unique', () => {
    const ids = activityFeed.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('activity amounts are positive', () => {
    for (const item of activityFeed) {
      expect(item.amount).toBeGreaterThan(0);
    }
  });
});
