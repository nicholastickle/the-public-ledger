import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegulationCard from '@/app/components/cards/RegulationCard';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: string; title: string }): ParliamentRegulation => ({
  enabling_act: 'Card Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-06-01',
  made_date: null,
  deadline: '2026-08-10',
  status: 'pending',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  detail_url: null,
  paper_number: null,
  ...overrides,
});

const OPEN_REG = regAt({ id: '31', title: 'The Card Test Regulations 2026', procedure: 'negative', status: 'pending' });
const CLOSED_REG = regAt({ id: '32', title: 'The Closed Card Regulations 2026', status: 'made', made_date: '2026-05-01' });
const COMMONS_ONLY_REG = regAt({ id: '33', title: 'The Commons-Only Card Regulations 2026', house: 'Commons' });

const noop = () => {};

describe('RegulationCard', () => {
  it('shows the instrument number, status, title and enabling Act', () => {
    render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('No. 31')).toBeInTheDocument();
    expect(screen.getByText('Annul Window Open')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'The Card Test Regulations 2026' })).toBeInTheDocument();
    expect(screen.getByText('Card Test Act 2026')).toBeInTheDocument();
  });

  it('shows the procedure', () => {
    render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('Negative')).toBeInTheDocument();
  });

  it('shows a House badge for each House laid before', () => {
    const { container } = render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    expect(container.querySelectorAll('.house-badge')).toHaveLength(2);
  });

  it('shows a single House badge for an instrument laid before only one House', () => {
    const { container } = render(<RegulationCard reg={COMMONS_ONLY_REG} onSelect={noop} onVote={noop} />);
    expect(container.querySelectorAll('.house-badge')).toHaveLength(1);
  });

  it('renders the same vote-tally table the detail modal uses', () => {
    render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    const headers = screen.getAllByRole('columnheader').map(h => h.getAttribute('aria-label'));
    expect(headers).toEqual(['Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']);
  });

  it('shows the Public and AI tallies even while the vote is open and uncast', () => {
    render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    expect(screen.queryAllByText(/Hidden until you vote/i)).toHaveLength(0);
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it("shows the negative instrument's government column as silent — no prayer, no vote", () => {
    const { container } = render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    expect(container.querySelector('.tally-cell__silent')).toBeInTheDocument();
    expect(screen.getByText('10/08/2026')).toBeInTheDocument();
  });

  it('labels the vote thumbs with the instrument wording on hover', () => {
    render(<RegulationCard reg={OPEN_REG} onSelect={noop} onVote={noop} />);
    expect(screen.getByRole('button', { name: /Vote Approve on The Card Test Regulations 2026/ })).toHaveAttribute('data-tooltip', 'Vote Approve');
    expect(screen.getByRole('button', { name: /Vote Annul on The Card Test Regulations 2026/ })).toHaveAttribute('data-tooltip', 'Vote Annul');
  });

  it('casts a vote without opening the detail modal', () => {
    const onVote = vi.fn();
    const onSelect = vi.fn();
    render(<RegulationCard reg={OPEN_REG} onSelect={onSelect} onVote={onVote} />);
    fireEvent.click(screen.getByRole('button', { name: /^Vote Annul/ }));
    expect(onVote).toHaveBeenCalledWith('against');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows the recorded choice once a vote has been cast', () => {
    const { container } = render(<RegulationCard reg={OPEN_REG} myVote="against" onSelect={noop} onVote={noop} />);
    expect(screen.queryByRole('button', { name: /^Vote Approve/ })).not.toBeInTheDocument();
    expect(container.querySelector('.own-vote--against')).toHaveTextContent('Annul');
  });

  it('opens the detail modal when the card is tapped anywhere', () => {
    const onSelect = vi.fn();
    const { container } = render(<RegulationCard reg={OPEN_REG} onSelect={onSelect} onVote={noop} />);
    fireEvent.click(container.querySelector('.ledger-card')!);
    expect(onSelect).toHaveBeenCalled();
  });

  it('shows "Did not vote" once the window is closed with nothing cast', () => {
    render(<RegulationCard reg={CLOSED_REG} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('Did not vote')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Vote Approve/ })).not.toBeInTheDocument();
  });
});
