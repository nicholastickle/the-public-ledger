import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BillCard from '@/app/components/BillCard';
import type { Bill } from '@/app/types';

const mockBill: Bill = {
  id: 'test-bill',
  title: 'Test Reform Act',
  question: 'Should the Test Reform Act be passed into law?',
  category: 'education',
  yesPercent: 65,
  noPercent: 35,
  totalVotes: 100_000,
  debateDate: '2026-12-31',
  parliamentVote: 'pending',
};

describe('BillCard', () => {
  it('renders the bill question', () => {
    render(<BillCard bill={mockBill} />);
    expect(screen.getByText('Should the Test Reform Act be passed into law?')).toBeInTheDocument();
  });

  it('renders YES and NO percentages', () => {
    render(<BillCard bill={mockBill} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
  });

  it('renders formatted vote count', () => {
    render(<BillCard bill={mockBill} />);
    expect(screen.getByText('100K votes cast')).toBeInTheDocument();
  });

  it('renders a Vote link pointing to the bill page', () => {
    render(<BillCard bill={mockBill} />);
    const link = screen.getByRole('link', { name: /vote/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/bills/test-bill');
  });

  it('renders the category label in uppercase', () => {
    render(<BillCard bill={mockBill} />);
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
  });

  it('shows "In Session" for pending parliament vote', () => {
    render(<BillCard bill={mockBill} />);
    expect(screen.getByText(/in session/i)).toBeInTheDocument();
  });

  it('shows "Parliament passed" badge when parliament voted passed', () => {
    render(<BillCard bill={{ ...mockBill, parliamentVote: 'passed' }} />);
    expect(screen.getByText(/parliament passed/i)).toBeInTheDocument();
  });

  it('shows "Parliament rejected" badge when parliament voted rejected', () => {
    render(<BillCard bill={{ ...mockBill, parliamentVote: 'rejected' }} />);
    expect(screen.getByText(/parliament rejected/i)).toBeInTheDocument();
  });
});

describe('BillCard feed variant', () => {
  it('renders YES and NO action links', () => {
    render(<BillCard bill={mockBill} variant="feed" />);
    expect(screen.getByRole('link', { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /no/i })).toBeInTheDocument();
  });

  it('YES link points to the bill vote page', () => {
    render(<BillCard bill={mockBill} variant="feed" />);
    expect(screen.getByRole('link', { name: /yes/i })).toHaveAttribute(
      'href',
      '/bills/test-bill?vote=yes',
    );
  });

  it('NO link points to the bill vote page', () => {
    render(<BillCard bill={mockBill} variant="feed" />);
    expect(screen.getByRole('link', { name: /no/i })).toHaveAttribute(
      'href',
      '/bills/test-bill?vote=no',
    );
  });

  it('shows YES and NO percentages in feed variant', () => {
    render(<BillCard bill={mockBill} variant="feed" />);
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
  });

  it('shows vote count in feed variant', () => {
    render(<BillCard bill={mockBill} variant="feed" />);
    expect(screen.getByText('100K votes cast')).toBeInTheDocument();
  });

  it('does not render a Vote → link in feed variant', () => {
    render(<BillCard bill={mockBill} variant="feed" />);
    expect(screen.queryByRole('link', { name: /vote →/i })).not.toBeInTheDocument();
  });
});
