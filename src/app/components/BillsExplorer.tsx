'use client';

import { useState } from 'react';
import type { Bill, BillCategory } from '../types';
import BillCard from './BillCard';

type TabValue = 'all' | BillCategory;

const TABS: { label: string; value: TabValue }[] = [
  { label: 'All Bills', value: 'all' },
  { label: 'Health', value: 'health' },
  { label: 'Economy', value: 'economy' },
  { label: 'Housing', value: 'housing' },
  { label: 'Environment', value: 'environment' },
  { label: 'Education', value: 'education' },
  { label: 'Justice', value: 'justice' },
  { label: 'Immigration', value: 'immigration' },
];

interface Props {
  bills: Bill[];
}

export default function BillsExplorer({ bills }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const filtered =
    activeTab === 'all' ? bills : bills.filter((b) => b.category === activeTab);

  return (
    <section className="bg-canvas-soft py-3xl md:py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Section header */}
        <div className="flex items-end justify-between mb-2xl">
          <div>
            <div className="text-caption-mono font-mono text-mute uppercase tracking-widest mb-xs">
              ACTIVE VOTES
            </div>
            <h2 className="text-display-lg font-semibold text-ink">
              Cast your shadow vote.
            </h2>
          </div>
          <a href="/bills" className="btn-secondary hidden sm:inline-flex">
            All bills →
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

        {/* Bills grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filtered.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4xl text-mute text-body-md">
            No bills in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
