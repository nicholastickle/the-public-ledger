import type { AiModelOpinion } from '../lib/mockVotes';
import ModelLogo from './ModelLogo';
import InfoTip from './InfoTip';

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
      <span className="modal-section__heading">
        AI Commentary
        <InfoTip
          align="left"
          label="AI Commentary"
          tip="One verdict per model, each cast by the named model version on the published text alone. Every verdict can be audited: the prompt each model was given and the reply it returned are both on the record. The panel is advisory — it carries no weight in the shadow vote and none in Parliament's."
        />
      </span>

      {/* Wraps rather than scrolls: a horizontal scroller hides whichever models
          fall off the right edge, and a panel you have to scroll to see all of
          is a panel most readers only see half of. */}
      <div className="ai-panel-grid">
        {opinions.map(op => (
          <div key={op.model} className="ai-panel-card">
            {/* The vendor line sits on its own row rather than beside the
                verdict badge — squeezed into the same row it truncates to
                "Anthropic · C…", which tells a reader nothing. */}
            <div className="flex items-center justify-between gap-sm">
              <div className="flex items-center gap-xs min-w-0">
                <span className="ai-panel-card__logo" style={{ color: op.color }}>
                  <ModelLogo brand={op.model} />
                </span>
                <span className="font-medium truncate" style={{ color: '#FAF6ED', fontSize: '13px' }}>
                  {op.modelVersion}
                </span>
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
            <p className="ai-panel-card__vendor font-mono">
              {op.vendor} · {op.model}
            </p>
            <p className="mt-sm" style={{ color: '#E8DFC8', fontSize: '12.5px', lineHeight: 1.5 }}>{op.summary}</p>
            <p className="mt-xs" style={{ color: '#8FBF9F', fontSize: '12px', lineHeight: 1.5 }}>{op.merits}</p>
            <p className="mt-xxs" style={{ color: '#D89A9A', fontSize: '12px', lineHeight: 1.5 }}>{op.problems}</p>

            {/* A verdict nobody can check is just an assertion. These open the
                exact prompt the model was given and the reply it returned, so a
                reader can judge the verdict rather than take it on trust.
                Disabled until the panel runs against live models. */}
            <div className="ai-panel-card__audit">
              <button type="button" className="ledger-btn ledger-btn--sm" disabled title="Available once the panel runs against live models">
                System prompt
              </button>
              <button type="button" className="ledger-btn ledger-btn--sm" disabled title="Available once the panel runs against live models">
                Model response
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
