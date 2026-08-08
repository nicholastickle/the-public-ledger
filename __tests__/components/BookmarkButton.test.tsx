import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookmarkButton from '@/app/components/cards/BookmarkButton';

describe('BookmarkButton', () => {
  it('starts unbookmarked', () => {
    render(<BookmarkButton title="Test Reform Bill" />);
    const btn = screen.getByRole('button', { name: 'Bookmark Test Reform Bill' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles on click and updates its accessible label', () => {
    render(<BookmarkButton title="Test Reform Bill" />);
    const btn = screen.getByRole('button', { name: 'Bookmark Test Reform Bill' });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Remove bookmark from Test Reform Bill' })).toBeInTheDocument();
  });

  it('keeps its click off the surrounding card', () => {
    const onCardClick = vi.fn();
    render(
      <div onClick={onCardClick}>
        <BookmarkButton title="Test Reform Bill" />
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /Bookmark/ }));
    expect(onCardClick).not.toHaveBeenCalled();
  });
});
