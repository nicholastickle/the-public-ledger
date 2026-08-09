import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OwnVoteCell from '@/app/components/board/OwnVoteCell';

describe('OwnVoteCell', () => {
  it('tells the reader which way each thumb votes, on hover and to a screen reader', () => {
    render(<OwnVoteCell title="Test Reform Bill" isOpen onVote={() => {}} forLabel="Aye" againstLabel="No" />);
    const aye = screen.getByRole('button', { name: 'Vote Aye on Test Reform Bill' });
    const no = screen.getByRole('button', { name: 'Vote No on Test Reform Bill' });
    expect(aye).toHaveAttribute('data-tooltip', 'Vote Aye');
    expect(no).toHaveAttribute('data-tooltip', 'Vote No');
    expect(aye).toHaveClass('vote-tip');
    expect(no).toHaveClass('vote-tip');
  });

  it('follows the surface wording on the regulation board', () => {
    render(<OwnVoteCell title="Test Regulations 2026" isOpen onVote={() => {}} forLabel="Approve" againstLabel="Annul" />);
    expect(screen.getByRole('button', { name: /Vote Approve on/ })).toHaveAttribute('data-tooltip', 'Vote Approve');
    expect(screen.getByRole('button', { name: /Vote Annul on/ })).toHaveAttribute('data-tooltip', 'Vote Annul');
  });

  it('reports the choice without bubbling the click to the surrounding row', () => {
    const onVote = vi.fn();
    const onRowClick = vi.fn();
    render(
      <div onClick={onRowClick}>
        <OwnVoteCell title="Test Reform Bill" isOpen onVote={onVote} forLabel="Aye" againstLabel="No" />
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /Vote Aye on/ }));
    expect(onVote).toHaveBeenCalledWith('for');
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('shows the recorded choice instead of the buttons once cast', () => {
    render(<OwnVoteCell title="Test Reform Bill" isOpen myVote="against" onVote={() => {}} forLabel="Aye" againstLabel="No" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('reads "Did not vote" once the window has shut with nothing cast', () => {
    render(<OwnVoteCell title="Test Reform Bill" isOpen={false} onVote={() => {}} forLabel="Aye" againstLabel="No" />);
    expect(screen.getByText('Did not vote')).toBeInTheDocument();
  });
});
