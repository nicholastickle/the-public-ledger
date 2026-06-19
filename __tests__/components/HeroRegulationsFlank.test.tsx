import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroRegulationsFlank from '@/app/components/HeroRegulationsFlank';
import type { ParliamentRegulation } from '@/app/types/parliament';

beforeEach(() => {
  vi.useFakeTimers();
  return () => vi.useRealTimers();
});

const makeReg = (
  overrides: Partial<ParliamentRegulation> & { id: number; title: string }
): ParliamentRegulation => ({
  enabling_act: 'Test Act',
  procedure: 'negative',
  laid_date: '2026-01-01',
  made_date: null,
  deadline: null,
  status: 'pending',
  house: 'Both',
  last_update: null,
  ...overrides,
});

describe('HeroRegulationsFlank', () => {
  it('renders the "Regulations" label', () => {
    render(<HeroRegulationsFlank regulations={[]} />);
    expect(screen.getByText('Regulations')).toBeInTheDocument();
  });

  it('falls back to demo data when no regulations provided', () => {
    render(<HeroRegulationsFlank regulations={[]} />);
    expect(screen.getByText('14 tracked')).toBeInTheDocument();
  });

  it('shows demo approve/annul stats in demo mode', () => {
    render(<HeroRegulationsFlank regulations={[]} />);
    expect(screen.getAllByText(/↑/).length).toBeGreaterThan(0);
  });

  it('shows live regulation titles when data is provided', () => {
    const regs = Array.from({ length: 14 }, (_, i) =>
      makeReg({ id: i + 1, title: `Test Regulation ${i + 1}` })
    );
    render(<HeroRegulationsFlank regulations={regs} />);
    expect(screen.getByText('Test Regulation 1')).toBeInTheDocument();
  });

  it('shows "Made" label for made regulations', () => {
    const regs = Array.from({ length: 14 }, (_, i) =>
      makeReg({ id: i + 1, title: `Reg ${i + 1}`, status: i === 0 ? 'made' : 'pending' })
    );
    render(<HeroRegulationsFlank regulations={regs} />);
    expect(screen.getByText('Made')).toBeInTheDocument();
  });

  it('shows "Affirmative" procedure for pending affirmative SIs', () => {
    const regs = Array.from({ length: 14 }, (_, i) =>
      makeReg({ id: i + 1, title: `Reg ${i + 1}`, status: 'pending', procedure: 'affirmative' })
    );
    render(<HeroRegulationsFlank regulations={regs} />);
    expect(screen.getAllByText('Affirmative').length).toBeGreaterThan(0);
  });
});
