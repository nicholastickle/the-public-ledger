# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# UI Work

Before writing or modifying any UI code, read `DESIGN.md` in full. All colours, typography, spacing, elevation, and component decisions must use the tokens and rules defined there. Do not introduce values that are not derived from the design system.

## Workflow

For every request, create a to-do list at the start and check off each item as it is completed.

After any change to infrastructure (hosting, third-party services, environment variables) or to production/dev dependencies in `package.json`, update both `CLAUDE.md` and `README.md` in the same commit to keep the documentation in sync.

## What this repo is

The Public Ledger — [description TBD]. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Has both a marketing/product frontend and a backend (API routes + database — see Architecture and Backend sections).

## Commands

```bash
npm run dev         # Dev server at localhost:3000
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
npm run type-check  # TypeScript — tsc --noEmit
npm run test        # Full suite — add Vitest + Husky when test infra is wired up
```

## Architecture

App Router + TypeScript throughout. No pages directory.

`src/app/page.tsx` and route `page.tsx` files import components only — no inline JSX. Sections are components under `src/app/components/`. Data is fetched at the page level and passed as props; components never fetch their own data. Push `"use client"` as deep into the tree as possible.

Content and data live in `src/app/data/` — no CMS for content. API routes (`src/app/api/`) handle all backend logic.

`src/app/sitemap.ts` generates the sitemap. After any change that adds, removes, or renames a page or route, check whether it needs updating.

`src/app/llms.txt/route.ts` — add this route when the site is substantive enough to warrant an agent-readable summary.

Theme (dark/light) — not implemented yet. Add a `theme` cookie + server-side read in `src/app/layout.tsx` when needed. DESIGN.md is light-mode only; dark-mode tokens are not defined.

## Design System & Tailwind v4

### How DESIGN.md maps to Tailwind v4

Tailwind v4 is CSS-first: tokens are defined via `@theme` in `globals.css` instead of `tailwind.config.js`. Every `@theme` variable generates a corresponding utility class following these naming conventions:

| `@theme` prefix | Generated utilities | Example |
|---|---|---|
| `--color-*` | `bg-*` `text-*` `border-*` `ring-*` `fill-*` | `--color-ink` → `text-ink`, `bg-ink` |
| `--spacing-*` | `p-*` `m-*` `gap-*` `w-*` `h-*` `inset-*` | `--spacing-lg` → `p-lg`, `gap-lg` |
| `--radius-*` | `rounded-*` | `--radius-md` → `rounded-md` |
| `--text-*` | `text-*` (bundles font-size + line-height + letter-spacing) | `--text-display-xl` → `text-display-xl` |
| `--font-*` | `font-*` | `--font-sans` → `font-sans` |

All DESIGN.md tokens are registered in `globals.css` under `@theme`. Because they are in a standard `@theme` block (not `@theme inline`), they are also emitted as CSS custom properties — use `var(--color-ink)` freely in custom styles.

The font references (`--font-sans`, `--font-mono`) are in a separate `@theme inline` block because they point to Next.js font variables (`var(--font-geist-sans)`) which must stay as variable references, not inlined values.

### Design token → Tailwind class reference

**Colors**
- Text: `text-ink` `text-body` `text-mute` `text-on-primary`
- Backgrounds: `bg-canvas` `bg-canvas-soft` `bg-canvas-soft-2` `bg-primary`
- Borders: `border-hairline` `border-hairline-strong`
- Semantic: `text-link` `text-link-deep` `bg-link-bg-soft` `text-error` `bg-error-soft` `text-warning` `text-success`
- Accent: `text-violet` `text-cyan` `text-highlight-pink`

**Typography** (each class sets font-size + line-height + letter-spacing together)
- `text-display-xl` (48px / 600 / −2.4px) — hero headline
- `text-display-lg` (32px / 600 / −1.28px) — section headline
- `text-display-md` (24px / 600 / −0.96px) — card headline
- `text-display-sm` (20px / 600 / −0.6px) — micro-heading
- `text-body-lg` (18px / 400) — lead paragraph
- `text-body-md` (16px / 400) — default body
- `text-body-sm` (14px / 400 / −0.28px) — secondary body, nav links
- `text-caption` (12px / 400) — small labels
- `text-caption-mono` (12px / 400) — technical eyebrows (use with `font-mono`)
- `text-code` (13px / 400) — code blocks (use with `font-mono`)
- `text-button-lg` (16px / 500) — marketing CTA labels
- `text-button-md` (14px / 500) — nav/compact CTA labels

Font weights are NOT baked into the text utilities — apply `font-semibold` (600), `font-medium` (500), or `font-normal` (400) alongside the size utility where the DESIGN.md specifies a weight.

**Spacing** — applies to `p-*` `m-*` `gap-*` `w-*` `h-*` `inset-*` etc.
`p-xxs` (4px) · `p-xs` (8px) · `p-sm` (12px) · `p-md` (16px) · `p-lg` (24px) · `p-xl` (32px) · `p-2xl` (40px) · `p-3xl` (48px) · `p-4xl` (64px) · `p-5xl` (96px) · `p-6xl` (128px) · `p-section` (192px)

**Border radius**
`rounded-none` · `rounded-xs` (4px) · `rounded-sm` (6px) · `rounded-md` (8px) · `rounded-lg` (12px) · `rounded-xl` (16px) · `rounded-pill-sm` (64px) · `rounded-pill` (100px) · `rounded-full` (9999px)

### Elevation

DESIGN.md defines a stacked-shadow system — multiple small offsets + inset hairline ring, never a single heavy drop-shadow. Use these utility classes defined in `globals.css`:

- `shadow-level-1` — inset hairline only (default card chrome)
- `shadow-level-2` — subtle drop + inset hairline (marketing cards, template cards)
- `shadow-level-3` — soft stack + inset hairline (feature-grid cards)
- `shadow-level-4` — float stack + inset hairline (pricing cards, callout panels)
- `shadow-level-5` — modal shadow + inset hairline (modals, dropdowns)

### The brand gradient

The mesh gradient (develop blue → preview violet/pink → ship coral/amber) is the only decorative chrome. Use it at hero scale only — never miniaturise to a swatch. Implemented as CSS `background: linear-gradient(...)` or an inline SVG. Token values:
- Develop: `#007cf0` → `#00dfd8`
- Preview: `#7928ca` → `#ff0080`
- Ship: `#ff4d4d` → `#f9cb28`

## Custom CSS classes

`globals.css` defines component-level classes — check existing usage before adding buttons or links:

- `.btn-primary` — marketing-scale black pill (`button-primary` in DESIGN.md): `bg-primary`, `text-on-primary`, `rounded-pill`, height 48px
- `.btn-secondary` — marketing-scale white pill (`button-secondary`): `bg-canvas`, `text-ink`, `rounded-pill`, height 48px
- `.btn-primary-sm` — nav/compact-scale black pill (`button-primary-sm`): `bg-primary`, `text-on-primary`, `rounded-pill`, height 28px
- `.btn-secondary-sm` — nav/compact-scale white pill (`button-secondary-sm`): height 28px
- `.link` — inline body-copy link (`link-inline`): `text-link`, underlined, hover deepens to `text-link-deep`

All external links must include `target="_blank"` and `rel="noopener noreferrer"`.

## Backend

API routes live at `src/app/api/`. [Expand this section as the backend is built out — include: database driver/ORM, auth provider, key services, migration workflow, connection pooling notes.]

After any new service, third-party integration, or environment variable is added, update this section and the Infrastructure table.

## UI testing

A Puppeteer MCP server is configured — `puppeteer_navigate`, `puppeteer_screenshot`, and `puppeteer_click` are available in every session.

After any change to a component, page, or global CSS:

1. Ensure the dev server is running (`npm run dev` in the background if not already).
2. Call `puppeteer_navigate` to `http://localhost:3000` (and any affected sub-pages).
3. Call `puppeteer_screenshot` to capture each changed section.
4. Inspect the screenshot for visual regressions before marking the task complete.

## Infrastructure

The site runs on Vercel. Pushing to `main` triggers a production deployment. PR branches get preview deployments automatically.

| Service | Purpose | Key env vars |
|---|---|---|
| Vercel | Hosting + CI/CD | — |

[Expand this table as services are added — mirror the format used in nicholas-tickle CLAUDE.md.]

## Environment variables

When changing `.env`, update `.env.example` in the same commit. When adding new variables, also set them in the Vercel project dashboard.

Add a `.env.example` file with all required variables (values redacted) when the first secrets are added.

## Unit tests

When test infrastructure is added (Vitest recommended — same setup as nicholas-tickle):

- Utilities → `__tests__/utils/`
- Client components → `__tests__/components/`
- API route logic → `__tests__/api/`
- New data collections → integrity checks in `__tests__/data/integrity.test.ts`

Wire Vitest into `npm run test` and add a Husky pre-push hook so tests run on every push.
