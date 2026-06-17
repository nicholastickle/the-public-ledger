'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ParliamentBill } from '../types/parliament';
import { formatTimeAgo } from '../lib/utils';

interface Props {
  bills: ParliamentBill[];
}

interface BillVotes {
  shadowAyes: number;
  shadowNoes: number;
  parliamentAyes?: number;
  parliamentNoes?: number;
}

interface StageGroup {
  stage: string;
  bills: ParliamentBill[];
}

/* ── Constants ──────────────────────────────────────────────────────────── */

const ROW_H_MOBILE   = 60;
const VISIBLE_MOBILE = 8;
const TICK_MS        = 3800;

// grid per half-panel: pip | bill+stage | 2nd rdg vote | gov division | vote/status
const PANEL_GRID = '12px 1fr 76px 76px 64px';
const PANEL_GAP  = '0 10px';

/* ── Demo data ─────────────────────────────────────────────────────────── */

const DEMO_BILLS: ParliamentBill[] = [
  { id: 1,  short_title: 'Employment Rights Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T08:51:00Z' },
  { id: 2,  short_title: 'Planning and Infrastructure Bill',                   long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T06:42:00Z' },
  { id: 3,  short_title: 'Crime and Policing Bill',                            long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T09:14:00Z' },
  { id: 4,  short_title: 'Data (Use and Access) Bill',                         long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T04:30:00Z' },
  { id: 5,  short_title: "Renters' Rights Bill",                               long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Third Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T10:22:00Z' },
  { id: 6,  short_title: 'Border Security, Asylum and Immigration Bill',       long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T02:55:00Z' },
  { id: 7,  short_title: "Children's Wellbeing and Schools Bill",              long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T07:48:00Z' },
  { id: 8,  short_title: 'Great British Energy Bill',                          long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-15T11:00:00Z' },
  { id: 9,  short_title: 'Football Governance Bill',                           long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-12T14:00:00Z' },
  { id: 10, short_title: 'Terminal Illness (Relief of Pain) Bill',             long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-17T05:10:00Z' },
  { id: 11, short_title: 'Armed Forces Commissioner Bill',                     long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-14T09:00:00Z' },
  { id: 12, short_title: 'Passenger Railway Services (Public Ownership) Bill', long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-10T16:00:00Z' },
  { id: 13, short_title: 'Tobacco and Vapes Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-16T22:05:00Z' },
  { id: 14, short_title: 'Bank Resolution (Recapitalisation) Bill',            long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, parliament_last_update: '2026-06-16T16:20:00Z' },
];

const DEMO_VOTES: Record<number, BillVotes> = {
  1:  { shadowAyes: 18400, shadowNoes:  6200, parliamentAyes: 324, parliamentNoes: 218 },
  3:  { shadowAyes:  9100, shadowNoes: 12300, parliamentAyes: 298, parliamentNoes: 241 },
  4:  { shadowAyes: 14200, shadowNoes:  3800, parliamentAyes: 312, parliamentNoes: 187 },
  5:  { shadowAyes: 31500, shadowNoes:  4100, parliamentAyes: 341, parliamentNoes: 206 },
  7:  { shadowAyes: 22800, shadowNoes:  7200, parliamentAyes: 358, parliamentNoes: 199 },
  8:  { shadowAyes: 28400, shadowNoes:  9100, parliamentAyes: 367, parliamentNoes: 212 },
  9:  { shadowAyes: 45200, shadowNoes:  2300, parliamentAyes: 389, parliamentNoes:  98 },
  11: { shadowAyes: 11200, shadowNoes:  4800, parliamentAyes: 302, parliamentNoes: 174 },
  12: { shadowAyes: 19600, shadowNoes:  8400, parliamentAyes: 314, parliamentNoes: 228 },
  13: { shadowAyes: 26700, shadowNoes:  5900, parliamentAyes: 383, parliamentNoes: 205 },
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

function splitGroups(groups: StageGroup[]): { left: StageGroup[]; right: StageGroup[] } {
  const total = groups.reduce((n, g) => n + g.bills.length, 0);
  const target = Math.ceil(total / 2);
  let leftCount = 0;
  let splitAt = groups.length;
  for (let i = 0; i < groups.length; i++) {
    if (leftCount >= target) { splitAt = i; break; }
    leftCount += groups[i].bills.length;
  }
  return { left: groups.slice(0, splitAt), right: groups.slice(splitAt) };
}

function billStatus(bill: ParliamentBill): { label: string; color: string; glow: string } {
  if (bill.is_act)         return { label: 'Royal Assent', color: '#10B981', glow: '#10B98166' };
  if (bill.is_defeated)    return { label: 'Defeated',     color: '#EF4444', glow: '#EF444466' };
  if (bill.bill_withdrawn) return { label: 'Withdrawn',    color: '#6B7280', glow: '#6B728066' };
  return                          { label: 'Active',       color: '#D4AF37', glow: '#D4AF3766' };
}

function isVoteOpen(bill: ParliamentBill): boolean {
  if (bill.is_act || bill.is_defeated || bill.bill_withdrawn) return false;
  const s = (bill.current_stage_name ?? '').toLowerCase();
  return s === '' || s.includes('first reading') || s.includes('second reading');
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

/* ── Vote cells ─────────────────────────────────────────────────────────── */

/** Second-reading public shadow vote with ✓ next to winning side */
function ShadowVoteCell({ votes, isOpen }: { votes?: BillVotes; isOpen: boolean }) {
  if (isOpen) {
    return (
      <div className="flex flex-col items-end gap-xxs">
        <span className="font-mono" style={{ color: '#D4AF37', fontSize: '10px', letterSpacing: '0.06em' }}>Voting open</span>
        <span className="font-mono" style={{ color: '#B8960C', fontSize: '9px', opacity: 0.45 }}>2nd Reading</span>
      </div>
    );
  }
  if (!votes) {
    return <span className="font-mono" style={{ color: '#FAF6ED', opacity: 0.2, fontSize: '10px' }}>—</span>;
  }
  const ayeWins = votes.shadowAyes >= votes.shadowNoes;
  return (
    <div className="flex flex-col items-end gap-xxs">
      <span className="font-mono tabular-nums" style={{ color: '#10B981', fontSize: '10px', letterSpacing: '0.02em' }}>
        {ayeWins ? '✓ ' : ''}↑ {fmtVotes(votes.shadowAyes)}
      </span>
      <span className="font-mono tabular-nums" style={{ color: '#EF4444', fontSize: '10px', letterSpacing: '0.02em' }}>
        {!ayeWins ? '✓ ' : ''}↓ {fmtVotes(votes.shadowNoes)}
      </span>
    </div>
  );
}

/** Government division at the bill's current stage with ✓ next to winning side */
function GovDivisionCell({ votes }: { votes?: BillVotes }) {
  if (!votes?.parliamentAyes) {
    return <span className="font-mono" style={{ color: '#FAF6ED', opacity: 0.2, fontSize: '10px' }}>—</span>;
  }
  const ayeWins = votes.parliamentAyes >= (votes.parliamentNoes ?? 0);
  return (
    <div className="flex flex-col items-end gap-xxs">
      <span className="font-mono tabular-nums" style={{ color: '#10B981', fontSize: '10px', letterSpacing: '0.02em' }}>
        {ayeWins ? '✓ ' : ''}{votes.parliamentAyes} Aye
      </span>
      <span className="font-mono tabular-nums" style={{ color: '#EF4444', fontSize: '10px', letterSpacing: '0.02em' }}>
        {!ayeWins ? '✓ ' : ''}{votes.parliamentNoes} No
      </span>
    </div>
  );
}

/* ── Panel sub-component ────────────────────────────────────────────────── */

function PanelColumnHeaders() {
  return (
    <div
      className="grid items-center px-md"
      style={{
        gridTemplateColumns: PANEL_GRID,
        gap: PANEL_GAP,
        height: 34,
        borderBottom: '1px solid rgba(184,150,12,0.18)',
        background: 'rgba(184,150,12,0.055)',
      }}
    >
      <div />
      <span className="font-mono uppercase" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.2em' }}>Bill</span>
      <div className="text-right">
        <span className="font-mono uppercase block" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.16em' }}>Public Vote</span>
        <span className="font-mono block" style={{ color: '#B8960C', fontSize: '8px', opacity: 0.5, letterSpacing: '0.1em' }}>2nd Reading</span>
      </div>
      <div className="text-right">
        <span className="font-mono uppercase block" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.16em' }}>Gov. Division</span>
        <span className="font-mono block" style={{ color: '#B8960C', fontSize: '8px', opacity: 0.5, letterSpacing: '0.1em' }}>at current stage</span>
      </div>
      <span className="font-mono uppercase text-right" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.2em' }}>Vote</span>
    </div>
  );
}

function StageGroupHeader({ stage, count, first }: { stage: string; count: number; first: boolean }) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(184,150,12,0.12)',
        borderTop: first ? undefined : '1px solid rgba(184,150,12,0.08)',
        background: 'rgba(184,150,12,0.035)',
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span className="font-mono uppercase" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.22em' }}>
        {stage}
      </span>
      <span className="font-mono" style={{ color: '#B8960C', fontSize: '9px', opacity: 0.38 }}>
        · {count}
      </span>
    </div>
  );
}

interface BillRowProps {
  bill: ParliamentBill;
  votes?: BillVotes;
  rowH: number;
}

function BillRow({ bill, votes, rowH }: BillRowProps) {
  const st    = billStatus(bill);
  const vOpen = isVoteOpen(bill);

  return (
    <Link
      href={`/bills/${bill.id}`}
      className="no-underline grid items-center"
      style={{
        gridTemplateColumns: PANEL_GRID,
        gap: PANEL_GAP,
        height: rowH,
        padding: '0 12px',
        borderBottom: '1px solid rgba(184,150,12,0.08)',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,67,50,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Pip */}
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: st.color, boxShadow: `0 0 7px ${st.glow}` }}
      />

      {/* Bill + stage */}
      <div className="min-w-0">
        <p className="font-medium truncate" style={{ color: '#FAF6ED', fontSize: '13px', lineHeight: '1.3' }}>
          {clip(bill.short_title ?? bill.long_title, 60)}
        </p>
        <p className="font-mono truncate" style={{ color: '#B8960C', fontSize: '10px', opacity: 0.55, marginTop: '1px' }}>
          {clip(bill.current_stage_name, 40)}
        </p>
      </div>

      {/* Public 2R vote */}
      <div className="text-right">
        <ShadowVoteCell votes={votes} isOpen={vOpen} />
      </div>

      {/* Gov division */}
      <div className="text-right">
        <GovDivisionCell votes={votes} />
      </div>

      {/* Vote / status */}
      <div className="flex justify-end">
        {vOpen ? (
          <span
            className="font-mono inline-block"
            style={{
              color: '#D4AF37',
              fontSize: '10px',
              letterSpacing: '0.08em',
              border: '1px solid rgba(212,175,55,0.45)',
              lineHeight: '22px',
              padding: '0 7px',
              borderRadius: '2px',
              background: 'rgba(212,175,55,0.06)',
              whiteSpace: 'nowrap',
            }}
          >
            Vote →
          </span>
        ) : (
          <span className="font-mono" style={{ color: st.color, fontSize: '10px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            {st.label}
          </span>
        )}
      </div>
    </Link>
  );
}

function ColumnPanel({ groups, votes, rowH }: { groups: StageGroup[]; votes: Record<number, BillVotes>; rowH: number }) {
  return (
    <div className="flex-1 min-w-0">
      <PanelColumnHeaders />
      {groups.map((group, gi) => (
        <div key={group.stage}>
          <StageGroupHeader stage={group.stage} count={group.bills.length} first={gi === 0} />
          {group.bills.map(bill => (
            <BillRow key={bill.id} bill={bill} votes={votes[bill.id]} rowH={rowH} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Ghost skeleton ─────────────────────────────────────────────────────── */

function GhostRow({ index }: { index: number }) {
  const widths = [72, 58, 65, 48, 70, 54, 62, 44];
  const w = widths[index % widths.length];
  const o = Math.max(0.22, 0.5 - index * 0.035);
  const delay = `${index * 0.18}s`;
  return (
    <div
      className="flex items-center gap-md px-md"
      style={{ height: ROW_H_MOBILE, borderBottom: '1px solid rgba(184,150,12,0.08)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#B8960C', opacity: o * 1.5, animationName: 'ledger-pulse', animationDuration: '2.4s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: delay }} />
      <div className="flex-1 min-w-0 flex flex-col gap-xxs">
        <div className="h-2.5 rounded-sm" style={{ background: 'rgba(250,246,237,0.12)', width: `${w}%`, opacity: o, animationName: 'ledger-pulse', animationDuration: '2.8s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: delay }} />
        <div className="h-1.5 rounded-sm" style={{ background: 'rgba(184,150,12,0.18)', width: `${Math.round(w * 0.55)}%`, opacity: o * 0.75 }} />
      </div>
      <div className="w-14 h-2 rounded-sm shrink-0" style={{ background: 'rgba(184,150,12,0.14)', opacity: o }} />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function DepartureBoardSection({ bills }: Props) {
  const [offset, setOffset]   = useState(0);
  const [sliding, setSliding] = useState(false);
  const [clock, setClock]     = useState('');
  const [date, setDate]       = useState('');

  const isDemo  = bills.length === 0;
  const display = isDemo ? DEMO_BILLS : bills;
  const votes   = isDemo ? DEMO_VOTES : ({} as Record<number, BillVotes>);

  const groups                = groupByStage(display);
  const { left, right }       = splitGroups(groups);

  // Mobile cycling
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
    if (display.length <= VISIBLE_MOBILE) return;
    const id = setInterval(() => setSliding(true), TICK_MS);
    return () => clearInterval(id);
  }, [display.length]);

  function onTransitionEnd() {
    setOffset(prev => (prev + 1) % display.length);
    setSliding(false);
  }

  const mobileCount = Math.min(VISIBLE_MOBILE + 1, display.length);
  const mobileRows  = Array.from({ length: mobileCount }, (_, i) => display[(offset + i) % display.length]);

  return (
    <section style={{ background: 'linear-gradient(to bottom, #171717 0px, #0A1E12 64px)' }}>
      <div className="max-w-[1360px] mx-auto px-md sm:px-xl lg:px-3xl pt-xl lg:pt-2xl pb-2xl lg:pb-3xl">

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
              The Billboard.
            </h2>
            <p className="font-mono hidden sm:block" style={{ color: '#B8960C', fontSize: '10px', opacity: 0.45, letterSpacing: '0.14em', marginTop: '6px' }}>
              Public votes cast at Second Reading · Government divisions at current stage
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

        {/* ── Board panel ─────────────────────────────────────────────── */}
        <div
          style={{
            border: '1px solid rgba(184,150,12,0.32)',
            borderTop: '1px solid rgba(184,150,12,0.6)',
            background: '#071108',
            boxShadow: '0 0 0 4px rgba(184,150,12,0.03), 0 16px 60px rgba(0,0,0,0.75), inset 0 1px 0 rgba(184,150,12,0.12)',
          }}
        >

          {/* ── Desktop: two-column stage-grouped layout ─────────────── */}
          {display.length > 0 ? (
            <div className="hidden sm:flex" style={{ minHeight: '200px' }}>
              <ColumnPanel groups={left}  votes={votes} rowH={54} />
              <div style={{ width: '1px', background: 'rgba(184,150,12,0.14)', flexShrink: 0 }} />
              <ColumnPanel groups={right} votes={votes} rowH={54} />
            </div>
          ) : (
            <div className="hidden sm:grid" style={{ gridTemplateColumns: '1fr 1px 1fr' }}>
              <div>
                <PanelColumnHeaders />
                {Array.from({ length: 7 }).map((_, i) => <GhostRow key={i} index={i} />)}
              </div>
              <div style={{ background: 'rgba(184,150,12,0.14)' }} />
              <div>
                <PanelColumnHeaders />
                {Array.from({ length: 7 }).map((_, i) => <GhostRow key={`r${i}`} index={i + 7} />)}
              </div>
            </div>
          )}

          {/* ── Mobile: single cycling column ────────────────────────── */}
          <div className="sm:hidden" style={{ height: Math.min(VISIBLE_MOBILE, display.length || VISIBLE_MOBILE) * ROW_H_MOBILE, overflow: 'hidden' }}>
            {display.length > 0 ? (
              <div
                style={{
                  transform: sliding ? `translateY(-${ROW_H_MOBILE}px)` : 'translateY(0)',
                  transition: sliding ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {mobileRows.map((bill, i) => {
                  const st    = billStatus(bill);
                  const vOpen = isVoteOpen(bill);
                  return (
                    <Link
                      key={`${bill.id}-${offset + i}`}
                      href={`/bills/${bill.id}`}
                      className="no-underline flex items-center gap-sm"
                      style={{ height: ROW_H_MOBILE, padding: '0 16px', borderBottom: '1px solid rgba(184,150,12,0.1)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,67,50,0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
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
                        <span className="font-mono shrink-0" style={{ color: st.color, fontSize: '10px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                          {st.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              Array.from({ length: VISIBLE_MOBILE }).map((_, i) => <GhostRow key={i} index={i} />)
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
