import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '@/app/components/ui/Modal';

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

  it('calls onClose on a leftward swipe across the panel', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>
    );
    const panel = screen.getByRole('dialog');
    fireEvent.touchStart(panel, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 200, clientY: 205 }] });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on a short swipe, a rightward swipe, or a mostly-vertical scroll', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>
    );
    const panel = screen.getByRole('dialog');

    // Too short
    fireEvent.touchStart(panel, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 270, clientY: 200 }] });

    // Rightward
    fireEvent.touchStart(panel, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 300, clientY: 200 }] });

    // Mostly vertical (a scroll), even though it moves left too
    fireEvent.touchStart(panel, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 250, clientY: 400 }] });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders a sound toggle beside the close button, not a fixed floating one', () => {
    render(
      <Modal onClose={() => {}} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>
    );
    const controls = screen.getByRole('button', { name: /close/i }).closest('.ledger-modal-controls');
    expect(controls).not.toBeNull();
    expect(within(controls as HTMLElement).getByRole('button', { name: /unmute rule britannia/i })).toBeInTheDocument();
  });
});
