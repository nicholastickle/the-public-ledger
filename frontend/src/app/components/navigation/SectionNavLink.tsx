'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { scrollToSection } from '../../lib/scrollToSection';

/** A nav Link that also works for repeat clicks on a home-page section
 *  anchor (see scrollToSection). Safe to use for ordinary route links too —
 *  scrollToSection no-ops for anything that isn't a "/#" href. */
export default function SectionNavLink({
  href,
  className,
  style,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        scrollToSection(e, href);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
