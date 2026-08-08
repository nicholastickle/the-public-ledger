import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegulationDetailModal from '@/app/components/RegulationDetailModal';
import type { ParliamentRegulation } from '@/app/types/parliament';

const PENDING_REG: ParliamentRegulation = {
  id: 1,
  title: 'The Test (Amendment) Regulations 2026',
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-07-01',
  made_date: null,
  deadline: '2026-09-01',
  status: 'pending',
  house: 'Both',
  last_update: '2026-07-01T09:00:00Z',
};

const AFFIRMATIVE_REG: ParliamentRegulation = {
  ...PENDING_REG,
  id: 3,
  title: 'The Affirmative Regulations 2026',
  procedure: 'affirmative',
};

const MADE_REG: ParliamentRegulation = {
  ...PENDING_REG,
  id: 2,
  title: 'The Made Regulations 2026',
  made_date: '2026-06-01',
  status: 'made',
};

const ANNULLED_REG: ParliamentRegulation = {
  ...PENDING_REG,
  id: 4,
  title: 'The Annulled Regulations 2026',
  status: 'annulled',
};

const WITHDRAWN_AFFIRMATIVE_REG: ParliamentRegulation = {
  ...PENDING_REG,
  id: 5,
  title: 'The Withdrawn Regulations 2026',
  procedure: 'affirmative',
  status: 'withdrawn',
};

describe('RegulationDetailModal', () => {
  it('renders the regulation title and enabling act', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'The Test (Amendment) Regulations 2026' })).toBeInTheDocument();
    expect(screen.getByText(/Test Act 2026/)).toBeInTheDocument();
  });

  it('leads with the SI number, then the title, date, source links, procedure and stage', () => {
    const { container } = render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const all = Array.from(container.querySelectorAll('*'));
    const at = (el: Element | null) => {
      expect(el).not.toBeNull();
      return all.indexOf(el as Element);
    };

    const positions = [
      at(screen.getByText('SI No. 1')),
      at(screen.getByRole('heading', { name: 'The Test (Amendment) Regulations 2026' })),
      at(screen.getByText(/Last updated 1 Jul 2026/)),
      at(screen.getByRole('link', { name: /Instrument on legislation\.gov\.uk/i })),
      at(container.querySelector('.modal-meta__label')),
      at(container.querySelector('.modal-section__heading')),
      at(screen.getByRole('list', { name: /legislative progress/i })),
    ];

    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('links out to the instrument as published and to its explanatory memorandum', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const made = screen.getByRole('link', { name: /Instrument on legislation\.gov\.uk/i });
    expect(made).toHaveAttribute('href', 'https://www.legislation.gov.uk/uksi/2026/1');
    expect(made).toHaveAttribute('target', '_blank');
    expect(made).toHaveAttribute('rel', 'noopener noreferrer');
    expect(made).toHaveClass('ledger-btn');

    const memo = screen.getByRole('link', { name: /Explanatory memorandum/i });
    expect(memo).toHaveAttribute('href', 'https://www.legislation.gov.uk/uksi/2026/1/memorandum/contents');
    expect(memo).toHaveClass('ledger-btn');
  });

  it('names the section "Stage" and renders the instrument\'s stages', () => {
    const { container } = render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(container.querySelector('.modal-section__heading')?.textContent).toContain('Stage');
    expect(screen.queryByText(/^Progress$/)).not.toBeInTheDocument();
    const timeline = screen.getByRole('list', { name: /legislative progress/i });
    expect(within(timeline).getByText('Laid')).toBeInTheDocument();
    expect(within(timeline).getByText('Annul Window Open')).toBeInTheDocument();
    expect(within(timeline).getByText('Made')).toBeInTheDocument();
  });

  it('explains what the procedure means for how Parliament settles it', () => {
    const { container } = render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const tips = Array.from(container.querySelectorAll('.info-tip')).map(el => el.getAttribute('data-tooltip'));
    expect(tips.some(t => t?.includes('becomes law automatically unless either House votes to annul'))).toBe(true);

    const affirmative = render(<RegulationDetailModal regulation={AFFIRMATIVE_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const affTips = Array.from(affirmative.container.querySelectorAll('.info-tip')).map(el => el.getAttribute('data-tooltip'));
    expect(affTips.some(t => t?.includes('cannot be made until both Houses have actively approved it'))).toBe(true);
  });

  it('renders the vote as the same four-column table the board uses', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const headers = screen.getAllByRole('columnheader').map(h => h.getAttribute('aria-label'));
    expect(headers).toEqual(['Public vote tally', 'AI vote tally', 'Government vote tally', 'Your vote']);
  });

  it('describes the columns against the instrument timeline, not the bill one', () => {
    const { container } = render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const tips = Array.from(container.querySelectorAll('.info-tip')).map(el => el.getAttribute('data-tooltip'));
    expect(tips.some(t => t?.includes('laid before Parliament'))).toBe(true);
    expect(tips.some(t => t?.includes('First Reading'))).toBe(false);
  });

  it('offers Approve/Annul thumbs and hides all tallies before voting', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} votes={{ shadowApprove: 50, shadowAnnul: 20 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Vote Approve on The Test \(Amendment\) Regulations 2026/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vote Annul on The Test \(Amendment\) Regulations 2026/ })).toBeInTheDocument();
    expect(screen.queryByText('50')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Hidden until you vote/i).length).toBeGreaterThan(0);
  });

  it('labels the vote thumbs with the instrument wording on hover', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Vote Approve on/ })).toHaveAttribute('data-tooltip', 'Vote Approve');
    expect(screen.getByRole('button', { name: /Vote Annul on/ })).toHaveAttribute('data-tooltip', 'Vote Annul');
  });

  it('shows the parliamentary deadline while Parliament has not settled it', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} votes={{ shadowApprove: 50, shadowAnnul: 20, deadline: '2026-09-01' }} voted="for" onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('01/09/2026')).toBeInTheDocument();
  });

  it('calls onVote with the chosen side', () => {
    const onVote = vi.fn();
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={onVote} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Vote Annul on/ }));
    expect(onVote).toHaveBeenCalledWith('against');
  });

  it('reveals the citizen tally and AI verdicts once voted', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} votes={{ shadowApprove: 50, shadowAnnul: 20 }} voted="against" onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.queryAllByText(/Vote to reveal/i)).toHaveLength(0);
  });

  it('shows no vote buttons for a made instrument and reveals tallies as already-closed record', () => {
    render(<RegulationDetailModal regulation={MADE_REG} votes={{ shadowApprove: 90, shadowAnnul: 10 }} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /Vote Approve on/ })).not.toBeInTheDocument();
    expect(screen.getByText(/approved — voting has closed/i)).toBeInTheDocument();
    expect(screen.getByText('Did not vote')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('summarises the instrument behind a read-more control', () => {
    const { container } = render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const headings = Array.from(container.querySelectorAll('.modal-section__heading')).map(h => h.textContent);
    expect(headings.some(h => h?.includes('About this instrument'))).toBe(true);
    const toggle = screen.getByRole('button', { name: /Read more/i });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /Read less/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('offers the AI audit controls on every model card', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getAllByRole('button', { name: /System prompt/i })).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: /Model response/i })).toHaveLength(4);
  });

  it('keeps the whole stage run visible for an annulled instrument', () => {
    render(<RegulationDetailModal regulation={ANNULLED_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    const timeline = screen.getByRole('list', { name: /legislative progress/i });
    expect(within(timeline).getAllByRole('listitem')).toHaveLength(4);
    // The stages it never reached stay on the timeline rather than being cut off.
    expect(within(timeline).getByText('Made')).toBeInTheDocument();
    expect(within(timeline).queryByText('Annulled')).not.toBeInTheDocument();
  });

  it('states the outcome under the timeline in the wording of its procedure', () => {
    render(<RegulationDetailModal regulation={ANNULLED_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('Annulled during the objection period')).toBeInTheDocument();
  });

  it('words a withdrawn affirmative instrument by its approval stage', () => {
    render(<RegulationDetailModal regulation={WITHDRAWN_AFFIRMATIVE_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByText('Withdrawn at the approval stage')).toBeInTheDocument();
  });

  it('shows no outcome banner for an instrument still before Parliament', () => {
    const { container } = render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(container.querySelector('.stage-outcome')).not.toBeInTheDocument();
  });

  it('opens on the bronze panel it was launched from', () => {
    render(<RegulationDetailModal regulation={PENDING_REG} voted={null} onVote={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-board-theme', 'bronze');
  });
});
