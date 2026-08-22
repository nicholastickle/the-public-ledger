import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DepartureBoardSection from '@/app/components/board/DepartureBoardSection';
import type { ParliamentBill } from '@/app/types/parliament';

const billAt = (overrides: Partial<ParliamentBill> & { id: number; short_title: string }): ParliamentBill => ({
  long_title: null,
  originating_house: 'Lords',
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
    expect(screen.getByText('Public shadow votes — open from First Reading to Royal Assent')).toBeInTheDocument();
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
    for (const name of ['No.', 'Bill', 'Current House', 'Stage', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(board.getByRole('columnheader', { name })).toBeInTheDocument();
    }
  });

  it('shows an originating-House badge as the row\'s first cell', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    const row = rows()[0];
    expect(row.firstElementChild).toHaveClass('ledger-table__cell--origin');
    expect(row.querySelector('.ledger-table__cell--origin .house-badge')).toHaveAttribute('title', 'Lords');
  });

  it('shows the bill\'s raw current stage in its own column', () => {
    render(<DepartureBoardSection bills={[COMMITTEE_BILL]} />);
    expect(within(rows()[0] as HTMLElement).getByText('Committee Stage')).toBeInTheDocument();
  });

  it('sorts rows by bill number, not by stage', () => {
    const late  = billAt({ id: 305, short_title: 'Late Number Bill', current_stage_name: 'First Reading' });
    const early = billAt({ id: 102, short_title: 'Early Number Bill', current_stage_name: 'Report Stage' });
    render(<DepartureBoardSection bills={[late, COMMITTEE_BILL, early]} />);
    const order = rows().map(r => r.querySelector('.ledger-table__title')!.textContent);
    expect(order).toEqual(['Early Number Bill', 'Committee Stage Bill', 'Late Number Bill']);
  });

  it('shows the bill number in the row', () => {
    render(<DepartureBoardSection bills={[COMMITTEE_BILL]} />);
    expect(within(rows()[0] as HTMLElement).getByText('103')).toBeInTheDocument();
  });

  it('reads the House as "Both" for a bill in ping-pong between the Houses', () => {
    const pingPong = billAt({ id: 306, short_title: 'Ping-Pong House Bill', current_stage_name: 'Ping-Pong' });
    render(<DepartureBoardSection bills={[pingPong]} />);
    expect(within(rows()[0] as HTMLElement).getByText('Both')).toBeInTheDocument();
  });

  it('reads the House as neither once a bill has received Royal Assent', () => {
    render(<DepartureBoardSection bills={[ASSENTED_BILL]} />);
    expect(within(rows()[0] as HTMLElement).getByText('—')).toBeInTheDocument();
  });

  it('keeps the vote open for a bill at Committee Stage, not just First or Second Reading', () => {
    render(<DepartureBoardSection bills={[COMMITTEE_BILL]} />);
    const own = cell(rows()[0], 'own');
    expect(within(own).getByRole('button', { name: 'Vote Aye on Committee Stage Bill' })).toBeInTheDocument();
  });

  it('offers Aye/No vote buttons for a bill at Second Reading', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    const own = cell(rows()[0], 'own');
    expect(within(own).getByRole('button', { name: 'Vote Aye on Test Reform Bill' })).toBeInTheDocument();
    expect(within(own).getByRole('button', { name: 'Vote No on Test Reform Bill' })).toBeInTheDocument();
  });

  it('folds an open vote into the Bill cell for phone viewports', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL, ASSENTED_BILL]} />);
    const [open, closed] = rows();

    const fold = open.querySelector('.ledger-table__row-own')!;
    expect(within(fold as HTMLElement).getByRole('button', { name: 'Vote Aye on Test Reform Bill' })).toBeInTheDocument();

    // Nothing to act on once the bill has received Royal Assent, so no vote control folds in.
    expect(closed.querySelector('.ledger-table__row-own')).toBeNull();
  });

  it('shows "Did not vote" once a bill is settled with no vote cast', () => {
    render(<DepartureBoardSection bills={[ASSENTED_BILL]} />);
    expect(within(rows()[0] as HTMLElement).getByText('Did not vote')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Vote Aye/ })).not.toBeInTheDocument();
  });

  it('records the citizen’s vote from the row', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: 'Vote Aye on Test Reform Bill' }));

    const row = rows()[0];
    expect(row).toHaveAttribute('data-voted', 'true');
    expect(cell(row, 'own').querySelector('.own-vote--for')).toHaveTextContent('Aye');
  });

  it('counts the citizen\'s own vote into the Public tally the moment it is cast', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: 'Vote Aye on Test Reform Bill' }));

    const publicCell = rows()[0].querySelectorAll('.ledger-table__cell--tally')[0];
    expect(within(publicCell as HTMLElement).getByText('1')).toBeInTheDocument();
  });

  it('shows the Public, AI and Government tallies for a bill whose vote is still open and uncast', () => {
    render(<DepartureBoardSection bills={[SECOND_READING_BILL]} />);
    const row = rows()[0];
    expect(within(row as HTMLElement).queryAllByText(/Hidden until you vote/i)).toHaveLength(0);
    expect(row.querySelectorAll('.thumb-tally').length).toBeGreaterThan(0);
  });

  it('marks the side that carried each completed public tally, and neither on a tie', () => {
    render(<DepartureBoardSection bills={[]} />);
    // Demo bill 1 (Employment Rights) closed 18,400 Ayes to 6,200 Noes.
    const row = rows().find(r => r.textContent?.includes('Employment Rights Bill'))!;
    const [ayes, noes] = Array.from(row.querySelectorAll('.ledger-table__cell--tally .thumb-tally__side'));
    expect(ayes).toHaveAttribute('data-outcome', 'won');
    expect(noes).toHaveAttribute('data-outcome', 'lost');
    // Tallies read "Ayes"/"Noes" (plural) — Parliament's own convention when
    // counting votes — distinct from the singular "Aye"/"No" vote buttons.
    expect(within(ayes as HTMLElement).getByText('Ayes — carried')).toBeInTheDocument();

    // Demo bill 24 was withdrawn at First Reading with no votes either way — a tie carries neither.
    const tied = rows().find(r => r.textContent?.includes('Digital Markets'))!;
    const tiedSide = tied.querySelector('.ledger-table__cell--tally .thumb-tally__side')!;
    expect(tiedSide).not.toHaveAttribute('data-outcome');
  });

  it('shows "—" in the Government column for a bill still at First Reading', () => {
    const first = billAt({ id: 301, short_title: 'First Reading Bill', current_stage_name: 'First Reading' });
    render(<DepartureBoardSection bills={[first]} />);
    const row = rows()[0];
    expect(within(row as HTMLElement).getByText('—')).toBeInTheDocument();
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
});
