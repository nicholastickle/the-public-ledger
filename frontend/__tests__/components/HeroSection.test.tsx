import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import HeroSection from '@/app/components/hero/HeroSection';

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true, configurable: true });
}

const ORIGINAL_WIDTH = window.innerWidth;
const ORIGINAL_HEIGHT = window.innerHeight;

afterEach(() => {
  setViewport(ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
});

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

  it('locks the mobile hero to the height measured on landing', () => {
    setViewport(375, 720);
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section')! as HTMLElement;
    expect(section.style.minHeight).toBe('720px');
  });

  it('ignores a height-only resize, such as the toolbar showing or hiding', () => {
    setViewport(375, 720);
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section')! as HTMLElement;

    // Same width, shorter height — the address bar reappearing, not a real resize.
    setViewport(375, 640);
    fireEvent.resize(window);

    expect(section.style.minHeight).toBe('720px');
  });

  it('re-measures on a genuine width change, such as device rotation', () => {
    setViewport(375, 720);
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section')! as HTMLElement;

    setViewport(720, 375);
    fireEvent.resize(window);

    expect(section.style.minHeight).toBe('');
  });

  it('does not lock a fixed height at desktop widths', () => {
    setViewport(1280, 800);
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section')! as HTMLElement;
    expect(section.style.minHeight).toBe('');
  });
});
