'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ParliamentBill } from '../types/parliament';
import { generateAiVerdicts, aiAggregate, mockGovTally, type GovVote } from '../lib/mockVotes';
import TallyHeader from './TallyHeader';
import InfoTip from './InfoTip';
import { TallyCell, GovTallyCell } from './TallyCell';
import OwnVoteCell from './OwnVoteCell';
import BillDetailModal from './BillDetailModal';
import BillCard from './BillCard';

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

/** What each stage actually is, in plain terms. Kept deliberately procedural —
 *  what happens and who votes — with no comment on any bill's merits or on who
 *  brought it forward. */
const STAGE_DESCRIPTIONS: Record<string, string> = {
  'first reading': 'The bill is formally introduced and its title read out. There is no debate and no vote; the full text is published shortly afterwards, and the public shadow vote opens.',
  'second reading': 'The first debate on the principle of the bill, ending in the division that decides whether it proceeds. The public shadow vote closes here.',
  'committee stage': 'The bill is examined line by line. Amendments are proposed and voted on, but the principle of the bill is already settled.',
  'report stage': 'The whole House reviews the bill as amended in committee and can make further changes before it is finalised.',
  'third reading': 'The final debate and vote on the bill as it now stands. No further amendments can be made in this House.',
  'consideration of amendments': 'One House considers the changes the other made, accepting, rejecting or amending them in turn.',
  'ping-pong': 'The bill passes back and forth between the Commons and the Lords until both Houses agree on identical text.',
  'royal assent': 'The bill has passed both Houses and received the monarch’s assent. It is now an Act of Parliament and is law.',
  defeated: 'The bill lost a decisive vote and can go no further in this session.',
  withdrawn: 'The bill was withdrawn before completing its passage and will not proceed.',
};

function stageDescription(stage: string): string {
  return STAGE_DESCRIPTIONS[stage.toLowerCase()] ?? 'This bill is making its way through Parliament.';
}

export function stageLabel(bill: ParliamentBill): string {
  if (bill.is_act) return 'Royal Assent';
  if (bill.is_defeated) return 'Defeated';
  if (bill.bill_withdrawn) return 'Withdrawn';
  return bill.current_stage_name ?? 'Active';
}

/** Board order: earliest stage first (First Reading at the top), defeated and
 *  withdrawn bills last, banded into one group per stage. `sort` is stable, so
 *  bills within a stage keep the order Parliament returned them in. */
function groupByStage(bills: ParliamentBill[]): StageGroup[] {
  const groups: StageGroup[] = [];
  for (const bill of [...bills].sort((a, b) => stageRank(a) - stageRank(b))) {
    const stage = stageLabel(bill);
    const last = groups[groups.length - 1];
    if (last && last.stage === stage) last.bills.push(bill);
    else groups.push({ stage, bills: [bill] });
  }
  return groups;
}

/** Which House the bill currently sits in. Deliberately derived from the
 *  *current* house only — `originating_house` identifies the political source
 *  of a bill and must never surface. A bill bouncing between the two Houses,
 *  or one that has cleared both, reads as "Both". */
export function billHouse(bill: ParliamentBill): string {
  if (bill.is_act) return 'Both';
  const s = (bill.current_stage_name ?? '').toLowerCase();
  if (s.includes('ping-pong') || s.includes('consideration of amendments')) return 'Both';
  return bill.current_house ?? '—';
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

/** Parliament divides on a bill at Second Reading. So while the citizen window
 *  is still open (First/Second Reading) the government has not voted yet — the
 *  Second Reading date is when it is expected to. */
export function billGovVote(bill: ParliamentBill, votes: BillVotes | undefined): GovVote {
  if (bill.bill_withdrawn) return { status: 'none' };
  if (isVoteOpen(bill)) return { status: 'pending', scheduledDate: votes?.secondReadingDate ?? null };
  const tally = mockGovTally(bill.id, votes?.shadowAyes ?? 0, votes?.shadowNoes ?? 0);
  return { status: 'voted', for: tally.for, against: tally.against };
}

/** The AI panel's verdicts collapsed into a for/against tally, so it can be
 *  shown in the same bar format as the citizen and Parliament tallies. */
export function billAiTally(bill: ParliamentBill): { for: number; against: number } {
  const agg = aiAggregate(generateAiVerdicts(bill.short_title ?? bill.long_title ?? 'this bill', bill.id));
  return { for: agg.approve, against: agg.reject };
}

/* ── Row ────────────────────────────────────────────────────────────────── */

function BillRow({ bill, votes, myVote, onSelect, onVote }: { bill: ParliamentBill; votes?: BillVotes; myVote?: 'for' | 'against'; onSelect: () => void; onVote: (choice: 'for' | 'against') => void }) {
  const vOpen = isVoteOpen(bill);
  const revealed = !vOpen || myVote != null;
  const title = bill.short_title ?? bill.long_title ?? 'Untitled Bill';

  return (
    // The whole row opens the bill. The title stays a real button so the row is
    // still reachable and operable from the keyboard without a second tab stop.
    <tr className="ledger-table__row" data-voted={myVote ? 'true' : undefined} onClick={onSelect}>
      <td className="ledger-table__cell ledger-table__cell--no font-mono tabular-nums">{bill.id}</td>

      <td className="ledger-table__cell ledger-table__cell--name">
        <button type="button" className="ledger-table__title" onClick={onSelect}>
          {title}
        </button>
        {/* On phones the citizen's own vote folds into this cell so the column
            they act on stays on screen. Only one copy is ever displayed; CSS
            decides which. Nothing folds in where there is nothing to act on. */}
        {(vOpen || myVote) && (
          <span className="ledger-table__row-own">
            <OwnVoteCell title={title} isOpen={vOpen} myVote={myVote} onVote={onVote} forLabel="Aye" againstLabel="No" />
          </span>
        )}
      </td>

      <td className="ledger-table__cell ledger-table__cell--house font-mono">{billHouse(bill)}</td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <TallyCell
          tally={{ for: votes?.shadowAyes ?? 0, against: votes?.shadowNoes ?? 0 }}
          revealed={revealed}
          forLabel="Aye"
          againstLabel="No"
        />
      </td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <TallyCell tally={billAiTally(bill)} revealed={revealed} forLabel="Aye" againstLabel="No" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <GovTallyCell gov={billGovVote(bill, votes)} revealed={revealed} forLabel="Aye" againstLabel="No" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--own">
        <OwnVoteCell title={title} isOpen={vOpen} myVote={myVote} onVote={onVote} forLabel="Aye" againstLabel="No" />
      </td>
    </tr>
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

  const castVote = (id: number, choice: 'for' | 'against') =>
    setVotedMap(prev => ({ ...prev, [id]: choice }));

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
    // Flat forest green edge to edge — no gradient, so the board reads as one
    // continuous surface and the step to the Regulation Board is a clean cut.
    <section className="board-surface" style={{ background: '#0C1610' }}>
      {/* 1400px is the brand page width (DESIGN.md `--ds-page-width`); beyond it
          the table's slack all lands in the Bill column and pushes House and
          Stage far from the name they describe. */}
      <div className="max-w-[1400px] mx-auto px-md sm:px-xl lg:px-3xl pt-2xl lg:pt-3xl pb-3xl lg:pb-4xl">

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
            <p className="font-mono" style={{ color: '#B8960C', fontSize: '12px', opacity: 0.5, letterSpacing: '0.12em', marginTop: '8px' }}>
              Public shadow votes cast at the second reading
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

        {/* ── Bill table ──────────────────────────────────────────────── */}
        <div className="ledger-table__wrap">
          <table className="ledger-table">
            <caption className="sr-only">
              Bills before Parliament, ordered by stage — First Reading first, defeated and withdrawn last.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="ledger-table__cell--no">No.</th>
                {/* aria-label so the column's own name stays the plain label —
                    without it the InfoTip's text runs into it in the a11y tree. */}
                <th scope="col" className="ledger-table__cell--name" aria-label="Bill">
                  Bill
                  {/* Left-anchored: this column sits against the table's left
                      edge, so a centred tooltip would spill off it. */}
                  <InfoTip align="left" label="Bill" tip="The bill's short title as published by Parliament. Select any row to read the full detail and cast your vote." />
                </th>
                <th scope="col" className="ledger-table__cell--house" aria-label="House">
                  House
                  <InfoTip label="House" tip="The House the bill currently sits in — Commons or Lords, or Both once it is passing between them." />
                </th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="Public vote tally"><TallyHeader kind="public" /></th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="AI vote tally"><TallyHeader kind="ai" /></th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="Government vote tally"><TallyHeader kind="government" align="right" /></th>
                <th scope="col" className="ledger-table__cell--own" aria-label="Your vote">
                  Your vote
                  <InfoTip
                    align="right"
                    label="Your vote"
                    tip="Your own shadow vote. Cast it from this column or from the bill detail while the bill is at First or Second Reading, and your choice is shown here. If you do not vote before the window closes, this column reads 'Did not vote'."
                  />
                </th>
              </tr>
            </thead>
            {/* One banded section per stage rather than a Stage column — the
                board is ordered by stage, so the heading carries it once for the
                whole group instead of repeating on every row. */}
            {groups.map(group => (
              <tbody key={group.stage} className="ledger-table__group">
                <tr className="ledger-table__stage-row">
                  <th scope="colgroup" colSpan={7} className="ledger-table__stage-head" aria-label={group.stage}>
                    <span className="ledger-table__stage-title">{group.stage}</span>
                    <InfoTip align="left" scope="stage" label={group.stage} tip={stageDescription(group.stage)} />
                  </th>
                </tr>
                {group.bills.map(bill => (
                  <BillRow
                    key={bill.id}
                    bill={bill}
                    votes={votes[bill.id]}
                    myVote={votedMap[bill.id]}
                    onSelect={() => setSelectedId(bill.id)}
                    onVote={choice => castVote(bill.id, choice)}
                  />
                ))}
              </tbody>
            ))}
          </table>
        </div>

        {/* ── Bill cards (phones) ──────────────────────────────────────
            The table's own fold keeps its header within reach for the first
            couple of rows, but a board running to a few dozen items scrolls
            it away from everything after that. Below the phone breakpoint,
            CSS swaps the table above for this card list — same groups, same
            data, same modal on tap. */}
        <div className="board-cards">
          {groups.map(group => (
            <div key={group.stage} className="board-cards__group">
              <div className="board-cards__stage-head">
                <span className="board-cards__stage-title">{group.stage}</span>
                <InfoTip align="left" scope="stage" label={group.stage} tip={stageDescription(group.stage)} />
              </div>
              <div className="board-cards__stack">
                {group.bills.map(bill => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    votes={votes[bill.id]}
                    myVote={votedMap[bill.id]}
                    onSelect={() => setSelectedId(bill.id)}
                    onVote={choice => castVote(bill.id, choice)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end mt-lg">
          <Link href="/bills" className="board-view-all font-mono no-underline shrink-0">
            View all →
          </Link>
        </div>
      </div>

      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          votes={votes[selectedBill.id]}
          voted={votedMap[selectedBill.id] ?? null}
          onVote={choice => castVote(selectedBill.id, choice)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
