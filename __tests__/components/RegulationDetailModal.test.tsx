import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegulationDetailModal from '@/app/components/RegulationDetailModal';
import type { ParliamentRegulation } from '@/app/types/parliament';

const PENDING_REG: ParliamentRegulation = {
  id: 1,
  title: 'The Test (Amendment) Regulations 2026',
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-07-01',
  made_date: null,
  deadline: '2026-09-01',
  status: 'pending',
  house: 'Both',
  last_update: '2026-07-01T09:00:00Z',
};

const MADE_REG: ParliamentRegulation = {
  ...PENDING_REG,
  id: 2,
  title: 'The Made Regulations 2026',
  made_date: '2026-06-01',
  status: 'made',
};

describe('RegulationDetailModal', () => {
  it('renders the regulation title and enabling act', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'The Test (Amendment) Regulations 2026' })).toBeInTheDocument();
    expect(screen.getByText(/Test Act 2026/)).toBeInTheDocument();
  });

  it('shows Approve/Annul vote buttons and hides all tallies before voting', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} votes={{ shadowApprove: 50, shadowAnnul: 20 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Annul' })).toBeInTheDocument();
    expect(screen.queryByText(/Approve 50/)).not.toBeInTheDocument();
    expect(screen.getByText(/Cast your vote above to reveal/i)).toBeInTheDocument();
  });

  it('shows a government-vote-pending indicator with the parliamentary deadline', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} votes={{ shadowApprove: 50, shadowAnnul: 20, deadline: '2026-09-01' }} voted="for" onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/Government vote pending/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Sept 2026|1 Sep 2026/)).toBeInTheDocument();
  });

  it('calls onVote with the chosen side', () => {
    const onVote = vi.fn();
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={onVote} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Annul' }));
    expect(onVote).toHaveBeenCalledWith('against');
  });

  it('reveals the citizen tally and AI verdicts once voted', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} votes={{ shadowApprove: 50, shadowAnnul: 20 }} voted="against" onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/Annul 21/)).toBeInTheDocument();
    expect(screen.queryAllByText(/Vote to reveal/i)).toHaveLength(0);
  });

  it('shows no vote buttons for a made instrument and reveals tallies as already-closed record', () => {
    render(<RegulationDetailModal regulation={MADE_REG} votes={{ shadowApprove: 90, shadowAnnul: 10 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
    expect(screen.getByText(/approved — voting has closed/i)).toBeInTheDocument();
    expect(screen.getByText('Parliament')).toBeInTheDocument();
  });
});
