import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BillCard from '@/app/components/cards/BillCard';
import type { ParliamentBill } from '@/app/types/parliament';

const billAt = (overrides: Partial<ParliamentBill> & { id: number; short_title: string }): ParliamentBill => ({
  long_title: null,
  originating_house: 'Lords',
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  detail_url: null,
  parliament_last_update: '2026-06-17T08:00:00Z',
  ...overrides,
});

const OPEN_BILL = billAt({ id: 21, short_title: 'Card Test Bill', current_stage_name: 'Second Reading' });
const CLOSED_BILL = billAt({ id: 22, short_title: 'Closed Card Bill', current_stage_name: 'Royal Assent', is_act: true, current_house: null });

const noop = () => {};

describe('BillCard', () => {
  it('shows the bill number, status and title', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('No. 21')).toBeInTheDocument();
    expect(screen.getByText('Second Reading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Card Test Bill' })).toBeInTheDocument();
  });

  it('shows both the originating House badge and the current House', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('Lords', { selector: '.sr-only' })).toBeInTheDocument();
    expect(screen.getByText('Commons')).toBeInTheDocument();
  });

  it('renders the same vote-tally table the detail modal uses', () => {
    render(<BillCard bill={OPEN_BILL} onSelect={noop} onVote={noop} />);
    const headers = screen.getAllByRole('columnheader').map(h => h.getAttribute('aria-label'));
    expect(headers).toEqual(['Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']);
  });

  it('shows the Public and AI tallies even while the vote is open and uncast', () => {
    render(<BillCard bill={OPEN_BILL} votes={{ shadowAyes: 40, shadowNoes: 10 }} onSelect={noop} onVote={noop} />);
    expect(screen.queryAllByText(/Hidden until you vote/i)).toHaveLength(0);
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('shows "—" for the Government column at First Reading, with no prior stage to report', () => {
    const bill = billAt({ id: 25, short_title: 'First Reading Card Bill', current_stage_name: 'First Reading' });
    render(<BillCard bill={bill} onSelect={noop} onVote={noop} />);
    expect(screen.getByText('—')).toBeInTheDocument();
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
