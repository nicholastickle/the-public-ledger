import type { ReactElement } from 'react';

/** Simplified line-engraving icons, one per stage of a bill's passage —
 *  quill (First Reading), gavel (Committee), book+lens (Report), scales
 *  (Third Reading), gate (crossing to the other House), crown (Royal
 *  Assent). `currentColor` throughout so a wrapper can set the theme
 *  colour once. */
const ICONS: Record<string, ReactElement> = {
  quill: (
    <>
      <path d="M9 31 L29 11" />
      <path d="M29 11 C31 9 32 6 31 3 C28 2 25 3 23 5 L11 27 Z" />
      <path d="M14 24 L18 20" opacity="0.7" />
      <path d="M9 33 C13 36 21 36 25 33" opacity="0.5" />
    </>
  ),
  gavel: (
    <>
      <rect x="14" y="8" width="12" height="7" rx="1" transform="rotate(35 20 11.5)" />
      <path d="M19 15 L9 25" />
      <path d="M6 28 L12 22" opacity="0.6" />
      <rect x="16" y="30" width="14" height="4" rx="1" opacity="0.6" />
    </>
  ),
  book: (
    <>
      <path d="M20 13 C16 10 8 9 4 11 L4 29 C8 27 16 28 20 31 C24 28 32 27 36 29 L36 11 C32 9 24 10 20 13 Z" />
      <circle cx="25" cy="20" r="5" opacity="0.65" />
      <path d="M29 24 L33 28" opacity="0.65" />
    </>
  ),
  scales: (
    <>
      <path d="M20 6 L20 34" />
      <path d="M11 37 L29 37" />
      <path d="M8 12 L32 12" />
      <path d="M8 12 L4 20 C4 24 12 24 12 20 Z" opacity="0.65" />
      <path d="M32 12 L28 20 C28 24 36 24 36 20 Z" opacity="0.65" />
    </>
  ),
  gate: (
    <>
      <path d="M8 8 L32 8 L32 26 C32 26 24 34 20 34 C16 34 8 26 8 26 Z" />
      <path d="M14 8 L14 29" opacity="0.6" />
      <path d="M20 8 L20 33" opacity="0.6" />
      <path d="M26 8 L26 29" opacity="0.6" />
    </>
  ),
  crown: (
    <>
      <path d="M6 16 L10 6 L16 13 L20 4 L24 13 L30 6 L34 16 Z" />
      <path d="M6 16 L34 16 L32 22 L8 22 Z" />
      <circle cx="10" cy="6" r="1.6" />
      <circle cx="20" cy="4" r="1.6" />
      <circle cx="30" cy="6" r="1.6" />
    </>
  ),
};

// Split across the two margins — early stages on the left, later stages on
// the right — so scanning left to right loosely tracks a bill's passage
// instead of mirroring the same three icons on both sides.
const LEFT_STAGES = ['quill', 'gavel', 'book'] as const;
const RIGHT_STAGES = ['scales', 'gate', 'crown'] as const;

function Roundel({ icon }: { icon: ReactElement }) {
  return (
    <span className="board-margin__roundel">
      <svg viewBox="0 0 40 40" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
    </span>
  );
}

interface Props {
  side: 'left' | 'right';
}

/** Purely decorative ledger ornament for the wide gutters either side of a
 *  board on large screens — a rule threaded with small illustrated
 *  roundels. Colour comes from the `--board-ornament` custom property (see
 *  globals.css), so it reads gold on the Bill Board and bronze on the
 *  Regulation Board automatically. Hidden below ~1680px via CSS, where
 *  there's no real gutter for it to sit in. */
export default function BoardMargin({ side }: Props) {
  const stages = side === 'left' ? LEFT_STAGES : RIGHT_STAGES;
  return (
    <div className={`board-margin board-margin--${side}`} aria-hidden="true">
      <span className="board-margin__rule" />
      <span className="board-margin__ornaments">
        {stages.map(stage => (
          <Roundel key={stage} icon={ICONS[stage]} />
        ))}
      </span>
    </div>
  );
}
