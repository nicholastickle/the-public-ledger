import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VoteCountdown, { getRemaining } from '@/app/components/hero/VoteCountdown';

describe('getRemaining', () => {
  it('breaks a positive diff into days/hours/mins/secs', () => {
    const now = 0;
    const target = (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000;
    expect(getRemaining(target, now)).toEqual({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      done: false,
    });
  });

  it('marks done when the target has passed', () => {
    expect(getRemaining(1000, 5000)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      done: true,
    });
  });

  it('marks done exactly at the target moment', () => {
    expect(getRemaining(1000, 1000).done).toBe(true);
  });
});

describe('VoteCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-29T20:00:00+01:00')); // one day before
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the four unit labels while counting down', () => {
    render(<VoteCountdown />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Mins')).toBeInTheDocument();
    expect(screen.getByText('Secs')).toBeInTheDocument();
  });

  it('shows one day remaining the day before the vote', () => {
    render(<VoteCountdown />);
    // 01 day, and the unit tiles are zero-padded to two digits
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('shows the live message once the target has passed', () => {
    vi.setSystemTime(new Date('2026-10-01T00:00:00+01:00'));
    render(<VoteCountdown />);
    expect(screen.getByText(/live/i)).toBeInTheDocument();
    expect(screen.queryByText('Days')).not.toBeInTheDocument();
  });
});
