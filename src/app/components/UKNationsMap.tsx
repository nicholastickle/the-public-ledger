'use client';

import { useRef, useState, useCallback } from 'react';
import {
  UK_NATIONS,
  UK_MAP_VIEWBOX,
  type UKNationKey,
} from '../data/uk-nations';
import NationFlag from './NationFlag';

const { width: VB_W, height: VB_H } = UK_MAP_VIEWBOX;

export default function UKNationsMap() {
  const [active, setActive] = useState<UKNationKey | null>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  // Light cursor parallax — mutate CSS vars directly, no re-render.
  const handlePointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = planeRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${px * 12}deg`);
    el.style.setProperty('--rx', `${16 - py * 9}deg`);
  }, []);

  const resetTilt = useCallback(() => {
    const el = planeRef.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '16deg');
  }, []);

  return (
    <div
      className="uk-map-stage"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        resetTilt();
        setActive(null);
      }}
    >
      <div ref={planeRef} className="uk-map-plane">
        <svg
          className="uk-map-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label="Map of the United Kingdom showing England, Scotland, Wales and Northern Ireland"
        >
          {/* Four nations — extruded relief plate (filter applied to the group) */}
          <g className="uk-map-relief">
            {UK_NATIONS.map((n) => {
              const isActive = active === n.key;
              return (
                <path
                  key={n.key}
                  className="uk-nation-top"
                  d={n.d}
                  aria-hidden="true"
                  style={{
                    fill: isActive ? n.color : '#e8dbba',
                    transform: isActive ? 'translateY(-11px)' : 'none',
                  }}
                  data-active={isActive}
                  onPointerEnter={() => setActive(n.key)}
                />
              );
            })}
          </g>
        </svg>

        {/* Flag badges pinned at each nation — always visible, emphasised on hover */}
        <div className="uk-map-badges" aria-hidden={false}>
          {UK_NATIONS.map((n) => {
            const isActive = active === n.key;
            return (
              <button
                key={n.key}
                type="button"
                className="uk-flag-badge"
                data-active={isActive}
                style={{
                  left: `${(n.cx / VB_W) * 100}%`,
                  top: `${(n.cy / VB_H) * 100}%`,
                }}
                onPointerEnter={() => setActive(n.key)}
                onFocus={() => setActive(n.key)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((cur) => (cur === n.key ? null : n.key))}
                aria-label={`${n.name} — reveal flag`}
              >
                <span className="uk-flag-badge__flag">
                  <NationFlag nation={n.key} width={36} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
