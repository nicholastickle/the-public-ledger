import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HowItWorksModal from '@/app/components/how-it-works/HowItWorksModal';

describe('HowItWorksModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<HowItWorksModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows step 01 on first open', () => {
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Step 01')).toBeInTheDocument();
    expect(screen.getByText('Find a bill or regulation before Parliament.')).toBeInTheDocument();
  });

  it('advances to next step on Next click', () => {
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step 02')).toBeInTheDocument();
    expect(screen.getByText('Verify your identity.')).toBeInTheDocument();
  });

  it('shows British Citizens Only badge on step 02', () => {
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('British Citizens Only')).toBeInTheDocument();
  });

  it('shows transparency note and login CTA on final slide', () => {
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    // Advance through all 4 steps
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    }
    expect(screen.getByText('A note on transparency')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create an account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    // The overlay is the outermost div — click it directly
    const overlay = screen.getByRole('button', { name: 'Close' }).closest('[class*="fixed"]') as HTMLElement;
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on a leftward swipe across the panel', () => {
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    const panel = screen.getByText('Step 01').closest('[class*="relative"]') as HTMLElement;
    fireEvent.touchStart(panel, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 200, clientY: 205 }] });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on a short swipe or a mostly-vertical scroll', () => {
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    const panel = screen.getByText('Step 01').closest('[class*="relative"]') as HTMLElement;

    fireEvent.touchStart(panel, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 270, clientY: 200 }] });

    fireEvent.touchStart(panel, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(panel, { changedTouches: [{ clientX: 250, clientY: 400 }] });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders a sound toggle beside the close button', () => {
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    const controls = closeBtn.parentElement!;
    expect(within(controls).getByRole('button', { name: /unmute rule britannia/i })).toBeInTheDocument();
  });

  it('resets to step 01 when reopened', () => {
    const { rerender } = render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step 02')).toBeInTheDocument();

    rerender(<HowItWorksModal isOpen={false} onClose={vi.fn()} />);
    rerender(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Step 01')).toBeInTheDocument();
  });
});
