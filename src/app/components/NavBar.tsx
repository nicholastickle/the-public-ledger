import Link from 'next/link';
import MobileMenu from './MobileMenu';

export const NAV_LINKS = [
  { label: 'Bills', href: '/bills' },
];

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 bg-parchment"
      style={{
        borderBottom: '1px solid rgba(184, 150, 12, 0.38)',
        boxShadow: '0 2px 12px rgba(27, 67, 50, 0.06)',
      }}
    >
      <nav className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl h-16 flex items-center gap-md">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-sm flex-shrink-0 no-underline">
          <LedgerIcon />
          <span
            className="font-display italic font-semibold text-forest-green"
            style={{ fontSize: '17px', letterSpacing: '-0.015em' }}
          >
            The Public Ledger
          </span>
        </Link>

        {/* Pip separator — desktop only */}
        <div
          className="hidden lg:block flex-shrink-0 h-4 w-px"
          style={{ background: 'rgba(184, 150, 12, 0.45)' }}
          aria-hidden="true"
        />

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-xxs">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="ledger-nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-xs">
          <Link href="/login" className="btn-ledger-secondary-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn-ledger-primary-sm">
            Register to Vote
          </Link>
        </div>

        {/* Hamburger */}
        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

function LedgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="1.5" width="13" height="15" rx="2" stroke="#1B4332" strokeWidth="1.5" />
      <line x1="6" y1="6" x2="12" y2="6" stroke="#B8960C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="9" x2="12" y2="9" stroke="#B8960C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="12" x2="10" y2="12" stroke="#B8960C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
