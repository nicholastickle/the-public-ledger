import Link from 'next/link';

const COLUMNS = [
  {
    heading: 'MARKETS',
    links: [
      { label: 'Politics', href: '/politics' },
      { label: 'Sports', href: '/sports' },
      { label: 'Crypto', href: '/crypto' },
      { label: 'Science', href: '/science' },
      { label: 'Culture', href: '/culture' },
      { label: 'World', href: '/world' },
    ],
  },
  {
    heading: 'RESOURCES',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'FAQ', href: '/faq' },
      { label: 'API Docs', href: '/api-docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Market data', href: '/data' },
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
    <footer className="bg-canvas border-t border-hairline py-4xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Top: brand + nav columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-xl mb-4xl">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-xs mb-md">
              <span className="text-body-sm font-semibold text-ink">
                The Public Ledger
              </span>
            </Link>
            <p className="text-body-sm text-body max-w-[20rem] leading-relaxed">
              Open prediction markets for global events. Trade on what you know.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-md">
                {col.heading}
              </div>
              <ul className="flex flex-col gap-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-body hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: copyright */}
        <div className="pt-lg border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
          <p className="text-caption text-mute">
            © {new Date().getFullYear()} The Public Ledger. All rights reserved.
          </p>
          <p className="text-caption font-mono text-mute">
            Prediction markets involve risk. Trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
