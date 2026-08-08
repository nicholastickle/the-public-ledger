const BENCH_ROWS = Array.from({ length: 7 });

/** Schematic plan-view of the Commons chamber — facing bench rows either side
 *  of the centre aisle, the table of the House, dispatch boxes, and the
 *  Speaker's chair. Line-art in the brand's gold-on-forest-green decoration
 *  system (see CrownOrnament, FiligreeCorner) rather than a photograph, so it
 *  reads as ornament, not a literal render of the room. */
export default function ChamberIllustration() {
  return (
    <svg
      viewBox="0 0 480 640"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%' }}
    >
      <rect x="12" y="12" width="456" height="616" rx="2" stroke="#B8960C" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* Speaker's chair + canopy */}
      <path d="M180 40 Q240 14 300 40" stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
      <rect x="196" y="42" width="88" height="46" rx="2" fill="#1B4332" fillOpacity="0.55" stroke="#B8960C" strokeOpacity="0.5" strokeWidth="1.2" />

      {/* Table of the House + dispatch boxes */}
      <rect x="176" y="116" width="22" height="18" rx="1" fill="#D4AF37" fillOpacity="0.45" />
      <rect x="210" y="118" width="60" height="14" rx="1" fill="#B8960C" fillOpacity="0.4" />
      <rect x="282" y="116" width="22" height="18" rx="1" fill="#D4AF37" fillOpacity="0.45" />

      {/* Facing bench rows either side of the centre aisle — each row carries
          seat-divider ticks so it reads as a bench, not a solid bar */}
      {BENCH_ROWS.map((_, i) => {
        const y = 156 + i * 62;
        const opacity = 0.5 - i * 0.03;
        const seats = [1, 2, 3, 4];
        return (
          <g key={i}>
            <rect x="40" y={y} width="170" height="34" rx="2" fill="#2D6A4F" fillOpacity={opacity} stroke="#B8960C" strokeOpacity="0.3" strokeWidth="1" />
            <rect x="270" y={y} width="170" height="34" rx="2" fill="#2D6A4F" fillOpacity={opacity} stroke="#B8960C" strokeOpacity="0.3" strokeWidth="1" />
            {seats.map((s) => (
              <g key={s}>
                <line x1={40 + s * 34} y1={y + 4} x2={40 + s * 34} y2={y + 30} stroke="#B8960C" strokeOpacity="0.18" strokeWidth="1" />
                <line x1={270 + s * 34} y1={y + 4} x2={270 + s * 34} y2={y + 30} stroke="#B8960C" strokeOpacity="0.18" strokeWidth="1" />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
