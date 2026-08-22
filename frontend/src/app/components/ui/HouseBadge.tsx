import Image from 'next/image';

/** Colour of the Royal Assent badge — purple, matching the crown-topped final
 *  stage on Parliament's own "Bill passage" diagram. Commons/Lords get their
 *  colour from the crest images themselves (see HOUSE_ICON below), not from a
 *  swatch here. */
const ROYAL_ASSENT_COLOR = '#5E2B8C';

/** The actual Commons/Lords portcullis crests, supplied as PNGs in
 *  `public/icons/` — used in place of a hand-drawn approximation. */
const HOUSE_ICON: Record<string, string> = {
  Commons: '/icons/House of commons.png',
  Lords: '/icons/House of lords.png',
};

/** Simplified crown for Royal Assent — there's no official crest for this one
 *  (it belongs to neither House), so it stays a drawn glyph rather than an
 *  image asset. */
function CrownGlyph({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
      <path d="M3 6.4 L5 8.1 L8 3.7 L11 8.1 L13 6.4 L12 11.6 H4 Z" fill="currentColor" />
      <rect x="3.4" y="11.6" width="9.2" height="1.4" rx="0.4" fill="currentColor" />
    </svg>
  );
}

interface Props {
  house: string | null;
  size?: number;
  className?: string;
}

export default function HouseBadge({ house, size = 16, className }: Props) {
  if (house === 'Royal Assent') {
    return (
      <span
        className={`house-badge${className ? ` ${className}` : ''}`}
        title={house}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '999px',
          background: ROYAL_ASSENT_COLOR,
          color: '#FAF6ED',
          flexShrink: 0,
        }}
      >
        <CrownGlyph size={size * 0.68} />
        <span className="sr-only">{house}</span>
      </span>
    );
  }

  if (!house || !(house in HOUSE_ICON)) return null;

  return (
    <span
      className={`house-badge${className ? ` ${className}` : ''}`}
      title={house}
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        borderRadius: '999px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* The crest PNGs are their own full-bleed colour swatch — Parliament's
          own green/crimson — so no separate background fill is needed here. */}
      <Image
        src={HOUSE_ICON[house]}
        alt=""
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <span className="sr-only">{house}</span>
    </span>
  );
}
