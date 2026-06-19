import Link from 'next/link';
import MobileMenu from './MobileMenu';
import HowItWorksButton from './HowItWorksButton';

export const NAV_LINKS = [
  { label: 'Bills',       href: '/bills' },
  { label: 'Regulations', href: '/regulations' },
  { label: 'Elections',   href: '/elections' },
];

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 bg-parchment"
      style={{
        borderBottom: '1px solid rgba(184,150,12,0.38)',
        boxShadow: '0 2px 12px rgba(27,67,50,0.06)',
      }}
    >
      {/* ── Row 1: Logo / Search / Auth ─────────────────────────────── */}
      <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl h-14 flex items-center gap-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-xs flex-shrink-0 no-underline">
          <LedgerIcon />
          <span
            className="font-display italic font-semibold text-forest-green hidden sm:block"
            style={{ fontSize: '17px', letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}
          >
            The Public Ledger
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 relative min-w-0 mx-xs sm:mx-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search bills, regulations…"
            className="ledger-search-input w-full font-mono"
            style={{
              paddingLeft: '32px',
              paddingRight: '36px',
              height: '36px',
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(184,150,12,0.35)',
              borderRadius: '2px',
              fontSize: '13px',
              color: 'var(--color-forest-green)',
              letterSpacing: '0.02em',
            }}
          />
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center font-mono pointer-events-none"
            style={{
              fontSize: '11px',
              color: 'rgba(184,150,12,0.55)',
              border: '1px solid rgba(184,150,12,0.3)',
              borderRadius: '2px',
              width: '18px',
              height: '18px',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            /
          </span>
        </div>

        {/* How it works — tablet+ */}
        <HowItWorksButton />

        {/* Auth — tablet+ */}
        <div className="hidden sm:flex items-center gap-xs flex-shrink-0">
          <Link href="/login" className="btn-ledger-secondary-sm">Log In</Link>
          <Link href="/signup" className="btn-ledger-primary-sm">Sign Up</Link>
        </div>

        {/* Hamburger — always */}
        <MobileMenu />
      </div>

      {/* ── Row 2: Category nav ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(184,150,12,0.2)' }}>
        <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl overflow-x-auto no-scrollbar">
          <nav className="flex items-center h-10 gap-xxs" aria-label="Browse categories">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="ledger-nav-link flex-shrink-0">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function LedgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="1.5" width="13" height="15" rx="2" stroke="#1B4332" strokeWidth="1.5" />
      <line x1="6" y1="6"  x2="12" y2="6"  stroke="#B8960C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="9"  x2="12" y2="9"  stroke="#B8960C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="12" x2="10" y2="12" stroke="#B8960C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="#1B4332" strokeWidth="1.4" strokeOpacity="0.5" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

