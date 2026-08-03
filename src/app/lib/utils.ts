/** Full vote counts with thousands separators — never abbreviated to K/M.
 *  A shadow vote is a count of real people; rounding 10,400 to "10K" hides
 *  400 of them. */
export function formatVotes(n: number): string {
  return n.toLocaleString('en-GB');
}

export function formatBillDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Numeric dd/mm/yyyy — used in dense table cells where the long form won't fit. */
export function formatDateNumeric(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 'TBD';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatTimeAgo(isoDate: string): string {
  const diffMin = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

/** Countdown label for an open vote/annul window. `closedLabel` covers the just-passed-deadline case. */
export function formatCountdown(dateStr: string | null | undefined, closedLabel: string): string {
  if (!dateStr) return 'closes TBD';
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return closedLabel;
  const days = Math.floor(diff / 86_400_000);
  if (days >= 14) {
    const d = new Date(dateStr);
    return `closes ${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`;
  }
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `closes in ${days}d ${hours}h`;
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours > 0) return `closes in ${hours}h`;
  return `closes in ${mins}m`;
}

/** The bill's own page on Parliament's bills service — the canonical record, and
 *  where the full text and every published document for it live. Linking out to
 *  Parliament rather than restating the text keeps the primary source one click
 *  away without this site becoming an intermediary for it. */
export function billSourceUrl(id: number): string {
  return `https://bills.parliament.uk/bills/${id}`;
}

/** The bill's publications index — the drafts, amendment papers and explanatory
 *  notes as published, for a reader who wants the text itself. */
export function billPublicationsUrl(id: number): string {
  return `https://bills.parliament.uk/bills/${id}/publications`;
}

/** Truncates to `n` characters with an ellipsis; returns an em dash for empty input. */
export function clipText(s: string | null, n: number): string {
  if (!s) return '—';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
