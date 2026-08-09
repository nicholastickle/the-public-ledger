'use client';

import { useSound } from '../../lib/SoundContext';

interface Props {
  /** Defaults to the dark ledger styling; pass a variant modifier for other
   *  surfaces (e.g. `"sound-toggle sound-toggle--light"`). */
  className?: string;
}

/** Presentational mute/unmute control. Reads shared playback state from
 *  `SoundContext` so it can be rendered in several places — a nav row, a
 *  modal's close-button corner — without ever owning its own audio element. */
export default function SoundToggleButton({ className = 'sound-toggle' }: Props) {
  const { muted, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      data-playing={!muted}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute Rule Britannia' : 'Mute Rule Britannia'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
