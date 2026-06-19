---
version: alpha
name: The-Public-Ledger-design-system
description: A Victorian parliamentary ledger aesthetic — parchment paper backgrounds ruled with aged-gold lines, forest-green ink for headings and primary actions, and a Playfair Display serif display face paired with a geometric sans for body and a monospaced face for technical eyebrows. The decoration system is ornamental: gold filigree corners, wax-seal crest, ruled dividers with diamond ornaments. No mesh gradients, no flat black. The ledger is the brand.

colors:
  # ── Victorian ledger palette (primary brand surface) ──────────────
  parchment: "#FAF6ED"
  parchment-dark: "#EDE3C8"
  forest-green: "#1B4332"
  forest-green-2: "#2D6A4F"
  aged-gold: "#B8960C"
  aged-gold-light: "#D4AF37"
  seal-red: "#8B1A1A"
  # ── Neutral utility palette (body text, cards, semantic states) ───
  primary: "#171717"
  on-primary: "#ffffff"
  ink: "#171717"
  body: "#4d4d4d"
  mute: "#888888"
  hairline: "#ebebeb"
  hairline-strong: "#a1a1a1"
  canvas: "#ffffff"
  canvas-soft: "#fafafa"
  canvas-soft-2: "#f5f5f5"
  link: "#0070f3"
  link-deep: "#0761d1"
  link-bg-soft: "#d3e5ff"
  success: "#0070f3"
  error: "#ee0000"
  error-soft: "#f7d4d6"
  error-deep: "#c50000"
  warning: "#f5a623"
  warning-soft: "#ffefcf"
  warning-deep: "#ab570a"
  violet: "#7928ca"
  violet-soft: "#d8ccf1"
  violet-deep: "#4c2889"
  cyan: "#50e3c2"
  cyan-soft: "#aaffec"
  cyan-deep: "#29bc9b"
  highlight-pink: "#ff0080"
  highlight-magenta: "#eb367f"
  selection-bg: "#171717"
  selection-fg: "#f2f2f2"

typography:
  display-xl:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 52px
    letterSpacing: -1.5px
  display-lg:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: -0.8px
  display-md:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: -0.5px
  display-sm:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 26px
    letterSpacing: -0.3px
  body-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.28px
  body-sm-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: -0.28px
  caption:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-mono:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  code:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  button-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill-sm: 64px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  6xl: 128px
  section: 192px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
    padding: "{spacing.sm} {spacing.lg}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"
  nav-cta-signup:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-login:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-ask-ai:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-primary-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  button-secondary-sm:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  tab-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill-sm}"
    padding: "0px {spacing.md}"
  icon-button-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
  card-marketing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-marketing-large:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  template-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-editor-mockup:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  form-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 40px
  form-input-sm:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 32px
  form-input-lg:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 48px
  badge-secondary:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0px {spacing.xs}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  pricing-card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.lg} {spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.4xl} {spacing.lg}"
  feature-mesh-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-light:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.lg}"
  link-inline:
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  banner-marketing:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default tier card. Mirrors pricing-card chrome on canvas-soft surface with a hairline border."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to ink primary with white text and white CTA."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What's Included summary card — repurposed for the brand's GPU / inference / Pro feature tiers."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Subscription summary — line items per add-on (NOT a literal e-commerce cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary as a left-edge indicator bar."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  ex-data-table-cell:
    description: "Mirrors the brand's table chrome. Header uses caption-mono uppercase mono; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption-mono}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.xs} {spacing.sm}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors card-marketing-large chrome with form-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as card-marketing-large with Level 5 modal shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame. Generous padding on canvas-soft."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — flat-cornered card-marketing chrome with Level 4 shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-sm}"

---


## Overview

The Public Ledger is a civic-data platform for UK parliamentary voting. The visual identity evokes a Victorian parliamentary record — parchment paper, forest-green ink, aged-gold ruled lines, and ornate wax seals. This is not a tech-startup aesthetic; it is a deliberate archival register that signals authority, permanence, and civic seriousness.

The surface is warm `{colors.parchment}` (`#FAF6ED`) ruled with faint gold horizontal ledger lines. Forest green (`{colors.forest-green}`) carries every heading, primary CTA, and structural border; aged gold (`{colors.aged-gold}`) carries every decorative element — dividers, filigree corners, eyebrow caps, bill ledger row borders. Sections darken to `{colors.parchment-dark}` for depth.

Type has two voices. **Playfair Display** (serif, weight 700) carries every display headline — the face's ink-trap calligraphy and high contrast evoke historical gazette type. **Geist** (geometric sans) carries body copy, buttons, and all narrative prose. **Geist Mono** handles all technical eyebrows, status badges, mono captions, and the ledger-entry micro-labels — anything that needs to read as a ledger clerk's hand.

Decoration is restrained and purposeful: filigree L-bracket corners, a Union Jack wax seal, gold ornamental diamond dividers, and a crown motif. No mesh gradients. No abstract illustration. The decoration IS the archive.

**Key Characteristics:**
- `{colors.parchment}` (#FAF6ED) is the primary surface — warm, cream, never stark white. `{colors.parchment-dark}` (#EDE3C8) is used for footer and secondary section backgrounds.
- `{colors.forest-green}` (#1B4332) is the primary ink colour for all headings, and the background for `btn-ledger-primary`.
- `{colors.aged-gold}` (#B8960C) is used ONLY for decoration — borders, dividers, eyebrow text, filigree. Never for headings or body copy.
- **Playfair Display** is the display face. Every `h1`–`h3` that surfaces a section headline uses `font-display` (Playfair Display, weight 700). Geist sans never renders at display scale on the marketing surface.
- **Geist Mono** handles every eyebrow, badge, status label, bill entry row, and footer column heading. Mono signals the ledger-clerk, not the code terminal.
- CTA shapes use a shallow `border-radius: 2px` — the sharp-cornered ledger aesthetic, never pill shapes.
- Elevation is expressed through the `ledger-frame` ornate gold border (not drop-shadows). Cards use a semi-transparent white fill over parchment to lift slightly from the background.
- The brand decoration system: filigree corners + wax seal + ruled gold lines + diamond dividers. Treat these as a unified ornamental family — do not mix with modern drop-shadows or gradients.

## Colors

### Victorian Ledger Palette (primary brand surface)

- **Parchment** (`{colors.parchment}` — `#FAF6ED`): The primary page surface — warm cream, like aged writing paper. Used as the hero background, how-it-works section, and any ledger-frame surface. Never substitute with pure white on brand-surface sections.
- **Parchment Dark** (`{colors.parchment-dark}` — `#EDE3C8`): The slightly-deeper parchment tone for footer and secondary section backgrounds.
- **Forest Green** (`{colors.forest-green}` — `#1B4332`): The primary ink colour. All major headings, the `btn-ledger-primary` background, nav links, and structural text. Evokes the green baize of the House of Commons chamber.
- **Forest Green 2** (`{colors.forest-green-2}` — `#2D6A4F`): Hover state for forest-green elements — slightly lighter to show interactivity.
- **Aged Gold** (`{colors.aged-gold}` — `#B8960C`): Decorative only — ledger-ruled lines, filigree borders, ornamental dividers, eyebrow text, bill row borders. Never use for body headings or narrative copy.
- **Aged Gold Light** (`{colors.aged-gold-light}` — `#D4AF37`): The highlight tone of aged gold — used in the wax seal ring, filigree corner diamonds, and decorative high-lights. More saturated / lighter than `aged-gold`.
- **Seal Red** (`{colors.seal-red}` — `#8B1A1A`): The wax-seal colour used in the Union Jack motif and defeated bill status badges.

### Neutral Utility Palette

- **Canvas** (`{colors.canvas}` — `#ffffff`): Pure white. Used for card fill backgrounds (semi-transparent over parchment: `rgba(255,255,255,0.5)`), form inputs, and modal surfaces.
- **Canvas Soft** (`{colors.canvas-soft}` — `#fafafa`): Near-white. Used for hover states inside ledger card rows.
- **Hairline** (`{colors.hairline}` — `#ebebeb`): 1 px dividers on white/canvas surfaces (form inputs, utility card borders).
- **Body text warm** (not a token — use inline `color: #4A3C2A`): The warm dark-brown body text used on parchment surfaces. Warmer than `{colors.ink}` to harmonise with the parchment background.

### Text on Parchment
Body copy on parchment surfaces uses `#4A3C2A` (warm dark brown) rather than `{colors.ink}` (`#171717`) — the cool near-black reads too stark against the warm cream.

### Semantic
- **Error** (`{colors.error}` — `#ee0000`): Validation red. On parchment, pair with `{colors.seal-red}` for destructive badges to stay within the warm palette.
- **Warning** (`{colors.warning}` — `#f5a623`): Caution / pending status. Close to aged gold — use `{colors.aged-gold}` for non-semantic decorative amber and `{colors.warning}` only for semantic status indicators.
- **Link Blue** (`{colors.link}` — `#0070f3`): Inline links on utility surfaces (not on parchment — parchment links should use `{colors.forest-green}` with underline).

### Bill Status Colours
| Status | Colour | Value |
|---|---|---|
| Active | `{colors.aged-gold}` | `#B8960C` |
| Act (passed) | `{colors.forest-green-2}` | `#2D6A4F` |
| Defeated | `{colors.seal-red}` | `#8B1A1A` |
| Withdrawn | `{colors.mute}` | `#888888` |

## Typography

### Font Family
Three faces carry the system:

1. **Playfair Display** (serif, loaded as `var(--font-playfair)`, Tailwind: `font-display`) — the display headline face. All h1–h3 on marketing surfaces. Weight 700. High-contrast calligraphic strokes evoke historical gazette typography. Letter-spacing slightly negative at display sizes. **Never render at weight 400 or below — it must read as authoritative headline text.**
2. **Geist** (geometric sans, `var(--font-geist-sans)`, Tailwind: `font-sans`) — body copy, buttons, CTA labels, paragraph text. Weights 400 / 500 are the working set.
3. **Geist Mono** (monospaced, `var(--font-geist-mono)`, Tailwind: `font-mono`) — all eyebrows, status badges, bill ledger micro-labels, technical captions, footer column headings. Weight 400 / 500. Always uppercase with letter-spacing 0.16–0.22em for the ledger-clerk voice.

### Hierarchy

| Token | Face | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.display-xl}` | Playfair Display | 48px | 700 | 52px | -1.5px | Hero headline (`h1`). Sentence-case. |
| `{typography.display-lg}` | Playfair Display | 32px | 700 | 38px | -0.8px | Section headlines (`h2`). |
| `{typography.display-md}` | Playfair Display | 24px | 700 | 30px | -0.5px | Card / step headings (`h3`). |
| `{typography.display-sm}` | Playfair Display | 20px | 700 | 26px | -0.3px | Inline micro-headings. |
| `{typography.body-lg}` | Geist | 18px | 400 | 28px | 0 | Lead paragraphs under section headlines. |
| `{typography.body-md}` | Geist | 16px | 400 | 24px | 0 | Default body paragraph. |
| `{typography.body-sm}` | Geist | 14px | 400 | 20px | -0.28px | Secondary body, nav-link text. |
| `{typography.caption}` | Geist | 12px | 400 | 16px | 0 | Fine print, badge labels. |
| `{typography.caption-mono}` | Geist Mono | 12px | 400 | 16px | +0.18em | Section eyebrows, ledger row labels — always uppercase. |
| `{typography.code}` | Geist Mono | 13px | 400 | 20px | 0 | Inline code, bill reference IDs. |
| `{typography.button-md}` | Geist | 14px | 500 | 20px | +0.02em | Compact CTA labels (`btn-ledger-*-sm`). |
| `{typography.button-lg}` | Geist | 16px | 500 | 24px | +0.03em | Marketing CTA labels (`btn-ledger-primary`). |

### Principles
- **Playfair Display is the headline voice without exception.** All h1–h3 on parchment surfaces use `font-display`. Never render section headlines in Geist sans.
- **Mono is the ledger-clerk voice.** Eyebrows, bill reference numbers, status labels, and footer column headers use Geist Mono, always uppercase with tracking 0.16–0.22em.
- **Sentence-case headlines.** No all-caps display headings. The Playfair italic is used selectively for emphasis (`<em>on every bill.</em>`).
- **Weight 700 is the Playfair headline weight.** Do not use weight 400 Playfair Display — it reads as editorial body copy, not authoritative headline text.
- **Body warmth.** Body copy on parchment uses `#4A3C2A` not `{colors.ink}` (`#171717`) — the warm brown harmonises with parchment; stark black reads as anachronistic on the warm surface.

## Layout

### Spacing System
- **Base unit**: 4 px. The brand's `--geist-space` token is exactly 4 px and every captured value is a multiple of 4.
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 8 px · `{spacing.sm}` 12 px · `{spacing.md}` 16 px · `{spacing.lg}` 24 px · `{spacing.xl}` 32 px · `{spacing.2xl}` 40 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px · `{spacing.6xl}` 128 px · `{spacing.section}` 192 px.
- **Section padding**: marketing bands use `{spacing.4xl}` to `{spacing.5xl}` top/bottom. Hero bands stretch to `{spacing.section}` to give the mesh gradient room to breathe.
- **Card interior padding**: marketing cards sit at `{spacing.lg}` to `{spacing.xl}`; template-grid cards stay tighter at `{spacing.md}` because they sit in a denser grid.
- **Inline gap**: button rows, nav rows, and chip rows use `{spacing.sm}` to `{spacing.md}` between siblings. The brand's `--geist-gap` is exactly 24 px.

### Grid & Container
- **Max width**: ~1400 px (`--ds-page-width`); the legacy `--geist-page-width` is 1200 px and still appears on some marketing surfaces. Content centres with horizontal gutters of `{spacing.lg}` 24 px on desktop, `{spacing.md}` 16 px on mobile.
- **Column patterns**:
  - Three-feature row: 3-up at desktop, 1-up at mobile (rows like "Web Apps / Composable Commerce / Multi-tenant Platforms").
  - Tab pill row: 5-up centred row of `tab-ghost` pills.
  - Template-grid cluster: 5-up at desktop, scaling to 1-up at mobile.
  - Pricing tier grid: 3-up at desktop with the middle tier polarity-flipped.
  - Logo strip: ~5 logos wide, single row.

### Whitespace Philosophy
The mesh gradient does most of the heavy decorative lifting; whitespace separates the bands. Section spacing is generous — `{spacing.4xl}` to `{spacing.5xl}` between bands lets the gradient breathe. Inside a card, the headline/paragraph stack is tight (`{spacing.xs}` 8 px gap), then a wider gap before the CTA cluster. The page reads as engineered — large gaps + tight interior, never the other way around.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Hero stacks; nav collapses to hamburger; 3-up feature grids drop to 1-up; tab pill row enables horizontal scroll. |
| Tablet | 600–959px | 3-up grids drop to 2-up; nav still horizontal. |
| Desktop | 960–1199px | Full 3-up grids; pricing 3-up. |
| Wide | 1200–1399px | Container caps at 1400 px content width. |
| Ultra-wide | ≥ 1400px | Content stays centred at 1400 px; bands stretch edge-to-edge in colour but content holds the max-width. |

#### Touch Targets
The `button-primary` pill renders at ~32 px tall in nav and ~48 px tall in marketing contexts. Marketing CTAs comfortably meet WCAG AAA at all breakpoints; nav buttons inflate touch area through `{spacing.xs}` padding on mobile to meet the 44 × 44 px floor.

#### Collapsing Strategy
- **Nav**: full link row + Ask AI / Log In / Sign Up pills at desktop. Collapses to logo + hamburger at mobile with the menu opening as a full-overlay.
- **Hero**: mesh gradient stays centred; headline + body stack vertically at all breakpoints (the brand doesn't use a split-hero pattern).
- **Three-feature row**: 3-up → 2-up → 1-up at the breakpoints above; cards keep their `{rounded.md}` 8 px shape across all viewports.
- **Pricing card grid**: 3-up at desktop, vertical stack at mobile with `pricing-card-featured` always sitting in the middle.
- **Template grid**: 5-up → 3-up → 2-up → 1-up. Each `template-card` keeps its 16:9 aspect on the image.

#### Image Behavior
- **Mesh gradient**: rendered as inline SVG or canvas-painted gradient; scales fluidly with the hero container; never crops, never tiles.
- **Customer logos**: rendered as monochrome SVGs in the logo strip; consistent 24 px height.
- **Code editor mockup**: dark `{colors.primary}` rectangle with mono text rendered inside; treated as an image at the layout level.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` card chrome; lazy-loaded; consistent grayscale palette in the placeholder state.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed hero bands and the polarity-flipped dark sections. |
| Level 1 — Inset Hairline | `0 0 0 1px #00000014` inset 1 px border. | Default card chrome — the brand's universal "you can see this card" cue. |
| Level 2 — Subtle Drop | `0px 1px 1px #00000005, 0px 2px 2px #0000000a` plus inset hairline. | Slightly elevated cards (template-grid, marketing-card). |
| Level 3 — Soft Stack | `0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a` plus inset hairline. | The "medium" elevation — feature-grid cards. |
| Level 4 — Float Stack | `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a` plus inset hairline. | "Large" elevation — pricing cards, callout panels. |
| Level 5 — Modal | `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f` plus inset hairline. | Modal / dialog surfaces and dropdown menus. |

The brand uses STACKED shadows — multiple small offsets layered to fake natural light — never a single 8-px-blur generic drop. Inset hairline rings are always added so the card edge stays crisp.

### Decorative Depth
- **Mesh gradient as atmospheric depth**: the hero's multi-stop gradient is the brand's only "atmospheric" effect — applied as a flat 2-D backdrop rather than a 3-D illustration.
- **Polarity-flipped dark band as section-depth**: switching the surface from `{colors.canvas-soft}` to `{colors.primary}` (the deep ink) is the brand's chief depth cue between bands.
- **Inset-shadow + drop-shadow combo**: the cards' combination of an inset 1 px ring and a multi-stop drop produces a "card sits on the page" effect without ever feeling material-heavy.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero / footer bands. |
| `{rounded.xs}` | 4px | Tightest inline pill — the `nav-cta-signup` 6-px-radius button (mapped to `xs/sm`). |
| `{rounded.sm}` | 6px | The brand's `--geist-radius` token — base UI radius for in-app buttons, form inputs, dropdown menus. |
| `{rounded.md}` | 8px | The brand's `--geist-marketing-radius` token — feature cards, template cards. |
| `{rounded.lg}` | 12px | Slightly larger card chrome (pricing-card variants). |
| `{rounded.xl}` | 16px | Largest card chrome — when a card hosts a hero image cap. |
| `{rounded.pill-sm}` | 64px | Tab-ghost pills inside the "AI Apps / Web Apps / Ecommerce / Marketing / Platforms" row. |
| `{rounded.pill}` | 100px | The marketing CTA pill — `button-primary`, `button-secondary`, "Start Deploying" pill. |
| `{rounded.full}` | 9999px | Icon-button circular containers, nav-link ghost pills. |

### Photography Geometry
- **Mesh gradient**: full-bleed 2-D atmospheric backdrop, never cropped to a frame; treated as the page's wallpaper.
- **Customer logos**: monochrome SVG, consistent 24 px height in a flex row.
- **Code editor mockup**: 16:10 dark rectangle, `{rounded.md}` corners.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` chrome.
- **Showcase imagery**: 2:1 or 16:9 inside `{rounded.lg}` to `{rounded.xl}` chrome with a stacked shadow.

## Components

### Buttons

**`button-primary`** — the canonical 100-px-radius black pill, marketing scale.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-lg}`, padding `0px {spacing.sm}` 12 px, shape `{rounded.pill}` 100 px. Renders ~48 px tall when paired with the marketing flex layout.

**`button-secondary`** — the white pill paired with the black primary inside marketing bands.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography + padding as `button-primary`, shape `{rounded.pill}`.

**`button-primary-sm`** — the smaller-scale primary pill used inside nav and pricing-card CTAs.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-md}` (14 px / 500), shape `{rounded.pill}`.

**`button-secondary-sm`** — the smaller-scale white pill paired with `button-primary-sm`.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography + shape as `button-primary-sm`.

**`tab-ghost`** — the centred-row tab pill ("AI Apps / Web Apps / Ecommerce / Marketing / Platforms").
- Background `{colors.canvas}`, text `{colors.ink}`, label set in `{typography.body-sm}`, padding `0px {spacing.md}`, shape `{rounded.pill-sm}` 64 px.

**`icon-button-circular`** — the circular icon container (often a "?" or arrow inside).
- Background `{colors.canvas}`, dark icon, 1 px solid hairline border, shape `{rounded.full}`.

**Nav CTAs:**

**`nav-cta-signup`** — the small black "Sign Up" button in the nav row.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.body-sm-strong}`, padding `0px {spacing.xs}`, height 28 px, shape `{rounded.sm}` 6 px (the brand's `--geist-radius`).

**`nav-cta-login`** — the white "Log In" button in the nav.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography / height / shape as `nav-cta-signup`.

**`nav-cta-ask-ai`** — the small "Ask AI" button with a faint border.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border (extracted as `0px solid rgb(235, 235, 235)`), same typography / height / shape.

### Cards & Containers

**`card-marketing`** — the canonical marketing feature card (3-up section cards).
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px (the `--geist-marketing-radius`). Carries Level 3 soft-stack shadow.

**`card-marketing-large`** — the larger marketing card used for "compute model" / "AI Gateway" callouts.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.lg}` 12 px. Carries Level 4 float-stack shadow.

**`card-soft`** — the soft-tinted card used inside cluster groups (lighter than canvas-soft).
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.md}`.

**`template-card`** — the deploy-template card in the "Deploy your first app" grid.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}` 16 px, shape `{rounded.md}` 8 px. Hosts a 16:9 thumbnail at the top.

**`code-editor-mockup`** — the dark code-preview surface inside marketing bands.
- Background `{colors.primary}`, text `{colors.on-primary}`, body in `{typography.code}` (13 px / Geist Mono), padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px.

**`pricing-card`** — the default pricing-tier card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}` 32 px, shape `{rounded.lg}` 12 px. Inside: tier name in `{typography.display-md}`, price in `{typography.display-xl}`, feature list in `{typography.body-md}` rows, CTA at the bottom.

**`pricing-card-featured`** — the polarity-flipped "Pro" tier card.
- Background `{colors.primary}`, text `{colors.on-primary}`, same shape + padding as `pricing-card`. CTA inverts to `button-secondary-sm` (white pill on black card).

### Inputs & Forms

**`form-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, body in `{typography.body-sm}` (14 px), padding `0px {spacing.sm}`, height 40 px (the brand's `--geist-form-height`), shape `{rounded.sm}` 6 px.

**`form-input-sm`** — small-height variant (32 px tall) for tight forms.
- Same as `form-input` but height 32 px (the `--geist-form-small-height`).

**`form-input-lg`** — large-height variant (48 px tall) for hero CTAs.
- Same as `form-input` but height 48 px (the `--geist-form-large-height`); body in `{typography.body-md}` 16 px.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, height 64 px (the brand's `--header-height`), padding `{spacing.sm} {spacing.lg}`. Layout: logo left, link row centre, "Ask AI / Log In / Sign Up" cluster right.

**`nav-link`** — the centred link row inside `nav-bar`.
- Text `{colors.body}`, set in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}` (ghost pill — visible only on hover or active, but the radius is documented).

**`footer`** — the bottom 4-column nav.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.4xl} {spacing.lg}`. Eyebrow column labels in `{typography.caption-mono}` (uppercase mono effect); link rows in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the white hero with the mesh gradient backdrop.
- Background `{colors.canvas}` (or `{colors.canvas-soft}` on some surfaces), text `{colors.ink}`, padding `{spacing.4xl} {spacing.lg}`. Inside: a small mono badge above the headline, the headline in `{typography.display-xl}` (sentence-case, period-terminated), a body lead in `{typography.body-lg}`, then a CTA row with `button-primary` + `button-secondary`. The mesh gradient sits behind, scaled to occupy roughly the top half of the band.

**`feature-mesh-band`** — the secondary section that hosts a mesh-gradient atmospheric backdrop with feature copy on top.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}`; supporting body in `{typography.body-md}`.

**`showcase-band-light`** — a soft-canvas section ("Deploy your first app in seconds").
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`.

**`showcase-band-dark`** — the polarity-flipped dark band ("A compute model for all workloads").
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}` (white on black). Often contains a `code-editor-mockup` flush with the band.

**`logo-strip`** — the customer-logo wrapping row near the top of the page.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.lg} {spacing.xl}`. Logos rendered as monochrome SVGs at consistent height.

**`badge-secondary`** — the small inline metadata pill ("New", "Beta", "Live").
- Background `{colors.canvas-soft}`, text `{colors.body}`, body in `{typography.caption}`, padding `0px {spacing.xs}`, shape `{rounded.full}`.

**`banner-marketing`** — the "Introducing X" announcement pill at the top of pages.
- Background `{colors.canvas-soft}`, text `{colors.body}`, body in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}`.

**`link-inline`** — body-copy inline links.
- Text `{colors.link}` (`#0070f3`), body in `{typography.body-md}`, underlined.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do's and Don'ts

### Do
- Use **Playfair Display** (`font-display`) for every section headline and card heading on parchment surfaces. It is the non-negotiable headline voice.
- Use `{colors.aged-gold}` (`#B8960C`) exclusively for decoration — borders, dividers, ornamental lines, eyebrow text. Never for narrative headings.
- Use `{colors.forest-green}` (`#1B4332`) as the primary ink for headings, CTA backgrounds, and structural accents. It is the editorial authority colour.
- Set every eyebrow, bill status badge, ledger micro-label, and footer column heading in Geist Mono, uppercase, letter-spacing 0.16–0.22em. Mono signals the ledger voice.
- Use `border-radius: 2px` for all CTA buttons. The sharp-cornered ledger aesthetic is deliberate — no pill shapes on this product.
- Keep body copy colour warm (`#4A3C2A`) on parchment surfaces. Never use the stark `{colors.ink}` (`#171717`) against `{colors.parchment}`.
- Cycle section surfaces in `{colors.parchment}` → `{colors.parchment-dark}`. This is the depth cue — light parchment for primary sections, darker parchment for footer and secondary bands.
- Ornamental elements (filigree corners, diamond dividers, wax seal, crown motif) are part of the brand identity. Include them on landmark surfaces (hero, section breaks, footer).

### Don't
- Don't use pill-shaped (100px radius) buttons anywhere — this product uses sharp ledger corners (`border-radius: 2px`).
- Don't render Geist sans at display/headline scale on marketing surfaces. Playfair Display is the exclusive headline face.
- Don't use `{colors.aged-gold}` for body text or headings — it is too low-contrast at body size and belongs only to decorative chrome.
- Don't use mesh gradients or abstract illustration. The decoration system is ornamental (filigree, seals, rules), not painterly.
- Don't introduce new accent colours. The palette is parchment + forest green + aged gold + seal red. Any new colour must justify itself within this four-tone register.
- Don't use Geist Mono at body size in running paragraphs. Mono is the ledger-clerk voice only — eyebrows, status labels, reference IDs.
- Don't render the Union Jack wax seal smaller than 80px — the detail degrades below that size.
- Don't use dark-mode polarity-flipped black bands. The ledger is always warm parchment; the depth cue is parchment → parchment-dark, not light → near-black.
