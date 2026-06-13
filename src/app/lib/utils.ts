export function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function formatMarketEnd(isoDate: string): string {
  const diffDays = Math.ceil(
    (new Date(isoDate).getTime() - Date.now()) / 86_400_000,
  );
  if (diffDays <= 0) return 'Ended';
  if (diffDays < 30) return `${diffDays}d left`;
  return `${Math.floor(diffDays / 30)}mo left`;
}

export function formatTimeAgo(isoDate: string): string {
  const diffMin = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}
