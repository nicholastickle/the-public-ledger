export type BillCategory =
  | 'health'
  | 'economy'
  | 'housing'
  | 'environment'
  | 'education'
  | 'justice'
  | 'immigration';

export interface Bill {
  id: string;
  title: string;
  question: string;
  category: BillCategory;
  yesPercent: number;
  noPercent: number;
  totalVotes: number;
  debateDate: string;
  featured?: boolean;
  parliamentVote?: 'passed' | 'rejected' | 'pending';
}

export interface ActivityItem {
  id: string;
  user: string;
  position: 'YES' | 'NO';
  bill: string;
  timestamp: string;
}
