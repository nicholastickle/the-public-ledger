import { describe, it, expect } from 'vitest';
import { bills, featuredBills, activityFeed } from '@/app/data';

describe('bills data integrity', () => {
  it('every bill has all required fields', () => {
    for (const bill of bills) {
      expect(bill.id).toBeTruthy();
      expect(bill.title).toBeTruthy();
      expect(bill.question).toBeTruthy();
      expect(bill.category).toBeTruthy();
      expect(typeof bill.yesPercent).toBe('number');
      expect(typeof bill.noPercent).toBe('number');
      expect(typeof bill.totalVotes).toBe('number');
      expect(bill.debateDate).toBeTruthy();
    }
  });

  it('yes and no percentages sum to 100 for every bill', () => {
    for (const bill of bills) {
      expect(bill.yesPercent + bill.noPercent).toBe(100);
    }
  });

  it('percentages are in the range 0–100', () => {
    for (const bill of bills) {
      expect(bill.yesPercent).toBeGreaterThanOrEqual(0);
      expect(bill.yesPercent).toBeLessThanOrEqual(100);
      expect(bill.noPercent).toBeGreaterThanOrEqual(0);
      expect(bill.noPercent).toBeLessThanOrEqual(100);
    }
  });

  it('bill ids are unique', () => {
    const ids = bills.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('totalVotes is positive for every bill', () => {
    for (const bill of bills) {
      expect(bill.totalVotes).toBeGreaterThan(0);
    }
  });

  it('parliamentVote is a valid value when present', () => {
    const valid = ['passed', 'rejected', 'pending'];
    for (const bill of bills) {
      if (bill.parliamentVote !== undefined) {
        expect(valid).toContain(bill.parliamentVote);
      }
    }
  });

  it('featuredBills are a subset of bills', () => {
    const allIds = new Set(bills.map((b) => b.id));
    for (const b of featuredBills) {
      expect(allIds.has(b.id)).toBe(true);
    }
  });

  it('there are at least 3 featured bills for the hero', () => {
    expect(featuredBills.length).toBeGreaterThanOrEqual(3);
  });
});

describe('activity feed integrity', () => {
  it('every activity item has all required fields', () => {
    for (const item of activityFeed) {
      expect(item.id).toBeTruthy();
      expect(item.user).toBeTruthy();
      expect(['YES', 'NO']).toContain(item.position);
      expect(item.bill).toBeTruthy();
      expect(item.timestamp).toBeTruthy();
    }
  });

  it('activity item ids are unique', () => {
    const ids = activityFeed.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
