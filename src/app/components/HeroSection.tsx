'use client';

import { useState } from 'react';
import type { Bill, BillCategory } from '../types';
import BillCard from './BillCard';

type TabValue = 'all' | BillCategory;

const TABS: { label: string; value: TabValue }[] = [
  { label: 'Trending', value: 'all' },
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

export default function HeroSection({ bills }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const categoryBills = activeTab === 'all' ? bills : bills.filter((b) => b.category === activeTab);
  const visible = categoryBills.slice(0, 6);

  return (
    <section className="bg-canvas">
      {/* Live status strip */}
      <div className="border-b border-hairline">
        <div className="max-w-[1400px] mx-auto px-lg py-sm flex items-center justify-between gap-md">
          <div className="flex items-center gap-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-caption-mono font-mono text-mute uppercase tracking-widest">
              Shadow Parliament · Live
            </span>
          </div>
          <span className="text-caption font-mono text-mute hidden sm:block">
            2.4M+ votes cast · 48 active bills · 650 MPs tracked
          </span>
          <a href="/signup" className="btn-primary-sm flex-shrink-0 sm:hidden">
            Register
          </a>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-hairline sticky top-16 bg-canvas z-40">
        <div className="max-w-[1400px] mx-auto px-lg">
          <div className="flex overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 whitespace-nowrap text-body-sm px-md py-md border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.value
                    ? 'border-ink text-ink font-medium'
                    : 'border-transparent text-mute hover:text-body hover:border-hairline-strong'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bills feed */}
      <div className="max-w-[1400px] mx-auto px-lg py-xl">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {visible.map((bill) => (
              <BillCard key={bill.id} bill={bill} variant="feed" />
            ))}
          </div>
        ) : (
          <p className="text-center py-4xl text-mute text-body-md">
            No bills in this category yet.
          </p>
        )}

        <div className="mt-xl flex items-center justify-between">
          <span className="text-body-sm text-mute">
            Showing {visible.length} of {categoryBills.length} bills
          </span>
          <a href="/bills" className="btn-secondary">
            View all bills →
          </a>
        </div>
      </div>
    </section>
  );
}
