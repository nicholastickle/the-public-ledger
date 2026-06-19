'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    number: '01',
    title: 'Find a bill or regulation before Parliament.',
    description:
      'Browse legislation and regulations currently being debated at Westminster. Every entry includes a plain-English summary drawn from the official parliamentary record.',
    badge: null as string | null,
  },
  {
    number: '02',
    title: 'Verify your identity.',
    description:
      'The Public Ledger is open to British citizens only. Before casting your first shadow vote you will need to verify your identity. This keeps the record honest and every vote accountable.',
    badge: 'British Citizens Only' as string | null,
  },
  {
    number: '03',
    title: 'Read both sides, then vote.',
    description:
      'Review the key arguments for and against. Cast your YES or NO shadow vote to place your position on the public record.',
    badge: null as string | null,
  },
  {
    number: '04',
    title: 'Watch the verdict unfold.',
    description:
      'When Parliament divides, the ledger reveals how citizen opinion aligned — or diverged — from your elected representatives.',
    badge: null as string | null,
  },
];

const TOTAL_SLIDES = STEPS.length + 1;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);

  const handleClose = useCallback(() => { onClose(); }, [onClose]);

  useEffect(() => { if (!isOpen) setStep(0); }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const isLastSlide = step === TOTAL_SLIDES - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      style={{ background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(5px)' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[460px] flex flex-col"
        style={{
          background: 'var(--color-parchment)',
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, rgba(184,150,12,0.1) 47px, rgba(184,150,12,0.1) 48px)',
          border: '1px solid rgba(184,150,12,0.4)',
          borderTop: '3px solid var(--color-forest-green)',
          minHeight: 'min(540px, calc(100dvh - 80px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-md right-md z-10 flex items-center justify-center w-7 h-7"
          style={{
            color: 'rgba(27,67,50,0.45)',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'var(--color-forest-green)';
            el.style.borderColor = 'rgba(184,150,12,0.3)';
            el.style.background = 'rgba(27,67,50,0.06)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'rgba(27,67,50,0.45)';
            el.style.borderColor = 'transparent';
            el.style.background = 'transparent';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Illustration area — fixed 168px on every slide */}
        <div
          className="flex items-center justify-center flex-shrink-0 overflow-hidden relative"
          style={{
            height: 168,
            borderBottom: '1px solid rgba(184,150,12,0.2)',
            background: isLastSlide
              ? 'rgba(27,67,50,0.05)'
              : step === 1
                ? 'rgba(27,67,50,0.05)'
                : 'rgba(184,150,12,0.05)',
          }}
        >
          {isLastSlide
            ? <ScalesIllustration />
            : <StepIllustration index={step} />}
        </div>

        {/* Content area — flex-1 so all slides stretch to the same height */}
        <div className="flex-1 flex flex-col px-xl pt-lg pb-xl">
          {!isLastSlide ? (
            <StepContent
              step={STEPS[step]}
              onNext={() => setStep((s) => s + 1)}
              currentSlide={step}
              totalSlides={TOTAL_SLIDES}
            />
          ) : (
            <FinalContent
              onClose={handleClose}
              currentSlide={step}
              totalSlides={TOTAL_SLIDES}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step content ───────────────────────────────────────────────────── */

function StepContent({
  step,
  onNext,
  currentSlide,
  totalSlides,
}: {
  step: typeof STEPS[0];
  onNext: () => void;
  currentSlide: number;
  totalSlides: number;
}) {
  return (
    <>
      {/* Eyebrow */}
      <div
        className="flex items-center gap-xs mb-sm"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(184,150,12,0.85)',
        }}
      >
        <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(184,150,12,0.5)' }} />
        Step {step.number}
      </div>

      {/* Title */}
      <h2
        className="mb-sm"
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--color-forest-green)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        {step.title}
      </h2>

      {/* Description — grows to fill remaining space */}
      <p className="text-body-sm flex-1" style={{ color: '#4A3C2A', lineHeight: 1.7 }}>
        {step.description}
      </p>

      {/* Badge row — always reserves space so heights stay equal */}
      <div style={{ minHeight: 44 }} className="flex items-center">
        {step.badge && (
          <div
            className="inline-flex items-center gap-xs"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-forest-green)',
              background: 'rgba(27,67,50,0.08)',
              border: '1px solid rgba(27,67,50,0.2)',
              borderRadius: '2px',
              padding: '4px 10px',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="4.5" stroke="#1B4332" strokeWidth="1" />
              <path d="M3 5l1.5 1.5L7 3.5" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
            </svg>
            {step.badge}
          </div>
        )}
      </div>

      {/* Next */}
      <button onClick={onNext} className="btn-ledger-primary w-full justify-center mb-xs">
        Next
      </button>

      <ProgressDots current={currentSlide} total={totalSlides} />
    </>
  );
}

/* ── Final slide ────────────────────────────────────────────────────── */

function FinalContent({
  onClose,
  currentSlide,
  totalSlides,
}: {
  onClose: () => void;
  currentSlide: number;
  totalSlides: number;
}) {
  return (
    <>
      <p
        className="font-mono uppercase mb-xs"
        style={{ color: 'var(--color-forest-green)', fontSize: '10px', letterSpacing: '0.2em' }}
      >
        A note on impartiality
      </p>

      {/* Text — flex-1 fills the gap to keep card the same height */}
      <p className="text-body-sm flex-1" style={{ color: '#4A3C2A', lineHeight: 1.7 }}>
        The Public Ledger deliberately withholds the names of those who sponsor or bring forward
        legislation, and does not reveal how Parliament divided on any bill. Your shadow vote should
        reflect your view of the policy — not the party behind it.
      </p>

      <div
        style={{
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(184,150,12,0.4) 30%, rgba(184,150,12,0.4) 70%, transparent)',
          margin: '20px 0 16px',
        }}
      />

      <p
        className="font-mono uppercase mb-md text-center"
        style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(27,67,50,0.5)' }}
      >
        Cast your first shadow vote
      </p>

      <Link href="/signup" className="btn-ledger-primary w-full justify-center mb-sm" onClick={onClose}>
        Create an account
      </Link>

      <div className="flex items-center justify-center gap-xs mb-xs">
        <span className="text-body-sm" style={{ color: '#6B5C42' }}>Already have an account?</span>
        <Link
          href="/login"
          className="text-body-sm font-medium"
          style={{ color: 'var(--color-forest-green)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          onClick={onClose}
        >
          Log in
        </Link>
      </div>

      <ProgressDots current={currentSlide} total={totalSlides} />
    </>
  );
}

/* ── Progress dots ──────────────────────────────────────────────────── */

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex justify-center items-center gap-xs mt-md">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? '18px' : '5px',
            height: '5px',
            borderRadius: '999px',
            background: i === current ? 'var(--color-forest-green)' : 'rgba(184,150,12,0.3)',
            transition: 'width 0.2s ease, background 0.2s ease',
          }}
        />
      ))}
    </div>
  );
}

/* ── Illustrations ──────────────────────────────────────────────────── */

function StepIllustration({ index }: { index: number }) {
  switch (index) {
    case 0: return <BillIllustration />;
    case 1: return <VerifyIllustration />;
    case 2: return <VoteIllustration />;
    case 3: return <VerdictIllustration />;
    default: return null;
  }
}

function BillIllustration() {
  const rowsL = [36, 50, 64, 78, 92, 106];
  const rowsR = [36, 50, 64, 78];
  return (
    <svg width="260" height="130" viewBox="0 0 260 130" fill="none" aria-hidden="true">
      {/* Left page */}
      <rect x="6" y="8" width="110" height="114" rx="1" fill="rgba(255,255,255,0.55)"
        stroke="rgba(27,67,50,0.3)" strokeWidth="1.2" />
      {/* Left page title */}
      <rect x="16" y="20" width="52" height="6" rx="0.5" fill="#1B4332" fillOpacity="0.55" />
      {/* Left column divider */}
      <line x1="80" y1="30" x2="80" y2="112" stroke="rgba(184,150,12,0.3)" strokeWidth="0.75" />
      {/* Left ruled lines + filled entries */}
      {rowsL.map((y) => (
        <g key={y}>
          <line x1="16" y1={y} x2="108" y2={y} stroke="#B8960C" strokeWidth="0.75" strokeOpacity="0.38" />
          <rect x="16" y={y - 8} width={44 + ((y * 7) % 18)} height="6" rx="0.5" fill="#1B4332" fillOpacity="0.18" />
          <rect x="84" y={y - 8} width="18" height="6" rx="0.5" fill="#1B4332" fillOpacity="0.18" />
        </g>
      ))}

      {/* Spine */}
      <rect x="116" y="4" width="14" height="122" fill="#1B4332" />
      <line x1="123" y1="4" x2="123" y2="126" stroke="#B8960C" strokeWidth="0.75" strokeOpacity="0.45" />
      <rect x="117" y="16" width="12" height="2" fill="#B8960C" fillOpacity="0.3" />
      <rect x="117" y="110" width="12" height="2" fill="#B8960C" fillOpacity="0.3" />

      {/* Right page */}
      <rect x="130" y="8" width="110" height="114" rx="1" fill="rgba(250,246,237,0.85)"
        stroke="rgba(184,150,12,0.35)" strokeWidth="1.2" />
      {/* Right page title */}
      <rect x="140" y="20" width="36" height="6" rx="0.5" fill="#1B4332" fillOpacity="0.4" />
      {/* Right column divider */}
      <line x1="200" y1="30" x2="200" y2="86" stroke="rgba(184,150,12,0.25)" strokeWidth="0.75" />
      {/* Right ruled lines + filled entries */}
      {rowsR.map((y) => (
        <g key={y}>
          <line x1="140" y1={y} x2="232" y2={y} stroke="#B8960C" strokeWidth="0.75" strokeOpacity="0.32" />
          <rect x="140" y={y - 8} width={38 + ((y * 5) % 16)} height="6" rx="0.5" fill="#1B4332" fillOpacity="0.15" />
          <rect x="204" y={y - 8} width="22" height="6" rx="0.5" fill="#1B4332" fillOpacity="0.15" />
        </g>
      ))}
      {/* Seal — bottom right of right page */}
      <circle cx="192" cy="100" r="14" stroke="#B8960C" strokeWidth="1" fill="rgba(184,150,12,0.06)"
        strokeDasharray="2.5 2" />
      <circle cx="192" cy="100" r="9" stroke="#B8960C" strokeWidth="0.75" fill="none" />
      <path d="M188 100l3 3 6-6" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}

function VerifyIllustration() {
  return (
    <svg width="200" height="130" viewBox="0 0 200 130" fill="none" aria-hidden="true">
      {/* Shield body */}
      <path
        d="M100 10 L38 36 L38 76 C38 104 68 122 100 130 C132 122 162 104 162 76 L162 36 Z"
        fill="rgba(27,67,50,0.09)"
        stroke="#1B4332"
        strokeWidth="1.8"
      />
      {/* Shield inner border */}
      <path
        d="M100 20 L46 42 L46 76 C46 100 72 116 100 123 C128 116 154 100 154 76 L154 42 Z"
        fill="none"
        stroke="rgba(184,150,12,0.4)"
        strokeWidth="0.8"
      />
      {/* Crown above shield */}
      <path d="M76 10 L76 2 L84 8 L100 0 L116 8 L124 2 L124 10"
        stroke="#B8960C" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(184,150,12,0.12)" />

      {/* Large checkmark inside shield */}
      <path
        d="M72 72 L90 90 L128 52"
        stroke="#1B4332"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M72 72 L90 90 L128 52"
        stroke="#B8960C"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

    </svg>
  );
}

function VoteIllustration() {
  return (
    <svg width="260" height="130" viewBox="0 0 260 130" fill="none" aria-hidden="true">
      {/* YES card */}
      <rect x="15" y="12" width="100" height="106" rx="2"
        fill="rgba(27,67,50,0.08)" stroke="#1B4332" strokeWidth="1.5" />
      <rect x="15" y="12" width="100" height="5" rx="1" fill="#1B4332" fillOpacity="0.5" />
      <text x="65" y="29" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11"
        fontWeight="700" fill="#1B4332" letterSpacing="0.1em">YES</text>
      {/* Tick — 30×30 box, centred at (65, 76): x 50→80, y 61→91 */}
      <path d="M50 83 L59 91 L80 61" stroke="#1B4332" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* NO card */}
      <rect x="145" y="12" width="100" height="106" rx="2"
        fill="rgba(184,150,12,0.07)" stroke="#B8960C" strokeWidth="1.5" />
      <rect x="145" y="12" width="100" height="5" rx="1" fill="#B8960C" fillOpacity="0.4" />
      <text x="195" y="29" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11"
        fontWeight="700" fill="#B8960C" letterSpacing="0.1em">NO</text>
      {/* Cross — 30×30 box, centred at (195, 76): x 180→210, y 61→91 */}
      <path d="M180 61 L210 91 M210 61 L180 91" stroke="#B8960C" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function VerdictIllustration() {
  return (
    <svg width="260" height="130" viewBox="0 0 260 130" fill="none" aria-hidden="true">
      {/* Parchment background */}
      <rect width="260" height="130" rx="1" fill="rgba(250,246,237,0.7)" />
      <rect width="260" height="130" rx="1" stroke="rgba(184,150,12,0.32)" strokeWidth="1" fill="none" />

      {/* Centre divider */}
      <line x1="130" y1="10" x2="130" y2="120" stroke="rgba(184,150,12,0.3)" strokeWidth="1" />

      {/* ── PUBLIC VOTE (left) ── */}
      <text x="65" y="21" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="600"
        fill="rgba(27,67,50,0.85)" letterSpacing="0.14em">PUBLIC VOTE</text>
      <text x="65" y="31" textAnchor="middle" fontFamily="monospace" fontSize="6.5"
        fill="rgba(184,150,12,0.75)" letterSpacing="0.08em">2ND READING</text>
      <line x1="14" y1="37" x2="116" y2="37" stroke="rgba(184,150,12,0.28)" strokeWidth="0.75" />

      {/* Up arrow — centred in left column, y=62 */}
      <polygon points="28,69 34,55 40,69" fill="#16A34A" />
      <text x="46" y="70" fontFamily="system-ui,sans-serif" fontSize="20" fontWeight="700" fill="#16A34A">14.2k</text>

      {/* Down arrow — centred in left column, y=96 */}
      <polygon points="28,89 34,103 40,89" fill="#DC2626" />
      <text x="46" y="104" fontFamily="system-ui,sans-serif" fontSize="20" fontWeight="700" fill="#DC2626">3.8k</text>

      {/* ── GOV. VOTE (right) ── */}
      <text x="195" y="21" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="600"
        fill="rgba(27,67,50,0.85)" letterSpacing="0.14em">GOV. VOTE</text>
      <text x="195" y="31" textAnchor="middle" fontFamily="monospace" fontSize="6.5"
        fill="rgba(184,150,12,0.75)" letterSpacing="0.08em">DIVISION</text>
      <line x1="140" y1="37" x2="246" y2="37" stroke="rgba(184,150,12,0.28)" strokeWidth="0.75" />

      {/* Aye checkmark — centred in right column, y=62 */}
      <path d="M163 62 L168 69 L179 55" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="184" y="70" fontFamily="system-ui,sans-serif" fontSize="20" fontWeight="700" fill="#16A34A">312</text>
      <text x="220" y="70" fontFamily="monospace" fontSize="7" fill="rgba(22,163,74,0.75)" letterSpacing="0.1em">AYE</text>

      {/* No cross — centred in right column, y=96 */}
      <path d="M163 89 L179 103 M179 89 L163 103" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
      <text x="184" y="104" fontFamily="system-ui,sans-serif" fontSize="20" fontWeight="700" fill="#DC2626">187</text>
      <text x="220" y="104" fontFamily="monospace" fontSize="7" fill="rgba(220,38,38,0.75)" letterSpacing="0.1em">NO</text>
    </svg>
  );
}

function ScalesIllustration() {
  return (
    <svg width="200" height="130" viewBox="0 0 200 130" fill="none" aria-hidden="true">
      {/* Pillar */}
      <line x1="100" y1="16" x2="100" y2="108" stroke="#1B4332" strokeWidth="2" strokeLinecap="square" />
      {/* Base */}
      <rect x="70" y="108" width="60" height="6" rx="1" fill="#1B4332" fillOpacity="0.6" />
      <rect x="60" y="114" width="80" height="4" rx="1" fill="#1B4332" fillOpacity="0.35" />

      {/* Beam — slightly tilted */}
      <line x1="26" y1="30" x2="174" y2="26" stroke="#1B4332" strokeWidth="2" strokeLinecap="square" />
      {/* Beam pivot */}
      <circle cx="100" cy="28" r="5" fill="#1B4332" />
      <circle cx="100" cy="28" r="3" fill="#B8960C" fillOpacity="0.6" />

      {/* Left chain (longer — pan sits lower) */}
      <line x1="40" y1="30" x2="40" y2="62" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.5"
        strokeDasharray="2.5 2" />
      <line x1="36" y1="30" x2="36" y2="62" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.5"
        strokeDasharray="2.5 2" />

      {/* Right chain (shorter — pan sits higher) */}
      <line x1="158" y1="26" x2="158" y2="50" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.5"
        strokeDasharray="2.5 2" />
      <line x1="162" y1="26" x2="162" y2="50" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.5"
        strokeDasharray="2.5 2" />

      {/* Left pan (lower) */}
      <path d="M18 62 Q38 70 58 62" stroke="#B8960C" strokeWidth="1.6" fill="rgba(184,150,12,0.1)" />
      <line x1="18" y1="62" x2="58" y2="62" stroke="#B8960C" strokeWidth="0.8" strokeOpacity="0.5" />
      {/* Left pan suspension bar */}
      <line x1="18" y1="62" x2="36" y2="62" stroke="#B8960C" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="58" y1="62" x2="36" y2="62" stroke="#B8960C" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* Right pan (higher) */}
      <path d="M142 50 Q162 58 182 50" stroke="#B8960C" strokeWidth="1.6" fill="rgba(184,150,12,0.1)" />
      <line x1="142" y1="50" x2="182" y2="50" stroke="#B8960C" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Left pan contents — small circles representing "policy" */}
      <circle cx="32" cy="60" r="3.5" fill="#1B4332" fillOpacity="0.3" stroke="#1B4332" strokeWidth="0.8" />
      <circle cx="44" cy="59" r="3.5" fill="#1B4332" fillOpacity="0.3" stroke="#1B4332" strokeWidth="0.8" />

      {/* Labels */}
      <text x="38" y="82" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8"
        fill="#4A3C2A" fillOpacity="0.7">POLICY</text>
      <text x="162" y="68" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8"
        fill="#4A3C2A" fillOpacity="0.7">PARTY</text>
    </svg>
  );
}
