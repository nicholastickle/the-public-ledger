'use client';

import { useState, useEffect } from 'react';

export interface FlankItem {
  id: string | number;
  title: string;
  statusColor: string;
  statusLabel: string;
  publicAyes?: number;
  publicNoes?: number;
  govAyes?: number;
  govNoes?: number;
  voteOpen?: boolean;
}

interface Props {
  label: string;
  subtitle: string;
  items: FlankItem[];
  side: 'left' | 'right';
}

const VISIBLE = 6;
const ROW_H = 74;   // px — fits title + stage + stats line with comfortable padding
const TICK_MS = 3400;

function fmtVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function FlankRow({ item }: { item: FlankItem }) {
  const hasStats = item.publicAyes !== undefined || item.voteOpen;
  return (
    <div
      style={{
        height: ROW_H,
        padding: '9px 12px',
        borderBottom: '1px solid rgba(184,150,12,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Title + pip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: item.statusColor,
            boxShadow: `0 0 5px ${item.statusColor}99`,
            flexShrink: 0,
          }}
        />
        <p
          style={{
            color: '#1B4332',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {item.title}
        </p>
      </div>

      {/* Stage label */}
      <p
        style={{
          color: '#B8960C',
          fontSize: '9px',
          fontFamily: 'var(--font-mono), monospace',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          paddingLeft: '12px',
          opacity: 0.65,
        }}
      >
        {item.statusLabel}
      </p>

      {/* Vote stats */}
      {hasStats && (
        <div
          style={{
            paddingLeft: '12px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            fontFamily: 'var(--font-mono), monospace',
          }}
        >
          {item.voteOpen ? (
            <span style={{ color: '#D4AF37', fontSize: '9px', letterSpacing: '0.06em' }}>
              Voting open
            </span>
          ) : (
            <>
              <span style={{ color: '#10B981', fontSize: '9px' }}>
                ↑ {fmtVotes(item.publicAyes!)}
              </span>
              <span style={{ color: '#EF4444', fontSize: '9px' }}>
                ↓ {fmtVotes(item.publicNoes!)}
              </span>
              {item.govAyes !== undefined && (
                <span style={{ color: '#B8960C', fontSize: '9px', opacity: 0.5 }}>
                  · {item.govAyes}/{item.govNoes}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        height: ROW_H,
        padding: '9px 12px',
        borderBottom: '1px solid rgba(184,150,12,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B8960C', opacity: 0.15, flexShrink: 0 }} />
        <div style={{ height: '9px', background: 'rgba(27,67,50,0.09)', borderRadius: '2px', width: '72%' }} />
      </div>
      <div style={{ height: '7px', background: 'rgba(184,150,12,0.1)', borderRadius: '2px', width: '40%', marginLeft: '12px' }} />
    </div>
  );
}

export default function HeroFlankPanel({ label, subtitle, items, side }: Props) {
  const [offset, setOffset] = useState(0);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    if (items.length <= VISIBLE) return;
    const id = setInterval(() => setSliding(true), TICK_MS);
    return () => clearInterval(id);
  }, [items.length]);

  function onTransitionEnd() {
    setOffset(prev => (prev + 1) % items.length);
    setSliding(false);
  }

  // Render VISIBLE + 1 rows so the incoming row is ready just below the visible window
  const rowCount = Math.min(VISIBLE + 1, items.length);
  const rows = Array.from({ length: rowCount }, (_, i) => items[(offset + i) % items.length]);

  const innerBorder =
    side === 'left'
      ? { borderRight: '1px solid rgba(184,150,12,0.3)' }
      : { borderLeft: '1px solid rgba(184,150,12,0.3)' };

  return (
    <div
      className="ledger-bg flex flex-col h-full"
      style={{
        ...innerBorder,
        borderTop: '2px solid var(--color-aged-gold)',
        borderBottom: '2px solid var(--color-aged-gold)',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        className="px-sm py-xs shrink-0"
        style={{
          borderBottom: '1px solid rgba(184,150,12,0.22)',
          background: 'rgba(27,67,50,0.04)',
        }}
      >
        <p
          style={{
            color: '#B8960C',
            fontSize: '10px',
            fontFamily: 'var(--font-mono), monospace',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            lineHeight: 1.3,
          }}
        >
          {label}
        </p>
        <p
          style={{
            color: 'rgba(27,67,50,0.4)',
            fontSize: '9px',
            fontFamily: 'var(--font-mono), monospace',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Column sub-headers */}
      <div
        className="shrink-0"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 12px 4px 24px',
          borderBottom: '1px solid rgba(184,150,12,0.14)',
          background: 'rgba(27,67,50,0.025)',
        }}
      >
        <span style={{ color: 'rgba(27,67,50,0.3)', fontSize: '8px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Item
        </span>
        <span style={{ color: 'rgba(184,150,12,0.35)', fontSize: '8px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Public · Gov
        </span>
      </div>

      {/* Fixed-height scrolling window */}
      <div
        className="shrink-0"
        style={{ height: VISIBLE * ROW_H, overflow: 'hidden' }}
      >
        {items.length === 0 ? (
          Array.from({ length: VISIBLE }).map((_, i) => <SkeletonRow key={i} />)
        ) : (
          <div
            style={{
              transform: sliding ? `translateY(-${ROW_H}px)` : 'translateY(0)',
              transition: sliding ? 'transform 0.58s cubic-bezier(0.4,0,0.2,1)' : 'none',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {rows.map((item, i) => (
              <FlankRow key={`${item.id}-${(offset + i) % items.length}`} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Spacer — fills remaining panel height with ruled ledger lines */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div
        className="px-sm shrink-0 flex items-center justify-between"
        style={{
          height: '22px',
          borderTop: '1px solid rgba(184,150,12,0.16)',
          background: 'rgba(184,150,12,0.025)',
        }}
      >
        <span
          style={{
            color: 'rgba(184,150,12,0.4)',
            fontSize: '8px',
            fontFamily: 'var(--font-mono), monospace',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {items.length > 0 ? `${items.length} tracked` : 'demo'}
        </span>
        <span style={{ color: 'rgba(184,150,12,0.3)', fontSize: '8px' }}>◆</span>
      </div>
    </div>
  );
}
