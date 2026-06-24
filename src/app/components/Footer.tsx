import Link from 'next/link';
import CrownOrnament from './CrownOrnament';

const COLUMNS = [
  {
    heading: 'BILLS',
    links: [
      { label: 'All bills', href: '/bills' },
      { label: 'Health & Care', href: '/health' },
      { label: 'Economy', href: '/economy' },
      { label: 'Housing', href: '/housing' },
      { label: 'Environment', href: '/environment' },
      { label: 'Justice', href: '/justice' },
    ],
  },
  {
    heading: 'RESOURCES',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Parliament API', href: '/api-docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Voting data', href: '/data' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-parchment-dark)',
        borderTop: '2px solid rgba(184,150,12,0.35)',
      }}
    >
      {/* Ornamental top rule */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(184,150,12,0.5) 20%, rgba(184,150,12,0.5) 80%, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl py-4xl">

        {/* Top: brand + nav columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-xl mb-4xl">

          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-xs mb-md no-underline group">
              <CrownOrnament size={22} />
              <span
                style={{
                  fontFamily: 'var(--font-display), Georgia, "Times New Roman", serif',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--color-forest-green)',
                  letterSpacing: '-0.01em',
                }}
              >
                The Public Ledger
              </span>
            </Link>

            <p
              className="text-body-sm leading-relaxed max-w-[18rem]"
              style={{ color: '#4A3C2A' }}
            >
              Shadow parliament voting for every UK citizen. Your voice on the
              bills that shape the country.
            </p>

            {/* Live indicator */}
            <div className="flex items-center gap-xs mt-md">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--color-forest-green)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(27,67,50,0.55)',
                }}
              >
                Session Active
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(184,150,12,0.9)',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(184,150,12,0.22)',
                }}
              >
                {col.heading}
              </div>
              <ul className="flex flex-col gap-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="ledger-footer-link text-body-sm no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center gap-sm mb-lg" aria-hidden="true">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, rgba(184,150,12,0.35), transparent)' }}
          />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 0L10 5L5 10L0 5Z" fill="#B8960C" opacity="0.5" />
          </svg>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to left, rgba(184,150,12,0.35), transparent)' }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              color: 'rgba(27,67,50,0.45)',
              letterSpacing: '0.04em',
            }}
          >
            © {new Date().getFullYear()} The Public Ledger. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              color: 'rgba(27,67,50,0.38)',
              letterSpacing: '0.04em',
            }}
          >
            Not affiliated with the UK Parliament or any political party.
          </p>
        </div>
      </div>
    </footer>
  );
}
