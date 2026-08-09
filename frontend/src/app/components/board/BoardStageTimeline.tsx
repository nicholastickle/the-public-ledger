export interface TimelineStep {
  label: string;
  /** `stopped` is the stage a measure died at; `unreached` are the stages after
   *  it, which it never travelled. The two are drawn differently from
   *  `upcoming` — an upcoming stage may still happen, an unreached one never
   *  will — and the line into them is broken rather than solid. */
  state: 'done' | 'current' | 'upcoming' | 'stopped' | 'unreached';
}

interface Props {
  steps: TimelineStep[];
}

/** Read through CSS variables so the bronze modal can recolour the timeline
 *  without a second component: the Regulation Board's panel overrides them to
 *  copper, and every other surface falls through to the gold defaults. Applied
 *  via `style` rather than SVG presentation attributes, which do not resolve
 *  `var()`. */
const STATE_COLOR: Record<TimelineStep['state'], string> = {
  done: 'var(--stage-done, #2D6A4F)',
  current: 'var(--stage-current, #D4AF37)',
  upcoming: 'var(--stage-upcoming, rgba(184,150,12,0.25))',
  stopped: 'var(--stage-stopped, #EF4444)',
  unreached: 'var(--stage-unreached, rgba(184,150,12,0.16))',
};

/** Neither the stage a measure died at nor anything after it was travelled, so
 *  the line into them is broken. */
const BROKEN_STATES = new Set<TimelineStep['state']>(['stopped', 'unreached']);

const CURRENT_GLOW = 'var(--stage-current-glow, rgba(212,175,55,0.6))';
const LINE_IDLE = 'var(--stage-line, rgba(184,150,12,0.18))';
const LABEL_UPCOMING = 'var(--stage-label-upcoming, rgba(184,150,12,0.45))';

/** Stage progress for the detail modal — dark-ledger themed, distinct from the
 *  light-theme StageTimeline (which renders division results, not this).
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
      // A bill runs to eight stages in the width an instrument uses for four, so
      // both the label and the step have to size to the room they have. At eight
      // steps 104px of label is all there is; at four, "Annul Window Open" would
      // wrap to three lines, and letting the steps share out the full width
      // would strand each label a long way from the next. Capping the step keeps
      // the run reading as one sequence rather than four separate markers.
      style={{
        '--timeline-rows': rows,
        '--stage-label-w': steps.length <= 5 ? '150px' : '104px',
        '--stage-step-max': steps.length <= 5 ? '132px' : 'none',
      } as React.CSSProperties}
    >
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        // Last node of the left-hand column: its connector would otherwise run
        // off the bottom of the column towards nothing.
        const isColumnEnd = (i + 1) % rows === 0;
        const color = STATE_COLOR[step.state];
        const connectorColor = step.state === 'done' ? STATE_COLOR.done : LINE_IDLE;
        // The line *out of* this node. Broken once the run has stopped, so the
        // stages a measure never travelled read as cut off rather than pending.
        const brokenOut = BROKEN_STATES.has(step.state);

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
                  background: step.state === 'upcoming' || step.state === 'unreached' ? 'transparent' : color,
                  borderColor: color,
                  boxShadow: step.state === 'current' ? `0 0 8px ${CURRENT_GLOW}` : undefined,
                }}
              />
              {!isLast && (
                <span
                  className="board-timeline__connector"
                  data-broken={brokenOut ? 'true' : undefined}
                  style={brokenOut ? undefined : { background: connectorColor }}
                />
              )}
            </span>

            {/* Leader line: straight down from the node, then away at 35°, with
                the label set on that same angle a short gap further along. */}
            <svg className="board-timeline__leader" viewBox="0 0 44 48" aria-hidden="true" focusable="false">
              <path
                d="M7 0 V 16 L 27 30"
                fill="none"
                style={{ stroke: color }}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span
              className="board-timeline__label"
              style={{
                color:
                  step.state === 'upcoming' || step.state === 'unreached'
                    ? LABEL_UPCOMING
                    : step.state === 'stopped'
                      ? STATE_COLOR.stopped
                      : '#FAF6ED',
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
