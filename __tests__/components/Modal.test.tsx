import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '@/app/components/Modal';

describe('Modal', () => {
  it('renders children inside a dialog', () => {
    render(
      <Modal onClose={() => {}} labelledBy="t">
        <h2 id="t">Title</h2>
        <p>Body content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked but not when the panel is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>
    );
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    const backdrop = screen.getByRole('dialog').parentElement!;
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
