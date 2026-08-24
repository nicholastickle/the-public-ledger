---
version: 2.0
name: The-Public-Ledger-design-system
description: A Victorian parliamentary ledger rendered as a near-black chamber — deep forest-green-black surfaces (`#122019`), gold ruled lines and filigree, and parchment-toned ink for headlines and body copy. Playfair Display carries every headline; Geist Mono carries almost every label, timestamp, and status badge — it is the dominant "voice" of the UI, not a rare accent; Geist carries running prose. Two accent metals exist: gold (`aged-gold`) for the Bill Board and site chrome, bronze/copper for the Regulation Board, switched with `data-board-theme="bronze"`. Warm parchment survives as a light surface in exactly one place — the How It Works modal — everywhere else it is ink, not paper.
---

## Source of truth

This file is the single source of truth for all visual decisions in `frontend/`. Tokens below are registered in `frontend/src/app/globals.css` under `@theme` (colors, spacing, radius, type scale) and in `@layer components`/`@layer utilities` (custom classes, elevation, ornaments). `CLAUDE.md` links here rather than duplicating any of it — if you change a token or a component class, update this file in the same commit.

## Overview

The Public Ledger reads as a parliamentary ledger book at night — a chamber, not a page of paper. The dominant surface across the hero, both vote boards, and the footer is `--color-ledger-bg` (`#122019`), a near-black forest green. Parchment (`#FAF6ED`) is not a background on these surfaces; it's the *ink* — headline and body text rendered in parchment-white and gold over the dark ground. The one exception is the **How It Works modal**, which is a genuinely light, parchment-surfaced panel with ruled gold lines and a forest-green top border — the sole place the "paper ledger" reading is literal rather than atmospheric.

Two accent metals carry the ornamental system: **gold** (`aged-gold` / `aged-gold-light`) is the site's default metal — hero frame, filigree corners, the Bill Board, nav, and footer. **Bronze/copper** (`#c08a4a` family) is a second, narrower palette used only to retheme the Regulation Board, switched via a `data-board-theme="bronze"` attribute that overrides a set of CSS custom properties (`--board-head-bg`, `--board-band-bg`, `--board-ornament`, `--board-bg`). Nothing else in the product uses bronze — it exists specifically to give the two boards a distinguishable identity while keeping the same chrome.

Type has three voices, and their proportions matter: **Playfair Display** (serif, weight 700) is reserved for headline text only — the hero H1 and both board section H2s. **Geist Mono** is not a rare "eyebrow" accent here — it is the dominant voice of the working UI: table headers, stage bands, tally counts, timestamps, nav links, footer headings, and status badges are almost all mono, uppercase, tracked. **Geist** sans carries running prose (footer tagline, modal body copy) and is comparatively rare on the boards.

Decoration is real but narrower in scope than it may first appear: filigree corners and the Union Jack wax seal both belong to the hero only, not to every landmark surface. The boards' ornament is a gold/bronze hairline rule plus a vertical margin ornament (rule, diamond dividers, spine label) that only appears at very wide viewports (≥1680px). The crown mark is the one motif reused across hero nav and footer.

**Key characteristics:**
- `--color-ledger-bg` (`#122019`) is the primary surface for hero, Bill Board, footer. The Regulation Board uses its own near-black, `#1a1612` (bronze theme).
- Parchment (`#FAF6ED`) and aged gold carry headline/body **text** on those dark surfaces — not backgrounds. `--color-parchment` is only a background inside the How It Works modal.
- **Playfair Display**, weight 700, is the exclusive headline face — hero H1, both board H2s. Never used at body scale.
- **Geist Mono**, uppercase, letter-spacing ~0.1–0.22em, is the default label voice across nav, table headers, stage bands, timestamps, and footer headings — far more pervasive than a typical "eyebrow-only" mono usage.
- CTA and card shapes are sharp: `2px` radius on every button that actually ships (`.btn-vote-hero`, `.hero-nav-btn`, `.btn-ledger-*`), `4–8px` on table/card containers. No pill-shaped buttons render on the live site.
- Elevation is bespoke per component (deep, dark, multi-layer box-shadows tuned per surface) rather than a single shared scale — see **Elevation** below.
- Gold is the default ornamental metal everywhere except the Regulation Board, which trades it for bronze via `data-board-theme="bronze"`.

## Colors

### Ledger surface & ink

| Token | Value | Use |
|---|---|---|
| `--color-ledger-bg` | `#122019` | Primary dark surface — hero, Bill Board, footer, and default (`html`/`body`) background. |
| Regulation Board bg | `#1a1612` | The bronze board's own near-black (not a named token — set inline / via `[data-board-theme='bronze']`). |
| `--color-parchment` | `#FAF6ED` | Headline/body **ink** on dark surfaces; the one **background** it fills is the How It Works modal. |
| `--color-parchment-dark` | `#EDE3C8` | Reserved for secondary parchment-surface sections (currently only exercised inside the modal system). |
| `--color-forest-green` | `#1B4332` | Structural accent — modal top border, orphaned light-nav ink (see **Legacy & reserved assets**). |
| `--color-forest-green-2` | `#2D6A4F` | Hover state for forest-green elements. |
| `--color-aged-gold` | `#B8960C` | The default ornamental metal — hairline rules, filigree, eyebrow/label text, board chrome accents. |
| `--color-aged-gold-light` | `#D4AF37` | Higher-key gold — wax-seal rings, "Active" status color, voted-badge accents. |
| `--color-seal-red` | `#8B1A1A` | Wax-seal base color (hero Union Jack seal SVG only). |
| Bronze ornament | `#c08a4a` | `--board-ornament` under `data-board-theme="bronze"` — the Regulation Board's gold-equivalent. |

### Bill / regulation status colors

These are the actual values read from `stageLabel`/`billStatus` in `DepartureBoardSection.tsx` — they are **not** the forest-green/seal-red/mute set implied by the old palette-only mapping, so use these exact values for status chips and glows:

| Status | Color | Value |
|---|---|---|
| Active (vote open) | gold | `#D4AF37` (`aged-gold-light`) |
| Royal Assent / Act | emerald | `#10B981` |
| Defeated | red | `#EF4444` |
| Withdrawn | grey | `#6B7280` |

### Text on dark surfaces

- Headline text: `#FAF6ED` (parchment) via `.ledger-headline`, not `aged-gold` and not the old `ink` (`#171717`) token.
- Body/secondary text on dark: parchment at reduced opacity, e.g. `rgba(250,246,237,0.6–0.68)` for footer copy and nav labels, rather than a flat hex.
- Gold-on-dark label text: `#B8960C`–`#E8C840` range depending on surface (hero nav links use the brighter `#e8c840`; board eyebrows use `#B8960C`).

### Text on parchment (the modal only)

Inside the How It Works modal, body copy uses warm dark brown (`#4A3C2A`) rather than a cool near-black — the only surface where this rule applies, since it's the only place parchment is actually a background.

## Typography

### Font family

Loaded in `frontend/src/app/layout.tsx` via `next/font/google`:

1. **Playfair Display** (`--font-playfair` → Tailwind `font-display`) — headline face only: the hero H1 (`.ledger-headline`) and both board section H2s. Weight 700 exclusively on marketing/landmark surfaces; the modal also sets Playfair inline for its title. Never render body copy in Playfair.
2. **Geist** (`--font-geist-sans` → `font-sans`) — running prose: footer tagline, modal body paragraphs, read-more copy. The body default (`body { font-family: var(--font-sans) }`).
3. **Geist Mono** (`--font-geist-mono` → `font-mono`) — the dominant label voice: table column headers, stage-band labels, tally counts, timestamps/dates, nav links (`.ledger-nav-link`, `.hero-nav-link`), footer column headings, status/voted badges. Uppercase, letter-spacing typically `0.1em`–`0.22em`. Treat mono as the default UI-chrome voice on the boards, not a rare accent reserved for short eyebrows.

### Hierarchy

| Token | Face | Size | Line height | Letter spacing | Use |
|---|---|---|---|---|---|
| `text-display-xl` | Playfair (via `.ledger-headline`, size set inline per-component with `clamp()`) | ~48px+ (hero uses `clamp(2.4rem, 4.6vw, 4.2rem)`) | tight (1.04–1.1) | negative | Hero H1. |
| `text-display-lg` | Playfair / `.ledger-headline` | 32px | 40px | −1.28px | Board section H2s. |
| `text-display-md` | Playfair | 24px | 32px | −0.96px | Card/step headings where used. |
| `text-body-lg` | Geist | 18px | 28px | 0 | Lead paragraphs (modal). |
| `text-body-md` | Geist | 16px | 24px | 0 | Default body prose. |
| `text-body-sm` | Geist | 14px | 20px | −0.28px | Footer links, secondary body. |
| `text-caption` / mono labels | Geist Mono | 11–14px | tight | +0.1em to +0.22em | Table headers, stage bands, nav links, footer headings, status badges, timestamps. |
| `text-code` | Geist Mono | 13px | 20px | 0 | Inline code, reference IDs. |

### Principles

- **Playfair is headline-only, and headline-only means exactly two places today**: the hero H1 and the two board H2s (`.ledger-headline`). Don't reach for it elsewhere without a reason.
- **Mono is the default working voice of the boards** — not an occasional eyebrow. Any new label, timestamp, stage tag, or status chip on a board surface should default to `font-mono`, uppercase, tracked, matching the existing table/nav/footer pattern.
- **Sentence-case Playfair headlines**, weight 700 only — never 400.
- Body copy is parchment-tinted (via opacity) on dark surfaces, and warm brown (`#4A3C2A`) only inside the parchment-background modal.

## Layout

### Spacing tokens

Base unit 4px, defined in `globals.css` `@theme`: `xxs` 4px · `xs` 8px · `sm` 12px · `md` 16px · `lg` 24px · `xl` 32px · `2xl` 40px · `3xl` 48px · `4xl` 64px · `5xl` 96px · `6xl` 128px · `section` 192px. These map to `p-*`/`m-*`/`gap-*`/`w-*`/`h-*` utilities per the Tailwind v4 mapping below.

**Actual section padding in production is tighter than the token names suggest** — don't assume every section reaches for `5xl`/`section`:
- Hero: `py-xl lg:py-3xl` (32px → 48px).
- Bill/Regulation Board: `pt-2xl lg:pt-3xl pb-3xl lg:pb-4xl` (40px/48px top, 48px/64px bottom).
- Footer: `py-4xl` (64px).

### Container widths

Container max-width is **not** uniform across sections — size to the section, not a single global value:
- Hero: `max-w-[1900px]`.
- Bill Board, Regulation Board, Footer: `max-w-[1400px]`.
- How It Works modal: `max-w-[460px]`.

### Breakpoints

The real breakpoint system is Tailwind v4's defaults, used sparingly — no custom `--breakpoint-*` tokens are defined in `globals.css`. In practice the landing page is effectively **two-tier**:

| Prefix | Width | Actual usage |
|---|---|---|
| (base) | < 640px | Mobile: board table gives way to `.ledger-card` stacked cards; hero stacks. |
| `sm:` | ≥ 640px | The primary breakpoint used throughout hero, boards, footer. |
| `lg:` | ≥ 1024px | Secondary breakpoint for padding/grid bumps. |
| `md:` (768px) | — | Effectively unused on the live landing page — don't assume a tablet-specific tier exists unless you add one deliberately. |
| bespoke `@media` | 1680px, 1024px, 639px, 600px | Hand-written pixel breakpoints in `globals.css` for board-margin ornament visibility, table→card fallback, and a couple of legacy component rules. Prefer `sm:`/`lg:` for new work; only add a bespoke pixel breakpoint when a Tailwind tier genuinely doesn't fit. |

### Table → card fallback

Both boards render a `.ledger-table` on wider viewports and swap to a `.board-cards` grid of `.ledger-card` items below `640px` — this is the real responsive strategy for tabular data, not a reflow of the table itself.

## Elevation

There is no single adopted elevation scale in production — `globals.css` defines a `shadow-level-1` through `shadow-level-5` utility set, but it is **unused dead code** (zero references outside its own definition). Real components use bespoke, hand-tuned multi-layer shadows sized to their dark surface:

| Component | Shadow | Use |
|---|---|---|
| `.ledger-table__wrap` | `0 1px 2px rgba(0,0,0,.3), 0 8px 20px -4px rgba(0,0,0,.45), 0 24px 40px -12px rgba(0,0,0,.4)` | Board table container. |
| `.ledger-modal-panel` | `0 24px 64px rgba(0,0,0,.55), inset 0 0 0 1px rgba(184,150,12,.1)` | Bill/regulation detail modal. |
| `.ledger-frame` | `inset 0 0 0 4px rgba(184,150,12,.12), inset 0 0 0 6px rgba(184,150,12,.06), 0 4px 24px rgba(27,67,50,.12), 0 1px 3px rgba(27,67,50,.08)` | Hero gold frame. |
| `.btn-vote-hero` | `inset 0 0 0 3px rgba(184,150,12,.14), 0 12px 34px rgba(0,0,0,.42)` | Hero CTA. |

When adding a new elevated surface, follow this pattern — a small inset gold/hairline ring plus one or two soft dark drops sized to the surface — rather than reaching for `shadow-level-*`, which nothing currently renders.

## Shapes

### Border radius

Tokens (`globals.css` `@theme`): `none` 0 · `xs` 4px · `sm` 6px · `md` 8px · `lg` 12px · `xl` 16px · `pill-sm` 64px · `pill` 100px · `full` 9999px.

**In production, only the sharp end of this scale ships:**
- **2px** — every button that actually renders on the site: `.btn-vote-hero`, `.hero-nav-btn`, `.btn-ledger-primary`/`-secondary` (modal CTAs), `.btn-ledger-primary-sm`/`-secondary-sm`. Treat 2px as the CTA radius for this product.
- **4px** — `.board-card`.
- **8px** — `.ledger-card` (mobile board card), `.ledger-table__wrap`.
- **Pill (`100px`) is a defined token but does not currently back any button a visitor can reach** — see **Legacy & reserved assets**. Don't use it for new CTAs; sharp 2px is the brand.

## Ornamentation

- **Filigree corners** (`FiligreeCorner`) — hero only, all four corners of the `.ledger-frame`. Not currently reused on the boards, footer, or modal.
- **Union Jack wax seal** (`UnionJackSeal`, defined inline in `HeroSection.tsx`) — hero only, rendered once at 82px over the UK nations map. Never render smaller than 80px — the serrated-wax detail degrades below that.
- **Crown ornament** (`CrownOrnament`) — the one motif reused across surfaces: hero nav logo, footer brand lockup, and the reserved `NavBar`.
- **Gold/bronze hairline rules** — a single-pixel gradient rule (`transparent → accent 20% → accent 80% → transparent`) tops the footer and separates board sections; color follows the active board's metal (gold by default, bronze under `data-board-theme="bronze"`).
- **Board margin ornament** (`.board-margin`, `BoardMargin` component) — a vertical rule, diamond dividers, and a spine label filling the flanking gutters beside a board. **Only visible at ≥1680px** — the gutter isn't wide enough below that. Purely decorative, no data dependency.
- **Two-metal system** — gold (`aged-gold`) is default; the Regulation Board switches every ornamental color (head background, band background, ornament accent, board background) to bronze via `data-board-theme="bronze"`, which overrides `--board-head-bg`, `--board-band-bg`, `--board-ornament`, `--board-bg`. This swap is not cosmetic-only — it's how the two boards stay visually distinguishable while sharing identical structure.
- **Sound toggle** (`SoundToggleButton`) — a firework/spark-burst animation (`@keyframes sound-firework`, ~620ms ease-out) on activation, gated behind `prefers-reduced-motion`. Variants: `--light` (hero/nav), `--modal`, `--howitworks`.

## Components

### Buttons

All are sharp `2px` radius. No pill buttons render on the live site (see **Legacy & reserved assets**).

- **`.btn-vote-hero`** — the hero's primary CTA ("Vote Now"). Forest-green background, parchment text, `1.5px` aged-gold border, inset gold ring + heavy dark drop shadow, uppercase, `clamp()`-scaled type. Carries the `voteGlow`/`voteSheen` shimmer animation (motion-reduced users get a static button).
- **`.hero-nav-btn`** (`--ghost` / `--solid` variants) — the hero's in-frame nav CTAs (Log In / Sign Up), dark-theme, 2px radius.
- **`.btn-ledger-primary`** / **`.btn-ledger-secondary`** — forest-green-filled / transparent-with-gold-border CTA pair, used in the How It Works modal.
- **`.btn-ledger-primary-sm`** / **`.btn-ledger-secondary-sm`** — compact (30px) versions for the reserved light `NavBar`.

### Ledger table / board cards

The core content pattern for both the Bill Board and Regulation Board:

- **`.ledger-table`** — one row per bill/regulation (`.ledger-table__row`, 50px tall, hairline top border), horizontally scrollable rather than reflowing on narrow-but-not-mobile widths. Column headers (`thead th`) are mono, uppercase.
- **`.ledger-card`** (inside `.board-cards`) — the < 640px fallback: 8px radius, translucent parchment fill (`rgba(250,246,237,0.035)`), 1px border in the active board's metal color.
- **`.board-card`** — 4px radius variant used for stage/kanban-style groupings; gets a lifted gold treatment (`data-voted="true"`) when the visitor has already voted on that item.
- Status/tally cells (`TallyCell`, `OwnVoteCell`, `TallyHeader`) render the bill-status colors from the **Colors** table above.
- Theme switch: wrap a board in `data-board-theme="bronze"` to retheme it; omit the attribute for the default gold board.

### Navigation

- **`HeroFrameNav`** — the real, live homepage nav, folded into the top of the hero's `.ledger-frame` rather than a separate sticky bar. Dark theme: crown logo + wordmark, mono nav links (`#e8c840`), `.hero-nav-btn` auth CTAs, sound toggle, mobile menu.
- **`NavBar`** (reserved, not currently rendered) — a light, parchment-surfaced sticky bar (`bg-parchment`, forest-green ink, gold hairline border, mono category links) intended for future standalone inner pages (e.g. a dedicated `/bills` route) rather than the homepage. See **Legacy & reserved assets**.

### Footer

Dark `--color-ledger-bg` surface. Gold hairline top rule. Four-column link grid (`.footer-heading` mono uppercase headings, `.footer-link` parchment-at-opacity links that brighten to `aged-gold-light` on hover). An oversized, low-opacity Playfair wordmark (`.footer-watermark`) sits as a full-width sign-off band beneath the content.

### Modals

- **How It Works modal** — the one parchment-**background** surface on the site: `--color-parchment` fill with a repeating gold ruled-line pattern and a 3px forest-green top border. Body copy uses the warm-brown ink rule from **Typography**. Title set in Playfair.
- **`.ledger-modal-panel`** (bill/regulation detail modal) — dark, matches the board's active metal theme via `data-board-theme`.

## Legacy & reserved assets

Not everything defined in `globals.css` or `src/app/components` renders on the live site. Don't copy these as reference for new work without first checking whether they're actually reachable:

- **`NavBar.tsx`** — the light-parchment nav described above. Not imported anywhere currently; reserved for a future standalone page route.
- **`StatsSection.tsx`** — unused, not imported anywhere. Also the only file still using the legacy neutral/pill palette (`bg-primary`, `text-on-primary`).
- **Legacy neutral palette** (`--color-primary` `#171717`, `--color-canvas`, `--color-link` `#0070f3`, etc.) and the pill-button classes (`.btn-primary`, `.btn-secondary`, `.btn-primary-sm`, `.btn-secondary-sm`) — only consumer is the orphaned `StatsSection.tsx`. Don't use these tokens or classes for new ledger UI; they predate the dark-ledger direction.
- **`shadow-level-1`…`shadow-level-5`** utilities — defined, unused. Follow the bespoke per-component pattern in **Elevation** instead.
- **`.hero-atmosphere`** mesh-gradient utility — defined, unused on the current hero (which uses the parliament video + scrim instead).
- **`.kanban-*`**, **`.board-stage-section*`** — a parallel stage-grid/kanban card system defined in CSS; not confirmed wired into the current landing page boards (which render `.ledger-table`). Check current usage before building on these.

If you're removing dead code as part of unrelated work, flag it rather than silently deleting — some of these (`NavBar`, the pill classes) look like they're mid-transition rather than abandoned.

## Do's and don'ts

### Do
- Treat `--color-ledger-bg` (`#122019`) as the default surface for any new landmark section (hero-adjacent, board-adjacent, footer-adjacent). Parchment is ink on these surfaces, not a background.
- Use **Playfair Display** only for true headline text (H1/H2 on landmark sections) — it is rare by design, not the default.
- Default new labels, timestamps, table headers, and status chips to **Geist Mono**, uppercase, tracked — it's the working voice of this UI.
- Use `2px` border-radius on any new CTA button. Use 4–8px on new card/table containers.
- Use the bill-status color table exactly (`#D4AF37` active, `#10B981` Act, `#EF4444` defeated, `#6B7280` withdrawn) — these are read directly from the board logic, not the decorative palette.
- When theming a new board-like surface, follow the `data-board-theme="bronze"` pattern (override `--board-head-bg`/`--board-band-bg`/`--board-ornament`/`--board-bg`) rather than hard-coding a third metal.
- Build new elevated surfaces as an inset gold/hairline ring plus one or two soft dark drop shadows, matching the existing bespoke shadows in **Elevation**.

### Don't
- Don't reach for `--color-parchment` as a page **background** outside the How It Works modal — everywhere else it's text color on a dark ground.
- Don't use pill-shaped (100px radius) buttons — the token exists but nothing that ships uses it; sharp 2px is the brand.
- Don't build on `NavBar.tsx`, `StatsSection.tsx`, the legacy neutral palette, `shadow-level-*`, or `.hero-atmosphere` as if they were the current standard — they're orphaned or unused (see **Legacy & reserved assets**).
- Don't render the Union Jack wax seal below 80px.
- Don't invent a third ornamental metal — gold is default, bronze is the Regulation Board's variant; that's the whole system.
- Don't assume a `md:` (tablet, 768px) tier is meaningfully styled — the live breakpoint system is effectively `sm:`/`lg:` plus a few bespoke pixel breakpoints.

## Tailwind v4 mapping

Tailwind v4 is CSS-first: tokens live in `frontend/src/app/globals.css` under `@theme` rather than `tailwind.config.js`. Every `@theme` variable generates a matching utility class:

| `@theme` prefix | Generated utilities | Example |
|---|---|---|
| `--color-*` | `bg-*` `text-*` `border-*` `ring-*` `fill-*` | `--color-forest-green` → `text-forest-green`, `bg-forest-green` |
| `--spacing-*` | `p-*` `m-*` `gap-*` `w-*` `h-*` `inset-*` | `--spacing-lg` → `p-lg`, `gap-lg` |
| `--radius-*` | `rounded-*` | `--radius-md` → `rounded-md` |
| `--text-*` | `text-*` (bundles font-size + line-height + letter-spacing) | `--text-display-xl` → `text-display-xl` |
| `--font-*` | `font-*` | `--font-display` → `font-display` |

Because color/spacing/radius/text tokens live in a standard `@theme` block (not `@theme inline`), they're also emitted as CSS custom properties — use `var(--color-aged-gold)` freely in inline styles and custom CSS, which is how most of the ledger-specific chrome above is actually written (component classes in `@layer components`, not Tailwind utility strings). The font variables (`--font-sans`, `--font-mono`, `--font-display`) live in a separate `@theme inline` block because they point to Next.js font variables (`var(--font-geist-sans)` etc.) that must stay as references, not be inlined.

### Custom CSS classes reference

`globals.css` defines the component-level classes documented above under `@layer components`/`@layer utilities`. Check this file — and the **Components** and **Legacy & reserved assets** sections above — before adding a new button or link class; a close match usually already exists.

All external links must include `target="_blank"` and `rel="noopener noreferrer"`.
