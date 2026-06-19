import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroBillsFlank from '@/app/components/HeroBillsFlank';
import type { ParliamentBill } from '@/app/types/parliament';

beforeEach(() => {
  vi.useFakeTimers();
  return () => vi.useRealTimers();
});

const makeBill = (overrides: Partial<ParliamentBill> & { id: number }): ParliamentBill => ({
  short_title: null,
  long_title: null,
  originating_house: 'Commons',
  current_house: 'Commons',
  current_stage_name: 'Committee Stage',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  parliament_last_update: null,
  ...overrides,
});

describe('HeroBillsFlank', () => {
  it('renders the "Bills" label', () => {
    render(<HeroBillsFlank bills={[]} />);
    expect(screen.getByText('Bills')).toBeInTheDocument();
  });

  it('falls back to demo data when no bills provided', () => {
    render(<HeroBillsFlank bills={[]} />);
    expect(screen.getByText('14 tracked')).toBeInTheDocument();
  });

  it('shows demo vote stats (↑ / ↓ arrows) in demo mode', () => {
    render(<HeroBillsFlank bills={[]} />);
    // Demo data has vote stats for most bills
    expect(screen.getAllByText(/↑/).length).toBeGreaterThan(0);
  });

  it('shows live bill titles when bills are provided', () => {
    const bills = Array.from({ length: 14 }, (_, i) =>
      makeBill({ id: i + 1, short_title: `Test Bill ${i + 1}` })
    );
    render(<HeroBillsFlank bills={bills} />);
    expect(screen.getByText('Test Bill 1')).toBeInTheDocument();
  });

  it('shows "Royal Assent" label for enacted bills', () => {
    const bills = Array.from({ length: 14 }, (_, i) =>
      makeBill({ id: i + 1, short_title: `Bill ${i + 1}`, is_act: i === 0 })
    );
    render(<HeroBillsFlank bills={bills} />);
    expect(screen.getByText('Royal Assent')).toBeInTheDocument();
  });

  it('marks bills at 1st/2nd reading as "Voting open"', () => {
    const bills = Array.from({ length: 14 }, (_, i) =>
      makeBill({ id: i + 1, short_title: `Bill ${i + 1}`, current_stage_name: 'Second Reading' })
    );
    render(<HeroBillsFlank bills={bills} />);
    expect(screen.getAllByText('Voting open').length).toBeGreaterThan(0);
  });
});
