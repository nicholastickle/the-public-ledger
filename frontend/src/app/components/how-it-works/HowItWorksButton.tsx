'use client';

import { useState } from 'react';
import HowItWorksModal from './HowItWorksModal';

export default function HowItWorksButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-xs flex-shrink-0 ledger-nav-link leading-none"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="How it works"
      >
        <InfoIcon />
        <span>How it works</span>
      </button>

      <HowItWorksModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#1B4332" strokeWidth="1.3" strokeOpacity="0.65" />
      <line x1="8" y1="7" x2="8" y2="11" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.65" />
      <circle cx="8" cy="5" r="0.8" fill="#1B4332" fillOpacity="0.65" />
    </svg>
  );
}
