import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DepartureBoardSection from '@/app/components/DepartureBoardSection';
import type { ParliamentBill } from '@/app/types/parliament';

const MOCK_BILLS: ParliamentBill[] = [
  {
    id: 101,
    short_title: 'Test Reform Bill',
    long_title: null,
    originating_house: 'Commons',
    current_house: 'Lords',
    current_stage_name: 'Second Reading',
    is_act: false,
    is_defeated: false,
    bill_withdrawn: null,
    parliament_last_update: '2026-06-17T08:00:00Z',
  },
  {
    id: 102,
    short_title: 'Another Test Act',
    long_title: null,
    originating_house: 'Commons',
    current_house: null,
    current_stage_name: 'Royal Assent',
    is_act: true,
    is_defeated: false,
    bill_withdrawn: null,
    parliament_last_update: '2026-06-15T10:00:00Z',
  },
];

describe('DepartureBoardSection', () => {
  it('renders the section heading', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText(/Bills before/i)).toBeInTheDocument();
  });

  it('shows DEMO badge and footer when no live bills provided', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText(/connect the backend for live bills/i)).toBeInTheDocument();
  });

  it('shows demo bill names when no live bills provided', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getAllByText('Employment Rights Bill').length).toBeGreaterThan(0);
  });

  it('renders live bills when provided and hides DEMO badge', () => {
    render(<DepartureBoardSection bills={MOCK_BILLS} />);
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    expect(screen.getAllByText('Test Reform Bill').length).toBeGreaterThan(0);
  });

  it('shows bill count in footer when live bills are provided', () => {
    render(<DepartureBoardSection bills={MOCK_BILLS} />);
    expect(screen.getByText(/2 bills tracked/i)).toBeInTheDocument();
  });

  it('renders "View all →" link pointing to /bills', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByRole('link', { name: /View all/i })).toHaveAttribute('href', '/bills');
  });

  it('shows "Active" status label for non-completed bills', () => {
    render(<DepartureBoardSection bills={MOCK_BILLS} />);
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
  });

  it('shows "Royal Assent" status label for enacted bills', () => {
    render(<DepartureBoardSection bills={MOCK_BILLS} />);
    expect(screen.getAllByText('Royal Assent').length).toBeGreaterThan(0);
  });

  it('renders column headers on desktop', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText('Bill')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('links each bill to its detail page', () => {
    render(<DepartureBoardSection bills={MOCK_BILLS} />);
    const billLinks = screen.getAllByRole('link', { name: /Test Reform Bill/i });
    expect(billLinks[0]).toHaveAttribute('href', '/bills/101');
  });
});
