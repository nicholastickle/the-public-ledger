interface Props {
  /** Names the row being opened, for the button's accessible label. */
  label: string;
  onSelect: () => void;
}

/** The golden chevron at the far right of a board row. Now that the row
 *  itself carries no click handler, this and the title are the only two
 *  ways to open the detail modal from the table. */
export default function TableRowArrow({ label, onSelect }: Props) {
  return (
    <button
      type="button"
      className="ledger-table__arrow-btn"
      aria-label={`Open detail for ${label}`}
      onClick={onSelect}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M5 2.5 11 8l-6 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
