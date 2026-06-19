import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DepartureBoardSection from '@/app/components/DepartureBoardSection';
import type { ParliamentBill } from '@/app/types/parliament';

const billAt = (overrides: Partial<ParliamentBill> & { id: number; short_title: string }): ParliamentBill => ({
  long_title: null,
  originating_house: 'Commons',
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  parliament_last_update: '2026-06-17T08:00:00Z',
  ...overrides,
});

const SECOND_READING_BILL = billAt({ id: 101, short_title: 'Test Reform Bill', current_stage_name: 'Second Reading' });
const ASSENTED_BILL       = billAt({ id: 102, short_title: 'Another Test Act',  current_stage_name: 'Royal Assent', is_act: true, current_house: null });
const COMMITTEE_BILL      = billAt({ id: 103, short_title: 'Committee Stage Bill', current_stage_name: 'Committee Stage' });

describe('DepartureBoardSection', () => {
  it('renders the section heading', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText(/The Bill Board/i)).toBeInTheDocument();
  });

  it('shows DEMO badge and footer message when no live bills provided', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText(/connect the backend for live bills/i)).toBeInTheDocument();
  });

  it('populates the board with demo bills when no live data', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getAllByText('Employment Rights Bill').length).toBeGreaterThan(0);
  });

  it('renders live bills and hides DEMO badge when bills are provided', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    expect(screen.getAllByText('Test Reform Bill').length).toBeGreaterThan(0);
  });

  it('shows bill count in footer when live bills are provided', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL, ASSENTED_BILL]} />);
    expect(screen.getByText(/2 bills tracked/i)).toBeInTheDocument();
  });

  it('renders "View all →" link pointing to /bills', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByRole('link', { name: /View all/i })).toHaveAttribute('href', '/bills');
  });

  it('shows column headers: Bill, Public Vote, Gov. Vote, Status', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getAllByText('Bill').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Public Vote').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gov. Vote').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
  });

  it('shows "Vote →" button for bills at First or Second Reading', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    expect(screen.getAllByText('Vote →').length).toBeGreaterThan(0);
  });

  it('does not show "Vote →" for bills past Second Reading', () => {
    render(<DepartureBoardSection bills={[COMMITTEE_BILL]} />);
    expect(screen.queryByText('Vote →')).not.toBeInTheDocument();
  });

  it('shows "Royal Assent" status for enacted bills with no vote button', () => {
    render(<DepartureBoardSection bills={[ASSENTED_BILL]} />);
    expect(screen.getAllByText('Royal Assent').length).toBeGreaterThan(0);
    expect(screen.queryByText('Cast Vote')).not.toBeInTheDocument();
  });

  it('links each bill row to its detail page', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    const links = screen.getAllByRole('link', { name: /Test Reform Bill/i });
    expect(links[0]).toHaveAttribute('href', '/bills/101');
  });
});
