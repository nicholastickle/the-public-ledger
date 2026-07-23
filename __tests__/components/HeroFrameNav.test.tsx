import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroFrameNav from '@/app/components/HeroFrameNav';

describe('HeroFrameNav', () => {
  it('renders the wordmark and primary links', () => {
    render(<HeroFrameNav />);
    expect(screen.getByText('The Public Ledger')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bills' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regulations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Elections' })).toBeInTheDocument();
  });

  it('renders Log In and Sign Up CTAs with correct hrefs', () => {
    render(<HeroFrameNav />);
    expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
  });

  it('toggles the mobile menu open and closed', () => {
    render(<HeroFrameNav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    expect(burger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(burger);
    const close = screen.getByRole('button', { name: /close menu/i });
    expect(close).toHaveAttribute('aria-expanded', 'true');
    // mobile menu now duplicates the nav links
    expect(screen.getAllByRole('link', { name: 'Bills' }).length).toBeGreaterThan(1);
  });
});
