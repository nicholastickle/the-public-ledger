interface Props {
  size?: number;
}

export default function CrownOrnament({ size = 38 }: Props) {
  const scale = size / 38;
  const h = Math.round(30 * scale);
  return (
    <svg width={size} height={h} viewBox="0 0 38 30" fill="none" aria-hidden="true">
      <rect x="2" y="21" width="34" height="7" rx="1" fill="#B8960C" opacity="0.65" />
      <path d="M2 21 L2 9 L11 17 L19 1 L27 17 L36 9 L36 21 Z" fill="#B8960C" opacity="0.6" />
      <path d="M2 21 L2 9 L11 17 L19 1 L27 17 L36 9 L36 21 Z" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
      <rect x="2" y="21" width="34" height="7" rx="1" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
      <circle cx="19" cy="6" r="2.8" fill="#8B1A1A" />
      <circle cx="7" cy="14" r="2" fill="#012169" />
      <circle cx="31" cy="14" r="2" fill="#012169" />
      <circle cx="18" cy="5" r="1" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
