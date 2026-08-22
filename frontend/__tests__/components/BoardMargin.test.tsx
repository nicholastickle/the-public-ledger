import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BoardMargin from '@/app/components/board/BoardMargin';

describe('BoardMargin', () => {
  it('applies the side-specific class', () => {
    const { container } = render(<BoardMargin side="right" />);
    expect(container.querySelector('.board-margin--right')).toBeInTheDocument();
  });

  it('is hidden from assistive tech as purely decorative', () => {
    const { container } = render(<BoardMargin side="left" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('renders a distinct set of roundels for each side', () => {
    const { container: left } = render(<BoardMargin side="left" />);
    const { container: right } = render(<BoardMargin side="right" />);
    const leftIcons = left.querySelectorAll('.board-margin__roundel svg');
    const rightIcons = right.querySelectorAll('.board-margin__roundel svg');
    expect(leftIcons).toHaveLength(3);
    expect(rightIcons).toHaveLength(3);
    expect(left.innerHTML).not.toBe(right.innerHTML);
  });
});
