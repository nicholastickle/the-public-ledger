'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useSound } from '../../lib/SoundContext';

interface Props {
  /** Defaults to the dark ledger styling; pass a variant modifier for other
   *  surfaces (e.g. `"sound-toggle sound-toggle--light"`). */
  className?: string;
}

/** Burst geometry — angle around the icon, and a colour drawn from the
 *  ledger palette (gold / forest-green / seal-red) rather than a generic
 *  rainbow, plus a slight stagger so the sparks don't all pop in lockstep. */
const SPARKS = [
  { angle: 0, color: '#D4AF37', delay: 0 },
  { angle: 40, color: '#8B1A1A', delay: 40 },
  { angle: 80, color: '#2D6A4F', delay: 10 },
  { angle: 120, color: '#D4AF37', delay: 60 },
  { angle: 160, color: '#8B1A1A', delay: 20 },
  { angle: 200, color: '#2D6A4F', delay: 50 },
  { angle: 240, color: '#D4AF37', delay: 5 },
  { angle: 280, color: '#8B1A1A', delay: 35 },
  { angle: 320, color: '#2D6A4F', delay: 15 },
];

/** Comfortably longer than the CSS burst animation (620ms + the longest
 *  spark delay above) so every spark finishes before this unmounts them. */
const FIREWORKS_DURATION_MS = 1000;

/** Presentational mute/unmute control. Reads shared playback state from
 *  `SoundContext` so it can be rendered in several places — a nav row, a
 *  modal's close-button corner — without ever owning its own audio element. */
export default function SoundToggleButton({ className = 'sound-toggle' }: Props) {
  const { muted, toggle, fireworksTick } = useSound();
  const [showFireworks, setShowFireworks] = useState(false);

  // fireworksTick starts at 0, which no real finale ever produces, so this
  // skips firing a burst just because the button mounted.
  useEffect(() => {
    if (fireworksTick === 0) return;
    setShowFireworks(true);
    const timer = setTimeout(() => setShowFireworks(false), FIREWORKS_DURATION_MS);
    return () => clearTimeout(timer);
  }, [fireworksTick]);

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      data-playing={!muted}
      data-fireworks={showFireworks}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute Rule Britannia' : 'Mute Rule Britannia'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
      {showFireworks && (
        <span className="sound-toggle__fireworks" key={fireworksTick} aria-hidden="true">
          {SPARKS.map((spark, i) => (
            <span
              key={i}
              className="sound-toggle__spark"
              style={{
                '--spark-angle': `${spark.angle}deg`,
                '--spark-color': spark.color,
                animationDelay: `${spark.delay}ms`,
              } as CSSProperties}
            />
          ))}
        </span>
      )}
    </button>
  );
}
