'use client';

import { useState, useEffect } from 'react';
import type { ParliamentRegulation } from '../../types/parliament';
import { generateAiVerdicts, aiAggregate, mockGovTally, type GovVote } from '../../lib/mockVotes';
import TallyHeader from './TallyHeader';
import InfoTip from '../ui/InfoTip';
import { TallyCell, GovTallyCell } from './TallyCell';
import OwnVoteCell from './OwnVoteCell';
import TableRowArrow from './TableRowArrow';
import RegulationDetailModal from '../cards/RegulationDetailModal';
import RegulationCard from '../cards/RegulationCard';

interface Props {
  regulations: ParliamentRegulation[];
}

export interface RegulationVotes {
  shadowApprove: number;
  shadowAnnul: number;
  deadline?: string | null;
}

interface PhaseGroup {
  phase: string;
  regulations: ParliamentRegulation[];
}

/* ── Demo data ──────────────────────────────────────────────────────────── */

// Parliament makes roughly 1,500-3,500 SIs a year (Commons Library) and negative-procedure
// SIs sit in a ~40-sitting-day objection window, so — unlike bills, of which only ~19 are
// usually in flight — several dozen SIs are typically live at once. Scaled up accordingly,
// while staying demo-sized.
const DEMO_REGULATIONS: ParliamentRegulation[] = [
  // ── Pending Approval (affirmative) ──────────────────────────────────────
  { id: 1, title: 'The Investigatory Powers (Interception) Regulations 2026', enabling_act: 'Investigatory Powers Act 2016', procedure: 'affirmative', laid_date: '2026-07-20', made_date: null, deadline: '2026-08-15', status: 'pending', house: 'Both', last_update: '2026-07-20T11:00:00Z' },
  { id: 2, title: 'The Financial Services (OTC Derivatives) Regulations 2026', enabling_act: 'Financial Services Act 2021', procedure: 'affirmative', laid_date: '2026-07-18', made_date: null, deadline: '2026-08-10', status: 'pending', house: 'Both', last_update: '2026-07-18T09:00:00Z' },
  { id: 25, title: 'The Online Safety (Categorisation of Services) Regulations 2026', enabling_act: 'Online Safety Act 2023', procedure: 'affirmative', laid_date: '2026-07-22', made_date: null, deadline: '2026-08-20', status: 'pending', house: 'Both', last_update: '2026-07-22T13:00:00Z' },
  { id: 26, title: "The Renters' Rights (Decent Homes Standard) Regulations 2026", enabling_act: "Renters' Rights Act 2026", procedure: 'affirmative', laid_date: '2026-07-25', made_date: null, deadline: '2026-08-22', status: 'pending', house: 'Both', last_update: '2026-07-25T10:00:00Z' },
  { id: 27, title: 'The Economic Crime (Failure to Prevent Fraud) Regulations 2026', enabling_act: 'Economic Crime and Corporate Transparency Act 2023', procedure: 'affirmative', laid_date: '2026-07-15', made_date: null, deadline: '2026-08-05', status: 'pending', house: 'Both', last_update: '2026-07-15T14:30:00Z' },
  { id: 28, title: 'The Building Safety (Higher-Risk Buildings) (Amendment) Regulations 2026', enabling_act: 'Building Safety Act 2022', procedure: 'affirmative', laid_date: '2026-07-27', made_date: null, deadline: '2026-08-25', status: 'pending', house: 'Both', last_update: '2026-07-27T08:45:00Z' },

  // ── Annul Window Open (negative) ────────────────────────────────────────
  { id: 3, title: 'The National Minimum Wage (Amendment) Regulations 2026', enabling_act: 'National Minimum Wage Act 1998', procedure: 'negative', laid_date: '2026-07-10', made_date: null, deadline: '2026-09-14', status: 'pending', house: 'Both', last_update: '2026-07-10T09:00:00Z' },
  { id: 4, title: 'The Education (Student Loan) Regulations 2026', enabling_act: 'Teaching and Higher Education Act 1998', procedure: 'negative', laid_date: '2026-07-08', made_date: null, deadline: '2026-09-12', status: 'pending', house: 'Both', last_update: '2026-07-08T10:00:00Z' },
  { id: 5, title: 'The Immigration (Fees) (Amendment) Regulations 2026', enabling_act: 'Immigration Act 2014', procedure: 'negative', laid_date: '2026-06-29', made_date: null, deadline: '2026-09-02', status: 'pending', house: 'Both', last_update: '2026-06-29T14:00:00Z' },
  { id: 6, title: 'The Road Vehicles (Construction and Use) (Amendment) Regulations 2026', enabling_act: 'Road Traffic Act 1988', procedure: 'negative', laid_date: '2026-07-12', made_date: null, deadline: '2026-09-16', status: 'pending', house: 'Both', last_update: '2026-07-12T08:30:00Z' },
  { id: 29, title: 'The Data Protection (Fundamental Rights and Freedoms) (Amendment) Regulations 2026', enabling_act: 'Data Protection Act 2018', procedure: 'negative', laid_date: '2026-07-14', made_date: null, deadline: '2026-09-18', status: 'pending', house: 'Both', last_update: '2026-07-14T09:15:00Z' },
  { id: 30, title: 'The Environmental Permitting (England and Wales) (Amendment) Regulations 2026', enabling_act: 'Environment Act 2021', procedure: 'negative', laid_date: '2026-07-05', made_date: null, deadline: '2026-09-08', status: 'pending', house: 'Both', last_update: '2026-07-05T11:20:00Z' },
  { id: 31, title: 'The Value Added Tax (Amendment) Regulations 2026', enabling_act: 'Value Added Tax Act 1994', procedure: 'negative', laid_date: '2026-07-21', made_date: null, deadline: '2026-09-24', status: 'pending', house: 'Both', last_update: '2026-07-21T10:00:00Z' },
  { id: 32, title: 'The Air Navigation (Amendment) Regulations 2026', enabling_act: 'Civil Aviation Act 1982', procedure: 'negative', laid_date: '2026-07-17', made_date: null, deadline: '2026-09-20', status: 'pending', house: 'Both', last_update: '2026-07-17T13:40:00Z' },
  { id: 33, title: 'The Merchant Shipping (Amendment) Regulations 2026', enabling_act: 'Merchant Shipping Act 1995', procedure: 'negative', laid_date: '2026-07-09', made_date: null, deadline: '2026-09-13', status: 'pending', house: 'Both', last_update: '2026-07-09T09:50:00Z' },
  { id: 34, title: 'The Companies (Filing Requirements) (Amendment) Regulations 2026', enabling_act: 'Companies Act 2006', procedure: 'negative', laid_date: '2026-07-24', made_date: null, deadline: '2026-09-27', status: 'pending', house: 'Both', last_update: '2026-07-24T15:10:00Z' },
  { id: 35, title: 'The Social Security (Up-rating) Regulations 2026', enabling_act: 'Social Security Administration Act 1992', procedure: 'negative', laid_date: '2026-07-03', made_date: null, deadline: '2026-09-06', status: 'pending', house: 'Both', last_update: '2026-07-03T08:00:00Z' },
  { id: 36, title: 'The Consumer Rights (Digital Content) (Amendment) Regulations 2026', enabling_act: 'Consumer Rights Act 2015', procedure: 'negative', laid_date: '2026-07-19', made_date: null, deadline: '2026-09-22', status: 'pending', house: 'Both', last_update: '2026-07-19T12:00:00Z' },
  { id: 37, title: 'The Town and Country Planning (Permitted Development) (Amendment) Regulations 2026', enabling_act: 'Town and Country Planning Act 1990', procedure: 'negative', laid_date: '2026-07-06', made_date: null, deadline: '2026-09-09', status: 'pending', house: 'Both', last_update: '2026-07-06T10:25:00Z' },
  { id: 38, title: 'The Animal Welfare (Livestock Exports) (Amendment) Regulations 2026', enabling_act: 'Animal Welfare Act 2006', procedure: 'negative', laid_date: '2026-07-28', made_date: null, deadline: '2026-09-30', status: 'pending', house: 'Both', last_update: '2026-07-28T09:05:00Z' },

  // ── Approved (affirmative, passed both Houses, awaiting formal making) ─
  { id: 7, title: 'The Electricity (Capacity Mechanism) (Amendment) Regulations 2025', enabling_act: 'Energy Act 2013', procedure: 'affirmative', laid_date: '2025-11-12', made_date: null, deadline: null, status: 'approved', house: 'Both', last_update: '2026-07-08T00:00:00Z' },
  { id: 39, title: 'The National Insurance Contributions (Secondary Class 1) Regulations 2026', enabling_act: 'National Insurance Contributions Act 2026', procedure: 'affirmative', laid_date: '2026-06-20', made_date: null, deadline: null, status: 'approved', house: 'Both', last_update: '2026-07-11T00:00:00Z' },
  { id: 40, title: 'The Immigration (Skilled Worker) (Amendment) Regulations 2026', enabling_act: 'Immigration Act 1971', procedure: 'affirmative', laid_date: '2026-06-25', made_date: null, deadline: null, status: 'approved', house: 'Both', last_update: '2026-07-09T00:00:00Z' },
  { id: 41, title: 'The Carbon Budget (Sixth Carbon Budget) Regulations 2026', enabling_act: 'Climate Change Act 2008', procedure: 'affirmative', laid_date: '2026-06-15', made_date: null, deadline: null, status: 'approved', house: 'Both', last_update: '2026-07-06T00:00:00Z' },

  // ── Made ─────────────────────────────────────────────────────────────
  { id: 8, title: 'The Health and Safety (Amendment) Regulations 2026', enabling_act: 'Health and Safety at Work Act 1974', procedure: 'negative', laid_date: '2026-05-01', made_date: '2026-05-01', deadline: null, status: 'made', house: 'Both', last_update: '2026-05-01T00:00:00Z' },
  { id: 42, title: 'The Statutory Sick Pay (Amendment) Regulations 2026', enabling_act: 'Social Security Contributions and Benefits Act 1992', procedure: 'negative', laid_date: '2026-06-01', made_date: '2026-06-01', deadline: null, status: 'made', house: 'Both', last_update: '2026-06-01T00:00:00Z' },
  { id: 43, title: 'The Pensions (Automatic Enrolment) (Amendment) Regulations 2026', enabling_act: 'Pensions Act 2008', procedure: 'negative', laid_date: '2026-06-10', made_date: '2026-06-10', deadline: null, status: 'made', house: 'Both', last_update: '2026-06-10T00:00:00Z' },
  { id: 44, title: 'The School Admissions (Amendment) Regulations 2026', enabling_act: 'School Standards and Framework Act 1998', procedure: 'negative', laid_date: '2026-05-20', made_date: '2026-05-20', deadline: null, status: 'made', house: 'Both', last_update: '2026-05-20T00:00:00Z' },
  { id: 45, title: 'The Water Industry (Charges) (Amendment) Regulations 2026', enabling_act: 'Water Industry Act 1991', procedure: 'negative', laid_date: '2026-06-05', made_date: '2026-06-05', deadline: null, status: 'made', house: 'Both', last_update: '2026-06-05T00:00:00Z' },
  { id: 46, title: 'The Renewable Transport Fuel Obligations (Amendment) Regulations 2026', enabling_act: 'Energy Act 2004', procedure: 'negative', laid_date: '2026-06-18', made_date: '2026-06-18', deadline: null, status: 'made', house: 'Both', last_update: '2026-06-18T00:00:00Z' },

  // ── Annulled ─────────────────────────────────────────────────────────
  { id: 9, title: 'The Tenant Fees (Prohibited Payments) Amendment Regulations 2026', enabling_act: 'Tenant Fees Act 2019', procedure: 'negative', laid_date: '2026-02-10', made_date: null, deadline: '2026-04-28', status: 'annulled', house: 'Both', last_update: '2026-04-28T00:00:00Z' },
  { id: 47, title: 'The Housing Benefit (Amendment) Regulations 2026', enabling_act: 'Social Security Contributions and Benefits Act 1992', procedure: 'negative', laid_date: '2026-03-15', made_date: null, deadline: '2026-05-20', status: 'annulled', house: 'Both', last_update: '2026-05-20T00:00:00Z' },

  // ── Withdrawn ────────────────────────────────────────────────────────
  { id: 48, title: 'The Agricultural Subsidies (Transition) (Amendment) Regulations 2026', enabling_act: 'Agriculture Act 2020', procedure: 'negative', laid_date: '2026-04-01', made_date: null, deadline: null, status: 'withdrawn', house: 'Both', last_update: '2026-04-18T00:00:00Z' },
  { id: 49, title: 'The Free Trade Agreement (Tariff) (Amendment) Regulations 2026', enabling_act: 'Taxation (Cross-border Trade) Act 2018', procedure: 'negative', laid_date: '2026-04-10', made_date: null, deadline: null, status: 'withdrawn', house: 'Both', last_update: '2026-04-25T00:00:00Z' },
];

const DEMO_VOTES: Record<number, RegulationVotes> = {
  // Pending Approval
  1: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-08-15' },
  2: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-08-10' },
  25: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-08-20' },
  26: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-08-22' },
  27: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-08-05' },
  28: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-08-25' },
  // Annul Window Open
  3: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-14' },
  4: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-12' },
  5: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-02' },
  6: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-16' },
  29: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-18' },
  30: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-08' },
  31: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-24' },
  32: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-20' },
  33: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-13' },
  34: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-27' },
  35: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-06' },
  36: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-22' },
  37: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-09' },
  38: { shadowApprove: 0, shadowAnnul: 0, deadline: '2026-09-30' },
  // Approved
  7: { shadowApprove: 6100, shadowAnnul: 900 },
  39: { shadowApprove: 8200, shadowAnnul: 1400 },
  40: { shadowApprove: 5400, shadowAnnul: 6700 },
  41: { shadowApprove: 14300, shadowAnnul: 2100 },
  // Made
  8: { shadowApprove: 4200, shadowAnnul: 1800 },
  42: { shadowApprove: 9100, shadowAnnul: 2300 },
  43: { shadowApprove: 12400, shadowAnnul: 1900 },
  44: { shadowApprove: 3800, shadowAnnul: 5200 },
  45: { shadowApprove: 7600, shadowAnnul: 4100 },
  46: { shadowApprove: 6900, shadowAnnul: 2200 },
  // Annulled
  9: { shadowApprove: 1200, shadowAnnul: 8700 },
  47: { shadowApprove: 2100, shadowAnnul: 9400 },
  // 48, 49 (Withdrawn): withdrawn before debate — no tally
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

/** What each phase actually means for the instrument, in plain terms. Kept
 *  procedural — what happens and who votes — with no comment on any
 *  instrument's merits or on who laid it. */
const PHASE_DESCRIPTIONS: Record<string, string> = {
  'Pending Approval': 'An affirmative instrument. It cannot be made until both Houses actively vote to approve it, so the public vote runs until that approval is taken.',
  'Annul Window Open': 'A negative instrument. It becomes law automatically unless either House votes to annul it within the objection period — usually 40 sitting days from laying.',
  Approved: 'Both Houses have voted to approve the instrument. It now awaits formal making before it comes into force.',
  Made: 'The instrument has been formally made and is in force as law.',
  Annulled: 'Parliament voted to annul the instrument within the objection period, so it does not come into force.',
  Withdrawn: 'The instrument was withdrawn before Parliament settled it and will not proceed.',
};

function phaseDescription(phase: string): string {
  return PHASE_DESCRIPTIONS[phase] ?? 'This instrument is before Parliament.';
}

export function regulationPhase(reg: ParliamentRegulation): string {
  if (reg.status === 'pending') {
    return reg.procedure === 'affirmative' ? 'Pending Approval' : 'Annul Window Open';
  }
  if (reg.status === 'approved') return 'Approved';
  if (reg.status === 'made') return 'Made';
  if (reg.status === 'annulled') return 'Annulled';
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

export function regulationStatus(reg: ParliamentRegulation): { label: string; color: string; glow: string } {
  if (reg.status === 'made' || reg.status === 'approved') return { label: reg.status === 'approved' ? 'Approved' : 'Made', color: '#10B981', glow: '#10B98166' };
  if (reg.status === 'annulled') return { label: 'Annulled', color: '#EF4444', glow: '#EF444466' };
  if (reg.status === 'withdrawn') return { label: 'Withdrawn', color: '#6B7280', glow: '#6B728066' };
  return { label: 'Pending', color: '#D4AF37', glow: '#D4AF3766' };
}

export function isVoteOpen(reg: ParliamentRegulation): boolean {
  return reg.status === 'pending';
}

/** While an instrument is still pending, Parliament has not settled it — the
 *  parliamentary deadline is the date by which it must. */
export function regulationGovVote(reg: ParliamentRegulation, votes: RegulationVotes | undefined): GovVote {
  if (reg.status === 'withdrawn') return { status: 'none' };
  if (isVoteOpen(reg)) return { status: 'pending', scheduledDate: votes?.deadline ?? reg.deadline ?? null };
  const tally = mockGovTally(reg.id, votes?.shadowApprove ?? 0, votes?.shadowAnnul ?? 0);
  return { status: 'voted', for: tally.for, against: tally.against };
}

/** The AI panel's verdicts collapsed into a for/against tally, so it can be
 *  shown in the same bar format as the citizen and Parliament tallies. */
export function regulationAiTally(reg: ParliamentRegulation): { for: number; against: number } {
  const agg = aiAggregate(generateAiVerdicts(reg.title, reg.id));
  return { for: agg.approve, against: agg.reject };
}

/* ── Row ────────────────────────────────────────────────────────────────── */

function procedureLabel(reg: ParliamentRegulation): string {
  return reg.procedure === 'affirmative' ? 'Affirmative' : 'Negative';
}

function RegulationRow({ reg, votes, myVote, onSelect, onVote }: { reg: ParliamentRegulation; votes?: RegulationVotes; myVote?: 'for' | 'against'; onSelect: () => void; onVote: (choice: 'for' | 'against') => void }) {
  const vOpen = isVoteOpen(reg);
  const revealed = !vOpen || myVote != null;

  return (
    // Only the title and the trailing arrow open the instrument — the row
    // itself carries no click handler, so a miss-click reaching for the vote
    // buttons doesn't accidentally pop the modal open.
    <tr className="ledger-table__row" data-voted={myVote ? 'true' : undefined}>
      <td className="ledger-table__cell ledger-table__cell--no font-mono tabular-nums">{reg.id}</td>

      <td className="ledger-table__cell ledger-table__cell--name">
        <button type="button" className="ledger-table__title" onClick={onSelect}>
          {reg.title}
        </button>
        {/* The parent Act is what makes an otherwise opaque SI title legible. */}
        <span className="ledger-table__subtitle font-mono">{reg.enabling_act}</span>
        {/* Narrow viewports fold the Procedure column — and, on phones, the
            citizen's own vote — into this cell, so what a citizen needs to read
            the row stays on screen. Only one copy of each is ever displayed;
            CSS decides which. */}
        {/* Named in full when folded in — out of its column the bare word has
            nothing to tell a reader what it refers to. */}
        <span className="ledger-table__row-procedure font-mono">
          {procedureLabel(reg)} procedure
        </span>
        {(vOpen || myVote) && (
          <span className="ledger-table__row-own">
            <OwnVoteCell title={reg.title} isOpen={vOpen} myVote={myVote} onVote={onVote} forLabel="Approve" againstLabel="Annul" />
          </span>
        )}
      </td>

      <td className="ledger-table__cell ledger-table__cell--house font-mono">{procedureLabel(reg)}</td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <TallyCell
          tally={{ for: votes?.shadowApprove ?? 0, against: votes?.shadowAnnul ?? 0 }}
          revealed={revealed}
          forLabel="Approve"
          againstLabel="Annul"
        />
      </td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <TallyCell tally={regulationAiTally(reg)} revealed={revealed} forLabel="Approve" againstLabel="Annul" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <GovTallyCell gov={regulationGovVote(reg, votes)} revealed={revealed} forLabel="Approve" againstLabel="Annul" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--own">
        <OwnVoteCell title={reg.title} isOpen={vOpen} myVote={myVote} onVote={onVote} forLabel="Approve" againstLabel="Annul" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--arrow">
        <TableRowArrow label={reg.title} onSelect={onSelect} />
      </td>
    </tr>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function RegulationBoardSection({ regulations }: Props) {
  const [clock, setClock] = useState('');
  const [date, setDate] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [votedMap, setVotedMap] = useState<Record<number, 'for' | 'against'>>({});

  const isDemo = regulations.length === 0;
  const display = isDemo ? DEMO_REGULATIONS : regulations;
  const votes = isDemo ? DEMO_VOTES : ({} as Record<number, RegulationVotes>);
  const groups = groupByPhase(display);
  const selectedRegulation = selectedId != null ? display.find(r => r.id === selectedId) : undefined;

  const castVote = (id: number, choice: 'for' | 'against') =>
    setVotedMap(prev => ({ ...prev, [id]: choice }));

  // Starts empty and fills on the client — a server-rendered time would be
  // stale the moment it arrived, and would mismatch on hydration.
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
    // Antique bronze on near-black — the same darkness register as the Bill
    // Board, but with the gold accent swapped for a warmer bronze/copper so
    // the two boards read as different metals, not different hues.
    <section
      id="regulations"
      className="board-surface"
      data-board-theme="bronze"
      style={{ background: '#14100c', borderTop: '2px solid rgba(168,114,47,0.45)' }}
    >
      <div className="max-w-[1400px] mx-auto px-md sm:px-xl lg:px-3xl pt-2xl lg:pt-3xl pb-3xl lg:pb-4xl">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-lg mb-xl flex-wrap">
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: '#EF4444', boxShadow: '0 0 8px #EF444488' }} />
              <span className="font-mono text-caption uppercase" style={{ color: '#C08A4A', letterSpacing: '0.22em' }}>
                Live · Statutory Instruments
              </span>
              {isDemo && (
                <span className="font-mono" style={{ color: '#C08A4A', fontSize: '9px', letterSpacing: '0.15em', opacity: 0.5, textTransform: 'uppercase', border: '1px solid rgba(168,114,47,0.3)', padding: '1px 6px', borderRadius: '2px' }}>
                  Demo
                </span>
              )}
            </div>
            <h2 className="ledger-headline" style={{ color: '#FAF6ED', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', lineHeight: '1.08' }}>
              The Regulation Board.
            </h2>
            <p className="font-mono" style={{ color: '#C08A4A', fontSize: '12px', opacity: 0.5, letterSpacing: '0.12em', marginTop: '8px' }}>
              Public shadow votes cast before the parliamentary deadline
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-xxs shrink-0">
            <span className="font-mono font-semibold tabular-nums" style={{ color: '#FAF6ED', fontSize: '2.4rem', letterSpacing: '0.04em', lineHeight: 1 }}>
              {clock || '—:—:—'}
            </span>
            <span className="font-mono" style={{ color: '#C08A4A', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {date || ' '} · London
            </span>
          </div>
        </div>

        {/* ── Regulation table ────────────────────────────────────────── */}
        <div className="ledger-table__wrap">
          <table className="ledger-table">
            <caption className="sr-only">
              Statutory instruments before Parliament, ordered by phase — those still open to a vote first, settled and withdrawn instruments last.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="ledger-table__cell--no">No.</th>
                {/* Left-anchored: this column sits against the table's left
                    edge, so a centred tooltip would spill off it. */}
                <th scope="col" className="ledger-table__cell--name" aria-label="Regulation">
                  Regulation
                  <InfoTip align="left" label="Regulation" tip="The instrument's formal title as laid before Parliament, with the Act it is made under beneath. Select any row to read the full detail and cast your vote." />
                </th>
                <th scope="col" className="ledger-table__cell--house" aria-label="Procedure">
                  Procedure
                  <InfoTip label="Procedure" tip="How Parliament scrutinises the instrument. An affirmative instrument must be actively approved by both Houses before it can be made; a negative one becomes law unless either House annuls it." />
                </th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="Public vote tally"><TallyHeader kind="public" context="regulation" /></th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="AI vote tally"><TallyHeader kind="ai" context="regulation" /></th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="Government vote tally"><TallyHeader kind="government" context="regulation" align="right" /></th>
                <th scope="col" className="ledger-table__cell--own" aria-label="Your vote">
                  Your vote
                  <InfoTip
                    align="right"
                    label="Your vote"
                    tip="Your own shadow vote. Cast it from this column or from the instrument detail while the voting window is open, and your choice is shown here. If you do not vote before the deadline, this column reads 'Did not vote'."
                  />
                </th>
                <th scope="col" className="ledger-table__cell--arrow">
                  <span className="sr-only">Open detail</span>
                </th>
              </tr>
            </thead>
            {/* One banded section per phase rather than a Phase column — the
                board is ordered by phase, so the heading carries it once for the
                whole group instead of repeating on every row. */}
            {groups.map(group => (
              <tbody key={group.phase} className="ledger-table__group">
                <tr className="ledger-table__stage-row">
                  <th scope="colgroup" colSpan={8} className="ledger-table__stage-head" aria-label={group.phase}>
                    <span className="ledger-table__stage-title">{group.phase}</span>
                    <InfoTip align="left" scope="stage" label={group.phase} tip={phaseDescription(group.phase)} />
                  </th>
                </tr>
                {group.regulations.map(reg => (
                  <RegulationRow
                    key={reg.id}
                    reg={reg}
                    votes={votes[reg.id]}
                    myVote={votedMap[reg.id]}
                    onSelect={() => setSelectedId(reg.id)}
                    onVote={choice => castVote(reg.id, choice)}
                  />
                ))}
              </tbody>
            ))}
          </table>
        </div>

        {/* ── Regulation cards (phones) — see DepartureBoardSection for why. */}
        <div className="board-cards">
          {groups.map(group => (
            <div key={group.phase} className="board-cards__group">
              <div className="board-cards__stage-head">
                <span className="board-cards__stage-title">{group.phase}</span>
                <InfoTip align="left" scope="stage" label={group.phase} tip={phaseDescription(group.phase)} />
              </div>
              <div className="board-cards__stack">
                {group.regulations.map(reg => (
                  <RegulationCard
                    key={reg.id}
                    reg={reg}
                    votes={votes[reg.id]}
                    myVote={votedMap[reg.id]}
                    onSelect={() => setSelectedId(reg.id)}
                    onVote={choice => castVote(reg.id, choice)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRegulation && (
        <RegulationDetailModal
          regulation={selectedRegulation}
          votes={votes[selectedRegulation.id]}
          voted={votedMap[selectedRegulation.id] ?? null}
          onVote={choice => castVote(selectedRegulation.id, choice)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
