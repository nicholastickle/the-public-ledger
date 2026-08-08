import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BillCard from '@/app/components/BillCard';
import type { ParliamentBill } from '@/app/types/parliament';

const billAt = (overrides: Partial<ParliamentBill> & { id: number; short_title: string }): ParliamentBill => ({
  long_title: null,
  originating_house: 'Lords',
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  parliament_last_update: '2026-06-17T08:00:00Z',
  ...overrides,
});

const OPEN_BILL = billAt({ id: 21, short_title: 'Card Test Bill', current_stage_name: 'Second Reading' });
const CLOSED_BILL = billAt({ id: 22, short_title: 'Closed Card Bill', current_stage_name: 'Committee Stage' });

const noop = () => {};

describe('BillCard', () => {
  it('shows the bill number, status and title', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('No. 21')).toBeInTheDocument();
    expect(screen.getByText('Second Reading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Card Test Bill' })).toBeInTheDocument();
  });

  it('never reveals the originating house, only the current one', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.queryByText('Lords')).not.toBeInTheDocument();
    expect(screen.getByText('Commons')).toBeInTheDocument();
  });

  it('renders the same vote-tally table the detail modal uses', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    const headers = screen.getAllByRole('columnheader').map(h => h.getAttribute('aria-label'));
    expect(headers).toEqual(['Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']);
  });

  it('hides the Public and AI tallies behind a lock while the vote is open and uncast', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.getAllByText(/Hidden until you vote/i).length).toBeGreaterThan(0);
  });

  it('shows the expected sitting date before Parliament has voted', () => {
    render(<BillCard bill={OPEN_BILL} votes={{ shadowAyes: 0, shadowNoes: 0, secondReadingDate: '2026-08-12' }} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('12/08/2026')).toBeInTheDocument();
  });

  it('tells the reader which way each thumb votes, on hover', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.getByRole('button', { name: 'Vote Aye on Card Test Bill' })).toHaveAttribute('data-tooltip', 'Vote Aye');
    expect(screen.getByRole('button', { name: 'Vote No on Card Test Bill' })).toHaveAttribute('data-tooltip', 'Vote No');
  });

  it('casts a vote without opening the detail modal', () => {
    const onVote = vi.fn();
    const onSelect = vi.fn();
    render(<BillCard bill={OPEN_BILL} onSelect={onSelect} onVote={onVote} />);
    fireEvent.click(screen.getByRole('button', { name: 'Vote Aye on Card Test Bill' }));
    expect(onVote).toHaveBeenCalledWith('for');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reveals the tallies once a vote has been recorded, and shows the recorded choice', () => {
    const { container } = render(<BillCard bill={OPEN_BILL} myVote="for" onSelect={noop} onVote={noop} />);
    expect(screen.queryAllByText(/Hidden until you vote/i)).toHaveLength(0);
    expect(screen.queryByRole('button', { name: /^Vote /i })).not.toBeInTheDocument();
    expect(container.querySelector('.own-vote--for')).toHaveTextContent('Aye');
  });

  it('opens the detail modal when the card is tapped anywhere', () => {
    const onSelect = vi.fn();
    const { container } = render(<BillCard bill={OPEN_BILL} onSelect={onSelect} onVote={noop} />);
    fireEvent.click(container.querySelector('.ledger-card')!);
    expect(onSelect).toHaveBeenCalled();
  });

  it('opens the detail modal when the title is clicked', () => {
    const onSelect = vi.fn();
    render(<BillCard bill={OPEN_BILL} onSelect={onSelect} onVote={noop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Card Test Bill' }));
    expect(onSelect).toHaveBeenCalled();
  });

  it('shows "Did not vote" once the window is closed with nothing cast', () => {
    render(<BillCard bill={CLOSED_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('Did not vote')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Vote Aye/ })).not.toBeInTheDocument();
  });
});
