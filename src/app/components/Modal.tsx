'use client';

import { useEffect } from 'react';

interface Props {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}

export default function Modal({ onClose, labelledBy, children }: Props) {
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
      >
        <button type="button" onClick={onClose} aria-label="Close" className="ledger-modal-close">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
