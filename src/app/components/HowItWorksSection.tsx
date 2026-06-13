const STEPS = [
  {
    number: '01',
    title: 'Create an account.',
    description:
      'Sign up in seconds and fund your wallet. No barriers for small amounts — just connect and go.',
  },
  {
    number: '02',
    title: 'Pick your market.',
    description:
      'Browse hundreds of open markets across politics, sports, crypto, science, and global events.',
  },
  {
    number: '03',
    title: 'Trade and cash out.',
    description:
      "Buy YES or NO shares at current market prices. If you're right when the event resolves, you earn.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-canvas-soft py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Header */}
        <div className="text-center max-w-[36rem] mx-auto mb-4xl">
          <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-sm">
            How It Works
          </div>
          <h2 className="text-display-lg font-semibold text-ink">
            Start trading in minutes.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-canvas rounded-lg p-xl shadow-level-2 relative overflow-hidden"
            >
              {/* Large background step number for depth */}
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

        {/* CTA */}
        <div className="flex justify-center mt-4xl">
          <a href="/signup" className="btn-primary">
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  );
}
