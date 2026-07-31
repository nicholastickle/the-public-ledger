import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VotingPanel from '@/app/components/VotingPanel';
import type { GovVote } from '@/app/lib/mockVotes';

const GOV_VOTED: GovVote = { status: 'voted', for: 300, against: 200 };
const GOV_PENDING: GovVote = { status: 'pending', scheduledDate: '2026-08-12' };
const GOV_PENDING_TBA: GovVote = { status: 'pending', scheduledDate: null };
const GOV_NONE: GovVote = { status: 'none' };

describe('VotingPanel', () => {
  it('shows vote buttons when open and not yet voted', () => {
    const onVote = vi.fn();
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted={null} onVote={onVote}
        citizen={{ for: 10, against: 5 }} ai={{ for: 3, against: 1 }} gov={GOV_PENDING}
      />
    );
    expect(screen.getByRole('button', { name: 'Aye' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aye' }));
    expect(onVote).toHaveBeenCalledWith('for');
  });

  it('hides the citizen and AI tallies until the citizen votes', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted={null} onVote={() => {}}
        citizen={{ for: 10, against: 5 }} ai={{ for: 3, against: 1 }} gov={GOV_PENDING}
      />
    );
    // No tally numbers of any kind should be on screen before voting.
    expect(screen.queryByText(/Aye 1[01]/)).not.toBeInTheDocument();
    expect(screen.queryByText(/No 5/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Hidden until you vote/i).length).toBe(2);
  });

  it('reveals the citizen tally once voted, counting the new vote', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted="for" onVote={() => {}}
        citizen={{ for: 10, against: 5 }} ai={{ for: 3, against: 1 }} gov={GOV_PENDING}
      />
    );
    expect(screen.getByText(/You voted Aye/i)).toBeInTheDocument();
    expect(screen.getByText(/Aye 11/)).toBeInTheDocument();
    expect(screen.queryByText(/Hidden until you vote/i)).not.toBeInTheDocument();
  });

  it('shows a government-vote-pending indicator with the expected date', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted="for" onVote={() => {}}
        citizen={{ for: 10, against: 5 }} ai={{ for: 3, against: 1 }} gov={GOV_PENDING}
      />
    );
    expect(screen.getByText(/Government vote pending/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Aug 2026/)).toBeInTheDocument();
  });

  it('says the date is to be announced when no government vote date is known', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted="for" onVote={() => {}}
        citizen={{ for: 10, against: 5 }} ai={{ for: 3, against: 1 }} gov={GOV_PENDING_TBA}
      />
    );
    expect(screen.getByText(/Government vote pending/i)).toBeInTheDocument();
    expect(screen.getByText(/to be announced/i)).toBeInTheDocument();
  });

  it('shows the government tally only once Parliament has actually voted', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={false} voted={null} onVote={() => {}}
        citizen={{ for: 10, against: 5 }} ai={{ for: 3, against: 1 }} gov={GOV_VOTED} closedNote="Voting has closed."
      />
    );
    expect(screen.getByText('Voting has closed.')).toBeInTheDocument();
    expect(screen.getByText(/Aye 300/)).toBeInTheDocument();
    expect(screen.queryByText(/Government vote pending/i)).not.toBeInTheDocument();
  });

  it('reports when there will be no parliamentary vote at all', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={false} voted={null} onVote={() => {}}
        citizen={{ for: 0, against: 0 }} ai={{ for: 3, against: 1 }} gov={GOV_NONE} closedNote="Withdrawn."
      />
    );
    expect(screen.getByText(/No parliamentary vote recorded/i)).toBeInTheDocument();
  });
});
