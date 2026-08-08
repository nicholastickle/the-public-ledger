import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StageIcon, NumberIcon, HouseIcon, ProcedureIcon } from '@/app/components/CardMetaIcons';

describe('CardMetaIcons', () => {
  it.each([
    ['StageIcon', StageIcon],
    ['NumberIcon', NumberIcon],
    ['HouseIcon', HouseIcon],
    ['ProcedureIcon', ProcedureIcon],
  ])('renders %s as an accessibility-hidden svg', (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
