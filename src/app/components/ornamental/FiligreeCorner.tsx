interface Props {
  size?: number;
  flipH?: boolean;
  flipV?: boolean;
}

export default function FiligreeCorner({ size = 80, flipH = false, flipV = false }: Props) {
  let t = '';
  if (flipH && flipV) t = 'scale(-1,-1) translate(-80,-80)';
  else if (flipH) t = 'scale(-1,1) translate(-80,0)';
  else if (flipV) t = 'scale(1,-1) translate(0,-80)';

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <g transform={t || undefined}>
        <path d="M 4 76 L 4 4 L 76 4" stroke="#B8960C" strokeWidth="2.5" strokeLinecap="square" />
        <path d="M 13 68 L 13 13 L 68 13" stroke="#B8960C" strokeWidth="0.75" opacity="0.35" />
        <path d="M 4 4 m 0 -5 l 5 5 l -5 5 l -5 -5 Z" fill="#D4AF37" />
        <line x1="4" y1="72" x2="15" y2="72" stroke="#B8960C" strokeWidth="2.5" />
        <line x1="4" y1="65" x2="10" y2="65" stroke="#B8960C" strokeWidth="0.75" opacity="0.4" />
        <line x1="72" y1="4" x2="72" y2="15" stroke="#B8960C" strokeWidth="2.5" />
        <line x1="65" y1="4" x2="65" y2="10" stroke="#B8960C" strokeWidth="0.75" opacity="0.4" />
        <path d="M 19 13 Q 13 13 13 19" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="38" cy="4" r="1.5" fill="#D4AF37" opacity="0.5" />
        <circle cx="4" cy="38" r="1.5" fill="#D4AF37" opacity="0.5" />
      </g>
    </svg>
  );
}
