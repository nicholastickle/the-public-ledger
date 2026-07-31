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

  it('shows large vote counts in full, never abbreviated', () => {
    render(<VoteBar forCount={18400} againstCount={6200} forLabel="Aye" againstLabel="No" />);
    expect(screen.getByText(/18,400/)).toBeInTheDocument();
    expect(screen.getByText(/6,200/)).toBeInTheDocument();
    expect(screen.queryByText(/18K/)).not.toBeInTheDocument();
  });
});
