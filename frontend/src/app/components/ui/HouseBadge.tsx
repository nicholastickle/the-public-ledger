import Image from 'next/image';

/** Colour of the Royal Assent badge — purple, matching the crown-topped final
 *  stage on Parliament's own "Bill passage" diagram. Commons/Lords get their
 *  colour from the crest images themselves (see HOUSE_ICON below), not from a
 *  swatch here. */
const ROYAL_ASSENT_COLOR = '#5E2B8C';

/** Colour of the "Made" badge — the Regulation Board's bronze, matching that
 *  board's own accent rather than Royal Assent's purple, so the two boards'
 *  final-stage badges never get mistaken for one another. */
const MADE_COLOR = '#A8722F';

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

/** A wax seal, for a statutory instrument being signed into law — an
 *  instrument has no Royal Assent equivalent (a minister makes it, not the
 *  Crown), so it gets its own glyph rather than borrowing the crown. */
function SealGlyph({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.2" fill="currentColor" />
      <path d="M8 4.6v6.8M5.4 6.3l5.2 3.4M10.6 6.3 5.4 9.7" stroke="#14100C" strokeWidth="0.8" strokeLinecap="round" />
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

  if (house === 'Made') {
    return (
      <span
        className={`house-badge${className ? ` ${className}` : ''}`}
        title="Made"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '999px',
          background: MADE_COLOR,
          color: '#FAF6ED',
          flexShrink: 0,
        }}
      >
        <SealGlyph size={size * 0.62} />
        <span className="sr-only">Made</span>
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
