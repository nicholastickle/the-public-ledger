'use client';

import { useEffect, useRef } from 'react';
import SoundToggleButton from './SoundToggleButton';

interface Props {
  onClose: () => void;
  labelledBy: string;
  /** Tints the panel to match the board it opened from — forest green for
   *  bills, bronze-on-black for regulations. */
  theme?: 'bronze';
  children: React.ReactNode;
}

/** Swipe left by at least this many px, more horizontally than vertically, to
 *  close — short enough to feel responsive, long enough that a normal
 *  vertical scroll inside the panel never triggers it by accident. */
const SWIPE_CLOSE_THRESHOLD = 60;

export default function Modal({ onClose, labelledBy, theme, children }: Props) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (dx < -SWIPE_CLOSE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      style={{ background: 'rgba(4,10,6,0.8)', backdropFilter: 'blur(2px)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="ledger-modal-panel relative w-full"
        data-board-theme={theme}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="ledger-modal-controls">
          <SoundToggleButton className="sound-toggle sound-toggle--modal" />
          <button type="button" onClick={onClose} aria-label="Close" className="ledger-modal-close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
