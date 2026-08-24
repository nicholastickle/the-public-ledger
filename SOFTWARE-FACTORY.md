# Software Factory

This document maps the end-to-end flow for taking a change in The Public Ledger from idea to
production — and, longer term, from web-only to a shared web + mobile pipeline. It's a planning
reference, not yet a fully wired pipeline: some stages below (staging environment, dashboard,
mobile) describe target state rather than what exists today. Where a stage is aspirational, it's
marked accordingly.

Two tables follow:

1. **Web factory** — the flow as it applies today, using this repo's actual stack.
2. **Web + mobile factory** — the same flow extended with a mobile track, for when a native/Expo
   app is added alongside the web frontend. Design, spec, version control, and CI/CD structure are
   shared; build and release steps diverge per platform.

---

## 1. Web Factory (current)

| Stage | Description | Tools / Steps |
|---|---|---|
| **Design** | Ideation, feature planning, and UX/UI specs against `DESIGN.md`'s token system (colour, typography, spacing, elevation). AI-assisted brainstorming for feature ideas and copy. | AI tools (e.g. Claude) for brainstorming and drafting; Figma (or equivalent) for mockups; all UI decisions must trace back to a token in `DESIGN.md` — no ad-hoc values. |
| **Specification** | Define user stories, technical requirements, and architecture before code is written. Cross-cutting changes (new tables, new env vars, new services) get a short design note. | Shared doc tool (Notion/Confluence, or a `TODO.md` / issue in this repo for smaller items); architecture decisions that touch `backend/core/config.py`, migrations, or infra get called out explicitly. |
| **Local Development** | Run the full stack locally: Next.js 16 frontend, FastAPI backend, and a local Supabase instance, wired together via Docker Compose. | `docker-compose.yml` (frontend + backend + local Postgres/Supabase); `cd frontend && npm run dev`; `cd backend && python -m uvicorn main:app --reload`; `.env.example` files in each half kept current. *(Docker Compose file not yet present in this repo — target state.)* |
| **Version Control** | All work happens on feature branches off `main`; PRs required before merge. | Git + GitHub; branch-per-feature workflow (`claude/<slug>` / `feature/<slug>`); PR review before merge to `main`. |
| **CI/CD Pipeline** | Automated checks run on every push and PR: lint, type-check, unit tests (frontend + backend), and a build step. On merge to `main`, the frontend deploys automatically via Vercel; backend deploy is triggered separately. | GitHub Actions: `npm run lint`, `npm run type-check`, `npm run test:run` (frontend, Vitest — also enforced locally by the Husky pre-commit hook), `python -m pytest tests/ -q` (backend); Docker image build for the backend; push to Fly.io. |
| **Staging Environment** | Deploy merged changes to an isolated environment with its own database before they reach production, and run integration/E2E tests against it. | Vercel preview deployments (automatic per-PR) cover the frontend today; a dedicated Fly.io staging app + separate Supabase project for the backend is target state, not yet provisioned. |
| **Production Deployment** | Ship the reviewed, tested build to real users, connected to the live Supabase database. | Vercel production deploy (triggered by push to `main`, root directory `frontend`); Fly.io production deploy for the backend, migrations run as a `release_command` (per `CLAUDE.md`) before new instances start; rollback via Fly.io release history / Vercel instant rollback. |
| **Monitoring & Dashboard** | Track performance, deployment health, and errors after release. | Sentry for backend error tracking (already referenced in backend error-handling conventions); Vercel Analytics for frontend; a metrics dashboard (Grafana or similar) is target state — not yet wired up. |

---

## 2. Web + Mobile Factory (target — once a mobile client exists)

Design, specification, version control, and CI/CD *structure* are shared across platforms. Mobile
gets its own build tooling, staging distribution, and release channel, layered onto the same
process rather than replacing it.

| Stage | Description | Tools / Steps (Web) | Tools / Steps (Mobile) |
|---|---|---|---|
| **Design** | Ideation, feature planning, and UX/UI specs, still governed by `DESIGN.md`'s token system as the single source of truth for colour/type/spacing/elevation. | AI tools for brainstorming; Figma for web layouts and component states. | Same AI-assisted ideation; Figma (or Adobe XD) for native layouts — touch targets, platform navigation patterns, safe areas — mapped back to the shared design tokens where they apply. |
| **Specification** | User stories, technical requirements, and architecture, documented before build starts. | Shared doc (Notion/Confluence or in-repo `TODO.md` / issues). | Same document, extended with mobile-specific user journeys (offline behaviour, push notifications, deep links, app-store review constraints). |
| **Local Development** | Run the stack locally against a shared backend/API surface. | Docker Compose: Next.js frontend + FastAPI backend + local Supabase. | React Native (Expo) dev client or simulator, pointed at the same local FastAPI backend/Supabase instance used by web — no separate mobile backend. |
| **Version Control** | Single repo, feature-branch workflow, PR review before merge. | Git + GitHub, feature branches off `main`. | Same repository and workflow; mobile work lives in its own feature branches (e.g. `mobile/<slug>`), reviewed the same way as web PRs. |
| **CI/CD Pipeline** | Automated lint/type-check/test on every push; build artifacts produced per platform. | GitHub Actions: lint, type-check, Vitest, pytest, Docker build, push to Fly.io. | GitHub Actions + Expo Application Services (EAS) or Fastlane: run mobile unit tests, build signed iOS/Android binaries, publish to internal simulators/test devices. |
| **Staging Environment** | Deploy to an isolated environment with its own database for integration testing before production. | Vercel preview deployments per PR; Fly.io staging app + separate Supabase project (target state). | EAS/Fastlane internal distribution builds (TestFlight internal testing / Play Console internal track), or on-device testing against the Fly.io staging backend. |
| **Production Deployment** | Ship to real users on the live database. | Vercel production deploy on merge to `main`; Fly.io production deploy with migrations as a `release_command`; rollback via Fly.io/Vercel. | Submit to App Store / Google Play (or ship an OTA update via Expo for JS-only changes); staged rollout percentage where the store supports it. |
| **Monitoring & Dashboard** | Track performance, deployment health, crashes, and errors post-release. | Sentry (backend) + Vercel Analytics; Grafana for infra/API metrics (target state). | Same Grafana/Sentry stack extended to ingest mobile crash reports and API call metrics from the mobile client, so web and mobile health are visible on one dashboard. |

---

## Notes

- **Shared backbone, not duplicated pipelines.** Both tracks hit the same FastAPI backend and
  Supabase database — mobile does not get its own API. The factory branches only at the
  build/package/distribute stages.
- **Design tokens are the contract.** `DESIGN.md` stays the single source of truth for visual
  decisions; a mobile design pass extends it (native navigation, touch targets) rather than
  forking it.
- **Stages marked "target state"** (Docker Compose file, Fly.io staging environment, Grafana
  dashboard, anything mobile) don't exist in this repo yet. Building them out is tracked in
  `TODO.md` as it happens — update this document alongside any change that lands one of them, per
  the "keep docs in sync" rule in `CLAUDE.md`.
