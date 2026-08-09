# The Public Ledger

An unofficial public voting platform for UK citizens — giving the public a direct, transparent voice on government and societal issues.

## What is The Public Ledger?

The Public Ledger is an open platform where British citizens can vote on the issues that matter to them — from government policy to societal concerns. It exists to provide a realistic, data-driven snapshot of what the public actually wants from those in power, without waiting for official polls or elections.

Regular votes are scheduled on a range of topics. As participation grows, the platform aims to reduce the reliance on traditional polling by providing more frequent, direct insight into public opinion.

## Guiding Principles

- **Transparency** — All voting results are recorded on-chain and publicly available
- **Verification** — One verified person, one vote per issue
- **Neutrality** — The platform has no political affiliation or opinion. We show only what the public thinks
- **Privacy** — All voters and votes are anonymous. Identity verification data is never used, sold, or profited on
- **Open Source** — The entire codebase shall be open source to give full transparency on the data processing and scoring engines

## How It Works

- **Scheduled votes** are published on a regular basis covering government and societal topics
- **Your vote is anonymous** — participation is private, results are public
- **All results are recorded on a blockchain**, making them verifiable and tamper-proof
- **The entire codebase is publicly visible** — full transparency, no black boxes

## Who Can Vote?

The Public Ledger is currently available to **UK residents only**.

To participate, you must be a British citizen aged 18 or over, and verify your identity through one of our trusted verification partners. This ensures every vote counts once and counts legitimately.

## The Name

The Public Ledger takes its name from one of the world's longest-running newspapers. Founded in London in 1760 by John Newbery, the original *Public Ledger* published commodity prices alongside political, commercial, and societal news and commentary — making public information freely available at a time when it was tightly controlled. It was London's fourth daily newspaper, born in an era when the press was beginning to find its independence from political patronage.

The original publication eventually folded in the late 20th century, unable to adapt to a changing world. This platform borrows its name and spirit: the idea that public information — including what the public actually thinks — should be open, recorded, and accessible to all.

## Tech Stack

- **Frontend** — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, hosted on Vercel
- **Backend** — FastAPI (Python 3.12), APScheduler for background sync jobs
- **Database** — Supabase (Postgres + Auth), provisioned via the Vercel Marketplace integration
- **Data** — UK Parliament Bills API, Commons Votes API, Lords Votes API, Statutory Instruments API (all public, no key required)

### Running locally

Frontend and backend are separate servers — run each in its own terminal. You'll need `frontend/.env.local` and `backend/.env` set up first; see `frontend/.env.example` and `backend/.env.example` for what's required (both pull from the same Supabase project — `vercel env pull` at the repo root gets you the values).

**Backend** (FastAPI, `localhost:8000`)

```bash
cd backend

# First time only — create the virtualenv and install dependencies
python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Every time — activate the venv, then start the server
source .venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (Next.js, `localhost:3000`)

```bash
cd frontend
npm install   # first time only
npm run dev
```

Visit `http://localhost:3000` — it talks to the backend automatically via `BACKEND_URL` (defaults to `http://localhost:8000`), which in turn reads from the live Supabase database.

**Migrations** — only needed after adding/changing a file in `backend/migrations/`. Requires `SUPABASE_DB_URL`, the direct/non-pooling connection string (not the same one the frontend uses) — get it from `POSTGRES_URL_NON_POOLING` in `vercel env pull`'s output, exported as a real env var rather than kept in `backend/.env`:

```bash
cd backend
export SUPABASE_DB_URL="<POSTGRES_URL_NON_POOLING value>"
python -m migrate
```

## Contributing

Want to help build The Public Ledger? Contributions are welcome — whether that's code, design, ideas, or feedback.

Reach out to get involved.

## Sponsorship

If you believe in what The Public Ledger is trying to do, consider supporting the project financially. See the [sponsorship issue](https://github.com/nicholastickle/the-public-ledger/issues/1) for details on how to help.
