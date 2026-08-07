import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TapInfo from '@/app/components/TapInfo';

describe('TapInfo', () => {
  it('is closed by default and opens on tap', () => {
    render(<TapInfo message="Explains the thing." srLabel="About the thing">🔒</TapInfo>);
    expect(screen.queryByText('Explains the thing.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'About the thing' }));
    expect(screen.getByText('Explains the thing.')).toBeInTheDocument();
  });

  it('closes on a second tap of the trigger', () => {
    render(<TapInfo message="Explains the thing." srLabel="About the thing">🔒</TapInfo>);
    const trigger = screen.getByRole('button', { name: 'About the thing' });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByText('Explains the thing.')).not.toBeInTheDocument();
  });

  it('closes on an outside click', () => {
    render(
      <div>
        <TapInfo message="Explains the thing." srLabel="About the thing">🔒</TapInfo>
        <button type="button">Elsewhere</button>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: 'About the thing' }));
    expect(screen.getByText('Explains the thing.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByText('Explains the thing.')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<TapInfo message="Explains the thing." srLabel="About the thing">🔒</TapInfo>);
    fireEvent.click(screen.getByRole('button', { name: 'About the thing' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Explains the thing.')).not.toBeInTheDocument();
  });

  it('does not let the tap bubble to a surrounding click handler', () => {
    const onOuterClick = vi.fn();
    render(
      <div onClick={onOuterClick}>
        <TapInfo message="Explains the thing." srLabel="About the thing">🔒</TapInfo>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: 'About the thing' }));
    expect(onOuterClick).not.toHaveBeenCalled();
  });
});
