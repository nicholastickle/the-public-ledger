import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ModelLogo, { type ModelBrand } from '@/app/components/ModelLogo';

const BRANDS: ModelBrand[] = ['Claude', 'ChatGPT', 'Gemini', 'Grok'];

describe('ModelLogo', () => {
  it('draws a distinct mark for every brand on the panel', () => {
    const marks = BRANDS.map(brand => {
      const { container } = render(<ModelLogo brand={brand} />);
      return container.querySelector('svg')?.innerHTML ?? '';
    });
    expect(marks.every(m => m.length > 0)).toBe(true);
    expect(new Set(marks).size).toBe(BRANDS.length);
  });

  it('is decorative — the model is named in text beside it', () => {
    const { container } = render(<ModelLogo brand="Claude" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('honours a custom size', () => {
    const { container } = render(<ModelLogo brand="Gemini" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });
});
