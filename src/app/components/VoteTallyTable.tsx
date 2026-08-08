import TallyHeader from './TallyHeader';
import { TallyCell, GovTallyCell } from './TallyCell';
import OwnVoteCell from './OwnVoteCell';
import type { Tally } from '../types/votes';
import type { GovVote } from '../lib/mockVotes';

interface Props {
  /** Names the item being voted on, for the vote buttons' accessible labels. */
  title: string;
  /** Which board's timeline the column tooltips should describe. */
  context: 'bill' | 'regulation';
  forLabel: string;
  againstLabel: string;
  isOpen: boolean;
  myVote: 'for' | 'against' | null;
  onVote: (choice: 'for' | 'against') => void;
  publicVote: Tally;
  ai: Tally;
  gov: GovVote;
  /** Why the vote is shut, where it is. */
  closedNote?: string;
}

/** The same four columns as the board table — public, AI panel, Parliament, and
 *  the citizen's own vote — rendered for a single item. Deliberately the same
 *  icons, thumbs and tooltips as the board: someone who has learned to read a
 *  row there should not have to learn a second layout here.
 *
 *  Column order matches the board exactly, so the two surfaces can be scanned
 *  the same way. */
export default function VoteTallyTable({
  title,
  context,
  forLabel,
  againstLabel,
  isOpen,
  myVote,
  onVote,
  publicVote,
  ai,
  gov,
  closedNote,
}: Props) {
  // While a vote is open and the citizen has not yet cast their own, no tally of
  // any kind is shown — seeing how others are voting first would anchor their
  // decision. Once they vote (or once the window has closed and the result is
  // public record anyway), the tallies open up.
  const revealed = !isOpen || myVote !== null;

  // The citizen's own vote is counted into the public tally the moment they cast
  // it, so the number they are shown includes them.
  const publicDisplay: Tally = {
    for: myVote === 'for' ? publicVote.for + 1 : publicVote.for,
    against: myVote === 'against' ? publicVote.against + 1 : publicVote.against,
  };

  return (
    <div>
      <div className="vote-table__wrap">
        <table className="ledger-table vote-table">
          <caption className="sr-only">
            How the public, the AI panel and Parliament voted on {title}, and your own vote.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="ledger-table__cell--tally" aria-label="Public vote tally">
                <TallyHeader kind="public" context={context} align="left" showLabel />
              </th>
              <th scope="col" className="ledger-table__cell--tally" aria-label="AI vote tally">
                <TallyHeader kind="ai" context={context} showLabel />
              </th>
              <th scope="col" className="ledger-table__cell--tally" aria-label="Government vote tally">
                <TallyHeader kind="government" context={context} showLabel />
              </th>
              {/* Carries an icon like the other three: set as bare text beside
                  three icon-led headers it sits on its own baseline and reads a
                  shade lighter than them. */}
              <th scope="col" className="ledger-table__cell--own" aria-label="Your vote">
                <TallyHeader kind="own" context={context} align="right" showLabel />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ledger-table__cell ledger-table__cell--tally">
                <TallyCell tally={publicDisplay} revealed={revealed} forLabel={forLabel} againstLabel={againstLabel} />
              </td>
              <td className="ledger-table__cell ledger-table__cell--tally">
                <TallyCell tally={ai} revealed={revealed} forLabel={forLabel} againstLabel={againstLabel} />
              </td>
              <td className="ledger-table__cell ledger-table__cell--tally">
                <GovTallyCell gov={gov} revealed={revealed} forLabel={forLabel} againstLabel={againstLabel} />
              </td>
              <td className="ledger-table__cell ledger-table__cell--own">
                <OwnVoteCell
                  title={title}
                  isOpen={isOpen}
                  myVote={myVote ?? undefined}
                  onVote={onVote}
                  forLabel={forLabel}
                  againstLabel={againstLabel}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isOpen && !myVote && (
        <p className="vote-table__prompt font-mono">
          Cast your vote in the last column to unlock the three tallies.
        </p>
      )}
      {!isOpen && closedNote && (
        <p className="vote-table__note font-mono">{closedNote}</p>
      )}
    </div>
  );
}
