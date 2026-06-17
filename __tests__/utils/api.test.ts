import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchBills, fetchBill, fetchBillStages } from '@/app/lib/api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockOk(data: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockError(status = 500) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve(null) });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('fetchBills', () => {
  it('returns parsed bills on success', async () => {
    const bills = [{ id: 1, short_title: 'Test Bill' }];
    mockFetch.mockReturnValue(mockOk(bills));
    const result = await fetchBills({ status: 'active' });
    expect(result).toEqual(bills);
  });

  it('returns empty array on non-ok response', async () => {
    mockFetch.mockReturnValue(mockError());
    const result = await fetchBills();
    expect(result).toEqual([]);
  });

  it('returns empty array when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const result = await fetchBills();
    expect(result).toEqual([]);
  });

  it('includes status param in the URL', async () => {
    mockFetch.mockReturnValue(mockOk([]));
    await fetchBills({ status: 'completed' });
    const url: string = mockFetch.mock.calls[0][0];
    expect(url).toContain('status=completed');
  });

  it('includes house param in the URL', async () => {
    mockFetch.mockReturnValue(mockOk([]));
    await fetchBills({ house: 'Lords' });
    const url: string = mockFetch.mock.calls[0][0];
    expect(url).toContain('house=Lords');
  });
});

describe('fetchBill', () => {
  it('returns parsed bill on success', async () => {
    const bill = { id: 42, short_title: 'Single Bill' };
    mockFetch.mockReturnValue(mockOk(bill));
    const result = await fetchBill(42);
    expect(result).toEqual(bill);
  });

  it('returns null on non-ok response', async () => {
    mockFetch.mockReturnValue(mockError(404));
    const result = await fetchBill(999);
    expect(result).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const result = await fetchBill(1);
    expect(result).toBeNull();
  });
});

describe('fetchBillStages', () => {
  it('returns parsed stages on success', async () => {
    const stages = [{ id: 55, stage_name: 'Second Reading', sittings: [], divisions: [] }];
    mockFetch.mockReturnValue(mockOk(stages));
    const result = await fetchBillStages(42);
    expect(result).toEqual(stages);
  });

  it('returns empty array on failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const result = await fetchBillStages(1);
    expect(result).toEqual([]);
  });
});
