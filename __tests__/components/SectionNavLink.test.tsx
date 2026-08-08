import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SectionNavLink from '@/app/components/navigation/SectionNavLink';

describe('SectionNavLink', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/');
  });

  it('renders a link with the given href and label', () => {
    render(<SectionNavLink href="/#bills">Bills</SectionNavLink>);
    expect(screen.getByRole('link', { name: 'Bills' })).toHaveAttribute('href', '/#bills');
  });

  it('scrolls to the section (rather than relying on a hash change) when clicked on the home page', () => {
    const section = document.createElement('section');
    section.id = 'bills';
    const scrollIntoView = vi.fn();
    section.scrollIntoView = scrollIntoView;
    document.body.appendChild(section);

    render(<SectionNavLink href="/#bills">Bills</SectionNavLink>);
    fireEvent.click(screen.getByRole('link', { name: 'Bills' }));

    expect(scrollIntoView).toHaveBeenCalled();

    document.body.removeChild(section);
  });

  it('still runs a passed onClick alongside the scroll behaviour', () => {
    const onClick = vi.fn();
    render(
      <SectionNavLink href="/elections" onClick={onClick}>
        Elections
      </SectionNavLink>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Elections' }));
    expect(onClick).toHaveBeenCalled();
  });
});
