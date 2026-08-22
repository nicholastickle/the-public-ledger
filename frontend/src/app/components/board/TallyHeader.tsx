import InfoTip from '../ui/InfoTip';

export type TallyKind = 'public' | 'ai' | 'government' | 'own';

const ICONS: Record<TallyKind, React.ReactNode> = {
  // Two figures — the voting public.
  public: (
    <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM9 12.75c-3 0-6 1.5-6 3.75V19h12v-2.5c0-2.25-3-3.75-6-3.75Zm7.5.75c-.62 0-1.2.06-1.73.17 1.02.87 1.73 2.02 1.73 3.33V19H21v-2.25c0-1.86-2.34-3.25-4.5-3.25Z" />
  ),
  // A four-point sparkle — the standard "AI" glyph (Gemini, Copilot, etc.),
  // instantly legible at small sizes unlike the processor-die icon it replaced.
  ai: (
    <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" />
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
      'Shadow votes cast by verified members of the public. Voting is open for the whole of a bill\'s passage — from First Reading through to Royal Assent, defeat or withdrawal.',
    ai: 'Verdicts from the four-model AI panel, updated at every stage the bill reaches as it passes through Parliament.',
    government:
      'The division — or the agreement without one, "on the nod" — that most recently progressed the bill to the stage it is at now. A bill still at First Reading has no prior stage to report.',
    own: "Your own shadow vote. Cast it any time the bill remains before Parliament — from First Reading until Royal Assent, defeat or withdrawal. If you never vote, this reads 'Did not vote' once the bill is settled.",
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
        <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden="true">
          {ICONS[kind]}
        </svg>
        {!showLabel && <span className="sr-only">{TALLY_LABELS[kind]}</span>}
      </span>
      {showLabel && <span className="tally-header__label">{TALLY_SHORT_LABELS[kind]}</span>}
      <InfoTip label={TALLY_LABELS[kind]} tip={TOOLTIPS[context][kind]} align={align} />
    </span>
  );
}
