import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AIVotePanel from '@/app/components/AIVotePanel';
import type { AiModelOpinion } from '@/app/lib/mockVotes';

const OPINIONS: AiModelOpinion[] = [
  { model: 'Claude', vendor: 'Anthropic', color: '#D97757', verdict: 'approve', summary: 'Summary A', merits: 'Merit A', problems: 'Problem A' },
  { model: 'Grok', vendor: 'xAI', color: '#8B8F97', verdict: 'reject', summary: 'Summary B', merits: 'Merit B', problems: 'Problem B' },
];

describe('AIVotePanel', () => {
  it('renders every model with its summary, merits, and problems', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.getByText('Claude')).toBeInTheDocument();
    expect(screen.getByText('Grok')).toBeInTheDocument();
    expect(screen.getByText('Summary A')).toBeInTheDocument();
    expect(screen.getByText('Summary B')).toBeInTheDocument();
  });

  it('hides verdict badges behind a lock when not revealed', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={false} />);
    expect(screen.queryByText('Approve')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Vote to reveal/i).length).toBe(OPINIONS.length);
  });

  it('shows each verdict badge once revealed', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('labels the panel as demo commentary', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.getByText(/Demo commentary/i)).toBeInTheDocument();
  });
});
