import HeroFlankPanel, { type FlankItem } from './HeroFlankPanel';
import type { ParliamentBill } from '../types/parliament';

const DEMO_BILLS: FlankItem[] = [
  { id: 1,  title: 'Employment Rights Bill',             statusColor: '#D4AF37', statusLabel: 'Committee',    publicAyes: 18400, publicNoes:  6200, govAyes: 324, govNoes: 218 },
  { id: 2,  title: 'Planning & Infrastructure Bill',     statusColor: '#D4AF37', statusLabel: '2nd Reading',  voteOpen: true },
  { id: 3,  title: 'Crime and Policing Bill',            statusColor: '#D4AF37', statusLabel: 'Committee',    publicAyes:  9100, publicNoes: 12300, govAyes: 298, govNoes: 241 },
  { id: 4,  title: 'Data (Use and Access) Bill',         statusColor: '#D4AF37', statusLabel: 'Report Stage', publicAyes: 14200, publicNoes:  3800, govAyes: 312, govNoes: 187 },
  { id: 5,  title: "Renters' Rights Bill",               statusColor: '#D4AF37', statusLabel: '3rd Reading',  publicAyes: 31500, publicNoes:  4100, govAyes: 341, govNoes: 206 },
  { id: 6,  title: 'Border Security Bill',               statusColor: '#D4AF37', statusLabel: '2nd Reading',  voteOpen: true },
  { id: 7,  title: "Children's Wellbeing Bill",          statusColor: '#D4AF37', statusLabel: 'Report Stage', publicAyes: 22800, publicNoes:  7200, govAyes: 358, govNoes: 199 },
  { id: 8,  title: 'Great British Energy Bill',          statusColor: '#10B981', statusLabel: 'Royal Assent', publicAyes: 28400, publicNoes:  9100, govAyes: 367, govNoes: 212 },
  { id: 9,  title: 'Football Governance Bill',           statusColor: '#10B981', statusLabel: 'Royal Assent', publicAyes: 45200, publicNoes:  2300, govAyes: 389, govNoes:  98 },
  { id: 10, title: 'Tobacco and Vapes Bill',             statusColor: '#D4AF37', statusLabel: 'Committee',    voteOpen: true },
  { id: 11, title: 'Terminal Illness Bill',              statusColor: '#D4AF37', statusLabel: '2nd Reading',  voteOpen: true },
  { id: 12, title: 'Armed Forces Commissioner Bill',     statusColor: '#10B981', statusLabel: 'Royal Assent', publicAyes: 11200, publicNoes:  4800, govAyes: 302, govNoes: 174 },
  { id: 13, title: 'Bank Resolution Bill',               statusColor: '#D4AF37', statusLabel: '1st Reading' },
  { id: 14, title: 'Passenger Railway Bill',             statusColor: '#10B981', statusLabel: 'Royal Assent', publicAyes: 19600, publicNoes:  8400, govAyes: 314, govNoes: 228 },
];

function billColor(bill: ParliamentBill): string {
  if (bill.is_act) return '#10B981';
  if (bill.is_defeated) return '#EF4444';
  if (bill.bill_withdrawn) return '#6B7280';
  return '#D4AF37';
}

function billLabel(bill: ParliamentBill): string {
  if (bill.is_act) return 'Royal Assent';
  if (bill.is_defeated) return 'Defeated';
  if (bill.bill_withdrawn) return 'Withdrawn';
  return bill.current_stage_name ?? 'Active';
}

function toFlankItem(bill: ParliamentBill): FlankItem {
  const stage = (bill.current_stage_name ?? '').toLowerCase();
  const voteOpen =
    !bill.is_act &&
    !bill.is_defeated &&
    !bill.bill_withdrawn &&
    (stage.includes('first reading') || stage.includes('second reading'));

  return {
    id: bill.id,
    title: bill.short_title ?? bill.long_title ?? 'Untitled Bill',
    statusColor: billColor(bill),
    statusLabel: billLabel(bill),
    voteOpen: voteOpen || undefined,
  };
}

interface Props {
  bills: ParliamentBill[];
}

export default function HeroBillsFlank({ bills }: Props) {
  const items = bills.length > 0 ? bills.map(toFlankItem) : DEMO_BILLS;
  return (
    <HeroFlankPanel
      label="Bills"
      subtitle="In Session"
      items={items}
      side="left"
    />
  );
}
