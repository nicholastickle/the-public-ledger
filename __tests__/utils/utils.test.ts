import { describe, it, expect } from 'vitest';
import { formatVolume, formatMarketEnd, formatTimeAgo } from '@/app/lib/utils';

describe('formatVolume', () => {
  it('formats millions with one decimal', () => {
    expect(formatVolume(1_000_000)).toBe('$1.0M');
    expect(formatVolume(2_400_000)).toBe('$2.4M');
    expect(formatVolume(4_200_000)).toBe('$4.2M');
  });

  it('formats thousands with no decimal', () => {
    expect(formatVolume(100_000)).toBe('$100K');
    expect(formatVolume(50_000)).toBe('$50K');
    expect(formatVolume(1_000)).toBe('$1K');
  });

  it('formats sub-thousand amounts as-is', () => {
    expect(formatVolume(500)).toBe('$500');
    expect(formatVolume(0)).toBe('$0');
  });
});

describe('formatMarketEnd', () => {
  it('returns "Ended" for past dates', () => {
    expect(formatMarketEnd('2020-01-01')).toBe('Ended');
    expect(formatMarketEnd('2000-06-15')).toBe('Ended');
  });

  it('returns days remaining for dates within 30 days', () => {
    const future = new Date(Date.now() + 10 * 86_400_000).toISOString();
    expect(formatMarketEnd(future)).toBe('10d left');
  });

  it('returns months remaining for dates beyond 30 days', () => {
    const future = new Date(Date.now() + 90 * 86_400_000).toISOString();
    expect(formatMarketEnd(future)).toBe('3mo left');
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
