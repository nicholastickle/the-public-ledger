export type MarketCategory = 'politics' | 'sports' | 'crypto' | 'science' | 'culture' | 'world';

export interface Market {
  id: string;
  question: string;
  category: MarketCategory;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endsAt: string;
  featured?: boolean;
}

export interface ActivityItem {
  id: string;
  user: string;
  position: 'YES' | 'NO';
  market: string;
  amount: number;
  timestamp: string;
}
