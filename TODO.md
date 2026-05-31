# TODO

This file is for Claude Code to reference between sessions. It tracks outstanding work, features, and decisions for The Public Ledger.

---

## Data Sources

| Data | Source |
|---|---|
| Parliament members, financial interests, Commons & Lords votes, oral questions, statutory instruments, treaties, bills, written questions, committees | [Parliament API](https://developer.parliament.uk/) |
| MP expenses | IPSA |
| Economic statistics and demographics | ONS |
| Full text of all UK legislation | legislation.gov.uk |
| Health statistics | NHS Digital |
| Crime statistics | Home Office |
| Petition data | UK Parliament Petitions |
| Debate transcripts | Hansard |

---

## Setup & Infrastructure

- [ ] Review the Nicholas Tickle code repo and update this repo to reflect relevant principles and patterns
- [ ] Implement a Puppeteer MCP so Claude Code can inspect and verify UI changes in the browser
- [ ] Introduce ShadCN components into the design system
- [ ] Deploy to Vercel

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

- [ ] Make the web app fully responsive for mobile and tablet
- [ ] Plan for an eventual native app (React Native or similar)

---

## Core Features

### Public Vote Engine
- [ ] National government vote scheduled on a regular basis — citizens choose between registered political parties
- [ ] Shadow parliament: citizens vote on the same bills and motions currently before parliament
- [ ] Social issue votes (e.g. Scottish independence, abortion rights, drug legalisation, trans policy in sports, etc.)
- [ ] Live results of parliament votes shown alongside public position
- [ ] Live-style voting UI and charts, similar in feel to Polymarket
- [ ] Historical archive of all votes with outcome tracking
- [ ] Comparison view: platform result vs. contemporary polling data vs. actual parliamentary vote

### Vote UX
- [ ] Mobile swipe gesture for voting — swipe right to vote for, swipe left to vote against, swipe up to abstain

### Vote Integrity
- [ ] Each verified user receives one cryptographically signed vote token per question
- [ ] Votes committed to an append-only, immutable log
- [ ] Blockchain anchoring for a full audit trail
- [ ] Results cannot be deleted or retroactively altered
- [ ] Public audit: vote tallies independently verifiable by anyone

### Anti-Manipulation
- [ ] Rate limiting per user per day
- [ ] Anomaly detection: sudden vote surges flagged for review
- [ ] Results hidden until after the user has voted (no social pressure — exit poll model)
- [ ] All vote questions written to a strict neutrality standard

### Government Scorecard
- [ ] Full manifesto tracker for the current government — score each item as delivered, in progress, scrapped, or broken
- [ ] Record what was scrapped and what was introduced outside of the manifesto

### Party Manifesto Comparison
- [ ] Public selection of manifesto items across all parties to surface what the public wants most
- [ ] Survey of 30–50 key policy questions that calculates which party the user most aligns with

### Political Affiliation
- [ ] Allow users to anonymously declare their political affiliation
- [ ] Display vote results broken down by stated party affiliation

### Government Activity Feed
- [ ] Real-time stream of parliamentary activity
- [ ] Breaking alerts for major votes, emergency legislation, and budget announcements

### Bill & Legislation Tracker
- [ ] Full lifecycle tracking from First Reading through to Royal Assent or rejection
- [ ] Laws and regulations library

### AI Summaries
- [ ] Plain-English AI summaries of complex bills, regulations, and motions so citizens understand what they are voting on

### Budget Visualiser
- [ ] Show citizens exactly how their taxes are being spent
- [ ] Government spending receipts broken down by department and category
