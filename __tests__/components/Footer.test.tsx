import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/app/components/Footer';

describe('Footer', () => {
  it('renders the slogan', () => {
    render(<Footer />);
    expect(
      screen.getByText('Shadow parliament voting for British citizens ONLY. Your voice on the bills and regulations that shape the country.'),
    ).toBeInTheDocument();
  });

  it('renders the rights-reserved line', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} The Public Ledger\\. All rights reserved\\.`))).toBeInTheDocument();
  });

  it('renders the non-affiliation disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText('Not affiliated with the UK Parliament or any political party.')).toBeInTheDocument();
  });

  it('does not render a session-active indicator', () => {
    render(<Footer />);
    expect(screen.queryByText(/session active/i)).not.toBeInTheDocument();
  });

  it('renders every requested board and platform link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Bill Board' })).toHaveAttribute('href', '/#bills');
    expect(screen.getByRole('link', { name: 'Regulations Board' })).toHaveAttribute('href', '/#regulations');
    expect(screen.getByRole('link', { name: 'Elections Board' })).toHaveAttribute('href', '/elections');
    expect(screen.getByRole('link', { name: 'Lobby Board' })).toHaveAttribute('href', '/lobby');
    expect(screen.getByRole('link', { name: 'AI Voting' })).toHaveAttribute('href', '/ai-voting');
    expect(screen.getByRole('link', { name: 'AI Round Table' })).toHaveAttribute('href', '/ai-round-table');
    expect(screen.getByRole('button', { name: 'How it works' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Parliament API' })).toHaveAttribute('href', '/parliament-api');
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: 'Press' })).toHaveAttribute('href', '/press');
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
  });

  it('opens the GitHub repo link in a new tab safely', () => {
    render(<Footer />);
    const github = screen.getByRole('link', { name: 'GitHub Repo' });
    expect(github).toHaveAttribute('href', 'https://github.com/nicholastickle/the-public-ledger');
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the background watermark text', () => {
    render(<Footer />);
    expect(screen.getByText('Public Ledger')).toBeInTheDocument();
  });
});
