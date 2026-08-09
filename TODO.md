# TODO

This file is for Claude Code to reference between sessions. It tracks outstanding work, features, and decisions for The Public Ledger.

---

## Identity & Verification

### Accepted Verification Methods (UK)
- [ ] UK Passport (NFC chip read)
- [ ] UK Driving Licence
- [ ] National Insurance + bank account match
- [ ] GOV.UK One Login (government digital ID)

### Verification Flow
- [ ] User downloads app and creates anonymous account (email + password)
- [ ] User is prompted to verify identity to unlock voting
- [ ] Document scan via in-app camera — liveness check + NFC chip read for passports
- [ ] Face match against document photo (biometric liveness detection)
- [ ] Verification status stored as a cryptographic token — platform never stores raw document data
- [ ] Duplicate detection via biometric hash comparison to enforce one verified identity per human

### Architecture
- [ ] Raw biometric and document data processed entirely by the verification provider (Onfido / Yoti)
- [ ] Platform receives only: verified / not verified + a unique cryptographic identifier
- [ ] Cryptographic identifier must be non-reversible — cannot be used to reveal identity
- [ ] Voting records stored separately from identity — votes must not be linkable to a person, even internally
- [ ] Full GDPR Article 9 compliance (special category biometric data)

### Verification Levels
- [ ] **Level 1 — Unverified:** browse and read only
- [ ] **Level 2 — Email verified:** browse, read, set alerts, bookmark
- [ ] **Level 3 — Identity verified:** can vote on national issues

---

## Responsive Design & Native App

- [ ] Plan for an eventual native app (React Native or similar)

---

## Core Features

### Public Vote Engine
- [ ] National government vote scheduled on a regular basis — citizens choose between registered political parties
- [ ] Shadow parliament: citizens vote on the same bills / regulations and motions currently before parliament
- [ ] Live results of parliament votes shown alongside public position
- [ ] Historical archive of all votes with outcome tracking
- [ ] Comparison view: platform result vs. contemporary polling data vs. actual parliamentary vote

### Vote Integrity
- [ ] Votes committed to an append-only, immutable log
- [ ] Blockchain anchoring for a full audit trail
- [ ] Results cannot be deleted or retroactively altered
- [ ] Public audit: vote tallies independently verifiable by anyone

### Anti-Manipulation
- [ ] Anomaly detection: sudden vote surges flagged for review
- [ ] Results hidden until after the user has voted (no social pressure — exit poll model)
- [ ] All vote questions written to a strict neutrality standard

### Government Activity Feed
- [ ] Real-time stream of parliamentary activity
- [ ] Breaking alerts for major votes, emergency legislation, and budget announcements

### Bill & Legislation Tracker
- [x] Database schema — `bills`, `bill_stages`, `bill_stage_sittings`, `parliamentary_divisions` tables (`001_bill_tracking.sql`)
- [x] Migration runner (`backend/migrate.py`) — run before server start; wire as Fly.io `release_command`
- [x] **Run migration** — applied `001`–`004` to the Supabase project provisioned via the Vercel Marketplace integration (currently a test/dev database, not production)
- [x] `ParliamentClient` — async HTTP wrapper for Parliament Bills API + Commons/Lords Votes APIs + Statutory Instruments API
- [x] `BillSyncService` — upserts bills and stages from Parliament API; RSS poll every 5 min + nightly full sync
- [x] `DivisionSyncService` — matches Commons/Lords division results to bill stages via title + date search; now chained into both scheduled jobs, not just the manual admin trigger
- [x] `RegulationSyncService` — syncs statutory instruments; 30 min recent-window poll (no updated-since filter exists on that API)
- [x] `APScheduler` — RSS poll + division sync every 5 min, nightly full sync at 02:00, regulation sync every 30 min
- [x] REST API — bills, regulations, votes (cast/tally/my-votes/gated result), `GET /api/v1/votes/recent` (anonymized, for the live badge feed below)
- [ ] **Frontend live-update polling** — client component that polls `GET /api/v1/votes/recent` on an interval to (a) show a temporary "someone just voted yes/no" badge, and (b) refresh the bill/regulation tables without a manual page reload. Backend side already exists; today the frontend only fetches server-side with a 60s ISR cache, so the page never updates itself while open.
- [ ] **Distinguish "no division called" from "not yet synced"** — `GET /bills/{bill_id}/result` (`backend/api/v1/bills.py:168-172`) silently drops any stage with zero divisions from its response, and `DivisionSyncService` never records anything when its search comes back empty. A bill that passed a stage "on the nod" (no MP forced a vote — common at Second Reading) is currently indistinguishable, in both the API payload and the DB, from a stage whose division just hasn't been synced yet. Add a `checked_no_division` marker (or similar) once the sync has searched a stage's window and found nothing, so the eventual results UI (`ParliamentBillResult` — defined in `frontend/src/app/types/parliament.ts` but not yet consumed anywhere) can show "Parliament agreed without a vote" instead of silently omitting the stage.
- [ ] **Bill sync is dropping bills** — confirmed 2026-08-09: 12 bills from the live current session (40) are missing entirely from the `bills` table, despite most having a `lastUpdate` in July 2026 — well inside the RSS-poll (5 min) + nightly full sync window. Missing IDs: 3094 (High Speed Rail Crewe–Manchester, reintroduced), 3381 (Royal Albert Hall [HL], motion to revive), 3896 (City of London Markets, Report stage), 3897 (Malvern Hills [HL], motion to revive), 4019 (Public Office Accountability, 2nd reading), 4022 (Northern Ireland Troubles, Committee of the whole House), 4030 (Railways Bill, Committee stage), 4035 (Cyber Security and Resilience NIS, Committee stage), 4044 (Cheltenham BC Markets, 3rd reading), 4065 (Armed Forces Bill, Committee stage), 4080 (Representation of the People, Report stage), 4083 (Courts and Tribunals, Report stage). Root cause not yet diagnosed — suspect the RSS feed the 5-min poll relies on doesn't emit events for reintroduced/revived bills or certain Private Bills, and the nightly full sync (`sync_all_active`) isn't backfilling them either. Needs investigation, then a one-off backfill via `sync_single_bill` for the IDs above.
- [ ] **Stale prior-session bills read as still active** — the DB is carrying 54 bills from sessions 39, 37, and 36 that are still flagged `is_act=false, is_defeated=false, bill_withdrawn=null` (i.e. "active" by our current definition), even though they lapsed when Parliament moved on to the current session (40). Parliament's API never marks a lapsed bill as withdrawn, so nothing currently tells our sync to stop counting them. This inflates every "bills currently before Parliament" count that relies on `get_active_bill_ids()` (`backend/services/bill_sync.py:75-85`) or the equivalent frontend logic. Likely fix: scope "active" queries to the current `introduced_session_id` (or explicitly exclude prior sessions once a new one is confirmed underway).