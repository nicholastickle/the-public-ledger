import Link from 'next/link';
import CrownOrnament from './CrownOrnament';
import ChamberIllustration from './ChamberIllustration';
import FooterHowItWorksLink from './FooterHowItWorksLink';

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
      { label: 'Bill Board', href: '/bills' },
      { label: 'Regulations Board', href: '/regulations' },
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
    <footer className="relative overflow-hidden" style={{ background: '#0C1610' }}>
      {/* Ornamental top rule — same gold hairline treatment as the Bill Board */}
      <div
        className="relative z-10 w-full h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(184,150,12,0.5) 20%, rgba(184,150,12,0.5) 80%, transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row">
        {/* Content half */}
        <div className="w-full lg:w-1/2 px-md sm:px-xl lg:px-3xl py-4xl">
          {/* Brand + slogan */}
          <div className="mb-3xl max-w-[26rem]">
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
          <div className="grid grid-cols-2 2xl:grid-cols-4 gap-xl mb-3xl">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <div
                  className="footer-heading mb-md pb-xs"
                  style={{ borderBottom: '1px solid rgba(184,150,12,0.22)' }}
                >
                  {col.heading}
                </div>
                <ul className="flex flex-col gap-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href === null ? (
                        <FooterHowItWorksLink />
                      ) : link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link text-body-sm">
                          {link.label}
                        </a>
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
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm pt-lg"
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

        {/* Chamber half — desktop only; the illustration is decorative and
            adds nothing at the widths where columns already stack to 1-up. */}
        <div className="hidden lg:block relative lg:w-1/2 shrink-0" aria-hidden="true">
          <div className="absolute inset-0" style={{ opacity: 0.4 }}>
            <ChamberIllustration />
          </div>
          {/* Fades the illustration into the surface rather than a hard seam */}
          <div
            className="absolute inset-y-0 left-0 w-1/3"
            style={{ background: 'linear-gradient(to right, #0C1610, transparent)' }}
          />
        </div>
      </div>

      {/* Oversized brand wordmark bleeding off the bottom edge — the "modern
          site" background-text treatment. Layered above the chamber
          illustration (not just the plain background) so its gold strokes
          don't cut across individual letters; pointer-events-none keeps it
          from stealing clicks off the real links underneath. */}
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden pointer-events-none" aria-hidden="true">
        <span
          className="footer-watermark block text-center"
          style={{ fontSize: 'clamp(3.5rem, 13vw, 11rem)', transform: 'translateY(30%)' }}
        >
          Public Ledger
        </span>
      </div>
    </footer>
  );
}
