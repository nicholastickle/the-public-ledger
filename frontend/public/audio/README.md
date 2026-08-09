# Hero audio asset

`rule-britannia.m4a` is the looping background tune, played by
`src/app/components/SoundToggle.tsx`.

Current file: 3:14, stereo 48 kHz AAC @ 192 kbps, 4.7 MB.

If you replace it, keep the same filename and path — no code changes are then
needed — and keep these properties:

- **Format:** AAC in an MP4 container (`.m4a`)
- **Faststart (optional, not currently applied):** the committed file has its
  `moov` atom *after* `mdat` — `afinfo` reports `not optimized`. That costs one
  extra range request before playback can begin, which is harmless here since
  the tune starts muted and nobody is waiting on the first note. Moving `moov`
  to the front (`ffmpeg -movflags +faststart`) would remove it if the delay
  ever matters.
- **Trimmed tight at both ends.** The player adds its own 2-second gap between
  repeats, so silence baked into the file compounds it. The current file has
  15 ms of lead-in and 307 ms of tail after the fade.
- **Size:** it is fetched on every page load. 4.7 MB is on the heavy side; if
  that becomes a concern, re-encoding to mono 128 kbps would cut it to roughly
  1.5 MB with no meaningful loss for background music.

Note: *Rule, Britannia!* (Thomas Arne, 1740) is long out of copyright as a
composition, but any specific **recording** of it carries its own rights.
