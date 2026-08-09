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
- [ ] **Run migration** — connect `SUPABASE_DB_URL` and run `python -m migrate` to apply `001_bill_tracking.sql` to production Supabase
- [x] `ParliamentClient` — async HTTP wrapper for Parliament Bills API + Commons/Lords Votes APIs
- [x] `BillSyncService` — upserts bills and stages from Parliament API; RSS poll every 5 min + nightly full sync
- [x] `DivisionSyncService` — matches Commons/Lords division results to bill stages via title + date search
- [x] `APScheduler` — RSS poll every 5 min, nightly full sync at 02:00
- [x] REST API — `GET /api/v1/bills`, `GET /api/v1/bills/{id}`, `GET /api/v1/bills/{id}/stages`, `POST /admin/sync`