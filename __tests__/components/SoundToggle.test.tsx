import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SoundToggle from '@/app/components/SoundToggle';

class MockGainNode {
  gain = { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() };
  connect() { return this; }
}
class MockOscillatorNode {
  type = '';
  frequency = { value: 0 };
  connect() { return this; }
  start() {}
  stop() {}
}
class MockAudioContext {
  currentTime = 0;
  destination = {};
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  close() { return Promise.resolve(); }
}

describe('SoundToggle', () => {
  beforeEach(() => {
    vi.stubGlobal('AudioContext', MockAudioContext);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders muted by default', () => {
    render(<SoundToggle />);
    const btn = screen.getByRole('button', { name: /play rule britannia/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveAttribute('data-playing', 'false');
  });

  it('toggles to playing when clicked, and back to muted on a second click', () => {
    render(<SoundToggle />);
    const btn = screen.getByRole('button', { name: /play rule britannia/i });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /mute rule britannia/i })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /mute rule britannia/i }));
    expect(screen.getByRole('button', { name: /play rule britannia/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('does nothing when Web Audio is unavailable', () => {
    vi.stubGlobal('AudioContext', undefined);
    render(<SoundToggle />);
    const btn = screen.getByRole('button', { name: /play rule britannia/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });
});
