import InfoTip from '../ui/InfoTip';

export type TallyKind = 'public' | 'ai' | 'government' | 'own';

const ICONS: Record<TallyKind, React.ReactNode> = {
  // Two figures — the voting public.
  public: (
    <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM9 12.75c-3 0-6 1.5-6 3.75V19h12v-2.5c0-2.25-3-3.75-6-3.75Zm7.5.75c-.62 0-1.2.06-1.73.17 1.02.87 1.73 2.02 1.73 3.33V19H21v-2.25c0-1.86-2.34-3.25-4.5-3.25Z" />
  ),
  // A processor die — the AI panel. Pins on top and bottom only: side pins
  // were dropped because at this icon's rendered size (15px) they blurred
  // into what read as a stray vertical rule between the header columns.
  ai: (
    <path d="M9 2v2H7.5A2.5 2.5 0 0 0 5 6.5v11A2.5 2.5 0 0 0 7.5 20H9v2h2v-2h2v2h2v-2h1.5a2.5 2.5 0 0 0 2.5-2.5V6.5A2.5 2.5 0 0 0 16.5 4H15V2h-2v2h-2V2H9Zm0 7h6v6H9V9Z" />
  ),
  // A crown — Parliament.
  government: (
    <path d="M3 7l3.6 3L12 4l5.4 6L21 7l-1.6 10H4.6L3 7Zm1.6 12h14.8v2H4.6v-2Z" />
  ),
  // A ticked ballot paper — the citizen's own vote.
  own: (
    <path d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm11.3 5.3-5.6 5.6-2.4-2.4-1.6 1.6 4 4 7.2-7.2-1.6-1.6ZM7 17h10v2H7v-2Z" />
  ),
};

export const TALLY_LABELS: Record<TallyKind, string> = {
  public: 'Public vote tally',
  ai: 'AI vote tally',
  government: 'Government vote tally',
  own: 'Your vote',
};

/** Bills and statutory instruments are voted on at different points, so each
 *  board gets its own wording. Every tooltip says both what the tally is and
 *  when that vote is cast, so the three columns can be read against a shared
 *  parliamentary timeline. */
const TOOLTIPS: Record<'bill' | 'regulation', Record<TallyKind, string>> = {
  bill: {
    public:
      'Shadow votes cast by verified members of the public. Voting opens when a bill reaches First Reading and closes at Second Reading, when Parliament divides on it. From Committee Stage onward the public vote is closed and the result stands.',
    ai: 'Verdicts from the four-model AI panel, recorded at First Reading once the bill text is published, and fixed from then on.',
    government:
      'How Parliament itself divided. The decisive division is at Second Reading, on the principle of the bill; Committee and Report Stage divide on individual amendments, and Third Reading on the final text. Until Second Reading, the expected sitting date is shown.',
    own: "Your own shadow vote. Cast it here while the bill is at First or Second Reading and your choice is recorded. If you do not vote before the window closes, this reads 'Did not vote'.",
  },
  regulation: {
    public:
      'Shadow votes cast by verified members of the public. Voting opens when the instrument is laid before Parliament and closes at the parliamentary deadline — the approval vote for an affirmative instrument, or the end of the objection period for a negative one.',
    ai: 'Verdicts from the four-model AI panel, recorded when the instrument is laid and its text published, and fixed from then on.',
    government:
      'How Parliament settled the instrument. An affirmative instrument needs an approving vote in both Houses before it can be made; a negative one becomes law automatically unless either House votes to annul it within the objection period. Until then, the parliamentary deadline is shown.',
    own: "Your own shadow vote. Cast it here while the instrument is before Parliament and your choice is recorded. If you do not vote before the deadline, this reads 'Did not vote'.",
  },
};

/** The one-word column name. Used where the tally stands on its own — in the
 *  detail modal there is no row of bills to give the icon context, so the
 *  column says what it is in words as well. */
export const TALLY_SHORT_LABELS: Record<TallyKind, string> = {
  public: 'Public',
  ai: 'AI',
  government: 'Parliament',
  own: 'Your vote',
};

interface Props {
  kind: TallyKind;
  /** Which board's timeline the tooltip should describe. */
  context?: 'bill' | 'regulation';
  align?: 'left' | 'right';
  /** Shows the column's name beside the icon. Off on the boards, where the
   *  icon alone keeps the tally columns narrow. */
  showLabel?: boolean;
}

/** Icon plus an InfoTip for the three tally columns, matching the text columns.
 *  The written meaning lives in the tooltip and, for assistive tech, in
 *  `sr-only` text on the icon. */
export default function TallyHeader({ kind, context = 'bill', align, showLabel }: Props) {
  return (
    <span className="tally-header">
      <span className="tally-header__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
          {ICONS[kind]}
        </svg>
        {!showLabel && <span className="sr-only">{TALLY_LABELS[kind]}</span>}
      </span>
      {showLabel && <span className="tally-header__label">{TALLY_SHORT_LABELS[kind]}</span>}
      <InfoTip label={TALLY_LABELS[kind]} tip={TOOLTIPS[context][kind]} align={align} />
    </span>
  );
}
