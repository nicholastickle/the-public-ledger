import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadMoreText from '@/app/components/ReadMoreText';

const PARAS = ['First paragraph.', 'Second paragraph.', 'Third paragraph.'];

describe('ReadMoreText', () => {
  it('shows the first paragraph and offers to reveal the rest', () => {
    const { container } = render(<ReadMoreText paragraphs={PARAS} label="Test Bill" />);
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(container.querySelector('.read-more__rest')).toHaveAttribute('data-expanded', 'false');
    expect(screen.getByRole('button', { name: /Read more/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('fades the clipped remainder while collapsed and drops the fade once expanded', () => {
    const { container } = render(<ReadMoreText paragraphs={PARAS} label="Test Bill" />);
    expect(container.querySelector('.read-more__fade')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Read more/i }));
    expect(container.querySelector('.read-more__fade')).not.toBeInTheDocument();
  });

  it('expands to the full text and collapses again', () => {
    const { container } = render(<ReadMoreText paragraphs={PARAS} label="Test Bill" />);
    fireEvent.click(screen.getByRole('button', { name: /Read more/i }));
    expect(container.querySelector('.read-more__rest')).toHaveAttribute('data-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Read less/i }));
    expect(container.querySelector('.read-more__rest')).toHaveAttribute('data-expanded', 'false');
  });

  it('centres the toggle under the text it expands, in the shared button chrome', () => {
    const { container } = render(<ReadMoreText paragraphs={PARAS} label="Test Bill" />);
    expect(container.querySelector('.read-more__toggle-row')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Read more/i })).toHaveClass('ledger-btn');
  });

  it('points the toggle at the collapsible region for assistive tech', () => {
    render(<ReadMoreText paragraphs={PARAS} label="Test Bill" />);
    const toggle = screen.getByRole('button', { name: /Read more/i });
    const controlled = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(controlled).toHaveClass('read-more__rest');
  });

  it('renders no toggle at all when there is only one paragraph', () => {
    render(<ReadMoreText paragraphs={['Only this.']} label="Test Bill" />);
    expect(screen.getByText('Only this.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
