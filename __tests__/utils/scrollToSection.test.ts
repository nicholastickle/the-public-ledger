import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MouseEvent } from 'react';
import { scrollToSection } from '@/app/lib/scrollToSection';

function clickEvent() {
  return { preventDefault: vi.fn() } as unknown as MouseEvent<HTMLAnchorElement>;
}

describe('scrollToSection', () => {
  let scrollIntoView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '<section id="bills"></section>';
    scrollIntoView = vi.fn();
    document.getElementById('bills')!.scrollIntoView = scrollIntoView;
    window.history.pushState(null, '', '/');
  });

  it('scrolls to the target section and prevents default when already on the home page', () => {
    const event = clickEvent();
    scrollToSection(event, '/#bills');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(window.location.hash).toBe('#bills');
  });

  it('re-scrolls even when the URL hash already matches the target', () => {
    // The bug this guards against: the URL is already "/#bills" (from an
    // earlier click), the citizen scrolls back up, and clicks "Bills" again —
    // the hash never changes, so nothing should stop us scrolling anyway.
    window.history.pushState(null, '', '/#bills');
    const event = clickEvent();
    scrollToSection(event, '/#bills');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it('leaves ordinary route links alone', () => {
    const event = clickEvent();
    scrollToSection(event, '/elections');
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('leaves navigation alone when not already on the home page', () => {
    window.history.pushState(null, '', '/login');
    const event = clickEvent();
    scrollToSection(event, '/#bills');
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does nothing if the target section is not on the page', () => {
    document.body.innerHTML = '';
    const event = clickEvent();
    scrollToSection(event, '/#bills');
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
