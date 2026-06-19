import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroFlankPanel, { type FlankItem } from '@/app/components/HeroFlankPanel';

beforeEach(() => {
  vi.useFakeTimers();
  return () => vi.useRealTimers();
});

const makeItems = (n: number): FlankItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    statusColor: '#D4AF37',
    statusLabel: `Label ${i + 1}`,
  }));

const makeItemsWithVotes = (n: number): FlankItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    title: `Bill ${i + 1}`,
    statusColor: '#D4AF37',
    statusLabel: 'Committee',
    publicAyes: 18400,
    publicNoes: 6200,
    govAyes: 324,
    govNoes: 218,
  }));

describe('HeroFlankPanel', () => {
  it('renders the label and subtitle', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={makeItems(14)} side="left" />
    );
    expect(screen.getByText('Bills')).toBeInTheDocument();
    expect(screen.getByText('In Session')).toBeInTheDocument();
  });

  it('renders 6 visible rows of items', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={makeItems(14)} side="left" />
    );
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Item ${i}`)).toBeInTheDocument();
    }
  });

  it('shows tracked count in footer when items provided', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={makeItems(14)} side="left" />
    );
    expect(screen.getByText('14 tracked')).toBeInTheDocument();
  });

  it('shows "demo" in footer when items array is empty', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={[]} side="left" />
    );
    expect(screen.getByText('demo')).toBeInTheDocument();
  });

  it('renders vote stats when publicAyes and publicNoes are provided', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={makeItemsWithVotes(14)} side="left" />
    );
    expect(screen.getAllByText(/↑ 18\.4k/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/↓ 6\.2k/).length).toBeGreaterThan(0);
  });

  it('renders gov vote stats when govAyes provided', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={makeItemsWithVotes(14)} side="left" />
    );
    expect(screen.getAllByText(/324\/218/).length).toBeGreaterThan(0);
  });

  it('renders "Voting open" for items with voteOpen flag', () => {
    const items: FlankItem[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      title: `Bill ${i + 1}`,
      statusColor: '#D4AF37',
      statusLabel: '2nd Reading',
      voteOpen: true,
    }));
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={items} side="left" />
    );
    expect(screen.getAllByText('Voting open').length).toBeGreaterThan(0);
  });

  it('renders "Public · Gov" sub-header', () => {
    render(
      <HeroFlankPanel label="Bills" subtitle="In Session" items={makeItems(14)} side="left" />
    );
    expect(screen.getByText('Public · Gov')).toBeInTheDocument();
  });
});
