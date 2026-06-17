import type {
  ParliamentBill,
  ParliamentBillDetail,
  ParliamentBillStage,
  BillStatus,
} from '../types/parliament';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function fetchBills(params: {
  status?: BillStatus;
  house?: string;
  search?: string;
  skip?: number;
  take?: number;
} = {}): Promise<ParliamentBill[]> {
  const url = new URL(`${BACKEND_URL}/api/v1/bills`);
  if (params.status) url.searchParams.set('status', params.status);
  if (params.house) url.searchParams.set('house', params.house);
  if (params.search) url.searchParams.set('search', params.search);
  if (params.skip != null) url.searchParams.set('skip', String(params.skip));
  if (params.take != null) url.searchParams.set('take', String(params.take));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchBill(id: number): Promise<ParliamentBillDetail | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/bills/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchBillStages(id: number): Promise<ParliamentBillStage[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/bills/${id}/stages`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
