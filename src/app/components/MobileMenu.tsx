'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Markets', href: '/markets' },
  { label: 'Politics', href: '/politics' },
  { label: 'Sports', href: '/sports' },
  { label: 'Crypto', href: '/crypto' },
  { label: 'Science', href: '/science' },
  { label: 'Culture', href: '/culture' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="flex items-center justify-center w-8 h-8 rounded-md text-ink hover:bg-canvas-soft-2 transition-colors cursor-pointer"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 bg-canvas z-40 flex flex-col overflow-y-auto">
          <nav className="flex flex-col px-lg py-md gap-xxs">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-md text-ink px-md py-sm rounded-md hover:bg-canvas-soft-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-hairline px-lg py-lg flex flex-col gap-sm">
            <Link
              href="/signup"
              className="btn-primary justify-center"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="btn-secondary justify-center"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
