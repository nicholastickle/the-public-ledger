interface Props {
  /** What the tooltip explains — also the accessible name of the trigger. */
  label: string;
  tip: string;
  /** What kind of thing `label` names, for the trigger's accessible name. */
  scope?: 'column' | 'stage';
  /** Anchors the tooltip to one of its edges rather than centring it, for
   *  triggers close enough to the table's edge that a centred box would spill. */
  align?: 'left' | 'right';
}

/** A small circled "i" that tucks against a heading and explains it on hover or
 *  keyboard focus. Used for both column headers and stage bands.
 *
 *  A real `<button>` rather than a `<span tabIndex={0}>`: on iOS Safari a plain
 *  span only becomes focusable by tapping if the user has "Full Keyboard
 *  Access" turned on (off by default for virtually everyone), so a span-based
 *  trigger never opens on tap — hover never fires on touch either, so the tip
 *  was unreachable there. Buttons are natively tap-focusable everywhere. */
export default function InfoTip({ label, tip, scope = 'column', align }: Props) {
  return (
    <button
      type="button"
      className="header-tip info-tip"
      data-tooltip={tip}
      data-align={align}
      aria-label={`About the ${label} ${scope}`}
    >
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="4.9" r="0.95" fill="currentColor" />
        <path d="M8 7.1v4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </button>
  );
}
