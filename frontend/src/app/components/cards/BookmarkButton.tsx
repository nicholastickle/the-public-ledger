import { useState } from 'react';

interface Props {
  /** Names the item being bookmarked, for the button's accessible label. */
  title: string;
}

/** A citizen's personal marker for a bill or instrument worth coming back to —
 *  purely local to the card, so it never opens the detail modal underneath it. */
export default function BookmarkButton({ title }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <button
      type="button"
      className={`bookmark-btn${bookmarked ? ' bookmark-btn--active' : ''}`}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? `Remove bookmark from ${title}` : `Bookmark ${title}`}
      onClick={e => {
        e.stopPropagation();
        setBookmarked(v => !v);
      }}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path
          d="M6 2.75A1.75 1.75 0 0 1 7.75 1h8.5A1.75 1.75 0 0 1 18 2.75V22l-6-4.29L6 22V2.75Z"
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
