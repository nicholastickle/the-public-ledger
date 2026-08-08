import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InfoTip from '@/app/components/InfoTip';

describe('InfoTip', () => {
  it('renders a real button, not a span, so it is tap-focusable on every browser', () => {
    render(<InfoTip label="House" tip="Which House the bill is in." />);
    const trigger = screen.getByRole('button', { name: 'About the House column' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('type', 'button');
  });

  it('names the trigger after its scope, defaulting to column', () => {
    render(<InfoTip label="First Reading" tip="The stage a bill is introduced at." scope="stage" />);
    expect(screen.getByRole('button', { name: 'About the First Reading stage' })).toBeInTheDocument();
  });

  it('carries the explanation as the CSS-read tooltip content', () => {
    render(<InfoTip label="House" tip="Which House the bill is in." />);
    expect(screen.getByRole('button', { name: /About the House/ })).toHaveAttribute('data-tooltip', 'Which House the bill is in.');
  });

  it('exposes its edge anchor for the tooltip-positioning CSS', () => {
    render(<InfoTip label="Bill" tip="The bill's title." align="left" />);
    expect(screen.getByRole('button', { name: /About the Bill/ })).toHaveAttribute('data-align', 'left');
  });

  // Tap reveal is driven by explicit click state rather than `:focus`/
  // `:focus-visible`, because real mobile WebKit does not reliably leave a
  // tapped button matching `:focus` — a CSS-only reveal left the tooltip
  // unreachable by touch even once the trigger was a real button.
  it('opens on click and marks itself expanded, closing again on a second click', () => {
    render(<InfoTip label="House" tip="Which House the bill is in." />);
    const trigger = screen.getByRole('button', { name: /About the House/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('data-open');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('data-open', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('data-open');
  });

  it('closes when the user taps elsewhere on the page', () => {
    render(
      <div>
        <InfoTip label="House" tip="Which House the bill is in." />
        <button type="button">Elsewhere</button>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /About the House/ }));
    expect(screen.getByRole('button', { name: /About the House/ })).toHaveAttribute('data-open', 'true');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.getByRole('button', { name: /About the House/ })).not.toHaveAttribute('data-open');
  });

  it('closes on Escape', () => {
    render(<InfoTip label="House" tip="Which House the bill is in." />);
    const trigger = screen.getByRole('button', { name: /About the House/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('data-open', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).not.toHaveAttribute('data-open');
  });
});
