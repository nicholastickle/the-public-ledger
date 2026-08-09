'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Background player for the "Rule, Britannia!" tune (Thomas Arne, 1740 — the
 * composition is centuries out of copyright; see public/audio/README.md for
 * the recording's own licensing).
 *
 * The tune runs continuously from page load, muted. Toggling only lifts or
 * reapplies the mute — it never pauses, seeks, or restarts — so unmuting drops
 * you into wherever the tune has got to rather than back at the first bar.
 *
 * The audio element and its state live here, in a single provider mounted
 * once at the root, so the mute control can be rendered in several places at
 * once (each nav's row, a modal's close-button corner) without ever
 * restarting playback or losing the mute state when one of those renders
 * unmounts.
 */
const AUDIO_SRC = '/audio/rule-britannia.m4a';

/** Silence between repeats of the tune. */
const LOOP_GAP_MS = 2000;

/**
 * Playback level once unmuted. The recording itself is fairly restrained
 * (peaks around −5 dBFS, averages around −23), and unmuting is a deliberate
 * act, so this sits higher than a typical ambient bed would.
 */
const VOLUME = 0.7;

/**
 * jsdom (and any browser mid-teardown) can throw synchronously from play(),
 * and browsers reject the returned promise when autoplay is refused. Normalise
 * both into a rejected promise so callers only need one code path.
 */
function safePlay(el: HTMLAudioElement): Promise<void> {
  try {
    return Promise.resolve(el.play()).then(() => undefined);
  } catch {
    return Promise.reject(new Error('play() unavailable'));
  }
}

interface SoundContextValue {
  muted: boolean;
  toggle: () => void;
}

/** Muted, inert defaults so a mute button rendered without a provider (e.g. a
 *  component under test in isolation) degrades to a harmless no-op instead
 *  of throwing. `layout.tsx` always wraps the app in `SoundProvider`, so real
 *  usage is unaffected. */
const DEFAULT_VALUE: SoundContextValue = {
  muted: true,
  toggle: () => {},
};

const SoundContext = createContext<SoundContextValue>(DEFAULT_VALUE);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inGapRef = useRef(false);

  // Start the tune on mount. Muted autoplay is permitted by every current
  // browser, so playback is already underway before anyone touches a toggle.
  //
  // Playback is started here rather than with an `autoPlay` attribute on the
  // element: React does not emit `muted` into server-rendered markup, so an
  // autoplaying element could briefly be audible between HTML parse and
  // hydration. Muting imperatively first removes that window entirely.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = true;
    el.volume = VOLUME;

    let removeFallback: (() => void) | undefined;
    let unmounted = false;

    safePlay(el).catch(() => {
      // Some browsers (and stricter user settings) refuse even muted autoplay.
      // Fall back to the first interaction of any kind, which is always allowed.
      if (unmounted) return;
      const onFirstInteraction = () => void safePlay(el).catch(() => {});
      const opts = { once: true, passive: true } as const;
      window.addEventListener('pointerdown', onFirstInteraction, opts);
      window.addEventListener('keydown', onFirstInteraction, opts);
      removeFallback = () => {
        window.removeEventListener('pointerdown', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
      };
    });

    return () => {
      unmounted = true;
      removeFallback?.();
      if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    };
  }, []);

  // The element deliberately has no `loop` attribute: looping natively would
  // restart instantly, and the tune wants a breath between repeats.
  const handleEnded = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    inGapRef.current = true;
    gapTimerRef.current = setTimeout(() => {
      inGapRef.current = false;
      const current = audioRef.current;
      if (!current) return;
      current.currentTime = 0;
      void safePlay(current).catch(() => {});
    }, LOOP_GAP_MS);
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const nextMuted = !el.muted;
    el.muted = nextMuted;
    setMuted(nextMuted);

    // Unmuting resumes rather than restarts. The only case where this starts
    // playback at all is a browser that refused the muted autoplay — there the
    // element is still sitting at zero, and this click is the gesture that
    // releases it. Never interrupt the deliberate gap between repeats.
    if (!nextMuted && el.paused && !inGapRef.current) {
      void safePlay(el).catch(() => {});
    }
  }, []);

  const value = useMemo(() => ({ muted, toggle }), [muted, toggle]);

  return (
    <SoundContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        onEnded={handleEnded}
        preload="auto"
        muted
        aria-hidden="true"
      />
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
