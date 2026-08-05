import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegulationBoardSection from '@/app/components/RegulationBoardSection';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: number; title: string }): ParliamentRegulation => ({
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-06-01',
  made_date: null,
  deadline: '2026-08-10',
  status: 'pending',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  ...overrides,
});

const PENDING_NEG = regAt({ id: 1, title: 'The Test (Amendment) Regulations 2026', procedure: 'negative', status: 'pending' });
const PENDING_AFF = regAt({ id: 2, title: 'The Affirmative Test Regulations 2026', procedure: 'affirmative', status: 'pending' });
const MADE_REG = regAt({ id: 3, title: 'The Made Regulations 2026', status: 'made', made_date: '2026-05-01' });
const ANNULLED = regAt({ id: 4, title: 'The Annulled Regulations 2026', status: 'annulled' });

const rows = () => Array.from(document.querySelectorAll('.ledger-table__row'));

/** The Your-vote column is duplicated into the Regulation cell for phone
 *  viewports, where CSS shows one copy and hides the other. jsdom applies no
 *  CSS, so row queries are scoped to the canonical column cell. */
const cell = (row: Element, name: 'house' | 'own') =>
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

  it('keeps the board footer to the "View all →" link alone', () => {
    render(<RegulationBoardSection regulations={[]} />);
    expect(screen.getByRole('link', { name: /View all/i })).toHaveAttribute('href', '/regulations');
    expect(screen.queryByText(/connect the backend/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/regulations tracked/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/UK Parliament SI API/i)).not.toBeInTheDocument();
  });

  it('renders one table row per regulation with the documented columns', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG, MADE_REG]} />);
    expect(rows()).toHaveLength(2);
    for (const name of ['No.', 'Regulation', 'Procedure', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(screen.getByRole('columnheader', { name })).toBeInTheDocument();
    }
    // Every column but the instrument number carries an explanatory InfoTip.
    // The phone card repeats the same tally InfoTips outside the table, so
    // this checks at least one copy exists rather than exactly one.
    for (const label of ['Regulation', 'Procedure', 'Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']) {
      expect(screen.getAllByText(`About the ${label} column`).length).toBeGreaterThan(0);
    }
  });

  it('bands the rows under a phase heading, ordered open-to-settled', () => {
    render(<RegulationBoardSection regulations={[ANNULLED, MADE_REG, PENDING_AFF, PENDING_NEG]} />);

    expect(screen.queryByRole('columnheader', { name: 'Phase' })).not.toBeInTheDocument();
    expect(Array.from(document.querySelectorAll('.ledger-table__stage-title')).map(t => t.textContent))
      .toEqual(['Pending Approval', 'Annul Window Open', 'Made', 'Annulled']);
    expect(document.querySelector('.ledger-table__stage-head')!.getAttribute('colspan')).toBe('7');
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
    // checks at least one copy exists rather than exactly one.
    expect(screen.getAllByText('About the Annul Window Open stage').length).toBeGreaterThan(0);
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

  it('records the citizen’s vote from the row and reveals the tallies', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    expect(rows()[0].textContent).toMatch(/Hidden until you vote/);

    fireEvent.click(within(cell(rows()[0], 'own')).getByRole('button', { name: /^Vote Annul/ }));

    const row = rows()[0];
    expect(row).toHaveAttribute('data-voted', 'true');
    expect(cell(row, 'own').querySelector('.own-vote--against')).toHaveTextContent('Annul');
    expect(row.textContent).not.toMatch(/Hidden until you vote/);
  });

  it('opens the regulation detail modal from anywhere in the row', () => {
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    fireEvent.click(cell(rows()[0], 'house'));
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

  it('never reveals any tally on a row whose vote is still open and uncast', () => {
    // A pending instrument is still open to public votes, so neither the public
    // nor the AI tally may show a result, and Parliament shows only the deadline
    // it must be settled by — never a division result.
    render(<RegulationBoardSection regulations={[PENDING_NEG]} />);
    const row = rows()[0];
    expect(within(row as HTMLElement).getAllByText('Hidden until you vote')).toHaveLength(2);
    expect(row.textContent).toMatch(/10\/08\/2026/);
    expect(row.querySelectorAll('.thumb-tally')).toHaveLength(0);
  });
});
