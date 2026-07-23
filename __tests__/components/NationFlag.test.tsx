import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NationFlag from '@/app/components/NationFlag';

describe('NationFlag', () => {
  it('renders the St George flag for England', () => {
    render(<NationFlag nation="england" />);
    expect(screen.getByRole('img', { name: 'Flag of England' })).toBeInTheDocument();
  });

  it('renders the Saltire for Scotland', () => {
    render(<NationFlag nation="scotland" />);
    expect(screen.getByRole('img', { name: 'Flag of Scotland' })).toBeInTheDocument();
  });

  it('renders the dragon flag for Wales', () => {
    const { container } = render(<NationFlag nation="wales" />);
    expect(screen.getByRole('img', { name: 'Flag of Wales' })).toBeInTheDocument();
    // dragon flag is embedded markup, so it should contain nested paths
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('renders the Ulster Banner for Northern Ireland', () => {
    render(<NationFlag nation="northernIreland" />);
    expect(screen.getByRole('img', { name: 'Flag of Northern Ireland' })).toBeInTheDocument();
  });

  it('honours the requested width', () => {
    const { container } = render(<NationFlag nation="england" width={80} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '80');
  });
});
