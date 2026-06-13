import type { Market } from '../types';
import MarketCard from './MarketCard';

interface Props {
  featuredMarkets: Market[];
}

export default function HeroSection({ featuredMarkets }: Props) {
  return (
    <section className="relative bg-canvas overflow-hidden">
      {/* Atmospheric gradient backdrop */}
      <div className="absolute inset-0 hero-atmosphere pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-lg pt-4xl sm:pt-5xl lg:pt-section pb-4xl">
        {/* Eyebrow */}
        <div className="flex justify-center mb-lg">
          <div className="inline-flex items-center gap-xs bg-canvas-soft text-body text-body-sm rounded-full px-sm py-xs shadow-level-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-caption-mono uppercase tracking-widest">
              Live Prediction Markets
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-[42rem] mx-auto mb-xl">
          <h1 className="text-display-xl font-semibold text-ink mb-md">
            Trade on the world&apos;s events.
          </h1>
          <p className="text-body-lg text-body">
            The Public Ledger is an open prediction market where anyone can trade
            on politics, sports, crypto, and more. Powered by real money.
            Governed by the crowd.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-sm mb-4xl">
          <a href="/signup" className="btn-primary">
            Start Trading
          </a>
          <a href="/markets" className="btn-secondary">
            Browse Markets
          </a>
        </div>

        {/* Featured markets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {featuredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
