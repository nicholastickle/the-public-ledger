import Link from 'next/link';
import type { ParliamentRegulation } from '../types/parliament';
import { formatCountdown, clipText } from '../lib/utils';
import VoteBar from './VoteBar';

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

function regulationStatus(reg: ParliamentRegulation): { label: string; color: string; glow: string } {
  if (reg.status === 'made' || reg.status === 'approved') return { label: reg.status === 'approved' ? 'Approved' : 'Made', color: '#10B981', glow: '#10B98166' };
  if (reg.status === 'annulled')  return { label: 'Annulled',  color: '#EF4444', glow: '#EF444466' };
  if (reg.status === 'withdrawn') return { label: 'Withdrawn', color: '#6B7280', glow: '#6B728066' };
  return                                 { label: 'Pending',   color: '#D4AF37', glow: '#D4AF3766' };
}

function isVoteOpen(reg: ParliamentRegulation): boolean {
  return reg.status === 'pending';
}

/* ── Card ───────────────────────────────────────────────────────────────── */

function ProcedureBadge({ reg }: { reg: ParliamentRegulation }) {
  const isAff = reg.procedure === 'affirmative';
  const color  = isAff ? '#A78BFA' : '#D4AF37';
  const border = isAff ? 'rgba(167,139,250,0.35)' : 'rgba(212,175,55,0.35)';
  return (
    <span
      className="font-mono uppercase"
      style={{ color, fontSize: '10px', letterSpacing: '0.1em', border: `1px solid ${border}`, padding: '1px 5px', borderRadius: '2px' }}
    >
      {isAff ? 'Affirmative' : 'Negative'}
    </span>
  );
}

function RegulationKanbanCard({ reg, votes }: { reg: ParliamentRegulation; votes?: RegulationVotes }) {
  const st = regulationStatus(reg);
  const vOpen = isVoteOpen(reg);
  const hasVotes = !!votes && (votes.shadowApprove > 0 || votes.shadowAnnul > 0);

  return (
    <Link href={`/regulations/${reg.id}`} className="kanban-card" style={{ borderLeftColor: st.color }}>
      <div className="flex items-center justify-between gap-xs mb-xs">
        <div className="flex items-center gap-xs min-w-0">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
          {reg.house && (
            <span className="font-mono uppercase truncate" style={{ color: '#B8960C', fontSize: '10px', letterSpacing: '0.12em', opacity: 0.6 }}>
              {reg.house}
            </span>
          )}
        </div>
        <ProcedureBadge reg={reg} />
      </div>

      <h3 className="font-medium" style={{ color: '#FAF6ED', fontSize: '14px', lineHeight: 1.35 }}>
        {clipText(reg.title, 84)}
      </h3>
      <p className="font-mono truncate mt-xxs" style={{ color: '#B8960C', fontSize: '11px', opacity: 0.55 }}>
        {clipText(reg.enabling_act, 44)}
      </p>

      <div className="mt-sm pt-sm" style={{ borderTop: '1px solid rgba(184,150,12,0.1)' }}>
        {vOpen ? (
          <div className="flex items-center justify-between gap-sm">
            <div className="flex flex-col gap-xxs min-w-0">
              <span className="font-mono" style={{ color: '#D4AF37', fontSize: '11px', letterSpacing: '0.06em' }}>
                Voting open
              </span>
              <span className="font-mono truncate" suppressHydrationWarning style={{ color: '#B8960C', fontSize: '10px', opacity: 0.55 }}>
                {formatCountdown(votes?.deadline, 'window closed')}
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
              Vote →
            </span>
          </div>
        ) : hasVotes ? (
          <VoteBar forCount={votes!.shadowApprove} againstCount={votes!.shadowAnnul} forLabel="Approve" againstLabel="Annul" />
        ) : (
          <span className="font-mono" style={{ color: st.color, fontSize: '11px', letterSpacing: '0.05em' }}>
            {st.label}
          </span>
        )}
      </div>
    </Link>
  );
}

function RegulationKanbanColumn({ group, votes }: { group: PhaseGroup; votes: Record<number, RegulationVotes> }) {
  return (
    <div className="kanban-column">
      <div className="kanban-column__header">
        <span className="font-mono uppercase truncate" style={{ color: '#FAF6ED', fontSize: '12px', letterSpacing: '0.14em' }}>
          {group.phase}
        </span>
        <span className="kanban-column__count">{group.regulations.length}</span>
      </div>
      <div className="kanban-column__body">
        {group.regulations.map(reg => (
          <RegulationKanbanCard key={reg.id} reg={reg} votes={votes[reg.id]} />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function RegulationBoardSection({ regulations }: Props) {
  const isDemo  = regulations.length === 0;
  const display = isDemo ? DEMO_REGULATIONS : regulations;
  const votes   = isDemo ? DEMO_VOTES : ({} as Record<number, RegulationVotes>);
  const groups  = groupByPhase(display);

  return (
    <section style={{ background: 'linear-gradient(180deg, #071108 0%, #050d07 55%, #030804 100%)' }}>
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

        {/* ── Board grid ───────────────────────────────────────────────── */}
        <div className="kanban-grid">
          {groups.map(group => (
            <RegulationKanbanColumn key={group.phase} group={group} votes={votes} />
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between flex-wrap gap-xs mt-xl pt-md"
          style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }}
        >
          <span className="font-mono" style={{ color: '#B8960C', opacity: 0.45, fontSize: '11px' }}>
            {isDemo
              ? 'Demo data · connect the backend for live regulations'
              : `${regulations.length} regulations tracked · refreshes automatically`}
          </span>
          <Link href="/regulations" className="font-mono no-underline shrink-0" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.1em', opacity: 0.7 }}>
            View all →
          </Link>
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
