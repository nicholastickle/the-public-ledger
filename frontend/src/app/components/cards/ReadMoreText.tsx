'use client';

import { useId, useState } from 'react';

interface Props {
  /** Paragraphs of plain-English explainer copy. The first stands alone — it is
   *  the only one shown before the reader asks for more, so it has to say what
   *  the measure does on its own. */
  paragraphs: string[];
  /** Names the thing being explained, for the toggle's accessible name. */
  label: string;
}

/** The first paragraph in full, the rest clipped behind a fade until asked for.
 *  A modal that opens with four paragraphs of prose above the vote pushes the
 *  vote off the screen; a modal that hides the explanation entirely asks people
 *  to vote on a title. This shows enough to decide whether to read on. */
export default function ReadMoreText({ paragraphs, label }: Props) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();
  const [first, ...rest] = paragraphs;
  const hasMore = rest.length > 0;

  return (
    <div>
      <p className="read-more__para">{first}</p>

      {hasMore && (
        <>
          <div className="read-more__rest" id={bodyId} data-expanded={expanded ? 'true' : 'false'}>
            {rest.map((para, i) => (
              <p key={i} className="read-more__para mt-sm">
                {para}
              </p>
            ))}
            {!expanded && <span className="read-more__fade" aria-hidden="true" />}
          </div>

          <div className="read-more__toggle-row">
            <button
              type="button"
              className="ledger-btn read-more__toggle"
              aria-expanded={expanded}
              aria-controls={bodyId}
              onClick={() => setExpanded(v => !v)}
            >
              {expanded ? 'Read less' : 'Read more'}
              <span className="read-more__chevron" data-expanded={expanded ? 'true' : 'false'} aria-hidden="true">
                ▾
              </span>
              <span className="sr-only"> about {label}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
