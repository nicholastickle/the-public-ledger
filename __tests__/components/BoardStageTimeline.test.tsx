import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BoardStageTimeline from '@/app/components/BoardStageTimeline';

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

  it('draws a leader line from every node to its angled label', () => {
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
