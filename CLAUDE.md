# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# UI Work

Before writing or modifying any UI code, read `DESIGN.md` in full. All colours, typography, spacing, elevation, and component decisions must use the tokens and rules defined there. Do not introduce values that are not derived from the design system.

## Workflow

For every request, create a to-do list at the start and check off each item as it is completed.

After any change to infrastructure (hosting, third-party services, environment variables) or to production/dev dependencies in `package.json`, update both `CLAUDE.md` and `README.md` in the same commit to keep the documentation in sync.

After completing any task, run the full test suite (`cd frontend && npm run test:run`). If any tests are failing — regardless of whether they are related to the code you just changed — fix them before considering the task done.

## What this repo is

The Public Ledger — a civic shadow-voting platform for UK citizens. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Has both a marketing/product frontend and a backend (API routes + database — see Architecture and Backend sections).

## Commands

### Frontend (Next.js)
```bash
cd frontend
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

Two independently-deployed halves, kept as siblings so it's never ambiguous which side a file belongs to: `frontend/` (Vercel, root directory set to `frontend`) and `backend/` (FastAPI, hosting per the Infrastructure table below).

```
the-public-ledger/
├── frontend/             # Next.js 16 frontend (App Router) — Vercel root directory
│   ├── src/app/
│   │   ├── components/   # UI components, organised by feature section
│   │   ├── data/         # Static content — no CMS
│   │   ├── api/          # Next.js API routes (auth cookies, thin proxies only)
│   │   ├── lib/          # Shared frontend utilities
│   │   └── types/        # TypeScript types
│   ├── __tests__/        # Frontend tests (Vitest)
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   └── utils/
│   └── package.json      # Frontend deps
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
├── CLAUDE.md / README.md / DESIGN.md / TODO.md   # Repo-level docs — not inside either half
└── .husky/               # Git hooks — repo-root-relative; pre-commit `cd`s into frontend/
```

### Frontend conventions

App Router + TypeScript throughout. No pages directory. All frontend paths below are relative to `frontend/`.

`src/app/page.tsx` and route `page.tsx` files import components only — no inline JSX. Sections are components under `src/app/components/`. Data is fetched at the page level and passed as props; components never fetch their own data. Push `"use client"` as deep into the tree as possible.

Static content lives in `src/app/data/` — no CMS. Next.js API routes (`src/app/api/`) are thin: they handle auth cookie management and act as a proxy to the FastAPI backend where needed; they do not contain business logic.

`src/app/sitemap.ts` generates the sitemap. After any change that adds, removes, or renames a page or route, check whether it needs updating.

`src/app/llms.txt/route.ts` — add this route when the site is substantive enough to warrant an agent-readable summary.

The dark, near-black ledger surface (`--color-ledger-bg`) is the site's baseline appearance today — it is not a user-selectable "dark mode." A user-toggleable light/dark theme is not implemented; if one is added, wire it via a `theme` cookie + server-side read in `src/app/layout.tsx`. See `DESIGN.md` for the actual current palette.

### Backend conventions

FastAPI + Python 3.12, async throughout. All business logic lives in `backend/services/` — route handlers in `backend/api/v1/` should be thin: validate the request, call a service method, return the response.

- **Python style:** `async`/`await` throughout; type hints on every function; `logger = logging.getLogger(__name__)` — never `print()`.
- **Pydantic models:** every request body and response shape gets a Pydantic model defined in the relevant `api/v1/` file.
- **Dependency injection:** FastAPI `Depends()` for auth and rate-limiting; services are initialised once in `main.py` startup and stored on `app.state`.
- **Non-blocking writes:** use `asyncio.create_task()` for fire-and-forget DB persistence in the hot path — do not `await` them.
- **Migrations:** numbered SQL files in `backend/migrations/` (e.g. `001_initial_schema.sql`). Migrations run as a dedicated step before the server starts — not in the lifespan handler — to avoid races when multiple instances restart simultaneously. On Fly.io, wire this up as a `release_command`. Next migration number: 006.
- **Admin routes:** require `is_admin=True` on the user row — no middleware flag.
- **Error handling:** `HTTPException` for client errors; `logger.exception()` for unexpected errors; Sentry for production tracking.
- **New API endpoint checklist:** add router file in `api/v1/`, Pydantic models in the same file, register router in `main.py`, add service method in `services/`, add migration if schema changes.

### Database (Supabase / Postgres)

- **Application queries:** Supabase Python SDK (row-level security enforced per user).
- **Migrations:** direct psycopg2 connection via `SUPABASE_DB_URL` (set as a deployment secret, not in `.env`).
- Table naming: snake_case, plural (e.g. `users`, `documents`, `query_logs`).
- Every table needs `created_at TIMESTAMPTZ DEFAULT now()`.
- RLS policies enforce ownership; the service role key (`SUPABASE_SERVICE_ROLE_KEY`) is only used server-side in the FastAPI app — never exposed to the browser.
- **Append-only tables** (e.g. `votes`): give them an `INSERT ... WITH CHECK (auth.uid() = user_id)` and a `SELECT ... USING (auth.uid() = user_id)` policy, and no `UPDATE`/`DELETE` policy at all — RLS defaults to deny, so this makes a row physically impossible to alter or remove once written, not just discouraged by convention. Use this pattern for anything the product principles require to be immutable.
- **Users table:** `profiles`, keyed `id UUID PRIMARY KEY REFERENCES auth.users(id)`, populated automatically by a trigger on `auth.users` insert (see `backend/migrations/004_profiles_and_votes.sql`) — don't hand-manage profile row creation in application code.

## Design System

All design standards — colour, typography, spacing, radius, elevation, ornamentation, component classes, and the Tailwind v4 `@theme` mapping — live entirely in `DESIGN.md`. Read it in full before touching UI code; don't duplicate its tables here. If you change a token or a component class in `globals.css`, update `DESIGN.md` in the same commit.

## Backend

The FastAPI backend lives entirely in `backend/`. Next.js API routes (`frontend/src/app/api/`) are for frontend concerns only (auth cookies, lightweight proxies) — they do not contain business logic.

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

Use Supabase Auth directly — it handles OTP, OAuth, JWTs, and session management out of the box via the Supabase Python SDK. Do not build a custom OTP or session system; call `supabase.auth.*` methods instead. The Next.js API route at `frontend/src/app/api/auth/` sets the session cookie after Supabase issues a JWT; the FastAPI backend verifies it on each request using `dependencies.py`.

### Service layer

Start simple: route handlers can call the Supabase SDK directly for straightforward queries. Extract a service class only when logic is complex enough to warrant it — don't create `services/` files as boilerplate. When a service is needed, wire it via `app.state`:

```python
# services/example.py
class ExampleService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def do_something(self, user_id: str) -> SomeResult:
        ...
```

Services are initialised once in `main.py`'s lifespan and accessed via `request.app.state.example`.

### Streaming responses

Use FastAPI `StreamingResponse` with SSE format (`data: {...}\n\n`) for any long-running operation. Frontend consumes via `ReadableStream` or `EventSource`.

After any new service, third-party integration, or environment variable is added, update this section and the Infrastructure table.

## UI testing

A Puppeteer MCP server is configured in `.mcp.json`. Tools available: `mcp__puppeteer__puppeteer_navigate`, `mcp__puppeteer__puppeteer_screenshot`, `mcp__puppeteer__puppeteer_click`, `mcp__puppeteer__puppeteer_fill`, `mcp__puppeteer__puppeteer_evaluate`.

**Mandatory after any change to a component, page, or global CSS — run 3 full check-and-iterate cycles before marking the task complete.**

### Breakpoints to check on every iteration

| Breakpoint | Viewport width | Label |
|---|---|---|
| Mobile | 375px | `mobile` |
| Tablet | 768px | `tablet` |
| Desktop | 1280px | `desktop` |
| XL Desktop | 1920px | `xl-desktop` |

Use `mcp__puppeteer__puppeteer_evaluate` to resize the viewport before each screenshot:
```js
// example — resize to mobile
page.setViewport({ width: 375, height: 812 })
```

### Iteration loop (repeat 3 times)

1. Start the dev server in the background if not already running: `cd frontend && npm run dev`
2. Wait ~3 seconds for it to be ready, then navigate: `mcp__puppeteer__puppeteer_navigate` → `http://localhost:3000`
3. For **each of the four breakpoints** above, resize the viewport and take a screenshot of every changed section.
4. Inspect all four screenshots — check layout, colours, spacing, and typography against DESIGN.md tokens. Note any issues.
5. Apply fixes, then go back to step 2 and run the next iteration.

Only mark the task complete after all three iterations have been run and the final screenshots pass visual inspection at all four breakpoints.

Chrome for Testing is wired via `PUPPETEER_EXECUTABLE_PATH` in `.mcp.json`. On macOS Apple Silicon the path is `~/.cache/puppeteer/chrome/mac_arm-<version>/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`. Update `.mcp.json` if you install a newer version.

## Infrastructure

Frontend runs on Vercel (pushing to `main` triggers a production deploy; PR branches get previews). Backend runs as a separate service — hosting TBD (Fly.io is the default choice; update this section once decided).

When hosting on Fly.io, run migrations as a release command so they complete before any new instance starts:

```toml
# fly.toml
[deploy]
  release_command = "python -m backend.migrate"
```

| Service | Purpose | Key env vars |
|---|---|---|
| Vercel | Frontend hosting + CI/CD | — |
| Supabase | Postgres database + Auth — provisioned via the Vercel Marketplace integration (`vercel integration add supabase`), which auto-injects env vars into the linked Vercel project | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` (backend-only, used by ad-hoc scripts to sign in a test user), `SUPABASE_DB_URL` (migrations only — deployment secret, not in `.env`; use the non-pooling connection string) |
| FastAPI (backend) | Python API server — APScheduler runs: bill RSS poll + division sync (every 5 min), regulation sync (every 30 min — no RSS-equivalent exists for statutory instruments, see `regulation_sync.py`), nightly full bill + division sync (02:00) | `ENVIRONMENT`, `CORS_ORIGINS` |
| UK Parliament APIs | Bills, stages, Commons/Lords divisions, Statutory Instruments — public REST APIs, no key required | — |

[Expand this table as services are added — include storage, email, analytics once wired up.]

## Environment variables

Each half keeps its own example file, next to the `.env`/`.env.local` it documents — there is no repo-root `.env.example`: `frontend/.env.example` and `backend/.env.example`. When changing either `.env`, update the matching example file in the same commit. When adding new variables, also set them in the Vercel project dashboard (frontend) or the backend's deployment secrets.

## Unit tests

**Every new piece of code must ship with a test.** No exceptions. A utility, a component, an API route, a service method — all get a test file before the work is considered done. Husky runs the full frontend test suite on every `git commit` and blocks the commit if any test fails.

### Frontend (Vitest)

All paths below are relative to `frontend/`.

- `npm run test` — watch mode for development
- `npm run test:run` — single-pass (used by the pre-commit hook, which `cd`s into `frontend/` first)
- Config: `vitest.config.ts` / `vitest.setup.ts`

File placement:
- Utilities → `__tests__/utils/`
- Client components → `__tests__/components/`
- Next.js API route logic → `__tests__/api/`
- New data collections → integrity checks in `__tests__/data/integrity.test.ts`

Test conventions:
- Use `@testing-library/react` for component tests
- Use `@testing-library/jest-dom` matchers (automatically imported via `vitest.setup.ts`)
- Test the public behaviour, not implementation details
- One `describe` block per file, one `it` per behaviour

### Backend (Pytest)

- Route handlers → `backend/tests/api/`
- Service logic → `backend/tests/services/`
- Utilities → `backend/tests/utils/`

Run with `cd backend && python -m pytest tests/ -q`. Add `pytest-asyncio` for async service tests.
