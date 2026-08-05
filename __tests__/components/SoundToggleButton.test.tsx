import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SoundProvider } from '@/app/lib/SoundContext';
import SoundToggleButton from '@/app/components/SoundToggleButton';

/**
 * jsdom does not implement media playback, so play/pause/paused/currentTime are
 * stubbed on the prototype with just enough state to observe what the provider
 * does: whether it starts playback, whether it ever pauses, and whether it seeks.
 */
const originals = {
  play: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'play'),
  pause: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'pause'),
  paused: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'paused'),
  currentTime: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime'),
};

let play: ReturnType<typeof vi.fn>;
let pause: ReturnType<typeof vi.fn>;
let isPlaying: boolean;
let currentTime: number;

function stubMedia(playImpl?: () => Promise<void>) {
  play = vi.fn(playImpl ?? (() => { isPlaying = true; return Promise.resolve(); }));
  pause = vi.fn(() => { isPlaying = false; });
  Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, writable: true, value: play });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, writable: true, value: pause });
  Object.defineProperty(HTMLMediaElement.prototype, 'paused', { configurable: true, get: () => !isPlaying });
  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
    configurable: true,
    get: () => currentTime,
    set: (v: number) => { currentTime = v; },
  });
}

function getAudio(container: HTMLElement): HTMLAudioElement {
  const el = container.querySelector('audio');
  if (!el) throw new Error('audio element not rendered');
  return el;
}

function renderToggle() {
  return render(
    <SoundProvider>
      <SoundToggleButton />
    </SoundProvider>
  );
}

describe('SoundToggleButton', () => {
  beforeEach(() => {
    isPlaying = false;
    currentTime = 0;
    stubMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(HTMLMediaElement.prototype, key, descriptor);
    }
  });

  it('starts the tune muted on mount', () => {
    const { container } = renderToggle();
    const audio = getAudio(container);

    expect(play).toHaveBeenCalledTimes(1);
    expect(audio.muted).toBe(true);
    expect(audio.loop).toBe(false);

    const btn = screen.getByRole('button', { name: /unmute rule britannia/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveAttribute('data-playing', 'false');
  });

  it('unmutes on click without restarting the tune', () => {
    const { container } = renderToggle();
    const audio = getAudio(container);
    currentTime = 12.5;

    fireEvent.click(screen.getByRole('button', { name: /unmute rule britannia/i }));

    expect(audio.muted).toBe(false);
    expect(audio.currentTime).toBe(12.5);
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /mute rule britannia/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('remutes on a second click and never pauses playback', () => {
    const { container } = renderToggle();
    const audio = getAudio(container);

    fireEvent.click(screen.getByRole('button', { name: /unmute rule britannia/i }));
    currentTime = 30;
    fireEvent.click(screen.getByRole('button', { name: /mute rule britannia/i }));

    expect(audio.muted).toBe(true);
    expect(audio.currentTime).toBe(30);
    expect(pause).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /unmute rule britannia/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('waits two seconds after the tune ends, then plays it again from the start', () => {
    vi.useFakeTimers();
    const { container } = renderToggle();
    const audio = getAudio(container);
    expect(play).toHaveBeenCalledTimes(1);

    currentTime = 5.04;
    isPlaying = false;
    act(() => { fireEvent.ended(audio); });

    act(() => { vi.advanceTimersByTime(1999); });
    expect(play).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(5.04);

    act(() => { vi.advanceTimersByTime(1); });
    expect(play).toHaveBeenCalledTimes(2);
    expect(audio.currentTime).toBe(0);
  });

  it('keeps looping for repeat playthroughs', () => {
    vi.useFakeTimers();
    const { container } = renderToggle();
    const audio = getAudio(container);

    for (let i = 0; i < 3; i++) {
      isPlaying = false;
      act(() => { fireEvent.ended(audio); });
      act(() => { vi.advanceTimersByTime(2000); });
    }

    expect(play).toHaveBeenCalledTimes(4);
  });

  it('starts on the first interaction when the browser refuses muted autoplay', async () => {
    stubMedia(() => Promise.reject(new Error('NotAllowedError')));
    renderToggle();

    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));

    stubMedia();
    fireEvent.pointerDown(window);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('shares state across every button rendered under the same provider', () => {
    render(
      <SoundProvider>
        <SoundToggleButton className="sound-toggle a" />
        <SoundToggleButton className="sound-toggle b" />
      </SoundProvider>
    );
    const buttons = screen.getAllByRole('button', { name: /unmute rule britannia/i });
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);

    expect(screen.getAllByRole('button', { name: /mute rule britannia/i })).toHaveLength(2);
  });

  it('degrades to a harmless, muted no-op when rendered without a provider', () => {
    render(<SoundToggleButton />);
    const btn = screen.getByRole('button', { name: /unmute rule britannia/i });
    expect(() => fireEvent.click(btn)).not.toThrow();
    expect(screen.getByRole('button', { name: /unmute rule britannia/i })).toBeInTheDocument();
  });

  it('applies the className passed by the caller', () => {
    renderToggle();
    // default render uses the base "sound-toggle" class
    expect(screen.getByRole('button', { name: /unmute rule britannia/i })).toHaveClass('sound-toggle');
  });
});
