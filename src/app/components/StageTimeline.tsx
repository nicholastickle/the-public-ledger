import type { ParliamentBillStage } from '../types/parliament';
import { formatBillDate } from '../lib/utils';

interface Props {
  stages: ParliamentBillStage[];
}

export default function StageTimeline({ stages }: Props) {
  if (stages.length === 0) {
    return (
      <p className="text-body-md text-mute">No stage information available yet.</p>
    );
  }

  return (
    <ol className="flex flex-col">
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;

        return (
          <li key={stage.id} className="flex gap-lg">
            {/* Vertical connector */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-primary mt-xxs" />
              {!isLast && <div className="w-px flex-1 bg-hairline mt-xs" />}
            </div>

            {/* Stage content */}
            <div className={`flex flex-col gap-sm min-w-0 ${isLast ? 'pb-0' : 'pb-2xl'}`}>
              <div className="flex items-center gap-sm flex-wrap">
                <span className="text-body-md font-medium text-ink">
                  {stage.stage_name ?? 'Stage'}
                </span>
                {stage.house && (
                  <span className="text-caption-mono font-mono text-mute uppercase tracking-wider">
                    {stage.house}
                  </span>
                )}
              </div>

              {/* Sitting dates */}
              {stage.sittings.length > 0 && (
                <div className="flex flex-wrap gap-xs">
                  {stage.sittings.map((d) => (
                    <span
                      key={d}
                      className="text-caption font-mono text-mute bg-canvas-soft px-xs py-xxs rounded-xs"
                    >
                      {formatBillDate(d)}
                    </span>
                  ))}
                </div>
              )}

              {/* Division results */}
              {stage.divisions.map((div) => {
                const isCommons = div.house === 'Commons';
                const forCount = isCommons ? div.aye_count : div.content_count;
                const againstCount = isCommons ? div.no_count : div.not_content_count;
                const total = (forCount ?? 0) + (againstCount ?? 0);
                const forPct = total > 0 ? Math.round(((forCount ?? 0) / total) * 100) : 50;
                const againstPct = 100 - forPct;
                const forLabel = isCommons ? 'Aye' : 'Content';
                const againstLabel = isCommons ? 'No' : 'Not Content';

                return (
                  <div
                    key={div.division_id}
                    className="bg-canvas rounded-md p-md shadow-level-1 flex flex-col gap-sm"
                  >
                    <div className="flex items-center justify-between gap-sm">
                      <span className="text-caption font-mono text-mute">Division result</span>
                      {div.did_pass !== null && (
                        <span
                          className={`text-caption-mono font-mono uppercase tracking-wider ${
                            div.did_pass ? 'text-success' : 'text-error'
                          }`}
                        >
                          {div.did_pass ? '✓ Passed' : '✗ Rejected'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-xs">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-xs">
                          <span className="text-display-sm font-semibold text-link">{forPct}%</span>
                          <span className="text-caption-mono font-mono text-link">
                            {forLabel}
                            {forCount != null ? ` (${forCount})` : ''}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-xs">
                          <span className="text-caption-mono font-mono text-highlight-pink">
                            {againstLabel}
                            {againstCount != null ? ` (${againstCount})` : ''}
                          </span>
                          <span className="text-display-sm font-semibold text-highlight-pink">
                            {againstPct}%
                          </span>
                        </div>
                      </div>
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-canvas-soft-2">
                        <div
                          className="bg-link transition-all duration-300"
                          style={{ width: `${forPct}%` }}
                        />
                        <div
                          className="bg-highlight-pink transition-all duration-300"
                          style={{ width: `${againstPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
