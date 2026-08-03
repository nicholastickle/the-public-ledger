import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AIVotePanel from '@/app/components/AIVotePanel';
import type { AiModelOpinion } from '@/app/lib/mockVotes';

const OPINIONS: AiModelOpinion[] = [
  { model: 'Claude', modelVersion: 'Claude Opus 5', vendor: 'Anthropic', color: '#D97757', verdict: 'approve', summary: 'Summary A', merits: 'Merit A', problems: 'Problem A' },
  { model: 'Grok', modelVersion: 'Grok 4.1', vendor: 'xAI', color: '#8B8F97', verdict: 'reject', summary: 'Summary B', merits: 'Merit B', problems: 'Problem B' },
];

describe('AIVotePanel', () => {
  it('renders every model with its summary, merits, and problems', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.getByText('Anthropic · Claude')).toBeInTheDocument();
    expect(screen.getByText('xAI · Grok')).toBeInTheDocument();
    expect(screen.getByText('Summary A')).toBeInTheDocument();
    expect(screen.getByText('Summary B')).toBeInTheDocument();
  });

  it('names the exact model version that cast each verdict', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.getByText('Claude Opus 5')).toBeInTheDocument();
    expect(screen.getByText('Grok 4.1')).toBeInTheDocument();
  });

  it('lays the panel out as a wrapping grid rather than a horizontal scroller', () => {
    const { container } = render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(container.querySelector('.ai-panel-grid')).toBeInTheDocument();
    expect(container.querySelector('.ai-panel-scroll')).not.toBeInTheDocument();
  });

  it('shows a vendor logo mark on every card', () => {
    const { container } = render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(container.querySelectorAll('.ai-panel-card__logo svg')).toHaveLength(OPINIONS.length);
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

  it('offers a way to audit every verdict against the prompt and the reply', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.getAllByRole('button', { name: /System prompt/i })).toHaveLength(OPINIONS.length);
    expect(screen.getAllByRole('button', { name: /Model response/i })).toHaveLength(OPINIONS.length);
  });

  it('carries no demo-commentary strapline', () => {
    render(<AIVotePanel opinions={OPINIONS} revealed={true} />);
    expect(screen.queryByText(/Demo commentary/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});
