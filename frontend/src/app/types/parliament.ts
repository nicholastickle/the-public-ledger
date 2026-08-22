export interface ParliamentBill {
  id: number;
  short_title: string | null;
  long_title: string | null;
  /** The house the bill was introduced in — Commons or Lords. */
  originating_house: string | null;
  current_house: string | null;
  current_stage_name: string | null;
  is_act: boolean;
  is_defeated: boolean;
  bill_withdrawn: string | null;
  parliament_last_update: string | null;
  detail_url: string | null;
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

/** A stage the bill has passed through (or is currently at). `divisions` is
 *  empty when the stage was agreed without one — "on the nod". */
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

export interface ParliamentRegulation {
  /** The Parliament Statutory Instruments API's own alphanumeric paper ID —
   *  not a number, unlike ParliamentBill.id. */
  id: string;
  title: string;
  enabling_act: string | null;
  procedure: 'affirmative' | 'negative' | 'super-affirmative' | 'none';
  laid_date: string | null;
  made_date: string | null;
  deadline: string | null;
  status: 'pending' | 'approved' | 'made' | 'annulled' | 'withdrawn';
  house: 'Commons' | 'Lords' | 'Both' | null;
  last_update: string | null;
  detail_url: string | null;
  /** The instrument's human-readable SI number (e.g. 896 in "SI 2026/896") —
   *  null for demo data, which never had a real one. */
  paper_number: number | null;
}
