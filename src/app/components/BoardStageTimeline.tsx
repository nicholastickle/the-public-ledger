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

/** Horizontal stage progress — dark-ledger themed, distinct from the light-theme
 *  StageTimeline used on /bills/[id] (which renders division results, not this). */
export default function BoardStageTimeline({ steps }: Props) {
  return (
    <div className="board-timeline" role="list" aria-label="Legislative progress">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const color = STATE_COLOR[step.state];
        return (
          <div className="board-timeline__step" role="listitem" key={`${step.label}-${i}`}>
            <div className="board-timeline__node-row">
              <span
                className="board-timeline__node"
                style={{
                  background: step.state === 'upcoming' ? 'transparent' : color,
                  borderColor: color,
                  boxShadow: step.state === 'current' ? `0 0 8px ${color}99` : undefined,
                }}
              />
              {!isLast && (
                <span
                  className="board-timeline__connector"
                  style={{ background: step.state === 'done' ? STATE_COLOR.done : 'rgba(184,150,12,0.18)' }}
                />
              )}
            </div>
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
