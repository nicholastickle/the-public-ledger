import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MobileMenu from '@/app/components/MobileMenu';

describe('MobileMenu', () => {
  it('renders the hamburger button', () => {
    render(<MobileMenu />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('does not show nav links before the menu is opened', () => {
    render(<MobileMenu />);
    expect(screen.queryByRole('link', { name: 'Bills' })).not.toBeInTheDocument();
  });

  it('shows nav links after clicking the hamburger', () => {
    render(<MobileMenu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('link', { name: 'Bills' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register to Vote' })).toBeInTheDocument();
  });

  it('shows Register to Vote and Sign In CTAs when menu is open', () => {
    render(<MobileMenu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('link', { name: 'Register to Vote' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('closes the menu when a nav link is clicked', () => {
    render(<MobileMenu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByRole('link', { name: 'Bills' }));
    expect(screen.queryByRole('link', { name: 'Bills' })).not.toBeInTheDocument();
  });

  it('toggles aria-expanded on the button', () => {
    render(<MobileMenu />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});
