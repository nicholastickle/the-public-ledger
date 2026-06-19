'use client';

import { useState } from 'react';
import Link from 'next/link';
import HowItWorksModal from './HowItWorksModal';

const NAV_LINKS = [
  { label: 'Bills',        href: '/bills' },
  { label: 'Regulations',  href: '/regulations' },
  { label: 'Elections',    href: '/elections' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  return (
    <>
      <HowItWorksModal isOpen={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 cursor-pointer transition-colors flex-shrink-0"
        style={{
          color: 'var(--color-forest-green)',
          borderRadius: '2px',
          border: open ? '1px solid rgba(184,150,12,0.35)' : '1px solid transparent',
          background: open ? 'rgba(27,67,50,0.07)' : 'transparent',
        }}
      >
        {open ? (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto"
          style={{
            top: '96px',
            background: 'var(--color-parchment)',
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, rgba(184,150,12,0.12) 47px, rgba(184,150,12,0.12) 48px)',
            borderTop: '1px solid rgba(184,150,12,0.35)',
          }}
        >
          {/* Nav links */}
          <nav className="flex flex-col px-lg pt-lg pb-md gap-xxs">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ledger-nav-link"
                style={{ fontSize: '15px', padding: '10px 16px' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              className="ledger-nav-link text-left"
              style={{ fontSize: '15px', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
              onClick={() => { setOpen(false); setHowItWorksOpen(true); }}
            >
              How it works
            </button>
          </nav>

          {/* Decorative centre element */}
          <div className="flex-1 flex flex-col items-center justify-center gap-md py-3xl opacity-30" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="2" stroke="#B8960C" strokeWidth="1.5" />
              <rect x="10" y="10" width="28" height="28" rx="1" stroke="#B8960C" strokeWidth="0.75" />
              <line x1="14" y1="20" x2="34" y2="20" stroke="#B8960C" strokeWidth="1.5" />
              <line x1="14" y1="26" x2="34" y2="26" stroke="#B8960C" strokeWidth="1.5" />
              <line x1="14" y1="32" x2="26" y2="32" stroke="#B8960C" strokeWidth="1.5" />
              <path d="M24 4 m 0 -3 l 3 3 l -3 3 l -3 -3 Z" fill="#B8960C" />
              <path d="M24 44 m 0 3 l 3 -3 l -3 -3 l -3 3 Z" fill="#B8960C" />
              <path d="M4 24 m -3 0 l 3 3 l 3 -3 l -3 -3 Z" fill="#B8960C" />
              <path d="M44 24 m 3 0 l -3 3 l -3 -3 l 3 -3 Z" fill="#B8960C" />
            </svg>
            <p className="font-mono text-caption uppercase tracking-widest text-center" style={{ color: '#B8960C', letterSpacing: '0.2em', fontSize: '11px' }}>
              The Public Ledger
            </p>
          </div>

          {/* CTA buttons */}
          <div
            className="px-lg py-lg flex flex-col gap-sm"
            style={{ borderTop: '1px solid rgba(184,150,12,0.35)' }}
          >
            <Link href="/signup" className="btn-ledger-primary justify-center" onClick={() => setOpen(false)}>
              Sign Up
            </Link>
            <Link href="/login" className="btn-ledger-secondary justify-center" onClick={() => setOpen(false)}>
              Log In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
