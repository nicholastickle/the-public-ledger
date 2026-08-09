import type { MouseEvent } from 'react';

/**
 * Anchor links to home-page sections (e.g. "/#bills") normally rely on the
 * URL hash changing to trigger a scroll. Click the same nav item twice in a
 * row — or scroll back up and click it again — and the hash never changes,
 * so neither the browser nor Next's Link scroll the second time. Scrolling
 * manually whenever we're already on the home page sidesteps that.
 */
export function scrollToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (typeof window === 'undefined' || !href.startsWith('/#')) return;
  if (window.location.pathname !== '/') return;

  const id = href.slice(2);
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, '', href);
  }
}
