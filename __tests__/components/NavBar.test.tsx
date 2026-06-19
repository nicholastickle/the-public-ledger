import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NavBar from '@/app/components/NavBar';

describe('NavBar', () => {
  it('renders the site logo text', () => {
    render(<NavBar />);
    expect(screen.getByText('The Public Ledger')).toBeInTheDocument();
  });

  it('renders primary nav links', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: 'Bills' })).toBeInTheDocument();
  });

  it('renders Log In and Sign Up CTAs', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('Sign Up links to /signup', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
      'href',
      '/signup',
    );
  });
});
