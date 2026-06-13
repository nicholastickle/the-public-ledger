import Link from 'next/link';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { label: 'Markets', href: '/markets' },
  { label: 'Politics', href: '/politics' },
  { label: 'Sports', href: '/sports' },
  { label: 'Crypto', href: '/crypto' },
  { label: 'Science', href: '/science' },
  { label: 'Culture', href: '/culture' },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-hairline">
      <nav className="max-w-[1400px] mx-auto px-lg h-16 flex items-center gap-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-xs flex-shrink-0">
          <LedgerIcon />
          <span className="text-body-sm font-semibold text-ink tracking-tight">
            The Public Ledger
          </span>
        </Link>

        {/* Desktop nav links — only at lg+ where there's enough room */}
        <div className="hidden lg:flex items-center gap-xxs flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-sm text-body px-sm py-xs rounded-full hover:bg-canvas-soft-2 hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-xs">
          <Link href="/login" className="btn-secondary-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary-sm">
            Sign Up
          </Link>
        </div>

        {/* Hamburger for mobile + tablet */}
        <div className="lg:hidden ml-auto">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

function LedgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="1.5" width="13" height="15" rx="2" stroke="#171717" strokeWidth="1.5" />
      <line x1="6" y1="6" x2="12" y2="6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="9" x2="12" y2="9" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="12" x2="10" y2="12" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
