/** Small line icons for the bill/regulation card footer row — stroke-only,
 *  `currentColor`, same weight as InfoTip's "i" glyph so they read as one
 *  icon family across the board. */

export function StageIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M3 1.5v13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M3 2.3c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0v5.3c-1.4 1-2.8 1-4.2 0s-2.8-1-4.2 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NumberIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        d="M5.8 2.5 4.2 13.5M11.8 2.5l-1.6 11M2.3 6h11.4M2 10.2h11.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HouseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M1.5 6.5 8 2l6.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 6.5v6.5M13.5 6.5v6.5M1 13h14M5 8v4M8 8v4M11 8v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function ProcedureIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <rect x="3" y="1.5" width="10" height="13" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5h5M5.5 8h5M5.5 11h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
