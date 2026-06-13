import type { Bill } from '../types';
import BillCard from './BillCard';

interface Props {
  featuredBills: Bill[];
}

export default function HeroSection({ featuredBills }: Props) {
  return (
    <section className="relative bg-canvas overflow-hidden">
      <div className="absolute inset-0 hero-atmosphere pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-lg pt-4xl sm:pt-5xl lg:pt-section pb-4xl">
        {/* Eyebrow */}
        <div className="flex justify-center mb-lg">
          <div className="inline-flex items-center gap-xs bg-canvas-soft text-body text-body-sm rounded-full px-sm py-xs shadow-level-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-caption-mono uppercase tracking-widest">
              Shadow Parliament · Live
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-[42rem] mx-auto mb-xl">
          <h1 className="text-display-xl font-semibold text-ink mb-md">
            Your shadow vote on every bill.
          </h1>
          <p className="text-body-lg text-body">
            The Public Ledger lets every citizen cast a shadow vote on the same
            legislation parliament is debating. See how public opinion compares
            — bill by bill.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-sm mb-4xl">
          <a href="/bills" className="btn-primary">
            Browse Bills
          </a>
          <a href="/signup" className="btn-secondary">
            Cast Your Vote
          </a>
        </div>

        {/* Featured bills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {featuredBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
