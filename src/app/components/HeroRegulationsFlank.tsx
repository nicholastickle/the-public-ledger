import HeroFlankPanel, { type FlankItem } from './HeroFlankPanel';
import type { ParliamentRegulation } from '../types/parliament';

// publicAyes = public approve votes, publicNoes = public annul votes
const DEMO_REGULATIONS: FlankItem[] = [
  { id: 'r1',  title: 'Water Quality Regulations 2026',       statusColor: '#D4AF37', statusLabel: 'Pending',     publicAyes:  8400, publicNoes:  2100 },
  { id: 'r2',  title: 'Building Safety Amendment Order',      statusColor: '#D4AF37', statusLabel: 'Affirmative', publicAyes:  5200, publicNoes:  1800 },
  { id: 'r3',  title: 'Environmental Permitting Regs',        statusColor: '#10B981', statusLabel: 'Approved',    publicAyes: 12700, publicNoes:  3400 },
  { id: 'r4',  title: 'NHS Charging (Overseas) Amendment',    statusColor: '#D4AF37', statusLabel: 'Negative',    publicAyes:  3100, publicNoes:  9600 },
  { id: 'r5',  title: 'Financial Services Disclosure Rules',  statusColor: '#10B981', statusLabel: 'Made',        publicAyes:  7800, publicNoes:  2200 },
  { id: 'r6',  title: 'Road Traffic Speed Limits Order',      statusColor: '#10B981', statusLabel: 'Made',        publicAyes:  6300, publicNoes:  4100 },
  { id: 'r7',  title: 'Data Protection Exemptions Regs',      statusColor: '#D4AF37', statusLabel: 'Pending',     publicAyes:  9100, publicNoes:  1700 },
  { id: 'r8',  title: 'Housing Tenure Licensing Order',       statusColor: '#D4AF37', statusLabel: 'Pending',     publicAyes:  4500, publicNoes:  3200 },
  { id: 'r9',  title: 'Electricity Grid Standards 2026',      statusColor: '#10B981', statusLabel: 'Approved',    publicAyes: 11200, publicNoes:  2800 },
  { id: 'r10', title: 'Immigration Rules Amendment No. 4',    statusColor: '#10B981', statusLabel: 'Made',        publicAyes:  3800, publicNoes:  8700 },
  { id: 'r11', title: 'Pension Scheme Amendment Regs',        statusColor: '#D4AF37', statusLabel: 'Pending',     publicAyes:  6100, publicNoes:  1400 },
  { id: 'r12', title: 'Food Labelling Amendment Order',       statusColor: '#D4AF37', statusLabel: 'Negative',    publicAyes:  7200, publicNoes:  3600 },
  { id: 'r13', title: 'Employment (Modern Slavery) Regs',     statusColor: '#D4AF37', statusLabel: 'Pending',     publicAyes:  5400, publicNoes:   900 },
  { id: 'r14', title: 'Broadcasting Content Standards Regs',  statusColor: '#D4AF37', statusLabel: 'Pending',     publicAyes:  4800, publicNoes:  2300 },
];

function regColor(reg: ParliamentRegulation): string {
  switch (reg.status) {
    case 'approved':
    case 'made':
      return '#10B981';
    case 'annulled':
    case 'withdrawn':
      return '#6B7280';
    default:
      return '#D4AF37';
  }
}

function regLabel(reg: ParliamentRegulation): string {
  switch (reg.status) {
    case 'approved':  return 'Approved';
    case 'made':      return 'Made';
    case 'annulled':  return 'Annulled';
    case 'withdrawn': return 'Withdrawn';
    default: {
      if (reg.procedure === 'affirmative')       return 'Affirmative';
      if (reg.procedure === 'negative')          return 'Negative';
      if (reg.procedure === 'super-affirmative') return 'Super-Aff.';
      return 'Pending';
    }
  }
}

function toFlankItem(reg: ParliamentRegulation): FlankItem {
  return {
    id: reg.id,
    title: reg.title,
    statusColor: regColor(reg),
    statusLabel: regLabel(reg),
  };
}

interface Props {
  regulations: ParliamentRegulation[];
}

export default function HeroRegulationsFlank({ regulations }: Props) {
  const items = regulations.length > 0 ? regulations.map(toFlankItem) : DEMO_REGULATIONS;
  return (
    <HeroFlankPanel
      label="Regulations"
      subtitle="Before Parliament"
      items={items}
      side="right"
    />
  );
}
