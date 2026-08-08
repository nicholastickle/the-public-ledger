export type ModelBrand = 'Claude' | 'ChatGPT' | 'Gemini' | 'Grok';

/** Simplified single-colour marks drawn from each vendor's own geometry — the
 *  Claude burst, the OpenAI knot, the Gemini spark, the xAI cross. They are
 *  redrawn rather than the vendors' official assets, so they inherit the panel's
 *  colour and stay legible at 16px; swap in the real marks if the models are
 *  ever surfaced under a licensing arrangement that supplies them. */
const MARKS: Record<ModelBrand, React.ReactNode> = {
  Claude: (
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
      <path d="M12 3.2v17.6M3.2 12h17.6M5.8 5.8l12.4 12.4M18.2 5.8 5.8 18.2" />
    </g>
  ),
  ChatGPT: (
    <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="none">
      <path d="M12 2.6 3.9 7.3v9.4L12 21.4l8.1-4.7V7.3L12 2.6Z" />
      <path d="M12 7.6v4.8l4.1 2.4" strokeLinecap="round" />
    </g>
  ),
  Gemini: (
    <path
      fill="currentColor"
      d="M12 2c0 5.52 4.48 10 10 10-5.52 0-10 4.48-10 10 0-5.52-4.48-10-10-10 5.52 0 10-4.48 10-10Z"
    />
  ),
  Grok: (
    <g fill="currentColor">
      <path d="M4.3 2.4h4.4L20 21.6h-4.4L4.3 2.4Z" />
      <path d="M19.7 2.4h-4.4l-3.2 5.4 2.2 3.7 5.4-9.1ZM8.6 13.1l2.2 3.7-2.9 4.8H3.5l5.1-8.5Z" />
    </g>
  ),
};

interface Props {
  brand: ModelBrand;
  size?: number;
}

export default function ModelLogo({ brand, size = 16 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      {MARKS[brand]}
    </svg>
  );
}
