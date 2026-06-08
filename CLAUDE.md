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

### Frontend (Next.js)
```bash
npm run dev         # Dev server at localhost:3000
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
npm run type-check  # TypeScript — tsc --noEmit
npm run test        # Full suite (Vitest + Husky — wire up when test infra is added)
```

### Backend (FastAPI)
```bash
cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
cd backend && python -m pytest tests/ -q
```

## Architecture

### Monorepo layout

```
the-public-ledger/
├── src/app/              # Next.js 16 frontend (App Router)
│   ├── components/       # UI components, organised by feature section
│   ├── data/             # Static content — no CMS
│   ├── api/              # Next.js API routes (auth cookies, thin proxies only)
│   ├── lib/              # Shared frontend utilities
│   └── types/            # TypeScript types
├── backend/              # FastAPI Python backend
│   ├── main.py           # App entry point — registers routers, startup/shutdown
│   ├── core/
│   │   ├── config.py     # Pydantic BaseSettings — all env vars validated here
│   │   └── dependencies.py  # FastAPI Depends() helpers (auth, rate limit)
│   ├── api/
│   │   └── v1/           # Route handlers — one file per resource
│   ├── services/         # Business logic — one class per domain
│   ├── migrations/       # SQL files: 001_description.sql, 002_…, etc.
│   ├── tests/            # Python unit + integration tests
│   └── requirements.txt
├── __tests__/            # Frontend tests (Vitest)
│   ├── api/
│   ├── components/
│   ├── data/
│   └── utils/
└── package.json          # Frontend deps
```

### Frontend conventions

App Router + TypeScript throughout. No pages directory.

`src/app/page.tsx` and route `page.tsx` files import components only — no inline JSX. Sections are components under `src/app/components/`. Data is fetched at the page level and passed as props; components never fetch their own data. Push `"use client"` as deep into the tree as possible.

Static content lives in `src/app/data/` — no CMS. Next.js API routes (`src/app/api/`) are thin: they handle auth cookie management and act as a proxy to the FastAPI backend where needed; they do not contain business logic.

`src/app/sitemap.ts` generates the sitemap. After any change that adds, removes, or renames a page or route, check whether it needs updating.

`src/app/llms.txt/route.ts` — add this route when the site is substantive enough to warrant an agent-readable summary.

Theme (dark/light) — not implemented yet. Add a `theme` cookie + server-side read in `src/app/layout.tsx` when needed. DESIGN.md is light-mode only; dark-mode tokens are not defined.

### Backend conventions

FastAPI + Python 3.12, async throughout. All business logic lives in `backend/services/` — route handlers in `backend/api/v1/` should be thin: validate the request, call a service method, return the response.

- **Python style:** `async`/`await` throughout; type hints on every function; `logger = logging.getLogger(__name__)` — never `print()`.
- **Pydantic models:** every request body and response shape gets a Pydantic model defined in the relevant `api/v1/` file.
- **Dependency injection:** FastAPI `Depends()` for auth and rate-limiting; services are initialised once in `main.py` startup and stored on `app.state`.
- **Non-blocking writes:** use `asyncio.ensure_future()` for fire-and-forget DB persistence in the hot path — do not `await` them.
- **Migrations:** numbered SQL files in `backend/migrations/` (e.g. `001_initial_schema.sql`). Migrations run on startup via `SUPABASE_DB_URL`. Next migration number: 001 until the first one is written.
- **Admin routes:** require `is_admin=True` on the user row — no middleware flag.
- **Error handling:** `HTTPException` for client errors; `logger.exception()` for unexpected errors; Sentry for production tracking.
- **New API endpoint checklist:** add router file in `api/v1/`, Pydantic models in the same file, register router in `main.py`, add service method in `services/`, add migration if schema changes.

### Database (Supabase / Postgres)

- **Application queries:** Supabase Python SDK (row-level security enforced per user).
- **Migrations:** direct psycopg2 connection via `SUPABASE_DB_URL` (set as a deployment secret, not in `.env`).
- Table naming: snake_case, plural (e.g. `users`, `documents`, `query_logs`).
- Every table needs `created_at TIMESTAMPTZ DEFAULT now()`.
- RLS policies enforce ownership; the service role key (`SUPABASE_SERVICE_ROLE_KEY`) is only used server-side in the FastAPI app — never exposed to the browser.

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

The FastAPI backend lives entirely in `backend/`. Next.js API routes (`src/app/api/`) are for frontend concerns only (auth cookies, lightweight proxies) — they do not contain business logic.

### Directory structure

| Path | Purpose |
|---|---|
| `backend/main.py` | FastAPI app factory, lifespan handler, router registration |
| `backend/core/config.py` | `Settings` class (Pydantic BaseSettings) — single source for all env vars |
| `backend/core/dependencies.py` | `get_current_user`, rate-limit `Depends()` helpers |
| `backend/api/v1/` | Route handlers — one file per resource (e.g. `auth.py`, `documents.py`) |
| `backend/services/` | Business logic classes — one file per domain |
| `backend/migrations/` | Numbered SQL files: `001_description.sql`, `002_…` |
| `backend/tests/` | Pytest unit + integration tests |
| `backend/requirements.txt` | Python dependencies |

### Auth

Use Supabase Auth (passwordless email OTP or OAuth) managed via the Supabase Python SDK. Sessions are HTTP-only cookies. CSRF protection: cookie + request header token. JWT fallback for programmatic API clients.

### Service layer pattern (from Anchorbase)

Each service is a class injected via `app.state`:

```python
# services/example.py
class ExampleService:
    def __init__(self, db: DataStore, ...):
        self.db = db

    async def do_something(self, user_email: str) -> SomeResult:
        ...
```

Services are wired together in `main.py`'s lifespan and stored on `app.state`. Route handlers access them via `request.app.state.example`.

### Streaming responses

Use FastAPI `StreamingResponse` with SSE format (`data: {...}\n\n`) for any long-running operation. Frontend consumes via `ReadableStream` or `EventSource`.

After any new service, third-party integration, or environment variable is added, update this section and the Infrastructure table.

## UI testing

A Puppeteer MCP server is configured — `puppeteer_navigate`, `puppeteer_screenshot`, and `puppeteer_click` are available in every session.

After any change to a component, page, or global CSS:

1. Ensure the dev server is running (`npm run dev` in the background if not already).
2. Call `puppeteer_navigate` to `http://localhost:3000` (and any affected sub-pages).
3. Call `puppeteer_screenshot` to capture each changed section.
4. Inspect the screenshot for visual regressions before marking the task complete.

## Infrastructure

Frontend runs on Vercel (pushing to `main` triggers a production deploy; PR branches get previews). Backend runs as a separate service — hosting TBD (Fly.io is the default choice; update this section once decided).

| Service | Purpose | Key env vars |
|---|---|---|
| Vercel | Frontend hosting + CI/CD | — |
| Supabase | Postgres database + Auth | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` (migrations only — deployment secret, not in `.env`) |
| FastAPI (backend) | Python API server | `ENVIRONMENT`, `CORS_ORIGINS` |

[Expand this table as services are added — include auth provider, storage, email, analytics once wired up.]

## Environment variables

When changing `.env`, update `.env.example` in the same commit. When adding new variables, also set them in the Vercel project dashboard.

Add a `.env.example` file with all required variables (values redacted) when the first secrets are added.

## Unit tests

### Frontend (Vitest — same setup as nicholas-tickle)

- Utilities → `__tests__/utils/`
- Client components → `__tests__/components/`
- Next.js API route logic → `__tests__/api/`
- New data collections → integrity checks in `__tests__/data/integrity.test.ts`

Wire Vitest into `npm run test` and add a Husky pre-push hook so tests run on every push.

### Backend (Pytest)

- Route handlers → `backend/tests/api/`
- Service logic → `backend/tests/services/`
- Utilities → `backend/tests/utils/`

Run with `cd backend && python -m pytest tests/ -q`. Add `pytest-asyncio` for async service tests.
