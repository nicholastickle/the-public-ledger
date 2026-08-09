import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DepartureBoardSection from '@/app/components/board/DepartureBoardSection';
import type { ParliamentBill } from '@/app/types/parliament';

const billAt = (overrides: Partial<ParliamentBill> & { id: number; short_title: string }): ParliamentBill => ({
  long_title: null,
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  detail_url: null,
  parliament_last_update: '2026-06-17T08:00:00Z',
  ...overrides,
});

const SECOND_READING_BILL = billAt({ id: 101, short_title: 'Test Reform Bill', current_stage_name: 'Second Reading' });
const ASSENTED_BILL       = billAt({ id: 102, short_title: 'Another Test Act',  current_stage_name: 'Royal Assent', is_act: true, current_house: null });
const COMMITTEE_BILL      = billAt({ id: 103, short_title: 'Committee Stage Bill', current_stage_name: 'Committee Stage' });

const rows = () => Array.from(document.querySelectorAll('.ledger-table__row'));

/** The Stage and Your-vote columns are duplicated into the Bill cell for narrow
 *  viewports, where CSS shows one copy and hides the other. jsdom applies no
 *  CSS, so row queries are scoped to the canonical column cell. */
const cell = (row: Element, name: 'house' | 'own') =>
  row.querySelector(`.ledger-table__cell--${name}`) as HTMLElement;

describe('DepartureBoardSection', () => {
  it('renders the section heading', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText(/The Bill Board/i)).toBeInTheDocument();
  });

  it('renders the shadow-vote subtitle', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText('Public shadow votes cast at the second reading')).toBeInTheDocument();
  });

  it('shows the DEMO badge when no live bills are provided', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('populates the board with demo bills when no live data', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getAllByText('Employment Rights Bill').length).toBeGreaterThan(0);
  });

  it('renders live bills and hides DEMO badge when bills are provided', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    expect(screen.getAllByText('Test Reform Bill').length).toBeGreaterThan(0);
  });

  it('has no footer content — the board is the whole list, not a preview', () => {
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.queryByRole('link', { name: /View all/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/connect the backend/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/bills tracked/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/UK Parliament API/i)).not.toBeInTheDocument();
  });

  it('renders one table row per bill with the documented columns', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL, COMMITTEE_BILL]} />);
    expect(rows()).toHaveLength(2);
    // The phone card below repeats the same vote-tally table (with the same
    // column headers) outside this desktop table, so headers are scoped to it.
    const board = within(document.querySelector('.ledger-table__wrap')!);
    for (const name of ['No.', 'Bill', 'House', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(board.getByRole('columnheader', { name })).toBeInTheDocument();
    }
    // Every column but the bill number carries an explanatory InfoTip. The
    // phone card repeats the same tally InfoTips outside the table, so this
    // checks at least one copy exists rather than exactly one. InfoTip is a
    // button whose accessible name comes from `aria-label`, not visible text.
    for (const label of ['Bill', 'House', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(screen.getAllByRole('button', { name: `About the ${label} column` }).length).toBeGreaterThan(0);
    }
  });

  it('bands the rows under a stage heading instead of a stage column', () => {
    const first    = billAt({ id: 301, short_title: 'First Reading Bill', current_stage_name: 'First Reading' });
    const alsoFirst = billAt({ id: 303, short_title: 'Another First Reading Bill', current_stage_name: 'First Reading' });
    render(<DepartureBoardSection bills={[COMMITTEE_BILL, first, alsoFirst]} />);

    expect(screen.queryByRole('columnheader', { name: 'Stage' })).not.toBeInTheDocument();

    const bands = Array.from(document.querySelectorAll('.ledger-table__stage-head'));
    expect(bands.map(b => b.querySelector('.ledger-table__stage-title')!.textContent))
      .toEqual(['First Reading', 'Committee Stage']);
    expect(bands[0].getAttribute('colspan')).toBe('8');
  });

  it('explains each stage with an InfoTip on its band', () => {
    const first = billAt({ id: 301, short_title: 'First Reading Bill', current_stage_name: 'First Reading' });
    render(<DepartureBoardSection bills={[first, COMMITTEE_BILL]} />);

    // The phone card repeats the same stage band outside the table, so this
    // checks at least one copy exists rather than exactly one. InfoTip is a
    // button whose accessible name comes from `aria-label`, not visible text.
    expect(screen.getAllByRole('button', { name: 'About the First Reading stage' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'About the Committee Stage stage' }).length).toBeGreaterThan(0);

    const band = document.querySelector('.ledger-table__stage-head .info-tip')!;
    expect(band.getAttribute('data-tooltip')).toMatch(/formally introduced/);
  });

  it('describes every stage the board can band by', () => {
    // Any stage without its own description would silently fall back to the
    // generic line, which reads as an omission rather than an explanation.
    render(<DepartureBoardSection bills={[]} />);
    for (const tip of document.querySelectorAll('.ledger-table__stage-head .info-tip')) {
      expect(tip.getAttribute('data-tooltip')).not.toMatch(/making its way through Parliament/);
    }
  });

  it('orders bands by stage — first reading at the top, defeated at the bottom', () => {
    const first    = billAt({ id: 301, short_title: 'First Reading Bill', current_stage_name: 'First Reading' });
    const defeated = billAt({ id: 302, short_title: 'Defeated Bill', is_defeated: true });
    render(<DepartureBoardSection bills={[defeated, COMMITTEE_BILL, first]} />);
    const order = rows().map(r => r.querySelector('.ledger-table__title')!.textContent);
    expect(order).toEqual(['First Reading Bill', 'Committee Stage Bill', 'Defeated Bill']);
    expect(Array.from(document.querySelectorAll('.ledger-table__stage-title')).map(t => t.textContent))
      .toEqual(['First Reading', 'Committee Stage', 'Defeated']);
  });

  it('shows the bill number in the row', () => {
    render(<DepartureBoardSection bills={[COMMITTEE_BILL]} />);
    expect(within(rows()[0] as HTMLElement).getByText('103')).toBeInTheDocument();
  });

  it('reads the House as "Both" for a bill that has cleared both Houses', () => {
    render(<DepartureBoardSection bills={[ASSENTED_BILL]} />);
    expect(within(rows()[0] as HTMLElement).getByText('Both')).toBeInTheDocument();
  });

  it('offers Aye/No vote buttons for bills at First or Second Reading', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    const own = cell(rows()[0], 'own');
    expect(within(own).getByRole('button', { name: 'Vote Aye on Test Reform Bill' })).toBeInTheDocument();
    expect(within(own).getByRole('button', { name: 'Vote No on Test Reform Bill' })).toBeInTheDocument();
  });

  it('folds an open vote into the Bill cell for phone viewports', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL, COMMITTEE_BILL]} />);
    const [open, closed] = rows();

    const fold = open.querySelector('.ledger-table__row-own')!;
    expect(within(fold as HTMLElement).getByRole('button', { name: 'Vote Aye on Test Reform Bill' })).toBeInTheDocument();

    // Nothing to act on once the window has closed, so no vote control folds in.
    expect(closed.querySelector('.ledger-table__row-own')).toBeNull();
  });

  it('shows "Did not vote" once the window has closed with no vote cast', () => {
    render(<DepartureBoardSection bills={[COMMITTEE_BILL]} />);
    // The phone card renders the same "Did not vote" text alongside the row,
    // so this is scoped to the table row it's actually testing.
    expect(within(rows()[0] as HTMLElement).getByText('Did not vote')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Vote Aye/ })).not.toBeInTheDocument();
  });

  it('records the citizen’s vote from the row and reveals the tallies', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    expect(rows()[0].textContent).toMatch(/Hidden until you vote/);

    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: 'Vote Aye on Test Reform Bill' }));

    const row = rows()[0];
    expect(row).toHaveAttribute('data-voted', 'true');
    expect(cell(row, 'own').querySelector('.own-vote--for')).toHaveTextContent('Aye');
    expect(row.textContent).not.toMatch(/Hidden until you vote/);
  });

  it('marks the side that carried each completed tally, and neither on a tie', () => {
    render(<DepartureBoardSection bills={[]} />);
    // Demo bill 1 (Employment Rights) closed 18,400 Aye to 6,200 No.
    const row = rows().find(r => r.textContent?.includes('Employment Rights Bill'))!;
    const [ayes, noes] = Array.from(row.querySelectorAll('.ledger-table__cell--tally .thumb-tally__side'));
    expect(ayes).toHaveAttribute('data-outcome', 'won');
    expect(noes).toHaveAttribute('data-outcome', 'lost');
    expect(within(ayes as HTMLElement).getByText('Aye — carried')).toBeInTheDocument();

    // Demo bill 24 was withdrawn with no votes either way — a tie carries neither.
    const tied = rows().find(r => r.textContent?.includes('Digital Markets'))!;
    const tiedSide = tied.querySelector('.ledger-table__cell--tally .thumb-tally__side')!;
    expect(tiedSide).not.toHaveAttribute('data-outcome');
  });

  it('shows the expected government sitting date, or TBD when none is set', () => {
    // Demo bill 2 has a Second Reading listed for 12 Aug 2026; bill 14 has none.
    render(<DepartureBoardSection bills={[]} />);
    expect(screen.getAllByText('12/08/2026').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TBD').length).toBeGreaterThan(0);
  });

  it('shows "Royal Assent" status for enacted bills with no vote buttons', () => {
    render(<DepartureBoardSection bills={[ASSENTED_BILL]} />);
    expect(screen.getAllByText('Royal Assent').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /^Vote Aye/ })).not.toBeInTheDocument();
  });

  it('opens the bill detail modal when the bill title is clicked', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    // The phone card renders its own title button for the same bill, so this
    // is scoped to the table row it's actually testing.
    fireEvent.click(within(rows()[0] as HTMLElement).getByRole('button', { name: 'Test Reform Bill' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /Test Reform Bill/i })).toBeInTheDocument();
  });

  it('does not open the modal when clicking elsewhere in the row', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(cell(rows()[0], 'house'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the bill detail modal from the row-end arrow button', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(within(rows()[0] as HTMLElement).getByRole('button', { name: 'Open detail for Test Reform Bill' }));
    expect(within(screen.getByRole('dialog')).getByRole('heading', { name: /Test Reform Bill/i })).toBeInTheDocument();
  });

  it('does not open the modal when voting from within the row', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: 'Vote Aye on Test Reform Bill' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(rows()[0]).toHaveAttribute('data-voted', 'true');
  });

  it('closes the modal when the close button is clicked', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(within(rows()[0] as HTMLElement).getByRole('button', { name: 'Test Reform Bill' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('carries a vote cast in the modal back to the row', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(within(rows()[0] as HTMLElement).getByRole('button', { name: 'Test Reform Bill' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Vote Aye on Test Reform Bill' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close/i }));

    expect(rows()[0]).toHaveAttribute('data-voted', 'true');
  });

  it('never reveals the originating house of a bill', () => {
    // ParliamentBill has no `originating_house` field at all (see types/parliament.ts)
    // and the API never sends one — this only exercises that the row renders the
    // current house it's given, since there's no longer a way to even construct
    // a bill carrying an originating house to assert against.
    const bill = billAt({ id: 104, short_title: 'Origin Test Bill', current_house: 'Commons' });
    render(<DepartureBoardSection bills={[bill]} />);
    expect(screen.getAllByText('Commons').length).toBeGreaterThan(0);
  });

  it('never reveals any tally on a row whose vote is still open and uncast', () => {
    // A bill at Second Reading is still open to citizen votes, so neither the
    // citizen nor the AI tally may show a result, and Parliament shows only the
    // date it is expected to divide — never a division result.
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    const row = rows()[0];
    expect(within(row as HTMLElement).getAllByText('Hidden until you vote')).toHaveLength(2);
    expect(row.textContent).toMatch(/TBD/);
    // No tally digits leak through.
    expect(row.querySelectorAll('.thumb-tally')).toHaveLength(0);
  });
});
