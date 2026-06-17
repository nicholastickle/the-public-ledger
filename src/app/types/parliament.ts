export interface ParliamentBill {
  id: number;
  short_title: string | null;
  long_title: string | null;
  originating_house: string | null;
  current_house: string | null;
  current_stage_name: string | null;
  is_act: boolean;
  is_defeated: boolean;
  bill_withdrawn: string | null;
  parliament_last_update: string | null;
}

export interface ParliamentBillDetail extends ParliamentBill {
  introduced_session_id: number | null;
  summary: string | null;
}

export interface ParliamentDivision {
  division_id: number;
  house: string;
  division_date: string;
  title: string | null;
  aye_count: number | null;
  no_count: number | null;
  content_count: number | null;
  not_content_count: number | null;
  did_pass: boolean | null;
  division_number: number | null;
}

export interface ParliamentBillStage {
  id: number;
  stage_name: string | null;
  house: string | null;
  sort_order: number | null;
  last_update: string | null;
  sittings: string[];
  divisions: ParliamentDivision[];
}

export type BillStatus = 'active' | 'completed' | 'defeated' | 'withdrawn';
