import type { Market, MarketCategory } from '../types';
import { formatVolume, formatMarketEnd } from '../lib/utils';

const CATEGORY_LABELS: Record<MarketCategory, string> = {
  politics: 'POLITICS',
  sports: 'SPORTS',
  crypto: 'CRYPTO',
  science: 'SCIENCE',
  culture: 'CULTURE',
  world: 'WORLD',
};

interface Props {
  market: Market;
  variant?: 'default' | 'featured';
}

export default function MarketCard({ market, variant = 'default' }: Props) {
  const isFeatured = variant === 'featured';

  return (
    <article className="bg-canvas rounded-lg flex flex-col gap-md shadow-level-2 hover:shadow-level-3 transition-shadow overflow-hidden">
      <div className={`flex flex-col gap-md ${isFeatured ? 'p-xl' : 'p-lg'}`}>
        {/* Category + end date */}
        <div className="flex items-center justify-between">
          <span className="text-caption-mono font-mono text-mute uppercase tracking-wider">
            {CATEGORY_LABELS[market.category]}
          </span>
          <span className="text-caption font-mono text-mute">
            {formatMarketEnd(market.endsAt)}
          </span>
        </div>

        {/* Question */}
        <h3
          className={
            isFeatured
              ? 'text-display-sm font-semibold text-ink leading-snug'
              : 'text-body-md font-medium text-ink leading-snug'
          }
        >
          {market.question}
        </h3>

        {/* Probability */}
        <div className="flex flex-col gap-xs">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-xs">
              <span className="text-display-sm font-semibold text-link">
                {market.yesPrice}%
              </span>
              <span className="text-caption-mono font-mono text-link">YES</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="text-caption-mono font-mono text-highlight-pink">NO</span>
              <span className="text-display-sm font-semibold text-highlight-pink">
                {market.noPrice}%
              </span>
            </div>
          </div>

          {/* Probability bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden bg-canvas-soft-2">
            <div
              className="bg-link transition-all duration-300"
              style={{ width: `${market.yesPrice}%` }}
            />
            <div
              className="bg-highlight-pink transition-all duration-300"
              style={{ width: `${market.noPrice}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between border-t border-hairline ${
          isFeatured ? 'px-xl py-md' : 'px-lg py-sm'
        }`}
      >
        <span className="text-caption font-mono text-mute">
          {formatVolume(market.volume)} vol
        </span>
        <a href={`/markets/${market.id}`} className="btn-primary-sm">
          Trade →
        </a>
      </div>
    </article>
  );
}
