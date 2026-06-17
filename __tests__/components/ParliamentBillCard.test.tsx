import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ParliamentBillCard from '@/app/components/ParliamentBillCard';
import type { ParliamentBill } from '@/app/types/parliament';

const mockBill: ParliamentBill = {
  id: 3737,
  short_title: "Renters' Rights Bill",
  long_title: "A bill to improve the rights of renters.",
  originating_house: 'Commons',
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  parliament_last_update: '2024-11-12T10:00:00',
};

describe('ParliamentBillCard', () => {
  it('renders the bill title', () => {
    render(<ParliamentBillCard bill={mockBill} />);
    expect(screen.getByText("Renters' Rights Bill")).toBeInTheDocument();
  });

  it('renders the current house', () => {
    render(<ParliamentBillCard bill={mockBill} />);
    expect(screen.getByText('Commons')).toBeInTheDocument();
  });

  it('renders the current stage', () => {
    render(<ParliamentBillCard bill={mockBill} />);
    expect(screen.getByText('Second Reading')).toBeInTheDocument();
  });

  it('renders a View link pointing to the bill detail page', () => {
    render(<ParliamentBillCard bill={mockBill} />);
    const link = screen.getByRole('link', { name: /view/i });
    expect(link).toHaveAttribute('href', '/bills/3737');
  });

  it('shows Active status for non-act, non-defeated, non-withdrawn bills', () => {
    render(<ParliamentBillCard bill={mockBill} />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it('shows Act status when is_act is true', () => {
    render(<ParliamentBillCard bill={{ ...mockBill, is_act: true }} />);
    expect(screen.getByText(/act/i)).toBeInTheDocument();
  });

  it('shows Defeated status when is_defeated is true', () => {
    render(<ParliamentBillCard bill={{ ...mockBill, is_defeated: true }} />);
    expect(screen.getByText(/defeated/i)).toBeInTheDocument();
  });

  it('shows Withdrawn status when bill_withdrawn is set', () => {
    render(<ParliamentBillCard bill={{ ...mockBill, bill_withdrawn: '2024-06-01T00:00:00' }} />);
    expect(screen.getByText(/withdrawn/i)).toBeInTheDocument();
  });

  it('falls back to originating_house when current_house is null', () => {
    render(<ParliamentBillCard bill={{ ...mockBill, current_house: null }} />);
    expect(screen.getByText('Commons')).toBeInTheDocument();
  });
});
