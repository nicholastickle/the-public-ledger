import Link from 'next/link';
import CrownOrnament from '../ornamental/CrownOrnament';
import FooterHowItWorksLink from './FooterHowItWorksLink';
import SectionNavLink from './SectionNavLink';

type FooterLink = {
  label: string;
  /** null renders FooterHowItWorksLink instead — that item opens the shared
   *  modal rather than navigating anywhere. */
  href: string | null;
  external?: boolean;
};

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: 'The Boards',
    links: [
      { label: 'Bill Board', href: '/#bills' },
      { label: 'Regulations Board', href: '/#regulations' },
      { label: 'Elections Board', href: '/elections' },
      { label: 'Lobby Board', href: '/lobby' },
    ],
  },
  {
    heading: 'AI & Platform',
    links: [
      { label: 'AI Voting', href: '/ai-voting' },
      { label: 'AI Round Table', href: '/ai-round-table' },
      { label: 'How it works', href: null },
      { label: 'Parliament API', href: '/parliament-api' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    heading: 'Legal & Social',
    links: [
      // Placeholder until there's a real account to link to.
      { label: 'Twitter/X', href: '#' },
      { label: 'GitHub Repo', href: 'https://github.com/nicholastickle/the-public-ledger', external: true },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'var(--color-ledger-bg)' }}>
      {/* Ornamental top rule — same gold hairline treatment as the Bill Board */}
      <div
        className="relative z-10 w-full h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(184,150,12,0.5) 20%, rgba(184,150,12,0.5) 80%, transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-md sm:px-xl lg:px-3xl py-4xl flex flex-col items-center text-center">
        {/* Brand + slogan */}
        <div className="mb-3xl max-w-[26rem] flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-xs mb-md no-underline">
            <CrownOrnament size={22} />
            <span
              className="font-display italic font-semibold"
              style={{ fontSize: '15px', color: '#FAF6ED', letterSpacing: '-0.01em' }}
            >
              The Public Ledger
            </span>
          </Link>
          <p className="text-body-sm leading-relaxed" style={{ color: 'rgba(250,246,237,0.6)' }}>
            Shadow parliament voting for British citizens ONLY. Your voice on the bills and regulations that shape the country.
          </p>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-xl mb-3xl w-full max-w-[900px]">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col items-center">
              <div
                className="footer-heading mb-md pb-xs w-full"
                style={{ borderBottom: '1px solid rgba(184,150,12,0.22)' }}
              >
                {col.heading}
              </div>
              <ul className="flex flex-col items-center gap-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href === null ? (
                      <FooterHowItWorksLink />
                    ) : link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link text-body-sm">
                        {link.label}
                      </a>
                    ) : link.href.startsWith('/#') ? (
                      <SectionNavLink href={link.href} className="footer-link text-body-sm">
                        {link.label}
                      </SectionNavLink>
                    ) : (
                      <Link href={link.href} className="footer-link text-body-sm">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-sm sm:gap-xl pt-lg w-full"
          style={{ borderTop: '1px solid rgba(184,150,12,0.18)' }}
        >
          <p className="font-mono" style={{ fontSize: '11px', color: 'rgba(250,246,237,0.4)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} The Public Ledger. All rights reserved.
          </p>
          <p className="font-mono" style={{ fontSize: '11px', color: 'rgba(250,246,237,0.32)', letterSpacing: '0.04em' }}>
            Not affiliated with the UK Parliament or any political party.
          </p>
        </div>
      </div>

      {/* Oversized brand wordmark, sat below the footer content as its own
          full-width band rather than bleeding off/clipped by the edge, so
          it reads as a deliberate sign-off rather than a half-cut sliver. */}
      <div className="relative z-10 w-full overflow-hidden pointer-events-none pb-lg sm:pb-xl" aria-hidden="true">
        <span
          className="footer-watermark block text-center"
          style={{ fontSize: 'clamp(3rem, 15vw, 12.5rem)' }}
        >
          Public Ledger
        </span>
      </div>
    </footer>
  );
}
