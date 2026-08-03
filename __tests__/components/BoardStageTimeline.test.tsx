import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BoardStageTimeline from '@/app/components/BoardStageTimeline';

const FOUR = [
  { label: 'First Reading', state: 'done' },
  { label: 'Second Reading', state: 'current' },
  { label: 'Committee Stage', state: 'upcoming' },
  { label: 'Report Stage', state: 'upcoming' },
] as const;

describe('BoardStageTimeline', () => {
  it('renders a labelled step for every entry, in order', () => {
    render(
      <BoardStageTimeline
        steps={[
          { label: 'First Reading', state: 'done' },
          { label: 'Second Reading', state: 'current' },
          { label: 'Committee Stage', state: 'upcoming' },
        ]}
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map(i => i.textContent)).toEqual(['First Reading', 'Second Reading', 'Committee Stage']);
  });

  it('drops a leader line from every node to its angled label', () => {
    const { container } = render(
      <BoardStageTimeline
        steps={[
          { label: 'First Reading', state: 'done' },
          { label: 'Second Reading', state: 'current' },
        ]}
      />
    );
    expect(container.querySelectorAll('.board-timeline__leader')).toHaveLength(2);
    expect(container.querySelectorAll('.board-timeline__label')).toHaveLength(2);
  });

  it('draws the leader as a vertical run into a diagonal, so the label can sit parallel to it', () => {
    const { container } = render(<BoardStageTimeline steps={[{ label: 'First Reading', state: 'done' }]} />);
    const path = container.querySelector('.board-timeline__leader path');
    // A vertical command (V) before the diagonal (L) — no single kinked line.
    expect(path?.getAttribute('d')).toMatch(/V\s*\d+\s*L/);
  });

  it('joins consecutive nodes with a connector, and stops at the last one', () => {
    const { container } = render(<BoardStageTimeline steps={[...FOUR]} />);
    expect(container.querySelectorAll('.board-timeline__connector')).toHaveLength(FOUR.length - 1);
  });

  it('tells the two-column layout how tall a column is', () => {
    const { container } = render(<BoardStageTimeline steps={[...FOUR]} />);
    const root = container.querySelector('.board-timeline') as HTMLElement;
    expect(root.style.getPropertyValue('--timeline-rows')).toBe('2');
  });

  it('marks the step that ends the left-hand column so its connector can be dropped', () => {
    const { container } = render(<BoardStageTimeline steps={[...FOUR]} />);
    const steps = Array.from(container.querySelectorAll('.board-timeline__step'));
    expect(steps.map(s => s.getAttribute('data-col-end'))).toEqual([null, 'true', null, 'true']);
  });

  it('breaks the line out of the stage a measure stopped at, and every one after', () => {
    const { container } = render(
      <BoardStageTimeline
        steps={[
          { label: 'First Reading', state: 'done' },
          { label: 'Second Reading', state: 'stopped' },
          { label: 'Committee Stage', state: 'unreached' },
          { label: 'Report Stage', state: 'unreached' },
        ]}
      />
    );
    const broken = Array.from(container.querySelectorAll('.board-timeline__connector'))
      .map(c => c.getAttribute('data-broken'));
    // Three connectors for four steps: solid into the stop, broken after it.
    expect(broken).toEqual([null, 'true', 'true']);
  });

  it('keeps the line solid while a run is still live', () => {
    const { container } = render(
      <BoardStageTimeline
        steps={[
          { label: 'First Reading', state: 'done' },
          { label: 'Second Reading', state: 'current' },
          { label: 'Committee Stage', state: 'upcoming' },
        ]}
      />
    );
    const broken = Array.from(container.querySelectorAll('.board-timeline__connector'))
      .map(c => c.getAttribute('data-broken'));
    expect(broken).toEqual([null, null]);
  });

  it('renders a stopped end-state step (e.g. Defeated)', () => {
    render(
      <BoardStageTimeline
        steps={[
          { label: 'First Reading', state: 'done' },
          { label: 'Defeated', state: 'stopped' },
        ]}
      />
    );
    expect(screen.getByText('Defeated')).toBeInTheDocument();
  });
});
