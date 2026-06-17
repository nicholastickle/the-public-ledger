import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StageTimeline from '@/app/components/StageTimeline';
import type { ParliamentBillStage } from '@/app/types/parliament';

const stageWithDivision: ParliamentBillStage = {
  id: 55,
  stage_name: 'Second Reading',
  house: 'Commons',
  sort_order: 2,
  last_update: '2024-11-12T10:00:00',
  sittings: ['2024-11-12'],
  divisions: [
    {
      division_id: 777,
      house: 'Commons',
      division_date: '2024-11-12',
      title: "Renters' Rights Bill: Second Reading",
      aye_count: 301,
      no_count: 200,
      content_count: null,
      not_content_count: null,
      did_pass: true,
      division_number: 45,
    },
  ],
};

describe('StageTimeline', () => {
  it('shows empty message when no stages', () => {
    render(<StageTimeline stages={[]} />);
    expect(screen.getByText(/no stage information/i)).toBeInTheDocument();
  });

  it('renders a stage name', () => {
    render(<StageTimeline stages={[stageWithDivision]} />);
    expect(screen.getByText('Second Reading')).toBeInTheDocument();
  });

  it('renders the house label', () => {
    render(<StageTimeline stages={[stageWithDivision]} />);
    expect(screen.getByText('Commons')).toBeInTheDocument();
  });

  it('renders division result with Passed label', () => {
    render(<StageTimeline stages={[stageWithDivision]} />);
    expect(screen.getByText(/passed/i)).toBeInTheDocument();
  });

  it('renders Aye and No counts', () => {
    render(<StageTimeline stages={[stageWithDivision]} />);
    expect(screen.getByText(/aye.*301/i)).toBeInTheDocument();
    expect(screen.getByText(/no.*200/i)).toBeInTheDocument();
  });

  it('shows Rejected label when did_pass is false', () => {
    const defeated = {
      ...stageWithDivision,
      divisions: [{ ...stageWithDivision.divisions[0], did_pass: false }],
    };
    render(<StageTimeline stages={[defeated]} />);
    expect(screen.getByText(/rejected/i)).toBeInTheDocument();
  });
});
