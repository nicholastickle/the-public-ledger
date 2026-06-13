import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarketCard from '@/app/components/MarketCard';
import type { Market } from '@/app/types';

const mockMarket: Market = {
  id: 'test-market',
  question: 'Will the test pass?',
  category: 'science',
  yesPrice: 65,
  noPrice: 35,
  volume: 100_000,
  endsAt: '2026-12-31',
};

describe('MarketCard', () => {
  it('renders the market question', () => {
    render(<MarketCard market={mockMarket} />);
    expect(screen.getByText('Will the test pass?')).toBeInTheDocument();
  });

  it('renders YES and NO probabilities', () => {
    render(<MarketCard market={mockMarket} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
  });

  it('renders formatted volume', () => {
    render(<MarketCard market={mockMarket} />);
    expect(screen.getByText('$100K vol')).toBeInTheDocument();
  });

  it('renders a Trade link pointing to the market page', () => {
    render(<MarketCard market={mockMarket} />);
    const link = screen.getByRole('link', { name: /trade/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/markets/test-market');
  });

  it('renders the category label in uppercase', () => {
    render(<MarketCard market={mockMarket} />);
    expect(screen.getByText('SCIENCE')).toBeInTheDocument();
  });

  it('renders the market question as a heading in featured variant', () => {
    render(<MarketCard market={mockMarket} variant="featured" />);
    expect(screen.getByRole('heading', { name: 'Will the test pass?' })).toBeInTheDocument();
  });
});
