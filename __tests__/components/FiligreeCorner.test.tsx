import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FiligreeCorner from '@/app/components/ornamental/FiligreeCorner';

describe('FiligreeCorner', () => {
  it('renders an accessibility-hidden decorative svg', () => {
    const { container } = render(<FiligreeCorner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the given size to width and height', () => {
    const { container } = render(<FiligreeCorner size={52} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '52');
    expect(svg).toHaveAttribute('height', '52');
  });

  it('flips via transform when flipH/flipV are set', () => {
    const { container } = render(<FiligreeCorner flipH flipV />);
    const g = container.querySelector('g');
    expect(g).toHaveAttribute('transform', 'scale(-1,-1) translate(-80,-80)');
  });
});
