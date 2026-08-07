'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface Props {
  message: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  /** Read by assistive tech in place of the tooltip text, since the bubble
   *  itself only exists in the DOM while open. */
  srLabel: string;
}

/** A tap-to-reveal explanation for a control with no room for its own label —
 *  the padlock standing in for a hidden tally, or the TBD/date chip standing
 *  in for Parliament's vote. Hover-only tooltips don't work on a touchscreen,
 *  so this opens on tap and closes on an outside tap, Escape, or a second tap
 *  on the trigger itself. */
export default function TapInfo({ message, align = 'center', children, srLabel }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const bubbleId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    // Stops the tap from also opening the detail modal the card sits in —
    // both for the trigger itself and for a tap that lands on the bubble.
    <span className="tap-info" ref={wrapRef} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        className="tap-info__trigger"
        aria-expanded={open}
        aria-describedby={open ? bubbleId : undefined}
        aria-label={srLabel}
        onClick={() => setOpen(o => !o)}
      >
        {children}
      </button>
      {open && (
        <span id={bubbleId} role="status" className={`tap-info__bubble tap-info__bubble--${align}`}>
          {message}
        </span>
      )}
    </span>
  );
}
