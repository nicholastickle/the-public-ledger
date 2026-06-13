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
    expect(screen.getByRole('link', { name: 'Health' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Economy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Housing' })).toBeInTheDocument();
  });

  it('renders Sign In and Register to Vote CTAs', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register to Vote' })).toBeInTheDocument();
  });

  it('Register to Vote links to /signup', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: 'Register to Vote' })).toHaveAttribute(
      'href',
      '/signup',
    );
  });
});
