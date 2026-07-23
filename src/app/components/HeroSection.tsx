import HeroFrameNav from './HeroFrameNav';
import VoteCountdown from './VoteCountdown';
import UKNationsMap from './UKNationsMap';

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

function FiligreeCorner({ flipH = false, flipV = false }: { flipH?: boolean; flipV?: boolean }) {
  let t = '';
  if (flipH && flipV) t = 'scale(-1,-1) translate(-80,-80)';
  else if (flipH) t = 'scale(-1,1) translate(-80,0)';
  else if (flipV) t = 'scale(1,-1) translate(0,-80)';

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <g transform={t || undefined}>
        <path d="M 4 76 L 4 4 L 76 4" stroke="#B8960C" strokeWidth="2.5" strokeLinecap="square" />
        <path d="M 13 68 L 13 13 L 68 13" stroke="#B8960C" strokeWidth="0.75" opacity="0.35" />
        <path d="M 4 4 m 0 -5 l 5 5 l -5 5 l -5 -5 Z" fill="#D4AF37" />
        <line x1="4" y1="72" x2="15" y2="72" stroke="#B8960C" strokeWidth="2.5" />
        <line x1="4" y1="65" x2="10" y2="65" stroke="#B8960C" strokeWidth="0.75" opacity="0.4" />
        <line x1="72" y1="4" x2="72" y2="15" stroke="#B8960C" strokeWidth="2.5" />
        <line x1="65" y1="4" x2="65" y2="10" stroke="#B8960C" strokeWidth="0.75" opacity="0.4" />
        <path d="M 19 13 Q 13 13 13 19" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="38" cy="4" r="1.5" fill="#D4AF37" opacity="0.5" />
        <circle cx="4" cy="38" r="1.5" fill="#D4AF37" opacity="0.5" />
      </g>
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="overflow-hidden relative" style={{ backgroundColor: '#0c1610' }}>
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

      <div className="relative z-10 max-w-[1500px] mx-auto px-md sm:px-xl lg:px-3xl py-xl lg:py-3xl">
        <div className="ledger-frame relative">
          {/* Filigree corners */}
          <div className="absolute top-0 left-0 -translate-x-[2px] -translate-y-[2px]"><FiligreeCorner /></div>
          <div className="absolute top-0 right-0 translate-x-[2px] -translate-y-[2px]"><FiligreeCorner flipH /></div>
          <div className="absolute bottom-0 left-0 -translate-x-[2px] translate-y-[2px]"><FiligreeCorner flipV /></div>
          <div className="absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px]"><FiligreeCorner flipH flipV /></div>

          {/* Dark top-fade — guarantees nav legibility over bright sky in the video */}
          <div className="hero-frame-topfade" aria-hidden="true" />

          <div className="relative z-10 px-lg sm:px-2xl lg:px-3xl py-lg sm:py-xl lg:py-2xl">
            {/* Navigation folded into the frame */}
            <HeroFrameNav />

            {/* Main split: countdown + CTA (left) · nations map (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-2xl lg:gap-4xl items-center">

              {/* LEFT — the vote is the hero */}
              <div className="min-w-0">
                <h1
                  className="ledger-headline hero-ink-shadow mb-md"
                  style={{ color: '#FAF6ED', fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)', lineHeight: '1.04' }}
                >
                  The Unofficial
                  <br />
                  National Vote
                </h1>

                <p className="font-mono text-caption uppercase mb-lg hero-ink-shadow" style={{ color: '#E8C840', letterSpacing: '0.16em' }}>
                  Wednesday 30 September 2026 · 20:00 BST
                </p>

                <div className="mb-xl">
                  <VoteCountdown />
                </div>

                <div className="flex flex-col gap-sm">
                  <a href="/signup" className="btn-vote-hero self-start">
                    Vote Now
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className="font-mono text-caption uppercase hero-ink-shadow" style={{ color: 'rgba(232,200,64,0.8)', letterSpacing: '0.14em' }}>
                    Only British citizens are eligible to vote
                  </p>
                </div>
              </div>

              {/* RIGHT — interactive 3D nations map with wax-seal cartouche */}
              <div className="min-w-0">
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
