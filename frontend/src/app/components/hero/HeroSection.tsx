'use client';

import { useEffect, useState } from 'react';
import HeroFrameNav from '../navigation/HeroFrameNav';
import VoteCountdown from './VoteCountdown';
import UKNationsMap from './UKNationsMap';
import FiligreeCorner from '../ornamental/FiligreeCorner';

// Tailwind's `sm` breakpoint — matches the `sm:min-h-0` that hands height
// back to normal flow above this width.
const MOBILE_BREAKPOINT = 640;

/** The phone hero's height, captured once on landing and held fixed from
 *  then on. `svh` alone should already stop the hero resizing as the
 *  browser's address bar/toolbar shows and hides while scrolling, but real
 *  devices still slip through on some Chrome/Safari versions — so this
 *  locks the height in JS as a hard backstop. Only a genuine width change
 *  (device rotation, an actual window resize) triggers a re-measure; a
 *  height-only change from the toolbar toggling is ignored. Returns `null`
 *  on the server and at desktop widths, where the CSS breakpoint rules
 *  already apply and no lock is wanted. */
function useLockedMobileHeroHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    let lastWidth = window.innerWidth;

    const capture = () => {
      lastWidth = window.innerWidth;
      setHeight(lastWidth < MOBILE_BREAKPOINT ? window.innerHeight : null);
    };

    capture();

    const handleResize = () => {
      if (window.innerWidth !== lastWidth) capture();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
}

function UnionJackSeal({ size = 120 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) * 0.96;
  const flagR = (size / 2) * 0.74;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Union Jack wax seal"
    >
      <defs>
        <clipPath id={`flag-clip-${size}`}>
          <circle cx={cx} cy={cy} r={flagR} />
        </clipPath>
        <radialGradient id={`wax-grad-${size}`} cx="38%" cy="32%" r="68%" gradientUnits="userSpaceOnUse"
          x1={cx - flagR * 0.3} y1={cy - flagR * 0.3} x2={cx + flagR} y2={cy + flagR}>
          <stop offset="0%" stopColor="#A82020" />
          <stop offset="55%" stopColor="#7A1515" />
          <stop offset="100%" stopColor="#4A0C0C" />
        </radialGradient>
      </defs>

      {/* Drop shadow */}
      <circle cx={cx} cy={cy} r={outerR} fill="rgba(0,0,0,0.12)" transform="translate(0, 3)" />

      {/* Wax body */}
      <circle cx={cx} cy={cy} r={outerR} fill={`url(#wax-grad-${size})`} />

      {/* Serrated edge — alternating petals */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i * 360) / 40 * (Math.PI / 180);
        // Rounded to a fixed precision so the server and client — whose
        // Math.cos/Math.sin can differ in the last bit — always serialize
        // the same decimal string and avoid a hydration mismatch.
        const x = Number((cx + outerR * Math.cos(angle)).toFixed(3));
        const y = Number((cy + outerR * Math.sin(angle)).toFixed(3));
        const r = i % 2 === 0 ? size * 0.037 : size * 0.028;
        return <circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? '#8B1A1A' : '#6A1212'} />;
      })}

      {/* Gold rings */}
      <circle cx={cx} cy={cy} r={flagR + size * 0.056} fill="none" stroke="#D4AF37" strokeWidth={size * 0.021} />
      <circle cx={cx} cy={cy} r={flagR + size * 0.027} fill="none" stroke="#F0D060" strokeWidth={size * 0.007} opacity="0.5" />

      {/* Union Jack */}
      <g clipPath={`url(#flag-clip-${size})`}>
        <rect x={cx - flagR} y={cy - flagR} width={flagR * 2} height={flagR * 2} fill="#012169" />
        <line x1={cx - flagR} y1={cy - flagR} x2={cx + flagR} y2={cy + flagR} stroke="white" strokeWidth={flagR * 0.31} />
        <line x1={cx + flagR} y1={cy - flagR} x2={cx - flagR} y2={cy + flagR} stroke="white" strokeWidth={flagR * 0.31} />
        <line x1={cx - flagR} y1={cy - flagR} x2={cx + flagR} y2={cy + flagR} stroke="#C8102E" strokeWidth={flagR * 0.105} />
        <line x1={cx + flagR} y1={cy - flagR} x2={cx - flagR} y2={cy + flagR} stroke="#C8102E" strokeWidth={flagR * 0.105} />
        <rect x={cx - flagR * 0.185} y={cy - flagR} width={flagR * 0.37} height={flagR * 2} fill="white" />
        <rect x={cx - flagR} y={cy - flagR * 0.185} width={flagR * 2} height={flagR * 0.37} fill="white" />
        <rect x={cx - flagR * 0.12} y={cy - flagR} width={flagR * 0.24} height={flagR * 2} fill="#C8102E" />
        <rect x={cx - flagR} y={cy - flagR * 0.12} width={flagR * 2} height={flagR * 0.24} fill="#C8102E" />
      </g>
    </svg>
  );
}

export default function HeroSection() {
  const lockedHeight = useLockedMobileHeroHeight();

  return (
    // svh, not dvh: dvh tracks the browser chrome's actual on-screen height,
    // which changes as the address bar hides/shows while scrolling — the
    // hero would grow and shrink under your thumb and shove every section
    // below it up and down. svh is the CSS-only fallback for the first paint;
    // `lockedHeight` (see above) then pins the exact pixel height measured on
    // landing so the hero holds steady even where a device's svh support
    // still drifts with the toolbar.
    <section
      className="overflow-hidden relative flex flex-col min-h-svh sm:block sm:min-h-0"
      style={{ backgroundColor: 'var(--color-ledger-bg)', ...(lockedHeight ? { minHeight: `${lockedHeight}px` } : null) }}
    >
      {/* Parliament / Big Ben timelapse — now fully visible behind the content */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/parliament-timelapse.mp4" type="video/mp4" />
      </video>
      {/* Legibility scrim — darkest on the left where the copy sits */}
      <div className="absolute inset-0 pointer-events-none hero-video-scrim" aria-hidden="true" />

      <div className="relative z-10 max-w-[1900px] mx-auto px-md sm:px-xl lg:px-2xl py-xl lg:py-3xl flex-1 flex flex-col sm:block w-full">
        <div className="ledger-frame relative flex-1 flex flex-col sm:block">
          {/* Filigree corners */}
          <div className="absolute top-0 left-0 -translate-x-[2px] -translate-y-[2px]"><FiligreeCorner /></div>
          <div className="absolute top-0 right-0 translate-x-[2px] -translate-y-[2px]"><FiligreeCorner flipH /></div>
          <div className="absolute bottom-0 left-0 -translate-x-[2px] translate-y-[2px]"><FiligreeCorner flipV /></div>
          <div className="absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px]"><FiligreeCorner flipH flipV /></div>

          {/* Dark top-fade — guarantees nav legibility over bright sky in the video */}
          <div className="hero-frame-topfade" aria-hidden="true" />

          <div className="relative z-10 px-lg sm:px-2xl lg:px-3xl py-lg sm:py-xl lg:py-2xl flex-1 flex flex-col sm:block">
            {/* Navigation folded into the frame */}
            <HeroFrameNav />

            {/* Main split: countdown + CTA (left) · nations map (right). On
                phones this is the only content below the nav, so it grows to
                fill the rest of the viewport height (min-h-svh above) rather
                than leaving dead space under the CTA. */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-2xl lg:gap-4xl items-stretch sm:items-center flex-1 sm:flex-none">

              {/* LEFT — the vote is the hero. On phones the headline/date/
                  countdown keep the same tight rhythm as desktop — margins,
                  not equal flex gaps — and a single spacer absorbs whatever
                  height is left over, settling the CTA toward the bottom of
                  the frame instead of scattering every element evenly. */}
              <div className="min-w-0 flex flex-col sm:block">
                <h1
                  className="ledger-headline hero-ink-shadow mb-md"
                  style={{ color: '#FAF6ED', fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)', lineHeight: '1.04' }}
                >
                  The Unofficial
                  <br />
                  National Vote
                </h1>

                <p className="font-mono text-caption uppercase mb-2xl sm:mb-lg hero-ink-shadow" style={{ color: '#E8C840', letterSpacing: '0.16em' }}>
                  Wednesday 30 September 2026 · 20:00 BST
                </p>

                <div className="mb-xl">
                  <VoteCountdown />
                </div>

                {/* Equal spacers above and below the CTA centre it in the
                    space between the countdown and the bottom of the frame,
                    rather than pinning it flush to the bottom edge. */}
                <div className="flex-1 sm:hidden" aria-hidden="true" />

                <div className="flex flex-col items-center sm:items-start gap-md sm:gap-sm">
                  <a href="/signup" className="btn-vote-hero">
                    Vote Now
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className="font-mono text-caption uppercase hero-ink-shadow text-center w-full sm:text-left sm:w-auto" style={{ color: 'rgba(232,200,64,0.8)', letterSpacing: '0.14em' }}>
                    Only British citizens are eligible to vote
                  </p>
                </div>

                <div className="flex-1 sm:hidden" aria-hidden="true" />
              </div>

              {/* RIGHT — interactive 3D nations map with wax-seal cartouche.
                  Hidden on phones only: it relies on hover to reveal each
                  nation's flag, which phone viewports can't do, and its height
                  was what pushed the rest of the hero below the fold there. */}
              <div className="min-w-0 hidden sm:block">
                <div className="relative mx-auto" style={{ maxWidth: '350px' }}>
                  <div className="hero-map-seal" aria-hidden="true">
                    <UnionJackSeal size={82} />
                  </div>
                  <UKNationsMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
