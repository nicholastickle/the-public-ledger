'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ParliamentBill } from '../types/parliament';
import { formatCountdown, clipText } from '../lib/utils';
import VoteBar from './VoteBar';
import BillDetailModal from './BillDetailModal';

interface Props {
  bills: ParliamentBill[];
}

export interface BillVotes {
  shadowAyes: number;
  shadowNoes: number;
  secondReadingDate?: string | null;
}

interface StageGroup {
  stage: string;
  bills: ParliamentBill[];
}

/* ── Demo data ─────────────────────────────────────────────────────────── */

// Sized to match the ~19 government bills Parliament typically has in flight at once
// (Parallel Parliament, government-bills tracker, 2026-27 session), spread so every
// stage column has at least one bill.
const DEMO_BILLS: ParliamentBill[] = [
  { id: 1,  short_title: 'Employment Rights Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-22T08:51:00Z' },
  { id: 2,  short_title: 'Planning and Infrastructure Bill',                   long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-24T06:42:00Z' },
  { id: 3,  short_title: 'Crime and Policing Bill',                            long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-25T09:14:00Z' },
  { id: 4,  short_title: 'Data (Use and Access) Bill',                         long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-20T04:30:00Z' },
  { id: 5,  short_title: "Renters' Rights Bill",                               long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Third Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-27T10:22:00Z' },
  { id: 6,  short_title: 'Border Security, Asylum and Immigration Bill',       long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-18T02:55:00Z' },
  { id: 7,  short_title: "Children's Wellbeing and Schools Bill",              long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-23T07:48:00Z' },
  { id: 8,  short_title: 'Great British Energy Bill',                          long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-10T11:00:00Z' },
  { id: 9,  short_title: 'Football Governance Bill',                           long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-05T14:00:00Z' },
  { id: 10, short_title: 'Terminal Illness (Relief of Pain) Bill',             long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-26T05:10:00Z' },
  { id: 11, short_title: 'Armed Forces Commissioner Bill',                     long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-08T09:00:00Z' },
  { id: 12, short_title: 'Passenger Railway Services (Public Ownership) Bill', long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-02T16:00:00Z' },
  { id: 13, short_title: 'Tobacco and Vapes Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-21T22:05:00Z' },
  { id: 14, short_title: 'Bank Resolution (Recapitalisation) Bill',            long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-19T16:20:00Z' },
  { id: 15, short_title: 'High Speed Rail (Crewe – Manchester) Bill',          long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-29T10:00:00Z' },
  { id: 16, short_title: 'Sentencing Bill',                                    long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-28T11:30:00Z' },
  { id: 17, short_title: 'Mental Health Bill',                                 long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-24T13:15:00Z' },
  { id: 18, short_title: 'Water (Special Measures) Bill',                      long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-17T09:40:00Z' },
  { id: 19, short_title: 'Pension Schemes Bill',                               long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-15T15:05:00Z' },
  { id: 20, short_title: 'Non-Domestic Rating (Multipliers and Private Schools) Bill', long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Report Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-16T12:20:00Z' },
  { id: 21, short_title: 'Arbitration Bill',                                   long_title: null, originating_house: 'Lords',   current_house: 'Lords',   current_stage_name: 'Third Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-30T08:00:00Z' },
  { id: 22, short_title: 'Holocaust Memorial Bill',                            long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Ping-Pong',       is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-07-31T09:00:00Z' },
  { id: 23, short_title: 'Local Government (Boundary Changes) Bill',           long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: true,  bill_withdrawn: null, parliament_last_update: '2026-07-14T17:45:00Z' },
  { id: 24, short_title: 'Digital Markets (Amendment) Bill',                   long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: '2026-07-12', parliament_last_update: '2026-07-12T10:30:00Z' },
];

const DEMO_VOTES: Record<number, BillVotes> = {
  // Bills at First/Second Reading — vote open, second reading date known or TBD
  2:  { shadowAyes: 0, shadowNoes: 0, secondReadingDate: '2026-08-12' },
  6:  { shadowAyes: 0, shadowNoes: 0, secondReadingDate: '2026-08-04' },
  10: { shadowAyes: 0, shadowNoes: 0, secondReadingDate: '2026-08-03' },
  14: { shadowAyes: 0, shadowNoes: 0, secondReadingDate: null },
  15: { shadowAyes: 0, shadowNoes: 0, secondReadingDate: null },
  16: { shadowAyes: 0, shadowNoes: 0, secondReadingDate: '2026-08-05' },
  // Bills past Second Reading — shadow vote recorded
  1:  { shadowAyes: 18400, shadowNoes:  6200 },
  3:  { shadowAyes:  9100, shadowNoes: 12300 },
  4:  { shadowAyes: 14200, shadowNoes:  3800 },
  5:  { shadowAyes: 31500, shadowNoes:  4100 },
  7:  { shadowAyes: 22800, shadowNoes:  7200 },
  8:  { shadowAyes: 28400, shadowNoes:  9100 },
  9:  { shadowAyes: 45200, shadowNoes:  2300 },
  11: { shadowAyes: 11200, shadowNoes:  4800 },
  12: { shadowAyes: 19600, shadowNoes:  8400 },
  13: { shadowAyes: 26700, shadowNoes:  5900 },
  17: { shadowAyes: 15600, shadowNoes:  4300 },
  18: { shadowAyes: 24100, shadowNoes:  3200 },
  19: { shadowAyes: 12800, shadowNoes:  6700 },
  20: { shadowAyes:  8300, shadowNoes: 14900 },
  21: { shadowAyes:  6200, shadowNoes:  1100 },
  22: { shadowAyes: 33200, shadowNoes:  2800 },
  23: { shadowAyes:  9800, shadowNoes:  8600 },
  // 24 (Digital Markets (Amendment) Bill): withdrawn before Second Reading — no tally yet
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

const STAGE_RANK: Record<string, number> = {
  'first reading': 0,
  'second reading': 1,
  'committee stage': 2,
  'report stage': 3,
  'third reading': 4,
  'consideration of amendments': 5,
  'ping-pong': 6,
  'royal assent': 7,
  'defeated': 8,
  'withdrawn': 9,
};

function stageRank(bill: ParliamentBill): number {
  if (bill.is_act) return STAGE_RANK['royal assent'];
  if (bill.is_defeated) return STAGE_RANK['defeated'];
  if (bill.bill_withdrawn) return STAGE_RANK['withdrawn'];
  const s = (bill.current_stage_name ?? '').toLowerCase();
  for (const [k, v] of Object.entries(STAGE_RANK)) {
    if (s.includes(k)) return v;
  }
  return 3;
}

function stageLabel(bill: ParliamentBill): string {
  if (bill.is_act) return 'Royal Assent';
  if (bill.is_defeated) return 'Defeated';
  if (bill.bill_withdrawn) return 'Withdrawn';
  return bill.current_stage_name ?? 'Active';
}

function groupByStage(bills: ParliamentBill[]): StageGroup[] {
  const sorted = [...bills].sort((a, b) => stageRank(a) - stageRank(b));
  const groups: StageGroup[] = [];
  for (const bill of sorted) {
    const s = stageLabel(bill);
    const last = groups[groups.length - 1];
    if (last && last.stage === s) {
      last.bills.push(bill);
    } else {
      groups.push({ stage: s, bills: [bill] });
    }
  }
  return groups;
}

export function billStatus(bill: ParliamentBill): { label: string; color: string; glow: string } {
  if (bill.is_act)         return { label: 'Royal Assent', color: '#10B981', glow: '#10B98166' };
  if (bill.is_defeated)    return { label: 'Defeated',     color: '#EF4444', glow: '#EF444466' };
  if (bill.bill_withdrawn) return { label: 'Withdrawn',    color: '#6B7280', glow: '#6B728066' };
  return                          { label: 'Active',       color: '#D4AF37', glow: '#D4AF3766' };
}

export function isVoteOpen(bill: ParliamentBill): boolean {
  if (bill.is_act || bill.is_defeated || bill.bill_withdrawn) return false;
  const s = (bill.current_stage_name ?? '').toLowerCase();
  return s === '' || s.includes('first reading') || s.includes('second reading');
}

/* ── Card ───────────────────────────────────────────────────────────────── */

function BillGridCard({ bill, votes, onSelect }: { bill: ParliamentBill; votes?: BillVotes; onSelect: () => void }) {
  const st = billStatus(bill);
  const vOpen = isVoteOpen(bill);
  const hasVotes = !!votes && (votes.shadowAyes > 0 || votes.shadowNoes > 0);

  return (
    <button type="button" onClick={onSelect} className="board-card" style={{ borderLeftColor: st.color }}>
      <div className="flex items-center gap-xs mb-xs">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
        {bill.current_house && (
          <span className="font-mono uppercase truncate" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.12em', opacity: 0.6 }}>
            {bill.current_house}
          </span>
        )}
      </div>

      <h3 className="font-medium" style={{ color: '#FAF6ED', fontSize: '14px', lineHeight: 1.35 }}>
        {clipText(bill.short_title ?? bill.long_title, 84)}
      </h3>

      <div className="mt-sm pt-sm" style={{ borderTop: '1px solid rgba(184,150,12,0.1)' }}>
        {vOpen ? (
          <div className="flex items-center justify-between gap-sm">
            <div className="flex flex-col gap-xxs min-w-0">
              <span className="font-mono" style={{ color: '#D4AF37', fontSize: '11px', letterSpacing: '0.06em' }}>
                Voting open
              </span>
              <span className="font-mono truncate" suppressHydrationWarning style={{ color: '#B8960C', fontSize: '10px', opacity: 0.55 }}>
                {formatCountdown(votes?.secondReadingDate, 'vote closed')}
              </span>
            </div>
            <span
              className="font-mono shrink-0"
              style={{
                color: '#D4AF37',
                fontSize: '11px',
                letterSpacing: '0.06em',
                border: '1px solid rgba(212,175,55,0.45)',
                lineHeight: '22px',
                padding: '0 8px',
                borderRadius: '2px',
                background: 'rgba(212,175,55,0.06)',
                whiteSpace: 'nowrap',
              }}
            >
              View &amp; Vote →
            </span>
          </div>
        ) : hasVotes ? (
          <VoteBar forCount={votes!.shadowAyes} againstCount={votes!.shadowNoes} forLabel="Aye" againstLabel="No" />
        ) : (
          <span className="font-mono" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.05em' }}>
            {st.label}
          </span>
        )}
      </div>
    </button>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function DepartureBoardSection({ bills }: Props) {
  const [clock, setClock] = useState('');
  const [date, setDate]   = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [votedMap, setVotedMap] = useState<Record<number, 'for' | 'against'>>({});

  const isDemo  = bills.length === 0;
  const display = isDemo ? DEMO_BILLS : bills;
  const votes   = isDemo ? DEMO_VOTES : ({} as Record<number, BillVotes>);
  const groups  = groupByStage(display);
  const selectedBill = selectedId != null ? display.find(b => b.id === selectedId) : undefined;

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ background: 'linear-gradient(180deg, #0c1610 0%, #0a1d12 45%, #071108 100%)' }}>
      <div className="max-w-[1680px] mx-auto px-md sm:px-xl lg:px-3xl pt-2xl lg:pt-3xl pb-3xl lg:pb-4xl">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-lg mb-xl flex-wrap">
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: '#EF4444', boxShadow: '0 0 8px #EF444488' }} />
              <span className="font-mono text-caption uppercase" style={{ color: '#B8960C', letterSpacing: '0.22em' }}>
                Live · Parliament in Session
              </span>
              {isDemo && (
                <span className="font-mono" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.15em', opacity: 0.5, textTransform: 'uppercase', border: '1px solid rgba(184,150,12,0.3)', padding: '1px 6px', borderRadius: '2px' }}>
                  Demo
                </span>
              )}
            </div>
            <h2 className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', lineHeight: '1.08' }}>
              The Bill Board.
            </h2>
            <p className="font-mono hidden sm:block" style={{ color: '#B8960C', fontSize: '12px', opacity: 0.5, letterSpacing: '0.12em', marginTop: '8px' }}>
              Every stage, one board · public shadow votes cast at Second Reading
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-xxs shrink-0">
            <span className="font-mono font-semibold tabular-nums" style={{ color: '#FAF6ED', fontSize: '2.4rem', letterSpacing: '0.04em', lineHeight: 1 }}>
              {clock || '—:—:—'}
            </span>
            <span className="font-mono" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {date || ' '} · London
            </span>
          </div>
        </div>

        {/* ── Stage sections ──────────────────────────────────────────── */}
        {groups.map(group => (
          <div key={group.stage} className="board-stage-section">
            <div className="board-stage-section__header">
              <span className="board-stage-section__title">{group.stage}</span>
              <span className="kanban-column__count">{group.bills.length}</span>
            </div>
            <div className="board-card-grid">
              {group.bills.map(bill => (
                <BillGridCard key={bill.id} bill={bill} votes={votes[bill.id]} onSelect={() => setSelectedId(bill.id)} />
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div
          className="flex items-center justify-between flex-wrap gap-xs mt-xl pt-md"
          style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }}
        >
          <span className="font-mono" style={{ color: '#B8960C', opacity: 0.45, fontSize: '11px' }}>
            {isDemo
              ? 'Demo data · connect the backend for live bills'
              : `${bills.length} bills tracked · refreshes automatically`}
          </span>
          <Link href="/bills" className="font-mono no-underline shrink-0" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.1em', opacity: 0.7 }}>
            View all →
          </Link>
        </div>

        {/* Attribution */}
        <div className="flex items-center justify-center gap-md mt-xl" aria-hidden="true">
          <div className="flex-1 h-px" style={{ background: 'rgba(184,150,12,0.12)' }} />
          <span className="font-mono uppercase" style={{ color: 'rgba(184,150,12,0.25)', fontSize: '10px', letterSpacing: '0.22em' }}>
            UK Parliament API · Live data
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(184,150,12,0.12)' }} />
        </div>
      </div>

      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          votes={votes[selectedBill.id]}
          voted={votedMap[selectedBill.id] ?? null}
          onVote={choice => setVotedMap(prev => ({ ...prev, [selectedBill.id]: choice }))}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
