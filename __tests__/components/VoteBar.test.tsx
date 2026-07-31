import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VoteBar from '@/app/components/VoteBar';

describe('VoteBar', () => {
  it('marks the "for" side as the winner when it leads', () => {
    render(<VoteBar forCount={800} againstCount={200} forLabel="Aye" againstLabel="No" />);
    expect(screen.getByText(/✓ Aye 800/)).toBeInTheDocument();
    expect(screen.getByText(/No 200/)).toBeInTheDocument();
    expect(screen.queryByText(/✓ No/)).not.toBeInTheDocument();
  });

  it('marks the "against" side as the winner when it leads', () => {
    render(<VoteBar forCount={200} againstCount={800} forLabel="Approve" againstLabel="Annul" />);
    expect(screen.getByText(/✓ Annul 800/)).toBeInTheDocument();
    expect(screen.queryByText(/✓ Approve/)).not.toBeInTheDocument();
  });

  it('formats large vote counts', () => {
    render(<VoteBar forCount={18400} againstCount={6200} forLabel="Aye" againstLabel="No" />);
    expect(screen.getByText(/18K/)).toBeInTheDocument();
    expect(screen.getByText(/6K/)).toBeInTheDocument();
  });
});
