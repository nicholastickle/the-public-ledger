import type { ActivityItem } from '../types';
import { formatVolume, formatTimeAgo } from '../lib/utils';

interface Props {
  activity: ActivityItem[];
}

export default function LiveFeedSection({ activity }: Props) {
  return (
    <section className="bg-canvas py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        {/* Header */}
        <div className="flex items-center gap-sm mb-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-caption-mono font-mono text-mute uppercase tracking-widest">
            Live Activity
          </span>
        </div>
        <h2 className="text-display-lg font-semibold text-ink mb-xl">
          Real-time market activity.
        </h2>

        {/* Feed */}
        <div className="flex flex-col divide-y divide-hairline rounded-lg shadow-level-1 bg-canvas overflow-hidden">
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-lg py-md hover:bg-canvas-soft transition-colors"
            >
              {/* Left: avatar + description */}
              <div className="flex items-center gap-md min-w-0">
                <div className="w-8 h-8 rounded-full bg-canvas-soft-2 flex items-center justify-center flex-shrink-0">
                  <span className="text-caption font-mono text-mute uppercase">
                    {item.user.slice(0, 2)}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-xs flex-wrap">
                    <span className="text-body-sm font-medium text-ink">{item.user}</span>
                    <span className="text-body-sm text-mute">bought</span>
                    <span
                      className={`text-body-sm font-semibold ${
                        item.position === 'YES' ? 'text-link' : 'text-highlight-pink'
                      }`}
                    >
                      {item.position}
                    </span>
                  </div>
                  <div className="text-caption text-mute truncate max-w-[20rem] sm:max-w-[24rem] md:max-w-[32rem]">
                    {item.market}
                  </div>
                </div>
              </div>

              {/* Right: amount + time */}
              <div className="flex-shrink-0 text-right ml-md">
                <div className="text-body-sm font-semibold font-mono text-ink">
                  {formatVolume(item.amount)}
                </div>
                <div className="text-caption font-mono text-mute">
                  {formatTimeAgo(item.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
