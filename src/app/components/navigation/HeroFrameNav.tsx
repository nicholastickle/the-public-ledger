'use client';

import Link from 'next/link';
import { useState } from 'react';
import CrownOrnament from '../ornamental/CrownOrnament';
import HowItWorksModal from '../how-it-works/HowItWorksModal';
import SoundToggleButton from '../ui/SoundToggleButton';

const NAV_LINKS = [
  { label: 'Bills', href: '/#bills' },
  { label: 'Regulations', href: '/#regulations' },
  { label: 'Elections', href: '/elections' },
  { label: 'Lobby', href: '/lobby' },
];

/**
 * Navigation folded into the top of the hero's gold ledger frame (dark-themed).
 * Replaces the standalone sticky NavBar on the home page — self-contained so it
 * doesn't disturb the parchment NavBar still used on the bills pages.
 */
export default function HeroFrameNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between gap-md pb-sm mb-lg sm:pb-lg sm:mb-xl">
      {/* Logo */}
      <Link href="/" className="hero-nav__logo" aria-label="The Public Ledger — home">
        <CrownOrnament size={22} />
        <span className="hero-nav__wordmark">The Public Ledger</span>
      </Link>

      {/* Desktop links */}
      <nav className="hidden lg:flex items-center gap-xxs" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hero-nav-link">
            {link.label}
          </Link>
        ))}
        <button type="button" className="hero-nav-link" onClick={() => setHowOpen(true)}>
          How it works
        </button>
      </nav>

      {/* Desktop auth */}
      <div className="hidden lg:flex items-center gap-xs">
        <Link href="/login" className="hero-nav-btn hero-nav-btn--ghost">Log In</Link>
        <Link href="/signup" className="hero-nav-btn hero-nav-btn--solid">Sign Up</Link>
      </div>

      {/* Sound toggle grouped with the hamburger rather than floating at a
          fixed viewport corner — that's what previously put it on a collision
          course with this button. */}
      <div className="flex items-center gap-xs shrink-0">
        <SoundToggleButton />

        {/* Mobile hamburger. Hidden from assistive tech and the tab order
            while the menu is open — it's covered by the overlay's own close
            button at that point, so it shouldn't remain a second,
            indistinguishable "Close menu" control. */}
        <button
          type="button"
          className="hero-nav__burger lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-hidden={menuOpen || undefined}
          tabIndex={menuOpen ? -1 : undefined}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — a fixed overlay so it sits over the navbar row itself
          (not just the hero content below it), with its own title since the
          real logo row underneath is covered while it's open. Closes on a
          click anywhere outside the panel. */}
      {menuOpen && (
        <div
          className="hero-nav__menu-overlay lg:hidden"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false);
          }}
        >
          <div className="hero-nav__menu">
            <div className="hero-nav__menu-header">
              <Link
                href="/"
                className="hero-nav__logo"
                aria-label="The Public Ledger — home"
                onClick={() => setMenuOpen(false)}
              >
                <CrownOrnament size={22} />
                <span className="hero-nav__wordmark">The Public Ledger</span>
              </Link>
              <button
                type="button"
                className="hero-nav__burger"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-xxs" aria-label="Primary mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hero-nav-link"
                  style={{ padding: '10px 12px' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className="hero-nav-link text-left"
                style={{ padding: '10px 12px' }}
                onClick={() => {
                  setMenuOpen(false);
                  setHowOpen(true);
                }}
              >
                How it works
              </button>
            </nav>
            <div className="flex gap-xs mt-sm">
              <Link href="/login" className="hero-nav-btn hero-nav-btn--ghost flex-1" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link href="/signup" className="hero-nav-btn hero-nav-btn--solid flex-1" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </div>
      )}

      <HowItWorksModal isOpen={howOpen} onClose={() => setHowOpen(false)} />
    </div>
  );
}
