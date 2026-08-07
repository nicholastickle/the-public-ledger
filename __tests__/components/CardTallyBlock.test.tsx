import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardTallyBlock from '@/app/components/CardTallyBlock';

const TALLY_ZERO = { for: 0, against: 0 };

describe('CardTallyBlock', () => {
  it('locks Public and AI, and shows the expected date for Government, while unrevealed', () => {
    render(
      <CardTallyBlock
        context="bill"
        forLabel="Aye"
        againstLabel="No"
        revealed={false}
        publicTally={TALLY_ZERO}
        aiTally={TALLY_ZERO}
        gov={{ status: 'pending', scheduledDate: '2026-08-12' }}
      />
    );
    expect(screen.getAllByRole('button', { name: 'Hidden until you vote' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Government vote: 12/08/2026' })).toHaveTextContent('12/08/2026');
  });

  it('shows TBD when no date is scheduled yet', () => {
    render(
      <CardTallyBlock
        context="bill"
        forLabel="Aye"
        againstLabel="No"
        revealed={false}
        publicTally={TALLY_ZERO}
        aiTally={TALLY_ZERO}
        gov={{ status: 'pending', scheduledDate: null }}
      />
    );
    expect(screen.getByRole('button', { name: 'Government vote: TBD' })).toHaveTextContent('TBD');
  });

  it('reveals real thumb counts for all three once revealed', () => {
    render(
      <CardTallyBlock
        context="regulation"
        forLabel="Approve"
        againstLabel="Annul"
        revealed
        publicTally={{ for: 1200, against: 8700 }}
        aiTally={{ for: 1, against: 3 }}
        gov={{ status: 'voted', for: 413, against: 217 }}
      />
    );
    expect(screen.queryByRole('button', { name: 'Hidden until you vote' })).not.toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('8,700')).toBeInTheDocument();
    expect(screen.getByText('413')).toBeInTheDocument();
    expect(screen.getByText('217')).toBeInTheDocument();
  });

  it('shows a plain dash when there is no parliamentary vote to have', () => {
    render(
      <CardTallyBlock
        context="bill"
        forLabel="Aye"
        againstLabel="No"
        revealed
        publicTally={TALLY_ZERO}
        aiTally={TALLY_ZERO}
        gov={{ status: 'none' }}
      />
    );
    expect(screen.getByTitle('No parliamentary vote recorded')).toHaveTextContent('—');
  });

  it('explains the lock on tap with board-neutral wording', () => {
    render(
      <CardTallyBlock
        context="bill"
        forLabel="Aye"
        againstLabel="No"
        revealed={false}
        publicTally={TALLY_ZERO}
        aiTally={TALLY_ZERO}
        gov={{ status: 'pending', scheduledDate: null }}
      />
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Hidden until you vote' })[0]);
    expect(screen.getByText(/Cast your vote above to reveal it now/)).toBeInTheDocument();
    expect(screen.getByText(/wait until this is settled/)).toBeInTheDocument();
  });

  it('gives the Government date chip board-specific wording on tap', () => {
    render(
      <CardTallyBlock
        context="regulation"
        forLabel="Approve"
        againstLabel="Annul"
        revealed={false}
        publicTally={TALLY_ZERO}
        aiTally={TALLY_ZERO}
        gov={{ status: 'pending', scheduledDate: '2026-08-10' }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Government vote: 10/08/2026' }));
    expect(screen.getByText(/objection period for a negative one/)).toBeInTheDocument();
  });
});
