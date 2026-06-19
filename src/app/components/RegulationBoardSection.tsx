'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ParliamentRegulation } from '../types/parliament';

interface Props {
  regulations: ParliamentRegulation[];
}

interface RegulationVotes {
  shadowApprove: number;
  shadowAnnul: number;
  deadline?: string | null;
}

interface PhaseGroup {
  phase: string;
  regulations: ParliamentRegulation[];
}

/* ── Constants ──────────────────────────────────────────────────────────── */

const ROW_H_MOBILE   = 68;
const VISIBLE_MOBILE = 8;
const TICK_MS        = 3800;

const PANEL_GRID = '16px 1fr 120px 120px 88px';
const PANEL_GAP  = '0 14px';

/* ── Demo data ──────────────────────────────────────────────────────────── */

const DEMO_REGULATIONS: ParliamentRegulation[] = [
  { id: 1,  title: 'The National Minimum Wage (Amendment) Regulations 2026',               enabling_act: 'National Minimum Wage Act 1998',         procedure: 'negative',    laid_date: '2026-06-10', made_date: null,         deadline: '2026-08-20', status: 'pending',  house: 'Both', last_update: '2026-06-10T09:00:00Z' },
  { id: 2,  title: 'The Education (Student Loan) Regulations 2026',                         enabling_act: 'Teaching and Higher Education Act 1998', procedure: 'negative',    laid_date: '2026-05-28', made_date: null,         deadline: '2026-08-06', status: 'pending',  house: 'Both', last_update: '2026-05-28T10:00:00Z' },
  { id: 3,  title: 'The Immigration (Fees) (Amendment) Regulations 2026',                   enabling_act: 'Immigration Act 2014',                    procedure: 'negative',    laid_date: '2026-04-14', made_date: null,         deadline: '2026-06-25', status: 'pending',  house: 'Both', last_update: '2026-04-14T14:00:00Z' },
  { id: 4,  title: 'The Road Vehicles (Construction and Use) (Amendment) Regulations 2026', enabling_act: 'Road Traffic Act 1988',                   procedure: 'negative',    laid_date: '2026-06-03', made_date: null,         deadline: '2026-08-12', status: 'pending',  house: 'Both', last_update: '2026-06-03T08:30:00Z' },
  { id: 5,  title: 'The Investigatory Powers (Interception) Regulations 2026',              enabling_act: 'Investigatory Powers Act 2016',           procedure: 'affirmative', laid_date: '2026-06-05', made_date: null,         deadline: '2026-07-10', status: 'pending',  house: 'Both', last_update: '2026-06-05T11:00:00Z' },
  { id: 6,  title: 'The Financial Services (OTC Derivatives) Regulations 2026',             enabling_act: 'Financial Services Act 2021',             procedure: 'affirmative', laid_date: '2026-05-20', made_date: null,         deadline: '2026-06-30', status: 'pending',  house: 'Both', last_update: '2026-05-20T09:00:00Z' },
  { id: 7,  title: 'The Health and Safety (Amendment) Regulations 2026',                    enabling_act: 'Health and Safety at Work Act 1974',      procedure: 'negative',    laid_date: '2026-03-01', made_date: '2026-03-01', deadline: '2026-05-15', status: 'made',     house: 'Both', last_update: '2026-06-01T00:00:00Z' },
  { id: 8,  title: 'The Electricity (Capacity Mechanism) (Amendment) Regulations 2025',    enabling_act: 'Energy Act 2013',                         procedure: 'affirmative', laid_date: '2025-11-12', made_date: '2026-01-08', deadline: null,         status: 'approved', house: 'Both', last_update: '2026-01-08T00:00:00Z' },
  { id: 9,  title: 'The Tenant Fees (Prohibited Payments) Amendment Regulations 2026',     enabling_act: 'Tenant Fees Act 2019',                    procedure: 'negative',    laid_date: '2026-02-10', made_date: null,         deadline: '2026-04-28', status: 'annulled', house: 'Both', last_update: '2026-04-28T00:00:00Z' },
];

const DEMO_VOTES: Record<number, RegulationVotes> = {
  1: { shadowApprove: 0,    shadowAnnul: 0,    deadline: '2026-08-20' },
  2: { shadowApprove: 0,    shadowAnnul: 0,    deadline: '2026-08-06' },
  3: { shadowApprove: 0,    shadowAnnul: 0,    deadline: '2026-06-25' },
  4: { shadowApprove: 0,    shadowAnnul: 0,    deadline: '2026-08-12' },
  5: { shadowApprove: 0,    shadowAnnul: 0,    deadline: '2026-07-10' },
  6: { shadowApprove: 0,    shadowAnnul: 0,    deadline: '2026-06-30' },
  7: { shadowApprove: 4200, shadowAnnul: 1800 },
  8: { shadowApprove: 6100, shadowAnnul:  900 },
  9: { shadowApprove: 1200, shadowAnnul: 8700 },
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

const PHASE_RANK: Record<string, number> = {
  'Pending Approval': 0,
  'Annul Window Open': 1,
  'Approved': 2,
  'Made': 3,
  'Annulled': 4,
  'Withdrawn': 5,
};

function regulationPhase(reg: ParliamentRegulation): string {
  if (reg.status === 'pending') {
    return reg.procedure === 'affirmative' ? 'Pending Approval' : 'Annul Window Open';
  }
  if (reg.status === 'approved')  return 'Approved';
  if (reg.status === 'made')      return 'Made';
  if (reg.status === 'annulled')  return 'Annulled';
  if (reg.status === 'withdrawn') return 'Withdrawn';
  return 'Pending';
}

function groupByPhase(regs: ParliamentRegulation[]): PhaseGroup[] {
  const sorted = [...regs].sort((a, b) => {
    const ra = PHASE_RANK[regulationPhase(a)] ?? 99;
    const rb = PHASE_RANK[regulationPhase(b)] ?? 99;
    return ra - rb;
  });
  const groups: PhaseGroup[] = [];
  for (const reg of sorted) {
    const p = regulationPhase(reg);
    const last = groups[groups.length - 1];
    if (last && last.phase === p) {
      last.regulations.push(reg);
    } else {
      groups.push({ phase: p, regulations: [reg] });
    }
  }
  return groups;
}

function splitGroups(groups: PhaseGroup[]): { left: PhaseGroup[]; right: PhaseGroup[] } {
  const total = groups.reduce((n, g) => n + g.regulations.length, 0);
  const target = Math.ceil(total / 2);
  let leftCount = 0;
  let splitAt = groups.length;
  for (let i = 0; i < groups.length; i++) {
    if (leftCount >= target) { splitAt = i; break; }
    leftCount += groups[i].regulations.length;
  }
  return { left: groups.slice(0, splitAt), right: groups.slice(splitAt) };
}

function regulationStatus(reg: ParliamentRegulation): { label: string; color: string; glow: string } {
  if (reg.status === 'made' || reg.status === 'approved') return { label: reg.status === 'approved' ? 'Approved' : 'Made', color: '#10B981', glow: '#10B98166' };
  if (reg.status === 'annulled')  return { label: 'Annulled',  color: '#EF4444', glow: '#EF444466' };
  if (reg.status === 'withdrawn') return { label: 'Withdrawn', color: '#6B7280', glow: '#6B728066' };
  return                                 { label: 'Pending',   color: '#D4AF37', glow: '#D4AF3766' };
}

function isVoteOpen(reg: ParliamentRegulation): boolean {
  return reg.status === 'pending';
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

function fmtCountdown(dateStr: string | null | undefined): string {
  if (!dateStr) return 'closes TBD';
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 'window closed';
  const days = Math.floor(diff / 86_400_000);
  if (days >= 14) {
    const d = new Date(dateStr);
    return `closes ${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`;
  }
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `closes in ${days}d ${hours}h`;
  if (hours > 0) return `closes in ${hours}h`;
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return `closes in ${mins}m`;
}

/* ── Cell components ────────────────────────────────────────────────────── */

function ShadowVoteCell({ votes, isOpen }: { votes?: RegulationVotes; isOpen: boolean }) {
  if (isOpen) {
    return (
      <div className="flex flex-col items-end gap-xxs">
        <span className="font-mono" style={{ color: '#D4AF37', fontSize: '12px', letterSpacing: '0.06em' }}>Voting open</span>
        <span className="font-mono" suppressHydrationWarning style={{ color: '#B8960C', fontSize: '11px', opacity: 0.55 }}>
          {fmtCountdown(votes?.deadline)}
        </span>
      </div>
    );
  }
  if (!votes || (votes.shadowApprove === 0 && votes.shadowAnnul === 0)) {
    return <span className="font-mono" style={{ color: '#FAF6ED', opacity: 0.2, fontSize: '12px' }}>—</span>;
  }
  const approveWins = votes.shadowApprove >= votes.shadowAnnul;
  return (
    <div className="flex flex-col items-end gap-xxs">
      <span className="font-mono tabular-nums" style={{ color: '#10B981', fontSize: '12px', letterSpacing: '0.02em' }}>
        {approveWins ? '✓ ' : ''}↑ {fmtVotes(votes.shadowApprove)}
      </span>
      <span className="font-mono tabular-nums" style={{ color: '#EF4444', fontSize: '12px', letterSpacing: '0.02em' }}>
        {!approveWins ? '✓ ' : ''}↓ {fmtVotes(votes.shadowAnnul)}
      </span>
    </div>
  );
}

function ProcedureCell({ reg }: { reg: ParliamentRegulation }) {
  const isAff = reg.procedure === 'affirmative';
  const color  = isAff ? '#A78BFA' : '#D4AF37';
  const border = isAff ? 'rgba(167,139,250,0.35)' : 'rgba(212,175,55,0.35)';
  return (
    <div className="flex flex-col items-end gap-xxs">
      <span
        className="font-mono uppercase"
        style={{ color, fontSize: '10px', letterSpacing: '0.1em', border: `1px solid ${border}`, padding: '1px 5px', borderRadius: '2px' }}
      >
        {isAff ? 'Affirmative' : 'Negative'}
      </span>
      {reg.status === 'pending' && (
        <span className="font-mono" suppressHydrationWarning style={{ color: '#B8960C', fontSize: '11px', opacity: 0.55 }}>
          {fmtCountdown(reg.deadline)}
        </span>
      )}
    </div>
  );
}

/* ── Panel sub-components ───────────────────────────────────────────────── */

function PanelColumnHeaders() {
  return (
    <div
      className="grid items-center px-md"
      style={{
        gridTemplateColumns: PANEL_GRID,
        gap: PANEL_GAP,
        height: 48,
        borderBottom: '1px solid rgba(184,150,12,0.25)',
        background: 'rgba(27,67,50,0.45)',
      }}
    >
      <div />
      <span className="font-mono uppercase" style={{ color: '#FAF6ED', fontSize: '11px', letterSpacing: '0.18em' }}>Regulation</span>
      <div className="text-right">
        <span className="font-mono uppercase block" style={{ color: '#FAF6ED', fontSize: '11px', letterSpacing: '0.14em' }}>Public Vote</span>
        <span className="font-mono block" style={{ color: '#D4AF37', fontSize: '10px', opacity: 0.7, letterSpacing: '0.08em' }}>Approve / Annul</span>
      </div>
      <div className="text-right">
        <span className="font-mono uppercase block" style={{ color: '#FAF6ED', fontSize: '11px', letterSpacing: '0.14em' }}>Procedure</span>
        <span className="font-mono block" style={{ color: '#D4AF37', fontSize: '10px', opacity: 0.7, letterSpacing: '0.08em' }}>Deadline</span>
      </div>
      <span className="font-mono uppercase text-right" style={{ color: '#FAF6ED', fontSize: '11px', letterSpacing: '0.18em' }}>Status</span>
    </div>
  );
}

function PhaseGroupHeader({ phase, count, first }: { phase: string; count: number; first: boolean }) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(184,150,12,0.12)',
        borderTop: first ? undefined : '1px solid rgba(184,150,12,0.08)',
        background: 'rgba(184,150,12,0.035)',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span className="font-mono uppercase" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.2em' }}>
        {phase}
      </span>
      <span className="font-mono" style={{ color: '#B8960C', fontSize: '11px', opacity: 0.38 }}>
        · {count}
      </span>
    </div>
  );
}

interface RegulationRowProps {
  reg: ParliamentRegulation;
  votes?: RegulationVotes;
  rowH: number;
}

function RegulationRow({ reg, votes, rowH }: RegulationRowProps) {
  const st    = regulationStatus(reg);
  const vOpen = isVoteOpen(reg);

  return (
    <Link
      href={`/regulations/${reg.id}`}
      className="no-underline grid items-center"
      style={{
        gridTemplateColumns: PANEL_GRID,
        gap: PANEL_GAP,
        height: rowH,
        padding: '0 16px',
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

      {/* Title + enabling Act */}
      <div className="min-w-0">
        <p className="font-medium truncate" style={{ color: '#FAF6ED', fontSize: '15px', lineHeight: '1.3' }}>
          {clip(reg.title, 70)}
        </p>
        <p className="font-mono truncate" style={{ color: '#B8960C', fontSize: '11px', opacity: 0.6, marginTop: '3px' }}>
          {clip(reg.enabling_act, 52)}
        </p>
      </div>

      {/* Public vote */}
      <div className="text-right">
        <ShadowVoteCell votes={votes} isOpen={vOpen} />
      </div>

      {/* Procedure + deadline */}
      <div className="text-right">
        <ProcedureCell reg={reg} />
      </div>

      {/* Status / vote CTA */}
      <div className="flex justify-end">
        {vOpen ? (
          <span
            className="font-mono inline-block"
            style={{
              color: '#D4AF37',
              fontSize: '12px',
              letterSpacing: '0.08em',
              border: '1px solid rgba(212,175,55,0.45)',
              lineHeight: '26px',
              padding: '0 10px',
              borderRadius: '2px',
              background: 'rgba(212,175,55,0.06)',
              whiteSpace: 'nowrap',
            }}
          >
            Vote →
          </span>
        ) : (
          <span className="font-mono" style={{ color: st.color, fontSize: '12px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            {st.label}
          </span>
        )}
      </div>
    </Link>
  );
}

function ColumnPanel({ groups, votes, rowH }: { groups: PhaseGroup[]; votes: Record<number, RegulationVotes>; rowH: number }) {
  return (
    <div className="flex-1 min-w-0">
      <PanelColumnHeaders />
      {groups.map((group, gi) => (
        <div key={group.phase}>
          <PhaseGroupHeader phase={group.phase} count={group.regulations.length} first={gi === 0} />
          {group.regulations.map(reg => (
            <RegulationRow key={reg.id} reg={reg} votes={votes[reg.id]} rowH={rowH} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Ghost skeleton ─────────────────────────────────────────────────────── */

function GhostRow({ index }: { index: number }) {
  const widths = [68, 55, 72, 48, 62, 44, 58, 50];
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

export default function RegulationBoardSection({ regulations }: Props) {
  const [offset, setOffset]   = useState(0);
  const [sliding, setSliding] = useState(false);

  const isDemo  = regulations.length === 0;
  const display = isDemo ? DEMO_REGULATIONS : regulations;
  const votes   = isDemo ? DEMO_VOTES : ({} as Record<number, RegulationVotes>);

  const groups          = groupByPhase(display);
  const { left, right } = splitGroups(groups);

  // Mobile cycling
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
    <section style={{ background: 'linear-gradient(to bottom, #0A1E12 0px, #071108 80px)' }}>
      <div className="max-w-[1680px] mx-auto px-md sm:px-xl lg:px-3xl pt-2xl lg:pt-3xl pb-3xl lg:pb-4xl">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-lg mb-xl flex-wrap">
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: '#EF4444', boxShadow: '0 0 8px #EF444488' }} />
              <span className="font-mono text-caption uppercase" style={{ color: '#B8960C', letterSpacing: '0.22em' }}>
                Live · Statutory Instruments
              </span>
              {isDemo && (
                <span className="font-mono" style={{ color: '#B8960C', fontSize: '9px', letterSpacing: '0.15em', opacity: 0.5, textTransform: 'uppercase', border: '1px solid rgba(184,150,12,0.3)', padding: '1px 6px', borderRadius: '2px' }}>
                  Demo
                </span>
              )}
            </div>
            <h2 className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', lineHeight: '1.08' }}>
              The Regulation Board.
            </h2>
            <p className="font-mono hidden sm:block" style={{ color: '#B8960C', fontSize: '12px', opacity: 0.5, letterSpacing: '0.12em', marginTop: '8px' }}>
              Public votes open from laying · closes at parliamentary deadline
            </p>
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

          {/* ── Desktop (lg+): two-column layout ──────────────────────── */}
          {display.length > 0 ? (
            <div className="hidden lg:flex" style={{ minHeight: '320px' }}>
              <ColumnPanel groups={left}  votes={votes} rowH={68} />
              <div style={{ width: '1px', background: 'rgba(184,150,12,0.14)', flexShrink: 0 }} />
              <ColumnPanel groups={right} votes={votes} rowH={68} />
            </div>
          ) : (
            <div className="hidden lg:grid" style={{ gridTemplateColumns: '1fr 1px 1fr' }}>
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

          {/* ── Tablet (sm–lg): single full-width panel ───────────────── */}
          {display.length > 0 ? (
            <div className="hidden sm:block lg:hidden">
              <ColumnPanel groups={[...left, ...right]} votes={votes} rowH={62} />
            </div>
          ) : (
            <div className="hidden sm:block lg:hidden">
              <PanelColumnHeaders />
              {Array.from({ length: 10 }).map((_, i) => <GhostRow key={i} index={i} />)}
            </div>
          )}

          {/* ── Mobile (<sm): cycling column ──────────────────────────── */}
          <div className="sm:hidden" style={{ height: Math.min(VISIBLE_MOBILE, display.length || VISIBLE_MOBILE) * ROW_H_MOBILE, overflow: 'hidden' }}>
            {display.length > 0 ? (
              <div
                style={{
                  transform: sliding ? `translateY(-${ROW_H_MOBILE}px)` : 'translateY(0)',
                  transition: sliding ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {mobileRows.map((reg, i) => {
                  const st    = regulationStatus(reg);
                  const vOpen = isVoteOpen(reg);
                  return (
                    <Link
                      key={`${reg.id}-${offset + i}`}
                      href={`/regulations/${reg.id}`}
                      className="no-underline flex items-center gap-sm"
                      style={{ height: ROW_H_MOBILE, padding: '0 16px', borderBottom: '1px solid rgba(184,150,12,0.1)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,67,50,0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate" style={{ color: '#FAF6ED', fontSize: '14px' }}>
                          {clip(reg.title, 52)}
                        </p>
                        <p className="font-mono truncate" style={{ color: '#B8960C', fontSize: '11px', opacity: 0.65 }}>
                          {clip(reg.enabling_act, 38)}
                        </p>
                      </div>
                      {vOpen ? (
                        <span className="font-mono shrink-0 px-xs py-xxs" style={{ color: '#D4AF37', fontSize: '11px', letterSpacing: '0.08em', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '2px' }}>
                          Vote
                        </span>
                      ) : (
                        <span className="font-mono shrink-0" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
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
                ? 'Demo data · connect the backend for live regulations'
                : `${regulations.length} regulations tracked · refreshes automatically`}
            </span>
            <Link href="/regulations" className="font-mono no-underline" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.1em', opacity: 0.7 }}>
              View all →
            </Link>
          </div>
        </div>

        {/* Attribution */}
        <div className="flex items-center justify-center gap-md mt-xl" aria-hidden="true">
          <div className="flex-1 h-px" style={{ background: 'rgba(184,150,12,0.12)' }} />
          <span className="font-mono uppercase" style={{ color: 'rgba(184,150,12,0.25)', fontSize: '10px', letterSpacing: '0.22em' }}>
            UK Parliament SI API · Live data
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(184,150,12,0.12)' }} />
        </div>
      </div>
    </section>
  );
}
