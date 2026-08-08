import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VoteTallyTable from '@/app/components/VoteTallyTable';

function setup(overrides: Partial<React.ComponentProps<typeof VoteTallyTable>> = {}) {
  const onVote = vi.fn();
  const utils = render(
    <VoteTallyTable
      title="Test Reform Bill"
      context="bill"
      forLabel="Aye"
      againstLabel="No"
      isOpen
      myVote={null}
      onVote={onVote}
      publicVote={{ for: 100, against: 40 }}
      ai={{ for: 3, against: 1 }}
      gov={{ status: 'pending', scheduledDate: '2026-08-12' }}
      {...overrides}
    />
  );
  return { ...utils, onVote };
}

describe('VoteTallyTable', () => {
  it('renders the three tally columns, in the same order as the board', () => {
    setup();
    const headers = screen.getAllByRole('columnheader').map(h => h.getAttribute('aria-label'));
    expect(headers).toEqual(['Public vote tally', 'AI vote tally', 'Government vote tally']);
  });

  it('names each tally column in words as well as by icon', () => {
    setup();
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Parliament')).toBeInTheDocument();
  });

  it('gives all three headers the same wrapper so they sit on one line', () => {
    const { container } = render(
      <VoteTallyTable
        title="Test Reform Bill" context="bill" forLabel="Aye" againstLabel="No"
        isOpen myVote={null} onVote={() => {}}
        publicVote={{ for: 1, against: 1 }} ai={{ for: 1, against: 1 }} gov={{ status: 'none' }}
      />
    );
    expect(container.querySelectorAll('thead .tally-header')).toHaveLength(3);
  });

  it('offers full-width Aye/No buttons above the table while the vote is open', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Vote Aye on Test Reform Bill' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vote No on Test Reform Bill' })).toBeInTheDocument();
  });

  it('withholds every tally until the citizen has voted', () => {
    setup();
    expect(screen.getAllByText(/Hidden until you vote/i).length).toBe(2);
    expect(screen.queryByText('100')).not.toBeInTheDocument();
    expect(screen.getByText(/Cast your vote above/i)).toBeInTheDocument();
  });

  it('shows the scheduled division date rather than a locked tally while Parliament is pending', () => {
    setup();
    expect(screen.getByText('12/08/2026')).toBeInTheDocument();
  });

  it('counts the citizen into the public tally the moment they vote', () => {
    setup({ myVote: 'for' });
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('casts a vote from the buttons above the table', () => {
    const { onVote } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Vote No on Test Reform Bill' }));
    expect(onVote).toHaveBeenCalledWith('against');
  });

  it('keeps only the chosen button, muted, once a vote is cast', () => {
    setup({ myVote: 'for' });
    expect(screen.getByRole('button', { name: 'You voted Aye on Test Reform Bill' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /^Vote No/ })).not.toBeInTheDocument();
  });

  it('replaces the buttons with a closed note once the window has shut', () => {
    setup({ isOpen: false, closedNote: 'Voting has closed.', gov: { status: 'voted', for: 320, against: 300 } });
    expect(screen.queryByRole('button', { name: /^Vote /i })).not.toBeInTheDocument();
    expect(screen.getByText('Voting has closed.')).toBeInTheDocument();
    expect(screen.getByText('Did not vote')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
  });

  it('switches the column tooltips to the regulation timeline in that context', () => {
    const { container } = render(
      <VoteTallyTable
        title="Test Regulations 2026"
        context="regulation"
        forLabel="Approve"
        againstLabel="Annul"
        isOpen
        myVote={null}
        onVote={() => {}}
        publicVote={{ for: 10, against: 2 }}
        ai={{ for: 3, against: 1 }}
        gov={{ status: 'pending', scheduledDate: null }}
      />
    );
    const tips = Array.from(container.querySelectorAll('.info-tip')).map(el => el.getAttribute('data-tooltip'));
    expect(tips.some(t => t?.includes('laid before Parliament'))).toBe(true);
  });
});
