import { describe, it, expect } from 'vitest';
import { formatVotes, formatBillDate, formatTimeAgo } from '@/app/lib/utils';

describe('formatVotes', () => {
  it('formats millions with one decimal', () => {
    expect(formatVotes(1_000_000)).toBe('1.0M');
    expect(formatVotes(2_400_000)).toBe('2.4M');
  });

  it('formats thousands with no decimal', () => {
    expect(formatVotes(100_000)).toBe('100K');
    expect(formatVotes(50_000)).toBe('50K');
    expect(formatVotes(1_000)).toBe('1K');
  });

  it('formats sub-thousand amounts as-is', () => {
    expect(formatVotes(500)).toBe('500');
    expect(formatVotes(0)).toBe('0');
  });
});

describe('formatBillDate', () => {
  it('formats a date in en-GB locale', () => {
    expect(formatBillDate('2025-03-18')).toBe('18 Mar 2025');
  });

  it('handles year boundaries correctly', () => {
    expect(formatBillDate('2026-01-01')).toBe('1 Jan 2026');
  });
});

describe('formatTimeAgo', () => {
  it('returns "just now" for timestamps under 1 minute ago', () => {
    const recent = new Date(Date.now() - 30_000).toISOString();
    expect(formatTimeAgo(recent)).toBe('just now');
  });

  it('returns minutes ago for timestamps within an hour', () => {
    const past = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(formatTimeAgo(past)).toBe('5m ago');
  });

  it('returns hours ago for timestamps within a day', () => {
    const past = new Date(Date.now() - 2 * 3_600_000).toISOString();
    expect(formatTimeAgo(past)).toBe('2h ago');
  });

  it('returns days ago for older timestamps', () => {
    const past = new Date(Date.now() - 3 * 86_400_000).toISOString();
    expect(formatTimeAgo(past)).toBe('3d ago');
  });
});
