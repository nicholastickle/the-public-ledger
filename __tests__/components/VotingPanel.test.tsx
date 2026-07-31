import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VotingPanel from '@/app/components/VotingPanel';

describe('VotingPanel', () => {
  it('shows vote buttons when open and not yet voted', () => {
    const onVote = vi.fn();
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted={null} onVote={onVote}
        citizenFor={10} citizenAgainst={5} govFor={300} govAgainst={200} revealed={false}
      />
    );
    expect(screen.getByRole('button', { name: 'Aye' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aye' }));
    expect(onVote).toHaveBeenCalledWith('for');
  });

  it('hides the government tally behind a lock message before voting on an open item', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted={null} onVote={() => {}}
        citizenFor={10} citizenAgainst={5} govFor={300} govAgainst={200} revealed={false}
      />
    );
    expect(screen.queryByText('Parliament')).not.toBeInTheDocument();
    expect(screen.getByText(/Cast your vote above to reveal/i)).toBeInTheDocument();
  });

  it('shows the government tally and a confirmation once voted', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={true} voted="for" onVote={() => {}}
        citizenFor={10} citizenAgainst={5} govFor={300} govAgainst={200} revealed={true}
      />
    );
    expect(screen.getByText(/You voted Aye/i)).toBeInTheDocument();
    expect(screen.getByText('Parliament')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aye' })).not.toBeInTheDocument();
  });

  it('shows a closed note and no vote buttons when voting is closed', () => {
    render(
      <VotingPanel
        forLabel="Aye" againstLabel="No" isOpen={false} voted={null} onVote={() => {}}
        citizenFor={10} citizenAgainst={5} govFor={300} govAgainst={200} revealed={true}
        closedNote="Voting has closed."
      />
    );
    expect(screen.getByText('Voting has closed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aye' })).not.toBeInTheDocument();
    expect(screen.getByText('Parliament')).toBeInTheDocument();
  });
});
