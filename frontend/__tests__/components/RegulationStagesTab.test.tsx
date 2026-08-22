import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegulationStagesTab from '@/app/components/cards/RegulationStagesTab';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: string }): ParliamentRegulation => ({
  title: 'The Test Regulations 2026',
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-06-01',
  made_date: '2026-06-01',
  deadline: null,
  status: 'made',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  detail_url: null,
  paper_number: null,
  ...overrides,
});

describe('RegulationStagesTab', () => {
  it('lists every step the instrument has reached', () => {
    render(<RegulationStagesTab regulation={regAt({ id: '1' })} />);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('shows the House badge for a per-House step, and a Made badge for the making step', () => {
    render(<RegulationStagesTab regulation={regAt({ id: '1' })} />);
    const madeStep = screen.getByText('Instrument made (signed into law)').closest('li')!;
    expect(within(madeStep).getByText('Made', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it("describes a never-prayed negative instrument's settlement as no vote at all", () => {
    // id '1' never draws a prayer (see mockVotes.test.ts / mockStages.test.ts).
    render(<RegulationStagesTab regulation={regAt({ id: '1' })} />);
    expect(screen.getByText(/no vote — the objection period lapsed without a division/i)).toBeInTheDocument();
  });

  it('describes an annulled instrument\'s decisive step as a division, not a nod', () => {
    render(<RegulationStagesTab regulation={regAt({ id: '4', status: 'annulled' })} />);
    expect(screen.getByText(/^Division — \d+ for · \d+ against$/)).toBeInTheDocument();
  });

  it("carries the AI panel's verdict at each step", () => {
    render(<RegulationStagesTab regulation={regAt({ id: '1' })} />);
    expect(screen.getAllByText(/AI panel at this step:/i).length).toBeGreaterThan(0);
  });
});
