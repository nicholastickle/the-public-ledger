import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroSection from '@/app/components/HeroSection';

describe('HeroSection', () => {
  it('sizes the mobile hero with svh, not dvh', () => {
    // dvh tracks the browser chrome's live on-screen height, which changes as
    // the address bar hides/shows while scrolling — the hero would visibly
    // grow and shrink and shove every section below it up and down. svh is
    // locked to the smallest possible viewport, so it can't do that.
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section')!;
    expect(section.className).toContain('min-h-svh');
    expect(section.className).not.toContain('min-h-dvh');
  });
});
