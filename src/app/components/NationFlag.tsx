import { useId } from 'react';
import type { UKNationKey } from '../data/uk-nations';
import { WALES_FLAG_INNER } from '../data/wales-flag';

interface Props {
  nation: UKNationKey;
  /** rendered width in px; height follows the 5:3 flag ratio */
  width?: number;
  className?: string;
}

/**
 * Inline SVG flag for each UK constituent nation.
 * England — St George's Cross. Scotland — the Saltire. Wales — Y Ddraig Goch.
 * Northern Ireland — the Ulster Banner (St George's Cross with the crowned
 * six-pointed star and the Red Hand of Ulster).
 */
export default function NationFlag({ nation, width = 40, className }: Props) {
  const uid = useId().replace(/:/g, '');
  const h = Math.round((width * 3) / 5);
  const common = {
    width,
    height: h,
    className,
    role: 'img' as const,
  };

  if (nation === 'wales') {
    // dragon flag is authored at 640×480 (4:3); keep that ratio
    const wh = Math.round((width * 3) / 4);
    return (
      <svg
        width={width}
        height={wh}
        viewBox="0 0 640 480"
        className={className}
        role="img"
        aria-label="Flag of Wales"
        dangerouslySetInnerHTML={{ __html: WALES_FLAG_INNER }}
      />
    );
  }

  if (nation === 'england') {
    return (
      <svg {...common} viewBox="0 0 50 30" aria-label="Flag of England">
        <rect width="50" height="30" fill="#ffffff" />
        <rect x="21" width="8" height="30" fill="#CE1124" />
        <rect y="11" width="50" height="8" fill="#CE1124" />
      </svg>
    );
  }

  if (nation === 'scotland') {
    return (
      <svg {...common} viewBox="0 0 50 30" aria-label="Flag of Scotland">
        <clipPath id={`sc-${uid}`}>
          <rect width="50" height="30" />
        </clipPath>
        <g clipPath={`url(#sc-${uid})`}>
          <rect width="50" height="30" fill="#0b4da2" />
          <path d="M0 0 L50 30 M50 0 L0 30" stroke="#ffffff" strokeWidth="6" />
        </g>
      </svg>
    );
  }

  // northern ireland — the Ulster Banner
  return (
    <svg {...common} viewBox="0 0 50 30" aria-label="Flag of Northern Ireland">
      <rect width="50" height="30" fill="#ffffff" />
      {/* St George's Cross */}
      <rect x="21" width="8" height="30" fill="#CE1124" />
      <rect y="11" width="50" height="8" fill="#CE1124" />
      {/* six-pointed star */}
      <path
        d="M25 9 L26.73 12 L30.2 12 L28.46 15 L30.2 18 L26.73 18 L25 21 L23.27 18 L19.8 18 L21.54 15 L19.8 12 L23.27 12 Z"
        fill="#ffffff"
      />
      {/* Red Hand of Ulster */}
      <g fill="#CE1124">
        <rect x="23.5" y="14.9" width="3" height="2.3" rx="0.5" />
        <rect x="23.65" y="13.1" width="0.55" height="2.1" rx="0.25" />
        <rect x="24.4" y="12.7" width="0.55" height="2.5" rx="0.25" />
        <rect x="25.15" y="12.7" width="0.55" height="2.5" rx="0.25" />
        <rect x="25.9" y="13.1" width="0.55" height="2.1" rx="0.25" />
        <rect x="22.7" y="14" width="0.5" height="1.7" rx="0.2" transform="rotate(-32 22.95 14.85)" />
      </g>
      {/* Crown */}
      <g>
        <path d="M21.6 6.6 L21.6 3.6 L23.3 5.1 L25 3.1 L26.7 5.1 L28.4 3.6 L28.4 6.6 Z" fill="#F9D616" stroke="#C8102E" strokeWidth="0.2" />
        <rect x="21.4" y="6.5" width="7.2" height="1.7" rx="0.3" fill="#F9D616" stroke="#C8102E" strokeWidth="0.2" />
        <circle cx="21.6" cy="3.4" r="0.6" fill="#F9D616" />
        <circle cx="25" cy="2.8" r="0.6" fill="#F9D616" />
        <circle cx="28.4" cy="3.4" r="0.6" fill="#F9D616" />
      </g>
    </svg>
  );
}
