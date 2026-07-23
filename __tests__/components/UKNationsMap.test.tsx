import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UKNationsMap from '@/app/components/UKNationsMap';
import { UK_NATIONS } from '@/app/data/uk-nations';

describe('UKNationsMap', () => {
  it('renders a focusable badge button for each of the four nations', () => {
    render(<UKNationsMap />);
    for (const nation of UK_NATIONS) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${nation.name}`) })
      ).toBeInTheDocument();
    }
  });

  it('marks a nation active on pointer enter and clears it on leave', () => {
    render(<UKNationsMap />);
    const scotland = screen.getByRole('button', { name: /^Scotland/ });
    expect(scotland).toHaveAttribute('data-active', 'false');

    fireEvent.pointerEnter(scotland);
    expect(scotland).toHaveAttribute('data-active', 'true');
  });

  it('toggles the active nation on click (touch support)', () => {
    render(<UKNationsMap />);
    const wales = screen.getByRole('button', { name: /^Wales/ });
    fireEvent.click(wales);
    expect(wales).toHaveAttribute('data-active', 'true');
    fireEvent.click(wales);
    expect(wales).toHaveAttribute('data-active', 'false');
  });

  it('renders exactly four interactive nations (Republic of Ireland is context only)', () => {
    render(<UKNationsMap />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.queryByRole('button', { name: /Republic/i })).not.toBeInTheDocument();
  });
});
