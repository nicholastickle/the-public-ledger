import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegulationBoardSection from '@/app/components/board/RegulationBoardSection';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: string; title: string }): ParliamentRegulation => ({
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-06-01',
  made_date: null,
  deadline: '2026-08-10',
  status: 'pending',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  detail_url: null,
  paper_number: null,
  ...overrides,
});

// Government-vote outcomes below are the deterministic mock results for
// these exact ids/procedures/statuses (see mockRegulationDivision /
// mockPrayerTabled in lib/mockVotes.ts) — not arbitrary fixture choices.
const PENDING_NEG = regAt({ id: '1', title: 'The Test (Amendment) Regulations 2026', procedure: 'negative', status: 'pending' }); // never prayed against -> silent
const PENDING_AFF = regAt({ id: '2', title: 'The Affirmative Test Regulations 2026', procedure: 'affirmative', status: 'pending' }); // -> pending
const MADE_REG = regAt({ id: '3', title: 'The Made Regulations 2026', status: 'made', made_date: '2026-05-01' }); // never prayed against -> silent
const ANNULLED = regAt({ id: '4', title: 'The Annulled Regulations 2026', status: 'annulled' }); // annulment is always a carried division -> voted

const rows = () => Array.from(document.querySelectorAll('.ledger-table__row'));

/** The Your-vote column is duplicated into the Regulation cell for phone
 *  viewports, where CSS shows one copy and hides the other. jsdom applies no
 *  CSS, so row queries are scoped to the canonical column cell. */
const cell = (row: Element, name: 'origin' | 'house' | 'own') =>
  row.querySelector(`.ledger-table__cell--${name}`) as HTMLElement;

describe('RegulationBoardSection', () => {
  it('renders the section heading', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByText(/The Regulation Board/i)).toBeInTheDocument();
  });

  it('shows the DEMO badge when no live data is provided', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('populates the board with demo regulations when no live data', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getAllByText(/National Minimum Wage/i).length).toBeGreaterThan(0);
  });

  it('renders live regulations and hides the DEMO badge when data is provided', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    expect(screen.getAllByText(/The Test \(Amendment\) Regulations 2026/i).length).toBeGreaterThan(0);
  });

  it('has no footer content — the board is the whole list, not a preview', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.queryByRole('link', { name: /View all/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/connect the backend/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/regulations tracked/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/UK Parliament SI API/i)).not.toBeInTheDocument();
  });

  it('renders one table row per regulation with the documented columns', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG, MADE_REG]} />);
    expect(rows()).toHaveLength(2);
    // The phone card below repeats the same vote-tally table (with the same
    // column headers) outside this desktop table, so headers are scoped to it.
    const board = within(document.querySelector('.ledger-table__wrap')!);
    for (const name of ['House', 'No.', 'Regulation', 'Procedure', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(board.getByRole('columnheader', { name })).toBeInTheDocument();
    }
    // Every column but the instrument number carries an explanatory InfoTip.
    // The phone card repeats the same tally InfoTips outside the table, so
    // this checks at least one copy exists rather than exactly one. InfoTip
    // is a button whose accessible name comes from `aria-label`, not visible text.
    for (const label of ['House', 'Regulation', 'Procedure', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(screen.getAllByRole('button', { name: `About the ${label} column` }).length).toBeGreaterThan(0);
    }
  });

  it('shows a House badge per instrument — two for one laid before both Houses', () => {
    const { container } = render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(cell(rows()[0], 'origin').querySelectorAll('.house-badge')).toHaveLength(2);
    expect(container).toBeTruthy();
  });

  it('bands the rows under a phase heading, ordered open-to-settled', () => {
    render(<RegulationBoardSection regulations={[ANNULLED, MADE_REG, PENDING_AFF, PENDING_NEG]} />);

    expect(screen.queryByRole('columnheader', { name: 'Phase' })).not.toBeInTheDocument();
    expect(Array.from(document.querySelectorAll('.ledger-table__stage-title')).map(t => t.textContent))
      .toEqual(['Pending Approval', 'Annul Window Open', 'Made', 'Annulled']);
    expect(document.querySelector('.ledger-table__stage-head')!.getAttribute('colspan')).toBe('9');
  });

  it('explains every phase the board can band by', () => {
    render(<RegulationBoardSection regulations={[]} />);
    const tips = Array.from(document.querySelectorAll('.ledger-table__stage-head .info-tip'));
    expect(tips.length).toBeGreaterThan(0);
    for (const tip of tips) {
      // Any phase without its own description would silently fall back to the
      // generic line, which reads as an omission rather than an explanation.
      expect(tip.getAttribute('data-tooltip')).not.toMatch(/is before Parliament\.$/);
    }
    // The phone card repeats the same phase band outside the table, so this
    // checks at least one copy exists rather than exactly one. InfoTip is a
    // button whose accessible name comes from `aria-label`, not visible text.
    expect(screen.getAllByRole('button', { name: 'About the Annul Window Open stage' }).length).toBeGreaterThan(0);
  });

  it('shows the instrument number and its enabling Act in the row', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    const row = rows()[0];
    expect(within(row as HTMLElement).getByText('1')).toBeInTheDocument();
    expect(within(row as HTMLElement).getByText('Test Act 2026')).toBeInTheDocument();
  });

  it('shows the procedure for negative and affirmative instruments', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG, PENDING_AFF]} />);
    const byTitle = (t: string) => rows().find(r => r.textContent?.includes(t))!;
    expect(cell(byTitle('The Test (Amendment)'), 'house')).toHaveTextContent('Negative');
    expect(cell(byTitle('The Affirmative Test'), 'house')).toHaveTextContent('Affirmative');
  });

  it('offers Approve/Annul vote buttons while the window is open', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    const own = cell(rows()[0], 'own');
    expect(within(own).getByRole('button', { name: 'Vote Approve on The Test (Amendment) Regulations 2026' })).toBeInTheDocument();
    expect(within(own).getByRole('button', { name: 'Vote Annul on The Test (Amendment) Regulations 2026' })).toBeInTheDocument();
  });

  it('shows "Did not vote" once the window has closed with no vote cast', () => {
    render(<RegulationBoardSection regulations={[MADE_REG]} />);
    // The phone card renders the same "Did not vote" text alongside the row,
    // so this is scoped to the table row it's actually testing.
    expect(within(rows()[0] as HTMLElement).getByText('Did not vote')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Vote Approve/ })).not.toBeInTheDocument();
  });

  it("records the citizen's vote from the row without changing what's already shown", () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(screen.queryByText(/Hidden until you vote/i)).not.toBeInTheDocument();

    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: /^Vote Annul/ }));

    const row = rows()[0];
    expect(row).toHaveAttribute('data-voted', 'true');
    expect(cell(row, 'own').querySelector('.own-vote--against')).toHaveTextContent('Annul');
  });

  it("counts the citizen's own vote into the Public tally the moment it is cast", () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: 'Vote Approve on The Test (Amendment) Regulations 2026' }));

    const publicCell = rows()[0].querySelectorAll('.ledger-table__cell--tally')[0];
    expect(within(publicCell as HTMLElement).getByText('1')).toBeInTheDocument();
  });

  it('does not open the modal when clicking elsewhere in the row', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    fireEvent.click(cell(rows()[0], 'house'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the regulation detail modal from the row-end arrow button', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    fireEvent.click(within(rows()[0] as HTMLElement).getByRole('button', { name: 'Open detail for The Test (Amendment) Regulations 2026' }));
    expect(within(screen.getByRole('dialog')).getByRole('heading', { name: /The Test \(Amendment\) Regulations 2026/i })).toBeInTheDocument();
  });

  it('does not open the modal when voting from within the row', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: /^Vote Approve/ }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(rows()[0]).toHaveAttribute('data-voted', 'true');
  });

  it('carries a vote cast in the modal back to the row', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    // The phone card renders its own title button for the same instrument, so
    // this is scoped to the table row it's actually testing.
    fireEvent.click(within(rows()[0] as HTMLElement).getByRole('button', { name: 'The Test (Amendment) Regulations 2026' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^Vote Annul on/ }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close/i }));

    expect(rows()[0]).toHaveAttribute('data-voted', 'true');
  });

  it('renders the board on the bronze surface, apart from the Bill Board', () => {
    const { container } = render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(container.querySelector('section.board-surface')).toHaveAttribute('data-board-theme', 'bronze');
  });

  it('shows a London clock and date alongside the heading', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByText(/·\sLondon$/)).toBeInTheDocument();
    expect(screen.getByText(/^\d{2}:\d{2}:\d{2}$/)).toBeInTheDocument();
  });

  it('always shows the public and AI tallies, whether or not the citizen has voted', () => {
    // Matches the Bill Board: results are public record, so nothing is
    // anchor-gated behind casting a vote first.
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    const row = rows()[0];
    expect(within(row as HTMLElement).queryByText('Hidden until you vote')).not.toBeInTheDocument();
    expect(row.querySelectorAll('.thumb-tally').length).toBeGreaterThan(0);
  });

  it("shows a negative instrument's government column as silent by default — no prayer means no vote", () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    const gov = rows()[0].querySelectorAll('.ledger-table__cell--tally')[2];
    expect(gov.querySelector('.tally-cell__silent')).toBeInTheDocument();
    expect(gov.textContent).toMatch(/10\/08\/2026/);
  });

  it("shows an affirmative instrument's government column as pending with the parliamentary deadline", () => {
    render(<RegulationBoardSection regulations={[PENDING_AFF]} />);
    const gov = rows()[0].querySelectorAll('.ledger-table__cell--tally')[2];
    expect(gov.querySelector('.tally-cell__pending')).toBeInTheDocument();
    expect(gov.textContent).toMatch(/10\/08\/2026/);
  });

  it('shows a division result for an annulled instrument — annulment always requires a carried vote', () => {
    render(<RegulationBoardSection regulations={[ANNULLED]} />);
    const gov = rows()[0].querySelectorAll('.ledger-table__cell--tally')[2];
    expect(gov.querySelector('.thumb-tally')).toBeInTheDocument();
    expect(gov.querySelector('.tally-cell__silent')).not.toBeInTheDocument();
  });
});
