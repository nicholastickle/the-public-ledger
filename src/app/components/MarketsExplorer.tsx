'use client';

import { useState } from 'react';
import type { Market, MarketCategory } from '../types';
import MarketCard from './MarketCard';

type TabValue = 'all' | MarketCategory;

const TABS: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Politics', value: 'politics' },
  { label: 'Sports', value: 'sports' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Science', value: 'science' },
  { label: 'Culture', value: 'culture' },
  { label: 'World', value: 'world' },
];

interface Props {
  markets: Market[];
}

export default function MarketsExplorer({ markets }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const filtered =
    activeTab === 'all' ? markets : markets.filter((m) => m.category === activeTab);

  return (
    <section className="bg-canvas-soft py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Section header */}
        <div className="flex items-end justify-between mb-2xl">
          <div>
            <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-xs">
              LIVE MARKETS
            </div>
            <h2 className="text-display-lg font-semibold text-ink">
              Browse open markets.
            </h2>
          </div>
          <a href="/markets" className="btn-secondary hidden sm:inline-flex">
            View all →
          </a>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-xs overflow-x-auto pb-xs mb-xl no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 text-body-sm px-md py-xs rounded-pill-sm cursor-pointer transition-colors ${
                activeTab === tab.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-canvas text-body shadow-level-1 hover:shadow-level-2'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Market grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filtered.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4xl text-mute text-body-md">
            No markets in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
