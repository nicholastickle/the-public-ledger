export interface TimelineStep {
  label: string;
  state: 'done' | 'current' | 'upcoming' | 'stopped';
}

interface Props {
  steps: TimelineStep[];
}

const STATE_COLOR: Record<TimelineStep['state'], string> = {
  done: '#2D6A4F',
  current: '#D4AF37',
  upcoming: 'rgba(184,150,12,0.25)',
  stopped: '#8B1A1A',
};

/** Stage progress for the detail modal — dark-ledger themed, distinct from the
 *  light-theme StageTimeline used on /bills/[id] (which renders division
 *  results, not this).
 *
 *  One DOM, three layouts, chosen in CSS by how much width there is:
 *   · phone   — a plain vertical timeline, nodes joined top to bottom
 *   · tablet  — two columns of that timeline, read down the left then down the
 *               right, so eight stages don't become one long scroll
 *   · desktop — the full horizontal run, each node dropping a leader line
 *               (straight down, then away at an angle) to a label set parallel
 *               to that angle, which is what lets long stage names sit side by
 *               side without crowding each other.
 *
 *  `--timeline-rows` is what makes the two-column layout work: the grid fills
 *  column-first, so it needs to be told how tall a column is. */
export default function BoardStageTimeline({ steps }: Props) {
  const rows = Math.ceil(steps.length / 2);

  return (
    <div
      className="board-timeline"
      role="list"
      aria-label="Legislative progress"
      style={{ '--timeline-rows': rows } as React.CSSProperties}
    >
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        // Last node of the left-hand column: its connector would otherwise run
        // off the bottom of the column towards nothing.
        const isColumnEnd = (i + 1) % rows === 0;
        const color = STATE_COLOR[step.state];
        const connectorColor = step.state === 'done' ? STATE_COLOR.done : 'rgba(184,150,12,0.18)';

        return (
          <div
            className="board-timeline__step"
            role="listitem"
            key={`${step.label}-${i}`}
            data-col-end={isColumnEnd ? 'true' : undefined}
          >
            <span className="board-timeline__node-row">
              <span
                className="board-timeline__node"
                style={{
                  background: step.state === 'upcoming' ? 'transparent' : color,
                  borderColor: color,
                  boxShadow: step.state === 'current' ? `0 0 8px ${color}99` : undefined,
                }}
              />
              {!isLast && (
                <span className="board-timeline__connector" style={{ background: connectorColor }} />
              )}
            </span>

            {/* Leader line: straight down from the node, then away at 35°, with
                the label set on that same angle a short gap further along. */}
            <svg className="board-timeline__leader" viewBox="0 0 44 48" aria-hidden="true" focusable="false">
              <path
                d="M7 0 V 16 L 27 30"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span
              className="board-timeline__label"
              style={{ color: step.state === 'upcoming' ? 'rgba(184,150,12,0.45)' : '#FAF6ED' }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
