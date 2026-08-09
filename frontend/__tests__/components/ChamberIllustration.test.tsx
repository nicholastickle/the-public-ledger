import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChamberIllustration from '@/app/components/hero/ChamberIllustration';

describe('ChamberIllustration', () => {
  it('renders an accessibility-hidden decorative svg', () => {
    const { container } = render(<ChamberIllustration />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a facing bench row on both sides of the aisle', () => {
    const { container } = render(<ChamberIllustration />);
    const benchRects = container.querySelectorAll('rect[x="40"], rect[x="270"]');
    expect(benchRects.length).toBeGreaterThan(0);
  });
});
