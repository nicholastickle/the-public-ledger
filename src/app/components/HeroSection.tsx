import type { ParliamentBill } from '../types/parliament';
import Link from 'next/link';

interface Props {
  featuredBills: ParliamentBill[];
}

function UnionJackSeal({ size = 120 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) * 0.96;
  const flagR = (size / 2) * 0.74;
  const textR = (size / 2) * 0.62;

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
        <filter id={`wax-shadow-${size}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#2A0505" floodOpacity="0.4" />
        </filter>
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
        const x = cx + outerR * Math.cos(angle);
        const y = cy + outerR * Math.sin(angle);
        const r = i % 2 === 0 ? size * 0.037 : size * 0.028;
        return <circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? '#8B1A1A' : '#6A1212'} />;
      })}

      {/* Gold rings */}
      <circle cx={cx} cy={cy} r={flagR + size * 0.056} fill="none" stroke="#D4AF37" strokeWidth={size * 0.021} />
      <circle cx={cx} cy={cy} r={flagR + size * 0.027} fill="none" stroke="#F0D060" strokeWidth={size * 0.007} opacity="0.5" />

      {/* Union Jack */}
      <g clipPath={`url(#flag-clip-${size})`}>
        <rect x={cx - flagR} y={cy - flagR} width={flagR * 2} height={flagR * 2} fill="#012169" />
        {/* White diagonals (St Andrew) */}
        <line x1={cx - flagR} y1={cy - flagR} x2={cx + flagR} y2={cy + flagR} stroke="white" strokeWidth={flagR * 0.31} />
        <line x1={cx + flagR} y1={cy - flagR} x2={cx - flagR} y2={cy + flagR} stroke="white" strokeWidth={flagR * 0.31} />
        {/* Red diagonals (St Patrick) */}
        <line x1={cx - flagR} y1={cy - flagR} x2={cx + flagR} y2={cy + flagR} stroke="#C8102E" strokeWidth={flagR * 0.105} />
        <line x1={cx + flagR} y1={cy - flagR} x2={cx - flagR} y2={cy + flagR} stroke="#C8102E" strokeWidth={flagR * 0.105} />
        {/* White cross (St George) */}
        <rect x={cx - flagR * 0.185} y={cy - flagR} width={flagR * 0.37} height={flagR * 2} fill="white" />
        <rect x={cx - flagR} y={cy - flagR * 0.185} width={flagR * 2} height={flagR * 0.37} fill="white" />
        {/* Red cross (St George) */}
        <rect x={cx - flagR * 0.12} y={cy - flagR} width={flagR * 0.24} height={flagR * 2} fill="#C8102E" />
        <rect x={cx - flagR} y={cy - flagR * 0.12} width={flagR * 2} height={flagR * 0.24} fill="#C8102E" />
      </g>

      {/* Circular text path */}
      <path
        id={`seal-arc-${size}`}
        d={`M ${cx},${cy} m -${textR},0 a ${textR},${textR} 0 1,1 ${textR * 2},0 a ${textR},${textR} 0 1,1 -${textR * 2},0`}
        fill="none"
      />
      <text
        fontSize={size * 0.065}
        fontFamily="Georgia, 'Times New Roman', serif"
        fill="#E8C840"
        letterSpacing={size * 0.024}
      >
        <textPath href={`#seal-arc-${size}`} startOffset="2%">
          THE · PUBLIC · LEDGER · EST · MMXXIV ·
        </textPath>
      </text>
    </svg>
  );
}

function FiligreeCorner({ flipH = false, flipV = false }: { flipH?: boolean; flipV?: boolean }) {
  let t = '';
  if (flipH && flipV) t = 'scale(-1,-1) translate(-80,-80)';
  else if (flipH) t = 'scale(-1,1) translate(-80,0)';
  else if (flipV) t = 'scale(1,-1) translate(0,-80)';

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <g transform={t || undefined}>
        {/* Outer L-bracket */}
        <path d="M 4 76 L 4 4 L 76 4" stroke="#B8960C" strokeWidth="2.5" strokeLinecap="square" />
        {/* Inner parallel */}
        <path d="M 13 68 L 13 13 L 68 13" stroke="#B8960C" strokeWidth="0.75" opacity="0.35" />
        {/* Corner diamond */}
        <path d="M 4 4 m 0 -5 l 5 5 l -5 5 l -5 -5 Z" fill="#D4AF37" />
        {/* Horizontal end cap */}
        <line x1="4" y1="72" x2="15" y2="72" stroke="#B8960C" strokeWidth="2.5" />
        <line x1="4" y1="65" x2="10" y2="65" stroke="#B8960C" strokeWidth="0.75" opacity="0.4" />
        {/* Vertical end cap */}
        <line x1="72" y1="4" x2="72" y2="15" stroke="#B8960C" strokeWidth="2.5" />
        <line x1="65" y1="4" x2="65" y2="10" stroke="#B8960C" strokeWidth="0.75" opacity="0.4" />
        {/* Inner corner curl */}
        <path d="M 19 13 Q 13 13 13 19" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* Mid-point decorative dot on horizontal arm */}
        <circle cx="38" cy="4" r="1.5" fill="#D4AF37" opacity="0.5" />
        {/* Mid-point decorative dot on vertical arm */}
        <circle cx="4" cy="38" r="1.5" fill="#D4AF37" opacity="0.5" />
      </g>
    </svg>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center gap-sm" aria-hidden="true">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(184,150,12,0.45) 65%)' }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="#B8960C" />
        <path d="M7 3.5 L10.5 7 L7 10.5 L3.5 7 Z" fill="#FAF6ED" opacity="0.5" />
        <path d="M7 5.5 L8.5 7 L7 8.5 L5.5 7 Z" fill="#B8960C" />
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(184,150,12,0.45) 65%)' }} />
    </div>
  );
}

function CrownOrnament() {
  return (
    <svg width="38" height="30" viewBox="0 0 38 30" fill="none" aria-hidden="true">
      <rect x="2" y="21" width="34" height="7" rx="1" fill="#B8960C" opacity="0.65" />
      <path d="M2 21 L2 9 L11 17 L19 1 L27 17 L36 9 L36 21 Z" fill="#B8960C" opacity="0.6" />
      <path d="M2 21 L2 9 L11 17 L19 1 L27 17 L36 9 L36 21 Z" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
      <rect x="2" y="21" width="34" height="7" rx="1" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
      <circle cx="19" cy="6" r="2.8" fill="#8B1A1A" />
      <circle cx="7" cy="14" r="2" fill="#012169" />
      <circle cx="31" cy="14" r="2" fill="#012169" />
      {/* Highlight on crown jewel */}
      <circle cx="18" cy="5" r="1" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

function BillStatusBadge({ bill }: { bill: ParliamentBill }) {
  if (bill.is_act) return <span className="font-mono text-xs uppercase tracking-wider" style={{ color: '#2D6A4F' }}>Act</span>;
  if (bill.is_defeated) return <span className="font-mono text-xs uppercase tracking-wider" style={{ color: '#8B1A1A' }}>Defeated</span>;
  if (bill.bill_withdrawn) return <span className="font-mono text-xs uppercase tracking-wider" style={{ color: '#888' }}>Withdrawn</span>;
  return <span className="font-mono text-xs uppercase tracking-wider" style={{ color: '#B8960C' }}>Active</span>;
}

export default function HeroSection({ featuredBills }: Props) {
  return (
    <section className="ledger-bg overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl py-2xl lg:py-4xl">

        {/* Main ledger frame */}
        <div className="ledger-frame relative">

          {/* Filigree corners */}
          <div className="absolute top-0 left-0 -translate-x-[2px] -translate-y-[2px]"><FiligreeCorner /></div>
          <div className="absolute top-0 right-0 translate-x-[2px] -translate-y-[2px]"><FiligreeCorner flipH /></div>
          <div className="absolute bottom-0 left-0 -translate-x-[2px] translate-y-[2px]"><FiligreeCorner flipV /></div>
          <div className="absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px]"><FiligreeCorner flipH flipV /></div>

          <div className="px-xl sm:px-2xl lg:px-3xl py-xl sm:py-2xl lg:py-3xl">

            {/* Top eyebrow bar */}
            <div
              className="flex items-center justify-between gap-lg mb-xl pb-lg"
              style={{ borderBottom: '1px solid rgba(184,150,12,0.22)' }}
            >
              <div className="ledger-eyebrow">
                <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#1B4332' }} />
                Shadow Parliament · Live Session
              </div>
              <p className="font-mono text-caption uppercase hidden sm:block" style={{ color: '#B8960C', letterSpacing: '0.16em' }}>
                17 June 2026 · Westminster
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_410px] gap-2xl lg:gap-4xl items-start">

              {/* LEFT: Headline & CTAs */}
              <div>
                <div className="mb-sm"><CrownOrnament /></div>

                <p className="font-mono text-caption uppercase mb-sm" style={{ color: '#B8960C', letterSpacing: '0.22em' }}>
                  The Public Ledger
                </p>

                <h1
                  className="ledger-headline mb-lg"
                  style={{ fontSize: 'clamp(2.6rem, 4.8vw, 4.6rem)', lineHeight: '1.07' }}
                >
                  Your shadow vote
                  <br />
                  <em>on every bill.</em>
                </h1>

                <p className="text-body-md mb-xl" style={{ color: '#4A3C2A', lineHeight: '1.72', maxWidth: '500px' }}>
                  Cast your shadow vote on the same legislation Parliament
                  is debating. See how public opinion compares to your
                  elected representatives.
                </p>

                <OrnamentalDivider />

                <div className="flex flex-wrap gap-sm mt-xl">
                  <a href="/signup" className="btn-ledger-secondary">Cast Your Vote</a>
                </div>
              </div>

              {/* RIGHT: Seal + Bills */}
              <div className="flex flex-col gap-xl lg:pl-3xl lg:border-l lg:border-aged-gold/20">
                {/* Wax seal */}
                <div className="flex flex-col items-center gap-sm">
                  <div className="hidden lg:block">
                    <UnionJackSeal size={172} />
                  </div>
                  <div className="lg:hidden">
                    <UnionJackSeal size={96} />
                  </div>
                </div>

                {/* Bills ledger */}
                {featuredBills.length > 0 ? (
                  <div>
                    <div
                      className="flex items-center justify-between px-sm py-xs mb-xs"
                      style={{
                        borderBottom: '1.5px solid rgba(184,150,12,0.28)',
                        background: 'rgba(27,67,50,0.04)',
                      }}
                    >
                      <span className="font-mono text-caption uppercase tracking-widest" style={{ color: '#B8960C' }}>
                        Current Bills
                      </span>
                      <span className="font-mono text-caption uppercase tracking-widest" style={{ color: '#B8960C' }}>
                        Status
                      </span>
                    </div>
                    <div className="flex flex-col">
                      {featuredBills.map((bill, i) => (
                        <Link key={bill.id} href={`/bills/${bill.id}`} className="ledger-entry group block no-underline">
                          <div className="flex items-start justify-between gap-sm">
                            <div className="flex items-start gap-sm min-w-0">
                              <span
                                className="font-mono text-xs flex-shrink-0 mt-0.5 w-5 text-right"
                                style={{ color: '#B8960C', opacity: 0.42 }}
                              >
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <div className="min-w-0">
                                <p className="font-medium text-body-sm leading-snug" style={{ color: '#1B4332' }}>
                                  {bill.short_title ?? bill.long_title ?? 'Untitled Bill'}
                                </p>
                                {bill.current_stage_name && (
                                  <p className="text-caption text-mute mt-xxs">{bill.current_stage_name}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 pt-0.5">
                              <BillStatusBadge bill={bill} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-md text-right">
                      <Link href="/bills" className="font-mono text-caption" style={{ color: '#B8960C', textDecoration: 'underline', letterSpacing: '0.06em' }}>
                        View all bills →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-center py-2xl px-lg"
                    style={{ border: '1px dashed rgba(184,150,12,0.28)', background: 'rgba(27,67,50,0.025)' }}
                  >
                    <svg width="30" height="38" viewBox="0 0 30 38" fill="none" className="mx-auto mb-sm" aria-hidden="true">
                      <rect x="2" y="2" width="26" height="34" rx="2" stroke="#B8960C" strokeWidth="1.5" opacity="0.4" />
                      <line x1="7" y1="10" x2="23" y2="10" stroke="#B8960C" strokeWidth="1" opacity="0.28" />
                      <line x1="7" y1="15" x2="23" y2="15" stroke="#B8960C" strokeWidth="1" opacity="0.28" />
                      <line x1="7" y1="20" x2="19" y2="20" stroke="#B8960C" strokeWidth="1" opacity="0.28" />
                      <line x1="7" y1="25" x2="21" y2="25" stroke="#B8960C" strokeWidth="1" opacity="0.28" />
                    </svg>
                    <p className="font-mono text-caption uppercase tracking-widest mb-xs" style={{ color: '#1B4332', opacity: 0.38 }}>
                      Awaiting Data
                    </p>
                    <p className="text-caption" style={{ color: '#B8960C', opacity: 0.45, lineHeight: '1.55' }}>
                      Bill records appear here
                      <br />once the ledger is populated.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom motto */}
            <div
              className="mt-2xl pt-md flex items-center justify-center"
              style={{ borderTop: '1px solid rgba(184,150,12,0.16)' }}
            >
              <div className="flex items-center gap-lg">
                <div className="h-px w-8" style={{ background: 'rgba(184,150,12,0.35)' }} />
                <span className="font-mono text-caption uppercase" style={{ color: 'rgba(27,67,50,0.28)', letterSpacing: '0.16em' }}>
                  Fiat Lux &nbsp;·&nbsp; Veritas Vincit &nbsp;·&nbsp; The Public Ledger
                </span>
                <div className="h-px w-8" style={{ background: 'rgba(184,150,12,0.35)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
