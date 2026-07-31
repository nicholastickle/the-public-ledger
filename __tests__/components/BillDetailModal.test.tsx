import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BillDetailModal from '@/app/components/BillDetailModal';
import type { ParliamentBill } from '@/app/types/parliament';

const OPEN_BILL: ParliamentBill = {
  id: 1,
  short_title: 'Test Reform Bill',
  long_title: null,
  originating_house: 'Lords',
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  parliament_last_update: '2026-07-01T09:00:00Z',
};

const ENACTED_BILL: ParliamentBill = {
  ...OPEN_BILL,
  id: 2,
  short_title: 'Test Enacted Act',
  current_stage_name: 'Royal Assent',
  is_act: true,
  current_house: null,
};

describe('BillDetailModal', () => {
  it('renders the bill title and never reveals the originating house', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Test Reform Bill' })).toBeInTheDocument();
    expect(screen.queryByText('Lords')).not.toBeInTheDocument();
  });

  it('renders a horizontal progress timeline covering every stage', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const timeline = screen.getByRole('list', { name: /legislative progress/i });
    expect(timeline).toBeInTheDocument();
    expect(screen.getAllByText('Second Reading').length).toBeGreaterThan(0);
    expect(screen.getByText('Royal Assent')).toBeInTheDocument();
  });

  it('shows vote buttons for an open bill and keeps Parliament/AI verdicts hidden before voting', () => {
    render(<BillDetailModal bill={OPEN_BILL} votes={{ shadowAyes: 100, shadowNoes: 40 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Aye' })).toBeInTheDocument();
    expect(screen.queryByText('Parliament')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Vote to reveal/i).length).toBeGreaterThan(0);
  });

  it('calls onVote when a vote button is clicked', () => {
    const onVote = vi.fn();
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={onVote} onClose={onVote} />);
    fireEvent.click(screen.getByRole('button', { name: 'Aye' }));
    expect(onVote).toHaveBeenCalledWith('for');
  });

  it('reveals Parliament and AI verdicts once the citizen has voted', () => {
    render(<BillDetailModal bill={OPEN_BILL} votes={{ shadowAyes: 100, shadowNoes: 40 }} voted="for" onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('Parliament')).toBeInTheDocument();
    expect(screen.queryAllByText(/Vote to reveal/i)).toHaveLength(0);
  });

  it('shows no vote buttons for an enacted bill and reveals tallies as already-closed record', () => {
    render(<BillDetailModal bill={ENACTED_BILL} votes={{ shadowAyes: 500, shadowNoes: 90 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Aye' })).not.toBeInTheDocument();
    expect(screen.getByText(/Royal Assent — voting has closed/i)).toBeInTheDocument();
    expect(screen.getByText('Parliament')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
