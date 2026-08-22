import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BillDetailModal from '@/app/components/cards/BillDetailModal';
import type { ParliamentBill } from '@/app/types/parliament';

const OPEN_BILL: ParliamentBill = {
  id: 1,
  short_title: 'Test Reform Bill',
  long_title: null,
  originating_house: 'Lords',
  current_house: 'Commons',
  current_stage_name: 'Second Reading',
  is_act: false,
  is_defeated: false,
  bill_withdrawn: null,
  detail_url: null,
  parliament_last_update: '2026-07-01T09:00:00Z',
};

const DEFEATED_BILL: ParliamentBill = {
  ...OPEN_BILL,
  id: 3,
  short_title: 'Test Defeated Bill',
  current_stage_name: 'Second Reading',
  is_defeated: true,
};

const WITHDRAWN_BILL: ParliamentBill = {
  ...OPEN_BILL,
  id: 4,
  short_title: 'Test Withdrawn Bill',
  current_stage_name: 'First Reading',
  bill_withdrawn: '2026-07-12',
};

const ENACTED_BILL: ParliamentBill = {
  ...OPEN_BILL,
  id: 2,
  short_title: 'Test Enacted Act',
  current_stage_name: 'Royal Assent',
  is_act: true,
  current_house: null,
};

describe('BillDetailModal', () => {
  it('renders the bill title', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Test Reform Bill' })).toBeInTheDocument();
  });

  it('leads with the bill number, then the title, date, source links, and the tabs', () => {
    const { container } = render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const all = Array.from(container.querySelectorAll('*'));
    const at = (el: Element | null) => {
      expect(el).not.toBeNull();
      return all.indexOf(el as Element);
    };

    const positions = [
      at(screen.getByText('Bill No. 1')),
      at(screen.getByRole('heading', { name: 'Test Reform Bill' })),
      at(screen.getByText(/Last updated 1 Jul 2026/)),
      at(screen.getByRole('link', { name: /Bill details on parliament\.uk/i })),
      at(screen.getByRole('tablist', { name: /bill sections/i })),
    ];

    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('links out to Parliament for the bill record and its published text', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const record = screen.getByRole('link', { name: /Bill details on parliament\.uk/i });
    expect(record).toHaveAttribute('href', 'https://bills.parliament.uk/bills/1');
    expect(record).toHaveAttribute('target', '_blank');
    expect(record).toHaveAttribute('rel', 'noopener noreferrer');

    // The Publications tab repeats this same link further down, inert until
    // selected — the first copy in document order is the one above the tabs.
    const text = screen.getAllByRole('link', { name: /Full text & documents/i })[0];
    expect(text).toHaveAttribute('href', 'https://bills.parliament.uk/bills/1/publications');

    // Both wear the same bordered chrome as the read-more control.
    expect(record).toHaveClass('ledger-btn');
    expect(text).toHaveClass('ledger-btn');
  });

  it('opens on the Details tab, showing the House and the vote table', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    const details = screen.getByRole('tabpanel', { name: 'Details' });
    // The passage diagram's House-badge captions also read "Commons"/"Lords",
    // so this only checks the current House is shown somewhere in the tab.
    expect(within(details).getAllByText('Commons').length).toBeGreaterThan(0);
    expect(within(details).getByRole('columnheader', { name: /public vote tally/i })).toBeInTheDocument();
  });

  it('switches to the Stages tab and lists every stage the bill has reached', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Stages' }));
    expect(screen.getByRole('tab', { name: 'Stages' })).toHaveAttribute('aria-selected', 'true');

    const stages = screen.getByRole('tabpanel', { name: 'Stages' });
    // The bill's raw current stage name appears among the reached stages.
    expect(within(stages).getAllByText('Second Reading').length).toBeGreaterThan(0);
    // Every entry states how it was settled — a division tally or "on the nod".
    expect(within(stages).getAllByText(/Division —|Agreed without a division/).length).toBeGreaterThan(0);
    // And what the AI panel made of the bill at that point.
    expect(within(stages).getAllByText(/AI panel at this stage/).length).toBeGreaterThan(0);
  });

  it('switches to the Publications tab and links out to the documents', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Publications' }));
    const pubs = screen.getByRole('tabpanel', { name: 'Publications' });
    expect(within(pubs).getByRole('link', { name: /Full text & documents/i })).toHaveAttribute(
      'href',
      'https://bills.parliament.uk/bills/1/publications'
    );
  });

  it('shows both the House the bill currently sits in and the House it was introduced in', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const currentlyIn = screen.getByText('Currently in').parentElement as HTMLElement;
    expect(within(currentlyIn).getByText('Commons')).toBeInTheDocument();
    const introducedIn = screen.getByText('Introduced in').parentElement as HTMLElement;
    expect(within(introducedIn).getByText('Lords')).toBeInTheDocument();
  });

  it('builds on the previous single-line timeline with a per-House bill passage diagram', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const details = screen.getByRole('tabpanel', { name: 'Details' });
    expect(within(details).getByText('Bill passage')).toBeInTheDocument();
    expect(within(details).getByText('Bill started in the House of Lords')).toBeInTheDocument();
    expect(within(details).getByText('Bill in the House of Commons')).toBeInTheDocument();
    expect(within(details).getByText('Final stages')).toBeInTheDocument();
  });

  it('renders the vote as a four-column table matching the board', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('columnheader', { name: /public vote tally/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /ai vote tally/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /government vote tally/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /your vote/i })).toBeInTheDocument();
  });

  it('explains each column with the same info tooltips the board uses', () => {
    const { container } = render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const tips = Array.from(container.querySelectorAll('.info-tip')).map(el => el.getAttribute('data-tooltip'));
    expect(tips.some(t => t?.includes('Shadow votes cast by verified members of the public'))).toBe(true);
    expect(tips.some(t => t?.includes('four-model AI panel'))).toBe(true);
    expect(tips.some(t => t?.includes('on the nod'))).toBe(true);
  });

  it('shows the citizen tally and AI verdicts even before the citizen votes', () => {
    render(<BillDetailModal bill={OPEN_BILL} votes={{ shadowAyes: 100, shadowNoes: 40 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Vote Aye on Test Reform Bill/i })).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.queryAllByText(/Hidden until you vote/i)).toHaveLength(0);
  });

  it('calls onVote when a vote button is clicked', () => {
    const onVote = vi.fn();
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={onVote} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Vote Aye on Test Reform Bill/i }));
    expect(onVote).toHaveBeenCalledWith('for');
  });

  it('shows no vote buttons for an enacted bill and reveals both tallies as an already-closed record', () => {
    render(<BillDetailModal bill={ENACTED_BILL} votes={{ shadowAyes: 500, shadowNoes: 90 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /Vote Aye/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Royal Assent — voting has closed/i)).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText(/Did not vote/i)).toBeInTheDocument();
  });

  it('summarises the bill behind a read-more control', () => {
    const { container } = render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const headings = Array.from(container.querySelectorAll('.modal-section__heading')).map(h => h.textContent);
    expect(headings.some(h => h?.includes('About this bill'))).toBe(true);
    const toggle = screen.getByRole('button', { name: /Read more/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /Read less/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps the vote open for a bill at First Reading, and shows no prior stage to report', () => {
    render(<BillDetailModal bill={{ ...OPEN_BILL, id: 5, current_stage_name: 'First Reading' }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Vote Aye/i })).toBeInTheDocument();
  });

  it('closes voting for a defeated bill, with its own detail showing where it stopped', () => {
    render(<BillDetailModal bill={DEFEATED_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /Vote Aye/i })).not.toBeInTheDocument();
    expect(screen.getByText(/defeated — voting has closed/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Stages' }));
    expect(within(screen.getByRole('tabpanel', { name: 'Stages' })).getAllByText('Second Reading').length).toBeGreaterThan(0);
  });

  it('closes voting for a withdrawn bill', () => {
    render(<BillDetailModal bill={WITHDRAWN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/withdrawn before a public vote could be cast/i)).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
