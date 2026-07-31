export function formatVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export function formatBillDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

/** Truncates to `n` characters with an ellipsis; returns an em dash for empty input. */
export function clipText(s: string | null, n: number): string {
  if (!s) return '—';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
