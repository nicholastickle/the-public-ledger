import { describe, it, expect } from 'vitest';
import { formatVotes, formatBillDate, formatTimeAgo, formatCountdown, clipText } from '@/app/lib/utils';

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

describe('formatCountdown', () => {
  it('returns "closes TBD" when no date is given', () => {
    expect(formatCountdown(null, 'closed')).toBe('closes TBD');
    expect(formatCountdown(undefined, 'closed')).toBe('closes TBD');
  });

  it('returns the closedLabel when the date has already passed', () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    expect(formatCountdown(past, 'vote closed')).toBe('vote closed');
  });

  it('returns a minute countdown for imminent deadlines', () => {
    // +2s buffer so a slow test runner can't shave the minute down by the
    // time formatCountdown re-reads Date.now() internally.
    const soon = new Date(Date.now() + 5 * 60_000 + 2_000).toISOString();
    expect(formatCountdown(soon, 'closed')).toBe('closes in 5m');
  });

  it('returns an hour countdown within the same day', () => {
    const soon = new Date(Date.now() + 3 * 3_600_000 + 2_000).toISOString();
    expect(formatCountdown(soon, 'closed')).toBe('closes in 3h');
  });

  it('returns a day/hour countdown under two weeks out', () => {
    const soon = new Date(Date.now() + 2 * 86_400_000 + 3_600_000 + 2_000).toISOString();
    expect(formatCountdown(soon, 'closed')).toBe('closes in 2d 1h');
  });

  it('returns a calendar date for deadlines two weeks or more away', () => {
    const future = new Date(Date.now() + 20 * 86_400_000);
    const expected = `closes ${future.getDate()} ${future.toLocaleString('en-GB', { month: 'short' })}`;
    expect(formatCountdown(future.toISOString(), 'closed')).toBe(expected);
  });
});

describe('clipText', () => {
  it('returns an em dash for null input', () => {
    expect(clipText(null, 10)).toBe('—');
  });

  it('returns the string unchanged when within the limit', () => {
    expect(clipText('Short title', 20)).toBe('Short title');
  });

  it('truncates with an ellipsis when over the limit', () => {
    expect(clipText('This is a much longer title than allowed', 12)).toBe('This is a m…');
  });
});
