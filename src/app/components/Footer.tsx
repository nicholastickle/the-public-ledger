import Link from 'next/link';

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
              Shadow parliament voting for every UK citizen. Your voice on the
              bills that shape the country.
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

        {/* Bottom */}
        <div className="pt-lg border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
          <p className="text-caption text-mute">
            © {new Date().getFullYear()} The Public Ledger. All rights reserved.
          </p>
          <p className="text-caption font-mono text-mute">
            Not affiliated with the UK Parliament or any political party.
          </p>
        </div>
      </div>
    </footer>
  );
}
