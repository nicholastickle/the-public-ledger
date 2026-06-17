import Link from 'next/link';

const STEPS = [
  {
    number: '01',
    title: 'Browse active bills.',
    description:
      'Find legislation that parliament is currently debating. Each bill includes a plain-English summary and the official parliamentary record.',
  },
  {
    number: '02',
    title: 'Read, then decide.',
    description:
      'Review the key arguments on both sides. Cast your YES or NO vote to register your position as a citizen.',
  },
  {
    number: '03',
    title: 'See public vs parliament.',
    description:
      'Watch live as citizen votes are tallied. When parliament divides, see exactly how public opinion compared to your elected representatives.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-canvas-soft py-3xl md:py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Header */}
        <div className="text-center max-w-[36rem] mx-auto mb-4xl">
          <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-sm">
            How It Works
          </div>
          <h2 className="text-display-lg font-semibold text-ink">
            Your voice alongside parliament.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-canvas rounded-lg p-xl shadow-level-2 relative overflow-hidden"
            >
              <div
                className="absolute -top-4 -right-2 font-semibold leading-none select-none pointer-events-none text-canvas-soft-2"
                style={{ fontSize: '120px' }}
              >
                {step.number}
              </div>
              <div className="relative">
                <div className="text-caption-mono font-mono text-mute mb-md">
                  STEP {step.number}
                </div>
                <h3 className="text-display-sm font-semibold text-ink mb-sm">
                  {step.title}
                </h3>
                <p className="text-body-sm text-body">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4xl">
          <Link href="/bills" className="btn-primary">
            Browse Active Bills
          </Link>
        </div>
      </div>
    </section>
  );
}
