import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegulationBoardSection from '@/app/components/RegulationBoardSection';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: number; title: string }): ParliamentRegulation => ({
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-06-01',
  made_date: null,
  deadline: '2026-08-10',
  status: 'pending',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  ...overrides,
});

const PENDING_NEG = regAt({ id: 1, title: 'The Test (Amendment) Regulations 2026', procedure: 'negative', status: 'pending' });
const PENDING_AFF = regAt({ id: 2, title: 'The Affirmative Test Regulations 2026', procedure: 'affirmative', status: 'pending' });
const MADE_REG    = regAt({ id: 3, title: 'The Made Regulations 2026', status: 'made', made_date: '2026-05-01' });
const ANNULLED    = regAt({ id: 4, title: 'The Annulled Regulations 2026', status: 'annulled' });

describe('RegulationBoardSection', () => {
  it('renders the section heading', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByText(/The Regulation Board/i)).toBeInTheDocument();
  });

  it('shows DEMO badge and footer message when no live data provided', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText(/connect the backend for live regulations/i)).toBeInTheDocument();
  });

  it('populates the board with demo regulations when no live data', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getAllByText(/National Minimum Wage/i).length).toBeGreaterThan(0);
  });

  it('renders live regulations and hides DEMO badge when data is provided', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    expect(screen.getAllByText(/The Test \(Amendment\) Regulations 2026/i).length).toBeGreaterThan(0);
  });

  it('shows regulation count in footer when live data is provided', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG, MADE_REG]} />);
    expect(screen.getByText(/2 regulations tracked/i)).toBeInTheDocument();
  });

  it('renders "View all →" link pointing to /regulations', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByRole('link', { name: /View all/i })).toHaveAttribute('href', '/regulations');
  });

  it('shows column headers: Regulation, Public Vote, Procedure, Status', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getAllByText('Regulation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Public Vote').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Procedure').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
  });

  it('shows "Approve / Annul" sub-label in column header', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getAllByText('Approve / Annul').length).toBeGreaterThan(0);
  });

  it('shows "Vote →" button for pending regulations', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.getAllByText('Vote →').length).toBeGreaterThan(0);
  });

  it('does not show "Vote →" for made regulations', () => {
    render(<RegulationBoardSection regulations={[MADE_REG]} />);
    expect(screen.queryByText('Vote →')).not.toBeInTheDocument();
  });

  it('shows "Made" status for made regulations', () => {
    render(<RegulationBoardSection regulations={[MADE_REG]} />);
    expect(screen.getAllByText('Made').length).toBeGreaterThan(0);
  });

  it('shows "Annulled" status for annulled regulations', () => {
    render(<RegulationBoardSection regulations={[ANNULLED]} />);
    expect(screen.getAllByText('Annulled').length).toBeGreaterThan(0);
  });

  it('shows "Negative" procedure badge for negative SIs', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.getAllByText(/Negative/i).length).toBeGreaterThan(0);
  });

  it('shows "Affirmative" procedure badge for affirmative SIs', () => {
    render(<RegulationBoardSection regulations={[PENDING_AFF]} />);
    expect(screen.getAllByText(/Affirmative/i).length).toBeGreaterThan(0);
  });

  it('shows "Annul Window Open" phase group for pending negative SIs', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.getAllByText(/Annul Window Open/i).length).toBeGreaterThan(0);
  });

  it('shows "Pending Approval" phase group for pending affirmative SIs', () => {
    render(<RegulationBoardSection regulations={[PENDING_AFF]} />);
    expect(screen.getAllByText(/Pending Approval/i).length).toBeGreaterThan(0);
  });

  it('links each regulation row to its detail page', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    const links = screen.getAllByRole('link', { name: /The Test \(Amendment\) Regulations 2026/i });
    expect(links[0]).toHaveAttribute('href', '/regulations/1');
  });

  it('shows "Voting open" when vote is open', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.getAllByText(/Voting open/i).length).toBeGreaterThan(0);
  });
});
