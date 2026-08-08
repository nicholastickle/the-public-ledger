import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BillDetailModal from '@/app/components/BillDetailModal';
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
  it('renders the bill title and never reveals the originating house', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Test Reform Bill' })).toBeInTheDocument();
    expect(screen.queryByText('Lords')).not.toBeInTheDocument();
  });

  it('leads with the bill number, then the title, date, source links, House and stage', () => {
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
      at(container.querySelector('.modal-meta__label')),
      at(container.querySelector('.modal-section__heading')),
      at(screen.getByRole('list', { name: /legislative progress/i })),
    ];

    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('links out to Parliament for the bill record and its published text', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const record = screen.getByRole('link', { name: /Bill details on parliament\.uk/i });
    expect(record).toHaveAttribute('href', 'https://bills.parliament.uk/bills/1');
    expect(record).toHaveAttribute('target', '_blank');
    expect(record).toHaveAttribute('rel', 'noopener noreferrer');

    const text = screen.getByRole('link', { name: /Full text & documents/i });
    expect(text).toHaveAttribute('href', 'https://bills.parliament.uk/bills/1/publications');

    // Both wear the same bordered chrome as the read-more control.
    expect(record).toHaveClass('ledger-btn');
    expect(text).toHaveClass('ledger-btn');
  });

  it('names the section "Stage" and renders every stage in the timeline', () => {
    const { container } = render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(container.querySelector('.modal-section__heading')?.textContent).toContain('Stage');
    expect(screen.queryByText(/^Progress$/)).not.toBeInTheDocument();
    const timeline = screen.getByRole('list', { name: /legislative progress/i });
    expect(within(timeline).getByText('Second Reading')).toBeInTheDocument();
    expect(within(timeline).getByText('Royal Assent')).toBeInTheDocument();
  });

  it('shows the House the bill currently sits in', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('Commons')).toBeInTheDocument();
  });

  it('renders the vote as a three-column tally table matching the board', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('columnheader', { name: /public vote tally/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /ai vote tally/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /government vote tally/i })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /your vote/i })).not.toBeInTheDocument();
  });

  it('puts the vote buttons above the tally table, acting like the board card\'s', () => {
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const aye = screen.getByRole('button', { name: 'Vote Aye on Test Reform Bill' });
    expect(aye).not.toHaveAttribute('data-tooltip');
    expect(aye).not.toHaveClass('vote-tip');
  });

  it('explains each column with the same info tooltips the board uses', () => {
    const { container } = render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const tips = Array.from(container.querySelectorAll('.info-tip')).map(el => el.getAttribute('data-tooltip'));
    expect(tips.some(t => t?.includes('Shadow votes cast by verified members of the public'))).toBe(true);
    expect(tips.some(t => t?.includes('four-model AI panel'))).toBe(true);
    expect(tips.some(t => t?.includes('How Parliament itself divided'))).toBe(true);
  });

  it('keeps the citizen tally and AI verdicts hidden until the citizen votes', () => {
    render(<BillDetailModal bill={OPEN_BILL} votes={{ shadowAyes: 100, shadowNoes: 40 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Vote Aye on Test Reform Bill/i })).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Hidden until you vote/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vote to reveal/i).length).toBeGreaterThan(0);
  });

  it('shows a government-vote-pending date while the citizen window is open', () => {
    render(
      <BillDetailModal
        bill={OPEN_BILL}
        votes={{ shadowAyes: 100, shadowNoes: 40, secondReadingDate: '2026-08-12' }}
        voted="for" onVote={() => {}} onClose={() => {}}
      />
    );
    expect(screen.getByText('12/08/2026')).toBeInTheDocument();
  });

  it('calls onVote when a vote button is clicked', () => {
    const onVote = vi.fn();
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={onVote} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Vote Aye on Test Reform Bill/i }));
    expect(onVote).toHaveBeenCalledWith('for');
  });

  it('reveals the citizen tally and AI verdicts once the citizen has voted', () => {
    render(<BillDetailModal bill={OPEN_BILL} votes={{ shadowAyes: 100, shadowNoes: 40 }} voted="for" onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.queryAllByText(/Vote to reveal/i)).toHaveLength(0);
  });

  it('shows no vote buttons for an enacted bill and reveals both tallies as already-closed record', () => {
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

  it('keeps the whole stage run visible for a defeated bill, not just the part it travelled', () => {
    render(<BillDetailModal bill={DEFEATED_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    const timeline = screen.getByRole('list', { name: /legislative progress/i });
    // Stopping at Second Reading must not hide the six stages it never reached.
    expect(within(timeline).getByText('Second Reading')).toBeInTheDocument();
    expect(within(timeline).getByText('Royal Assent')).toBeInTheDocument();
    expect(within(timeline).getAllByRole('listitem')).toHaveLength(8);
  });

  it('states the outcome and the stage it happened at, rather than adding a fake stage', () => {
    render(<BillDetailModal bill={DEFEATED_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('Defeated at Second Reading')).toBeInTheDocument();
    // "Defeated" is an outcome, not a stage, so it gets no node of its own.
    const timeline = screen.getByRole('list', { name: /legislative progress/i });
    expect(within(timeline).queryByText('Defeated')).not.toBeInTheDocument();
  });

  it('names the stage a withdrawn bill was withdrawn at', () => {
    render(<BillDetailModal bill={WITHDRAWN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('Withdrawn at First Reading')).toBeInTheDocument();
  });

  it('shows no outcome banner for a bill that is still live or has passed', () => {
    const { container, rerender } = render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(container.querySelector('.stage-outcome')).not.toBeInTheDocument();
    rerender(<BillDetailModal bill={ENACTED_BILL} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(container.querySelector('.stage-outcome')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<BillDetailModal bill={OPEN_BILL} voted={null} onVote={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
