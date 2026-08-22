'use client';

import { useState, useEffect } from 'react';
import type { ParliamentBill } from '../../types/parliament';
import { generateAiVerdicts, aiAggregate, mockLastDivision, type GovVote } from '../../lib/mockVotes';
import TallyHeader from './TallyHeader';
import InfoTip from '../ui/InfoTip';
import HouseBadge from '../ui/HouseBadge';
import { TallyCell, GovTallyCell } from './TallyCell';
import OwnVoteCell from './OwnVoteCell';
import TableRowArrow from './TableRowArrow';
import BillDetailModal from '../cards/BillDetailModal';
import BillCard from '../cards/BillCard';
import BoardMargin from './BoardMargin';

interface Props {
  bills: ParliamentBill[];
}

export interface BillVotes {
  shadowAyes: number;
  shadowNoes: number;
}

/* ── Demo data ─────────────────────────────────────────────────────────── */

// Sized to match the ~19 government bills Parliament typically has in flight at once
// (Parallel Parliament, government-bills tracker, 2026-27 session), spread across stages.
const DEMO_BILLS: ParliamentBill[] = [
  { id: 1,  short_title: 'Employment Rights Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-22T08:51:00Z' },
  { id: 2,  short_title: 'Planning and Infrastructure Bill',                   long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-24T06:42:00Z' },
  { id: 3,  short_title: 'Crime and Policing Bill',                            long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-25T09:14:00Z' },
  { id: 4,  short_title: 'Data (Use and Access) Bill',                         long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-20T04:30:00Z' },
  { id: 5,  short_title: "Renters' Rights Bill",                               long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Third Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-27T10:22:00Z' },
  { id: 6,  short_title: 'Border Security, Asylum and Immigration Bill',       long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-18T02:55:00Z' },
  { id: 7,  short_title: "Children's Wellbeing and Schools Bill",              long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-23T07:48:00Z' },
  { id: 8,  short_title: 'Great British Energy Bill',                          long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-10T11:00:00Z' },
  { id: 9,  short_title: 'Football Governance Bill',                           long_title: null, originating_house: 'Lords',   current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-05T14:00:00Z' },
  { id: 10, short_title: 'Terminal Illness (Relief of Pain) Bill',             long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-26T05:10:00Z' },
  { id: 11, short_title: 'Armed Forces Commissioner Bill',                     long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-08T09:00:00Z' },
  { id: 12, short_title: 'Passenger Railway Services (Public Ownership) Bill', long_title: null, originating_house: 'Commons', current_house: null,      current_stage_name: 'Royal Assent',    is_act: true,  is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-02T16:00:00Z' },
  { id: 13, short_title: 'Tobacco and Vapes Bill',                             long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-21T22:05:00Z' },
  { id: 14, short_title: 'Bank Resolution (Recapitalisation) Bill',            long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-19T16:20:00Z' },
  { id: 15, short_title: 'High Speed Rail (Crewe – Manchester) Bill',          long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-29T10:00:00Z' },
  { id: 16, short_title: 'Sentencing Bill',                                    long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-28T11:30:00Z' },
  { id: 17, short_title: 'Mental Health Bill',                                 long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-24T13:15:00Z' },
  { id: 18, short_title: 'Water (Special Measures) Bill',                      long_title: null, originating_house: 'Lords',   current_house: 'Lords',   current_stage_name: 'Committee Stage', is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-17T09:40:00Z' },
  { id: 19, short_title: 'Pension Schemes Bill',                               long_title: null, originating_house: 'Commons', current_house: 'Lords',   current_stage_name: 'Report Stage',    is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-15T15:05:00Z' },
  { id: 20, short_title: 'Non-Domestic Rating (Multipliers and Private Schools) Bill', long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Report Stage', is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-16T12:20:00Z' },
  { id: 21, short_title: 'Arbitration Bill',                                   long_title: null, originating_house: 'Lords',   current_house: 'Lords',   current_stage_name: 'Third Reading',   is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-30T08:00:00Z' },
  { id: 22, short_title: 'Holocaust Memorial Bill',                            long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Ping-Pong',       is_act: false, is_defeated: false, bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-31T09:00:00Z' },
  { id: 23, short_title: 'Local Government (Boundary Changes) Bill',           long_title: null, originating_house: 'Commons', current_house: 'Commons', current_stage_name: 'Second Reading',  is_act: false, is_defeated: true,  bill_withdrawn: null, detail_url: null, parliament_last_update: '2026-07-14T17:45:00Z' },
  { id: 24, short_title: 'Digital Markets (Amendment) Bill',                   long_title: null, originating_house: 'Lords',   current_house: 'Commons', current_stage_name: 'First Reading',   is_act: false, is_defeated: false, bill_withdrawn: '2026-07-12', detail_url: null, parliament_last_update: '2026-07-12T10:30:00Z' },
];

const DEMO_VOTES: Record<number, BillVotes> = {
  // Bills at First/Second Reading — vote open, shadow tally still accruing
  2:  { shadowAyes: 6400, shadowNoes: 2100 },
  6:  { shadowAyes: 3200, shadowNoes: 1800 },
  10: { shadowAyes: 4100, shadowNoes:  900 },
  14: { shadowAyes:  600, shadowNoes:  200 },
  15: { shadowAyes:  300, shadowNoes:  150 },
  16: { shadowAyes: 5200, shadowNoes: 2600 },
  // Bills further through their passage — shadow vote has had longer to accrue
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
  // 24 (Digital Markets (Amendment) Bill): withdrawn at First Reading — no tally yet
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

export function stageLabel(bill: ParliamentBill): string {
  if (bill.is_act) return 'Royal Assent';
  if (bill.is_defeated) return 'Defeated';
  if (bill.bill_withdrawn) return 'Withdrawn';
  return bill.current_stage_name ?? 'Active';
}

export function billHouse(bill: ParliamentBill): string {
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

/** Open for the whole of a bill's passage — from First Reading to Royal
 *  Assent, defeat or withdrawal — rather than closing at any one stage. */
export function isVoteOpen(bill: ParliamentBill): boolean {
  return !bill.is_act && !bill.is_defeated && !bill.bill_withdrawn;
}

/** The division — or the agreement without one ("on the nod") — that most
 *  recently progressed the bill to the stage it is at now. A bill still at
 *  First Reading has no prior stage transition to report yet. */
export function billGovVote(bill: ParliamentBill): GovVote {
  if (bill.bill_withdrawn) return { status: 'none' };
  const s = (bill.current_stage_name ?? '').toLowerCase();
  if (s === '' || s.includes('first reading')) return { status: 'none' };
  const div = mockLastDivision(bill.id);
  return div.status === 'nod' ? { status: 'nod' } : { status: 'voted', for: div.for, against: div.against };
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
  const title = bill.short_title ?? bill.long_title ?? 'Untitled Bill';
  // Public, AI and Government tallies are never gated behind the citizen's own
  // vote for bills — only the vote buttons themselves are gated by vOpen.
  const revealed = true;

  return (
    // Only the title and the trailing arrow open the bill — the row itself
    // carries no click handler, so a miss-click reaching for the vote
    // buttons doesn't accidentally pop the modal open.
    <tr className="ledger-table__row" data-voted={myVote ? 'true' : undefined}>
      <td className="ledger-table__cell ledger-table__cell--origin">
        <HouseBadge house={bill.originating_house} size={28} />
      </td>

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

      <td className="ledger-table__cell ledger-table__cell--stage font-mono">{stageLabel(bill)}</td>

      {/* Tallies use the plural "Ayes"/"Noes" — Parliament's own convention when
          counting votes ("Ayes to the right, Noes to the left"), distinct from
          the singular "Aye"/"No" used for the citizen's own individual vote. */}
      <td className="ledger-table__cell ledger-table__cell--tally">
        <TallyCell
          tally={{
            // The citizen's own vote counts into the public tally the moment
            // they cast it, same as the card and modal.
            for: (votes?.shadowAyes ?? 0) + (myVote === 'for' ? 1 : 0),
            against: (votes?.shadowNoes ?? 0) + (myVote === 'against' ? 1 : 0),
          }}
          revealed={revealed}
          forLabel="Ayes"
          againstLabel="Noes"
        />
      </td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <TallyCell tally={billAiTally(bill)} revealed={revealed} forLabel="Ayes" againstLabel="Noes" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--tally">
        <GovTallyCell gov={billGovVote(bill)} revealed={revealed} forLabel="Ayes" againstLabel="Noes" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--own">
        <OwnVoteCell title={title} isOpen={vOpen} myVote={myVote} onVote={onVote} forLabel="Aye" againstLabel="No" />
      </td>

      <td className="ledger-table__cell ledger-table__cell--arrow">
        <TableRowArrow label={title} onSelect={onSelect} />
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
  const sorted  = [...display].sort((a, b) => a.id - b.id);
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
    <section id="bills" className="board-surface" style={{ background: 'var(--color-ledger-bg)', position: 'relative' }}>
      <BoardMargin side="left" />
      <BoardMargin side="right" />
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
            <p className="font-mono" style={{ color: '#B8960C', fontSize: '12px', letterSpacing: '0.12em', marginTop: '8px' }}>
              Public shadow votes — open from First Reading to Royal Assent
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
              Bills before Parliament, ordered by bill number.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="ledger-table__cell--origin" aria-label="Originating House">
                  <span className="tally-header">
                    <span className="tally-header__icon">
                      {/* A plain house — whichever House introduced the bill is read
                          per-row from the coloured badge below. */}
                      <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden="true">
                        <path d="M12 3 L2 11 H5 V21 H19 V11 H22 Z" />
                      </svg>
                      <span className="sr-only">Originating House</span>
                    </span>
                    <InfoTip align="left" label="Originating House" tip="The House the bill was first introduced in — Commons or Lords." />
                  </span>
                </th>
                <th scope="col" className="ledger-table__cell--no">No.</th>
                {/* aria-label so the column's own name stays the plain label —
                    without it the InfoTip's text runs into it in the a11y tree. */}
                <th scope="col" className="ledger-table__cell--name" aria-label="Bill">
                  Bill
                  {/* Left-anchored: this column sits against the table's left
                      edge, so a centred tooltip would spill off it. */}
                  <InfoTip align="left" label="Bill" tip="The bill's short title as published by Parliament. Select any row to read the full detail and cast your vote." />
                </th>
                <th scope="col" className="ledger-table__cell--house" aria-label="Current House">
                  Current House
                  <InfoTip label="Current House" tip="The House the bill currently sits in — Commons or Lords, or Both once it is passing between them, or neither once it has received Royal Assent." />
                </th>
                <th scope="col" className="ledger-table__cell--stage" aria-label="Stage">
                  Stage
                  <InfoTip label="Stage" tip="Where the bill stands right now, exactly as Parliament names it — not a simplified summary." />
                </th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="Public vote tally"><TallyHeader kind="public" /></th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="AI vote tally"><TallyHeader kind="ai" /></th>
                <th scope="col" className="ledger-table__cell--tally" aria-label="Government vote tally"><TallyHeader kind="government" align="right" /></th>
                <th scope="col" className="ledger-table__cell--own" aria-label="Your vote">
                  Your vote
                  <InfoTip
                    align="right"
                    label="Your vote"
                    tip="Your own shadow vote. Cast it from this column or from the bill detail any time the bill remains before Parliament — from First Reading until Royal Assent, defeat or withdrawal. If you never vote, this column reads 'Did not vote' once the bill is settled."
                  />
                </th>
                <th scope="col" className="ledger-table__cell--arrow">
                  <span className="sr-only">Open detail</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(bill => (
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
          </table>
        </div>

        {/* ── Bill cards (phones) ──────────────────────────────────────
            The table's own fold keeps its header within reach for the first
            couple of rows, but a board running to a few dozen items scrolls
            it away from everything after that. Below the phone breakpoint,
            CSS swaps the table above for this card list — same data, same
            order, same modal on tap. */}
        <div className="board-cards">
          <div className="board-cards__stack">
            {sorted.map(bill => (
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
