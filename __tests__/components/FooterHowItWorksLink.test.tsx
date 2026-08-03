import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FooterHowItWorksLink from '@/app/components/FooterHowItWorksLink';

describe('FooterHowItWorksLink', () => {
  it('renders a How it works trigger and no modal content until clicked', () => {
    render(<FooterHowItWorksLink />);
    expect(screen.getByRole('button', { name: 'How it works' })).toBeInTheDocument();
    expect(screen.queryByText('Step 01')).not.toBeInTheDocument();
  });

  it('opens the How it works modal on click', () => {
    render(<FooterHowItWorksLink />);
    fireEvent.click(screen.getByRole('button', { name: 'How it works' }));
    expect(screen.getByText('Step 01')).toBeInTheDocument();
  });
});
