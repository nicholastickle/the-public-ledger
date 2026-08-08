'use client';

import { useState } from 'react';
import HowItWorksModal from '../how-it-works/HowItWorksModal';

/** "How it works" has no page of its own — it opens the same modal as the nav
 *  button (HowItWorksButton) — so the footer needs its own small client
 *  island rather than a dead /how-it-works link. */
export default function FooterHowItWorksLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="footer-link text-body-sm"
        style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
      >
        How it works
      </button>
      <HowItWorksModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
