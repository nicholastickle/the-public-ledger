'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A best-effort, singable rendition of the "Rule, Britannia!" chorus melody
 * (Thomas Arne, 1740 — the composition is centuries out of copyright).
 * Synthesized in-browser via the Web Audio API rather than an audio file —
 * no asset to license or fetch, works offline, loops seamlessly. This is an
 * approximation from memory rather than a note-perfect transcription.
 */
const NOTE = {
  G4: 392.0, A4: 440.0, B4: 493.88,
  D5: 587.33, E5: 659.25, Fs5: 739.99, G5: 783.99,
} as const;

interface Note {
  freq: number;
  start: number;
  dur: number;
}

function buildMelody(): { notes: Note[]; loopDuration: number } {
  const q = 0.42;
  const h = q * 2;
  const w = q * 4;
  let t = 0;
  const notes: Note[] = [];
  function push(name: keyof typeof NOTE, dur: number) {
    notes.push({ freq: NOTE[name], start: t, dur: dur * 0.92 });
    t += dur;
  }
  // "Rule, Britannia! Britannia, rule the waves:"
  push('G4', q); push('D5', q); push('D5', q); push('E5', q); push('D5', h);
  push('B4', q); push('G4', q); push('D5', q); push('D5', q); push('G5', h);
  // "Britons never, never, never shall be slaves."
  push('G5', q); push('Fs5', q); push('E5', q); push('D5', h);
  push('E5', q); push('Fs5', q); push('G5', q); push('Fs5', q); push('E5', q); push('D5', q);
  push('G4', w);
  return { notes, loopDuration: t + q };
}

function getAudioContextCtor(): typeof AudioContext | undefined {
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  return w.AudioContext ?? w.webkitAudioContext;
}

export default function SoundToggle() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const melodyRef = useRef(buildMelody());

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ctxRef.current?.close();
    };
  }, []);

  function scheduleLoop(ctx: AudioContext) {
    const { notes, loopDuration } = melodyRef.current;
    const startAt = ctx.currentTime + 0.05;
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = n.freq;
      const noteStart = startAt + n.start;
      const noteEnd = noteStart + n.dur;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.02);
      gain.gain.linearRampToValueAtTime(0, noteEnd);
      osc.connect(gain).connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteEnd + 0.02);
    }
    timeoutRef.current = setTimeout(() => scheduleLoop(ctx), loopDuration * 1000);
  }

  function toggle() {
    if (playing) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ctxRef.current?.close();
      ctxRef.current = null;
      setPlaying(false);
      return;
    }
    const AudioCtx = getAudioContextCtor();
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;
    scheduleLoop(ctx);
    setPlaying(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="sound-toggle"
      data-playing={playing}
      aria-pressed={playing}
      aria-label={playing ? 'Mute Rule Britannia' : 'Play Rule Britannia'}
      title={playing ? 'Mute' : 'Play Rule Britannia'}
    >
      {playing ? '🔊' : '🔇'}
    </button>
  );
}
