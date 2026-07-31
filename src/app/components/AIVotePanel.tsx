import type { AiModelOpinion } from '../lib/mockVotes';

interface Props {
  opinions: AiModelOpinion[];
  /** Verdict badges stay locked until the citizen has cast their own vote — same
   *  reveal-after-you-vote rule as the government tally, so the AI panel can't
   *  bandwagon a citizen's decision before they've made it. Summaries/merits/
   *  problems are informational and always shown. */
  revealed: boolean;
}

export default function AIVotePanel({ opinions, revealed }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between gap-sm mb-xs">
        <span className="font-mono uppercase" style={{ color: '#B8960C', fontSize: '11px', letterSpacing: '0.16em' }}>
          AI Commentary
        </span>
        <span className="font-mono" style={{ color: 'rgba(184,150,12,0.5)', fontSize: '10px', letterSpacing: '0.08em' }}>
          Demo commentary · live model voting coming soon
        </span>
      </div>
      <div className="ai-panel-scroll">
        {opinions.map(op => (
          <div key={op.model} className="ai-panel-card">
            <div className="flex items-center justify-between gap-sm mb-sm">
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: op.color }} />
                <span className="font-medium" style={{ color: '#FAF6ED', fontSize: '13px' }}>{op.model}</span>
                <span className="font-mono" style={{ color: 'rgba(184,150,12,0.55)', fontSize: '10px' }}>{op.vendor}</span>
              </div>
              {revealed ? (
                <span
                  className="font-mono uppercase shrink-0"
                  style={{
                    color: op.verdict === 'approve' ? '#10B981' : '#EF4444',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    border: `1px solid ${op.verdict === 'approve' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                    borderRadius: '2px',
                    padding: '1px 6px',
                  }}
                >
                  {op.verdict === 'approve' ? 'Approve' : 'Reject'}
                </span>
              ) : (
                <span
                  className="font-mono uppercase shrink-0"
                  style={{ color: 'rgba(184,150,12,0.4)', fontSize: '10px', letterSpacing: '0.06em' }}
                  title="Cast your vote to reveal this model's verdict"
                >
                  🔒 Vote to reveal
                </span>
              )}
            </div>
            <p style={{ color: '#E8DFC8', fontSize: '12.5px', lineHeight: 1.5 }}>{op.summary}</p>
            <p className="mt-xs" style={{ color: '#8FBF9F', fontSize: '12px', lineHeight: 1.5 }}>{op.merits}</p>
            <p className="mt-xxs" style={{ color: '#D89A9A', fontSize: '12px', lineHeight: 1.5 }}>{op.problems}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
