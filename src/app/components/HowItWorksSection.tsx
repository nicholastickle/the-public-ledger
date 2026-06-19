import Link from 'next/link';

const STEPS = [
  {
    numeral: 'I',
    number: '01',
    title: 'Find a bill before Parliament.',
    description:
      'Browse legislation currently being debated at Westminster. Every bill includes a plain-English summary drawn from the official parliamentary record.',
    accent: false,
  },
  {
    numeral: 'II',
    number: '02',
    title: 'Verify your identity.',
    description:
      'The Public Ledger is open to British citizens only. Before casting your first shadow vote you will need to verify your identity. This keeps the record honest and every vote accountable.',
    accent: true,
  },
  {
    numeral: 'III',
    number: '03',
    title: 'Read both sides, then vote.',
    description:
      'Review the key arguments for and against. Cast your YES or NO shadow vote to place your position on the public record.',
    accent: false,
  },
  {
    numeral: 'IV',
    number: '04',
    title: 'Watch the verdict unfold.',
    description:
      'When Parliament divides, the ledger reveals how citizen opinion aligned — or diverged — from your elected representatives.',
    accent: false,
  },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  return (
    <div
      className="relative"
      style={{
        background: step.accent ? 'rgba(27,67,50,0.08)' : 'rgba(255,255,255,0.52)',
        border: step.accent ? '1px solid rgba(27,67,50,0.28)' : '1px solid rgba(184,150,12,0.32)',
        borderTop: step.accent ? '3px solid rgba(27,67,50,0.7)' : '3px solid rgba(184,150,12,0.6)',
      }}
    >
      {/* Large watermark numeral — clipped to card only */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <div
          className="absolute -bottom-4 -right-3 font-serif leading-none"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '110px',
            fontWeight: 700,
            color: 'rgba(184,150,12,0.07)',
            letterSpacing: '-0.04em',
          }}
        >
          {step.numeral}
        </div>
      </div>

      <div className="relative p-lg sm:p-xl">
        {/* Step eyebrow */}
        <div
          className="inline-flex items-center gap-xs mb-md"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(184,150,12,0.85)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '18px',
              height: '1px',
              background: 'rgba(184,150,12,0.5)',
            }}
          />
          Step {step.number}
        </div>

        <h3
          className="mb-sm"
          style={{
            fontFamily: 'var(--font-display), Georgia, "Times New Roman", serif',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-forest-green)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          {step.title}
        </h3>

        <p
          className="text-body-sm"
          style={{ color: '#4A3C2A', lineHeight: 1.7 }}
        >
          {step.description}
        </p>

        {step.accent && (
          <div
            className="inline-flex items-center gap-xs mt-md"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-forest-green)',
              background: 'rgba(27,67,50,0.1)',
              border: '1px solid rgba(27,67,50,0.25)',
              borderRadius: '2px',
              padding: '3px 10px',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="4.5" stroke="#1B4332" strokeWidth="1" />
              <path d="M3 5l1.5 1.5L7 3.5" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
            </svg>
            British Citizens Only
          </div>
        )}
      </div>

      {/* Connector arrow — hidden on last card */}
      {index < STEPS.length - 1 && (
        <div
          className="hidden xl:flex absolute -right-[13px] top-1/2 -translate-y-1/2 z-10 items-center justify-center w-[26px] h-[26px]"
          style={{
            background: 'var(--color-parchment)',
            border: '1px solid rgba(184,150,12,0.4)',
            borderRadius: '50%',
          }}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="#B8960C" strokeWidth="1.4" strokeLinecap="square" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      style={{
        background: 'var(--color-parchment)',
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, rgba(184,150,12,0.12) 47px, rgba(184,150,12,0.12) 48px)',
        borderTop: '1px solid rgba(184,150,12,0.2)',
      }}
      className="py-3xl md:py-5xl"
    >
      <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl">

        {/* Section header */}
        <div className="text-center mb-3xl md:mb-4xl">
          <div
            className="inline-flex items-center gap-sm mb-lg"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-forest-green)',
              background: 'rgba(27,67,50,0.06)',
              border: '1px solid rgba(27,67,50,0.16)',
              borderRadius: '2px',
              padding: '4px 12px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
            </svg>
            How It Works
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display), Georgia, "Times New Roman", serif',
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: 'var(--color-forest-green)',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
            }}
          >
            Your shadow vote on the public record.
          </h2>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-sm mt-lg">
            <div className="h-px w-16" style={{ background: 'rgba(184,150,12,0.35)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 0L10 5L5 10L0 5Z" fill="#B8960C" />
            </svg>
            <div className="h-px w-16" style={{ background: 'rgba(184,150,12,0.35)' }} />
          </div>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-lg xl:gap-[26px] relative">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Impartiality notice */}
        <div
          className="mt-3xl md:mt-4xl mx-auto max-w-[720px] flex gap-lg"
          style={{
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(184,150,12,0.3)',
            borderLeft: '3px solid rgba(27,67,50,0.6)',
            padding: '20px 24px',
          }}
        >
          {/* Scale-of-justice icon */}
          <svg className="shrink-0 mt-xxs" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <line x1="11" y1="2" x2="11" y2="20" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
            <line x1="4" y1="5" x2="18" y2="5" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
            <path d="M4 5 L1 11 Q4 14 7 11 L4 5Z" stroke="#B8960C" strokeWidth="1" fill="rgba(184,150,12,0.1)" />
            <path d="M18 5 L15 11 Q18 14 21 11 L18 5Z" stroke="#B8960C" strokeWidth="1" fill="rgba(184,150,12,0.1)" />
            <line x1="7" y1="20" x2="15" y2="20" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="square" />
          </svg>
          <div>
            <p
              className="font-mono uppercase mb-xs"
              style={{ color: 'var(--color-forest-green)', fontSize: '10px', letterSpacing: '0.2em' }}
            >
              A note on impartiality
            </p>
            <p className="text-body-sm" style={{ color: '#4A3C2A', lineHeight: 1.7 }}>
              The Public Ledger deliberately withholds the names of those who sponsor or
              bring forward legislation, and does not reveal how Parliament divided on any
              bill. Your shadow vote should reflect your view of the policy — not the party
              behind it.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-3xl md:mt-4xl">
          <Link href="/bills" className="btn-ledger-primary">
            Browse Active Bills
          </Link>
        </div>

        {/* Footer motto */}
        <div className="flex items-center justify-center gap-md mt-2xl">
          <div className="h-px w-10" style={{ background: 'rgba(184,150,12,0.28)' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(27,67,50,0.32)',
            }}
          >
            Fiat Lux &nbsp;·&nbsp; Veritas Vincit
          </span>
          <div className="h-px w-10" style={{ background: 'rgba(184,150,12,0.28)' }} />
        </div>
      </div>
    </section>
  );
}
