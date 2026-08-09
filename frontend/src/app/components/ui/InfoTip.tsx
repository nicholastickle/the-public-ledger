'use client';

import { useEffect, useRef, useState } from 'react';

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

/** A small circled "i" that tucks against a heading and explains it on hover,
 *  keyboard focus, or tap. Used for both column headers and stage bands.
 *
 *  Hover and keyboard focus are handled in CSS alone, but tap is driven by
 *  explicit click state rather than `:focus`/`:focus-visible`: on real mobile
 *  WebKit, tapping a button does not reliably leave it matching `:focus` the
 *  way a synthetic click does in desktop testing, so a CSS-only reveal left
 *  the tooltip unreachable on touch even after switching the trigger from a
 *  span to a button. Toggling `data-open` from a click handler works
 *  regardless of how any given browser models a tap. */
export default function InfoTip({ label, tip, scope = 'column', align }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <button
      ref={ref}
      type="button"
      className="header-tip info-tip"
      data-tooltip={tip}
      data-align={align}
      data-open={open || undefined}
      aria-label={`About the ${label} ${scope}`}
      aria-expanded={open}
      onClick={e => {
        e.stopPropagation();
        setOpen(o => !o);
      }}
    >
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="4.9" r="0.95" fill="currentColor" />
        <path d="M8 7.1v4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </button>
  );
}
