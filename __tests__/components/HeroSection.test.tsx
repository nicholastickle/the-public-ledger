import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroSection from '@/app/components/HeroSection';
import type { Bill } from '@/app/types';

const mockBills: Bill[] = [
  {
    id: 'health-bill',
    title: 'NHS Reform',
    question: 'Should the NHS receive a budget increase?',
    category: 'health',
    yesPercent: 67,
    noPercent: 33,
    totalVotes: 500_000,
    debateDate: '2025-06-12',
    parliamentVote: 'passed',
  },
  {
    id: 'economy-bill',
    title: 'Budget Resolution',
    question: 'Should the autumn budget be approved?',
    category: 'economy',
    yesPercent: 42,
    noPercent: 58,
    totalVotes: 320_000,
    debateDate: '2025-10-01',
    parliamentVote: 'pending',
  },
  {
    id: 'housing-bill',
    title: 'Housing Bill',
    question: 'Should planning restrictions be relaxed?',
    category: 'housing',
    yesPercent: 71,
    noPercent: 29,
    totalVotes: 280_000,
    debateDate: '2025-09-15',
    parliamentVote: 'pending',
  },
];

describe('HeroSection', () => {
  it('renders the live status strip', () => {
    render(<HeroSection bills={mockBills} />);
    expect(screen.getByText(/shadow parliament · live/i)).toBeInTheDocument();
  });

  it('renders bill cards immediately on load', () => {
    render(<HeroSection bills={mockBills} />);
    expect(screen.getByText('Should the NHS receive a budget increase?')).toBeInTheDocument();
  });

  it('renders the Trending tab as active by default', () => {
    render(<HeroSection bills={mockBills} />);
    const trendingBtn = screen.getByRole('button', { name: 'Trending' });
    expect(trendingBtn).toBeInTheDocument();
  });

  it('filters bills by category when a tab is clicked', () => {
    render(<HeroSection bills={mockBills} />);
    fireEvent.click(screen.getByRole('button', { name: 'Health' }));
    expect(screen.getByText('Should the NHS receive a budget increase?')).toBeInTheDocument();
    expect(screen.queryByText('Should the autumn budget be approved?')).not.toBeInTheDocument();
  });

  it('shows "View all bills" link', () => {
    render(<HeroSection bills={mockBills} />);
    expect(screen.getByRole('link', { name: /view all bills/i })).toBeInTheDocument();
  });

  it('shows bill count', () => {
    render(<HeroSection bills={mockBills} />);
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it('shows empty state when category has no bills', () => {
    render(<HeroSection bills={mockBills} />);
    fireEvent.click(screen.getByRole('button', { name: 'Justice' }));
    expect(screen.getByText(/no bills in this category/i)).toBeInTheDocument();
  });
});
