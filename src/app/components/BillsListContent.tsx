'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ParliamentBill } from '../types/parliament';
import ParliamentBillCard from './ParliamentBillCard';

const STATUS_TABS = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Defeated', value: 'defeated' },
  { label: 'Withdrawn', value: 'withdrawn' },
] as const;

const HOUSE_TABS = [
  { label: 'All Houses', value: '' },
  { label: 'Commons', value: 'Commons' },
  { label: 'Lords', value: 'Lords' },
] as const;

interface Props {
  bills: ParliamentBill[];
  status: string;
  house: string;
}

function BillsListContentInner({ bills, status, house }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/bills?${params.toString()}`);
  }

  return (
    <div>
      {/* Status tabs */}
      <div className="flex items-center gap-xs overflow-x-auto pb-xs mb-md no-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParam('status', tab.value)}
            className={`flex-shrink-0 text-body-sm px-md py-xs rounded-pill-sm cursor-pointer transition-colors ${
              status === tab.value
                ? 'bg-primary text-on-primary'
                : 'bg-canvas text-body shadow-level-1 hover:shadow-level-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* House filter */}
      <div className="flex items-center gap-xs mb-xl">
        {HOUSE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParam('house', tab.value)}
            className={`flex-shrink-0 text-body-sm px-md py-xs rounded-pill-sm cursor-pointer transition-colors ${
              house === tab.value
                ? 'bg-ink text-on-primary'
                : 'bg-canvas text-body shadow-level-1 hover:shadow-level-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bills grid */}
      {bills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {bills.map((bill) => (
            <ParliamentBillCard key={bill.id} bill={bill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4xl text-mute text-body-md">
          No bills found.
        </div>
      )}
    </div>
  );
}

export default function BillsListContent(props: Props) {
  return (
    <Suspense>
      <BillsListContentInner {...props} />
    </Suspense>
  );
}
