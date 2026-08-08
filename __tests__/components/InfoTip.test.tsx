import { render, screen } from '@testing-library/react';
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
});
