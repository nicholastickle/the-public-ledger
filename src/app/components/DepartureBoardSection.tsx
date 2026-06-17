'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ParliamentBill } from '../types/parliament';
import { formatTimeAgo } from '../lib/utils';

interface Props {
  bills: ParliamentBill[];
}

interface BillVotes {
  /** Public shadow-vote Ayes (second reading) */
  shadowAyes: number;
  /** Public shadow-vote Noes (second reading) */
  shadowNoes: number;
  /** Parliament division Ayes for the bill's current stage */
  parliamentAyes?: number;
  /** Parliament division Noes for the bill's current stage */
  parliamentNoes?: number;
}

const ROW_H = 62;
const VISIBLE_ROWS = 8;
const TICK_MS = 3800;

/* ── Demo data ─────────────────────────────────────────────────────────── */

const DEMO_BILLS: ParliamentBill[] = [
  { id: 1,  short_title: 'Employment Rights Bill',                              long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T08:51:00Z' },
  { id: 2,  short_title: 'Planning and Infrastructure Bill',                    long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T06:42:00Z' },
  { id: 3,  short_title: 'Crime and Policing Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Committee Stage',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T09:14:00Z' },
  { id: 4,  short_title: 'Data (Use and Access) Bill',                          long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'Report Stage',     is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T04:30:00Z' },
  { id: 5,  short_title: "Renters' Rights Bill",                                long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Third Reading',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T10:22:00Z' },
  { id: 6,  short_title: 'Border Security, Asylum and Immigration Bill',        long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Second Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T02:55:00Z' },
  { id: 7,  short_title: "Children's Wellbeing and Schools Bill",               long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Report Stage',     is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T07:48:00Z' },
  { id: 8,  short_title: 'Great British Energy Bill',                           long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',     is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-15T11:00:00Z' },
  { id: 9,  short_title: 'Football Governance Bill',                            long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',     is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-12T14:00:00Z' },
  { id: 10, short_title: 'Terminal Illness (Relief of Pain) Bill',              long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T05:10:00Z' },
  { id: 11, short_title: 'Armed Forces Commissioner Bill',                      long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',     is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-14T09:00:00Z' },
  { id: 12, short_title: 'Passenger Railway Services (Public Ownership) Bill',  long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',     is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-10T16:00:00Z' },
  { id: 13, short_title: 'Tobacco and Vapes Bill',                              long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-16T22:05:00Z' },
  { id: 14, short_title: 'Bank Resolution (Recapitalisation) Bill',             long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'First Reading',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-16T16:20:00Z' },
];

/* Vote data keyed by bill id — bills at/past Second Reading have closed public votes */
const DEMO_VOTES: Record<number, BillVotes> = {
  1:  { shadowAyes: 18400, shadowNoes: 6200,  parliamentAyes: 324, parliamentNoes: 218 },
  3:  { shadowAyes:  9100, shadowNoes: 12300, parliamentAyes: 298, parliamentNoes: 241 },
  4:  { shadowAyes: 14200, shadowNoes:  3800, parliamentAyes: 312, parliamentNoes: 187 },
  5:  { shadowAyes: 31500, shadowNoes:  4100, parliamentAyes: 341, parliamentNoes: 206 },
  7:  { shadowAyes: 22800, shadowNoes:  7200, parliamentAyes: 358, parliamentNoes: 199 },
  8:  { shadowAyes: 28400, shadowNoes:  9100, parliamentAyes: 367, parliamentNoes: 212 },
  9:  { shadowAyes: 45200, shadowNoes:  2300, parliamentAyes: 389, parliamentNoes:  98 },
  11: { shadowAyes: 11200, shadowNoes:  4800, parliamentAyes: 302, parliamentNoes: 174 },
  12: { shadowAyes: 19600, shadowNoes:  8400, parliamentAyes: 314, parliamentNoes: 228 },
  13: { shadowAyes: 26700, shadowNoes:  5900, parliamentAyes: 383, parliamentNoes: 205 },
  // Bills 2, 6, 10, 14 are still open (First/Second Reading) — no closed vote data
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

function billStatus(bill: ParliamentBill): { label: string; color: string; glow: string } {
  if (bill.is_act)         return { label: 'Royal Assent', color: '#10B981', glow: '#10B98166' };
  if (bill.is_defeated)    return { label: 'Defeated',     color: '#EF4444', glow: '#EF444466' };
  if (bill.bill_withdrawn) return { label: 'Withdrawn',    color: '#6B7280', glow: '#6B728066' };
  return                          { label: 'Active',       color: '#D4AF37', glow: '#D4AF3766' };
}

/** True while the public vote window is open: First Reading → until Second Reading division is cast */
function isVoteOpen(bill: ParliamentBill): boolean {
  if (bill.is_act || bill.is_defeated || bill.bill_withdrawn) return false;
  const stage = (bill.current_stage_name ?? '').toLowerCase();
  return stage.includes('first reading') || stage.includes('second reading') || stage === '';
}

function fmtVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function clip(s: string | null, n: number): string {
  if (!s) return '—';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function VoteCell({ votes, isOpen }: { votes?: BillVotes; isOpen: boolean }) {
  if (isOpen) {
    return <span className="font-mono" style={{ color: '#B8960C', opacity: 0.4, fontSize: '11px' }}>Open</span>;
  }
  if (!votes) {
    return <span className="font-mono" style={{ color: '#FAF6ED', opacity: 0.2, fontSize: '11px' }}>—</span>;
  }
  return (
    <div className="flex flex-col items-end gap-xxs">
      <span className="font-mono tabular-nums" style={{ color: '#10B981', fontSize: '11px', letterSpacing: '0.02em' }}>
        ↑ {fmtVotes(votes.shadowAyes)}
      </span>
      <span className="font-mono tabular-nums" style={{ color: '#EF4444', fontSize: '11px', letterSpacing: '0.02em' }}>
        ↓ {fmtVotes(votes.shadowNoes)}
      </span>
    </div>
  );
}

function ParliamentCell({ votes }: { votes?: BillVotes }) {
  if (!votes?.parliamentAyes) {
    return <span className="font-mono" style={{ color: '#FAF6ED', opacity: 0.2, fontSize: '11px' }}>—</span>;
  }
  return (
    <div className="flex flex-col items-end gap-xxs">
      <span className="font-mono tabular-nums" style={{ color: '#10B981', fontSize: '11px', letterSpacing: '0.02em' }}>
        {votes.parliamentAyes} Aye
      </span>
      <span className="font-mono tabular-nums" style={{ color: '#EF4444', fontSize: '11px', letterSpacing: '0.02em' }}>
        {votes.parliamentNoes} No
      </span>
    </div>
  );
}

function GhostRow({ index }: { index: number }) {
  const widths = [72, 58, 65, 48, 70, 54, 62, 44];
  const w = widths[index % widths.length];
  const baseOpacity = Math.max(0.22, 0.5 - index * 0.035);
  const delay = `${index * 0.18}s`;
  return (
    <div
      className="flex items-center gap-md px-md sm:px-lg"
      style={{ height: ROW_H, borderBottom: '1px solid rgba(184,150,12,0.08)' }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: '#B8960C', opacity: baseOpacity * 1.5, animationName: 'ledger-pulse', animationDuration: '2.4s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: delay }}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-xxs">
        <div className="h-2.5 rounded-sm" style={{ background: 'rgba(250,246,237,0.12)', width: `${w}%`, opacity: baseOpacity, animationName: 'ledger-pulse', animationDuration: '2.8s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: delay }} />
        <div className="h-1.5 rounded-sm" style={{ background: 'rgba(184,150,12,0.18)', width: `${Math.round(w * 0.55)}%`, opacity: baseOpacity * 0.75 }} />
      </div>
      <div className="hidden sm:block w-12 h-3 rounded-sm shrink-0" style={{ background: 'rgba(16,185,129,0.12)', opacity: baseOpacity }} />
      <div className="hidden sm:block w-12 h-3 rounded-sm shrink-0" style={{ background: 'rgba(16,185,129,0.08)', opacity: baseOpacity }} />
      <div className="hidden sm:block w-14 h-2 rounded-sm shrink-0" style={{ background: 'rgba(184,150,12,0.14)', opacity: baseOpacity }} />
    </div>
  );
}

/* ── Column grid ────────────────────────────────────────────────────────── */
// pip | bill+stage | shadow vote | parliament vote | action | updated
const GRID = '18px 1fr 88px 88px 88px 70px';
const GAP  = '0 14px';

/* ── Main component ─────────────────────────────────────────────────────── */

export default function DepartureBoardSection({ bills }: Props) {
  const [offset, setOffset]   = useState(0);
  const [sliding, setSliding] = useState(false);
  const [clock, setClock]     = useState('');
  const [date, setDate]       = useState('');

  const isDemo  = bills.length === 0;
  const display = isDemo ? DEMO_BILLS : bills;
  const votes   = isDemo ? DEMO_VOTES : ({} as Record<number, BillVotes>);

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

  useEffect(() => {
    if (display.length <= VISIBLE_ROWS) return;
    const id = setInterval(() => setSliding(true), TICK_MS);
    return () => clearInterval(id);
  }, [display.length]);

  function onTransitionEnd() {
    setOffset(prev => (prev + 1) % display.length);
    setSliding(false);
  }

  const count = Math.min(VISIBLE_ROWS + 1, display.length);
  const rows  = Array.from({ length: count }, (_, i) => display[(offset + i) % display.length]);

  return (
    <section style={{ background: 'linear-gradient(to bottom, #171717 0px, #0A1E12 64px)' }}>
      <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl pt-xl lg:pt-2xl pb-2xl lg:pb-3xl">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-lg mb-xl flex-wrap">
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <span
                className="w-2 h-2 rounded-full animate-pulse inline-block"
                style={{ background: '#EF4444', boxShadow: '0 0 8px #EF444488' }}
              />
              <span className="font-mono text-caption uppercase" style={{ color: '#B8960C', letterSpacing: '0.22em' }}>
                Live · Parliament in Session
              </span>
              {isDemo && (
                <span
                  className="font-mono"
                  style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.15em', opacity: 0.5, textTransform: 'uppercase', border: '1px solid rgba(184,150,12,0.3)', padding: '1px 6px', borderRadius: '2px' }}
                >
                  Demo
                </span>
              )}
            </div>
            <h2
              className="ledger-headline"
              style={{ color: '#FAF6ED', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', lineHeight: '1.08' }}
            >
              Bills before <em>the House.</em>
            </h2>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-xxs shrink-0">
            <span
              className="font-mono font-semibold tabular-nums"
              style={{ color: '#FAF6ED', fontSize: '2.4rem', letterSpacing: '0.04em', lineHeight: 1 }}
            >
              {clock || '—:—:—'}
            </span>
            <span className="font-mono" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {date || ' '} · London
            </span>
          </div>
        </div>

        {/* ── Board panel ─────────────────────────────────────────────── */}
        <div
          style={{
            border: '1px solid rgba(184,150,12,0.32)',
            borderTop: '1px solid rgba(184,150,12,0.6)',
            background: '#071108',
            boxShadow: '0 0 0 4px rgba(184,150,12,0.03), 0 16px 60px rgba(0,0,0,0.75), inset 0 1px 0 rgba(184,150,12,0.12)',
          }}
        >
          {/* Column headers */}
          <div
            className="hidden sm:grid items-center px-lg"
            style={{
              gridTemplateColumns: GRID,
              gap: GAP,
              height: 34,
              borderBottom: '1px solid rgba(184,150,12,0.2)',
              background: 'rgba(184,150,12,0.06)',
            }}
          >
            <div />
            <span className="font-mono uppercase" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.22em' }}>Bill</span>
            <span className="font-mono uppercase text-right" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.22em' }}>Shadow</span>
            <span className="font-mono uppercase text-right" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.22em' }}>Parliament</span>
            <span className="font-mono uppercase text-right" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.22em' }}>Vote</span>
            <span className="font-mono uppercase text-right" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.22em' }}>Updated</span>
          </div>

          {/* Rows */}
          <div style={{ height: Math.min(VISIBLE_ROWS, display.length) * ROW_H, overflow: 'hidden' }}>
            {display.length > 0 ? (
              <div
                style={{
                  transform: sliding ? `translateY(-${ROW_H}px)` : 'translateY(0)',
                  transition: sliding ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {rows.map((bill, i) => {
                  const st     = billStatus(bill);
                  const vOpen  = isVoteOpen(bill);
                  const vData  = votes[bill.id];

                  return (
                    <div
                      key={`${bill.id}-${offset + i}`}
                      className="block"
                      style={{
                        height: ROW_H,
                        borderBottom: '1px solid rgba(184,150,12,0.1)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,67,50,0.38)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Mobile */}
                      <Link href={`/bills/${bill.id}`} className="no-underline sm:hidden flex items-center gap-sm h-full px-md">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate" style={{ color: '#FAF6ED', fontSize: '13px' }}>
                            {clip(bill.short_title ?? bill.long_title, 48)}
                          </p>
                          <p className="font-mono truncate" style={{ color: '#B8960C', fontSize: '10px', opacity: 0.65 }}>
                            {clip(bill.current_stage_name, 34)}
                          </p>
                        </div>
                        {vOpen ? (
                          <span className="font-mono shrink-0 px-xs py-xxs" style={{ color: '#D4AF37', fontSize: '10px', letterSpacing: '0.08em', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '2px' }}>
                            Vote
                          </span>
                        ) : (
                          <span className="font-mono shrink-0" style={{ color: st.color, fontSize: '10px', letterSpacing: '0.05em' }}>
                            {st.label}
                          </span>
                        )}
                      </Link>

                      {/* Desktop */}
                      <Link
                        href={`/bills/${bill.id}`}
                        className="no-underline hidden sm:grid items-center h-full px-lg"
                        style={{ gridTemplateColumns: GRID, gap: GAP }}
                      >
                        {/* Pip */}
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: st.color, boxShadow: `0 0 8px ${st.glow}` }} />

                        {/* Bill + stage */}
                        <div className="min-w-0">
                          <p className="font-medium truncate" style={{ color: '#FAF6ED', fontSize: '14px', lineHeight: '1.3' }}>
                            {clip(bill.short_title ?? bill.long_title, 72)}
                          </p>
                          <p className="font-mono truncate" style={{ color: '#B8960C', fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>
                            {clip(bill.current_stage_name, 48)}
                          </p>
                        </div>

                        {/* Shadow vote */}
                        <div className="text-right">
                          <VoteCell votes={vData} isOpen={vOpen} />
                        </div>

                        {/* Parliament vote */}
                        <div className="text-right">
                          <ParliamentCell votes={vData} />
                        </div>

                        {/* Vote button / status */}
                        <div className="flex justify-end">
                          {vOpen ? (
                            <span
                              className="font-mono inline-block"
                              style={{
                                color: '#D4AF37',
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                border: '1px solid rgba(212,175,55,0.45)',
                                lineHeight: '24px',
                                padding: '0 8px',
                                borderRadius: '2px',
                                background: 'rgba(212,175,55,0.06)',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Vote →
                            </span>
                          ) : (
                            <span className="font-mono" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                              {st.label}
                            </span>
                          )}
                        </div>

                        {/* Updated */}
                        <div className="text-right">
                          <span className="font-mono" style={{ color: '#FAF6ED', fontSize: '11px', opacity: 0.3 }} suppressHydrationWarning>
                            {bill.parliament_last_update ? formatTimeAgo(bill.parliament_last_update) : '—'}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              Array.from({ length: VISIBLE_ROWS }).map((_, i) => <GhostRow key={i} index={i} />)
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-md sm:px-lg"
            style={{ height: 36, borderTop: '1px solid rgba(184,150,12,0.2)', background: 'rgba(184,150,12,0.03)' }}
          >
            <span className="font-mono" style={{ color: '#B8960C', opacity: 0.45, fontSize: '11px' }}>
              {isDemo
                ? 'Demo data · connect the backend for live bills'
                : `${bills.length} bills tracked · refreshes automatically`}
            </span>
            <Link href="/bills" className="font-mono no-underline" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.1em', opacity: 0.7 }}>
              View all →
            </Link>
          </div>
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
    </section>
  );
}
