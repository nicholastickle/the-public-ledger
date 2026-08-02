'use client';

import Link from 'next/link';
import { useState } from 'react';
import CrownOrnament from './CrownOrnament';
import HowItWorksModal from './HowItWorksModal';

const NAV_LINKS = [
  { label: 'Bills', href: '/bills' },
  { label: 'Regulations', href: '/regulations' },
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
    <div className="relative flex items-center justify-between gap-md pb-lg mb-xl">
      {/* Logo */}
      <Link href="/" className="hero-nav__logo" aria-label="The Public Ledger — home">
        <CrownOrnament size={22} />
        <span className="hero-nav__wordmark hidden sm:block">The Public Ledger</span>
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

      {/* Mobile hamburger */}
      <button
        type="button"
        className="hero-nav__burger lg:hidden"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="hero-nav__menu lg:hidden">
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
            <Link href="/login" className="hero-nav-btn hero-nav-btn--ghost flex-1">Log In</Link>
            <Link href="/signup" className="hero-nav-btn hero-nav-btn--solid flex-1">Sign Up</Link>
          </div>
        </div>
      )}

      <HowItWorksModal isOpen={howOpen} onClose={() => setHowOpen(false)} />
    </div>
  );
}
