import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegulationPassageDiagram from '@/app/components/cards/RegulationPassageDiagram';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: string }): ParliamentRegulation => ({
  title: 'The Test Regulations 2026',
  enabling_act: 'Test Act 2026',
  procedure: 'affirmative',
  laid_date: '2026-06-01',
  made_date: null,
  deadline: '2026-08-10',
  status: 'pending',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  detail_url: null,
  paper_number: null,
  ...overrides,
});

describe('RegulationPassageDiagram', () => {
  it('renders a panel for each House laid before, plus a final panel', () => {
    const { container } = render(<RegulationPassageDiagram regulation={regAt({ id: '1', house: 'Both' })} />);
    expect(container.querySelectorAll('.passage-diagram__panel')).toHaveLength(3);
  });

  it('renders fewer panels for an instrument laid before only one House', () => {
    const { container } = render(<RegulationPassageDiagram regulation={regAt({ id: '1', house: 'Lords' })} />);
    expect(container.querySelectorAll('.passage-diagram__panel')).toHaveLength(2);
  });

  it("shows the negative procedure's own steps, distinct from the affirmative diagram", () => {
    render(<RegulationPassageDiagram regulation={regAt({ id: '1', procedure: 'negative', house: 'Commons' })} />);
    expect(screen.getByText('Prayer tabled to annul it')).toBeInTheDocument();
    expect(screen.queryByText('Motion to approve')).not.toBeInTheDocument();
  });

  it("shows the affirmative procedure's own steps", () => {
    render(<RegulationPassageDiagram regulation={regAt({ id: '1', procedure: 'affirmative', house: 'Commons' })} />);
    expect(screen.getByText('Motion to approve')).toBeInTheDocument();
    expect(screen.queryByText('Prayer tabled to annul it')).not.toBeInTheDocument();
  });
});
