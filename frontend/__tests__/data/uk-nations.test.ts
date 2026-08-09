import { describe, it, expect } from 'vitest';
import {
  UK_NATIONS,
  UK_MAP_VIEWBOX,
  IRELAND_CONTEXT_PATH,
} from '@/app/data/uk-nations';

describe('uk-nations map data', () => {
  it('contains the four UK constituent nations in order', () => {
    expect(UK_NATIONS.map((n) => n.key)).toEqual([
      'england',
      'scotland',
      'wales',
      'northernIreland',
    ]);
  });

  it('every nation has a non-empty path, colour and an in-bounds flag anchor', () => {
    for (const n of UK_NATIONS) {
      expect(n.name).toBeTruthy();
      expect(n.d.startsWith('M')).toBe(true);
      expect(n.d.length).toBeGreaterThan(100);
      expect(n.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(n.cx).toBeGreaterThanOrEqual(0);
      expect(n.cx).toBeLessThanOrEqual(UK_MAP_VIEWBOX.width);
      expect(n.cy).toBeGreaterThanOrEqual(0);
      expect(n.cy).toBeLessThanOrEqual(UK_MAP_VIEWBOX.height);
    }
  });

  it('exposes a positive viewBox and a context outline for the Republic of Ireland', () => {
    expect(UK_MAP_VIEWBOX.width).toBeGreaterThan(0);
    expect(UK_MAP_VIEWBOX.height).toBeGreaterThan(0);
    expect(IRELAND_CONTEXT_PATH.startsWith('M')).toBe(true);
  });
});
