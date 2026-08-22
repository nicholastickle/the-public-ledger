import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HouseBadge from '@/app/components/ui/HouseBadge';

describe('HouseBadge', () => {
  it('renders the Commons crest', () => {
    const { container } = render(<HouseBadge house="Commons" />);
    expect(container.querySelector('.house-badge')).toBeInTheDocument();
    expect(screen.getByText('Commons', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('renders a crown glyph for Royal Assent', () => {
    const { container } = render(<HouseBadge house="Royal Assent" />);
    expect(container.querySelector('.house-badge svg')).toBeInTheDocument();
    expect(screen.getByText('Royal Assent', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('renders a distinct seal glyph for a statutory instrument being made', () => {
    const { container } = render(<HouseBadge house="Made" />);
    expect(container.querySelector('.house-badge svg')).toBeInTheDocument();
    expect(screen.getByText('Made', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('renders nothing for an unrecognised or absent House', () => {
    const { container } = render(<HouseBadge house={null} />);
    expect(container.querySelector('.house-badge')).not.toBeInTheDocument();
  });
});
