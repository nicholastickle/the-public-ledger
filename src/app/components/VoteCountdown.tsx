'use client';

import { useEffect, useState } from 'react';

/** The unofficial national vote — Wednesday 30 September 2026, 20:00 BST (19:00 UTC). */
export const VOTE_TARGET_ISO = '2026-09-30T20:00:00+01:00';

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

/** Pure, testable: time left between `nowMs` and `targetMs`. */
export function getRemaining(targetMs: number, nowMs: number): Remaining {
  const diff = targetMs - nowMs;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  targetIso?: string;
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="vote-countdown__unit">
      <span className="vote-countdown__num" suppressHydrationWarning>
        {value}
      </span>
      <span className="vote-countdown__label">{label}</span>
    </div>
  );
}

export default function VoteCountdown({ targetIso = VOTE_TARGET_ISO }: Props) {
  const targetMs = new Date(targetIso).getTime();
  const [r, setR] = useState<Remaining>(() => getRemaining(targetMs, Date.now()));

  useEffect(() => {
    const tick = () => setR(getRemaining(targetMs, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (r.done) {
    return (
      <div className="vote-countdown vote-countdown--live" role="timer" aria-live="polite">
        <p className="vote-countdown__livetext">The national vote is live.</p>
      </div>
    );
  }

  return (
    <div className="vote-countdown" role="timer" aria-live="off">
      <Unit value={pad(r.days)} label="Days" />
      <span className="vote-countdown__sep" aria-hidden="true">:</span>
      <Unit value={pad(r.hours)} label="Hours" />
      <span className="vote-countdown__sep" aria-hidden="true">:</span>
      <Unit value={pad(r.minutes)} label="Mins" />
      <span className="vote-countdown__sep" aria-hidden="true">:</span>
      <Unit value={pad(r.seconds)} label="Secs" />
    </div>
  );
}
