# Ideas

This file captures strategic ideas for The Public Ledger — solutions to known failure modes in prior platforms, and approaches to growing the user base.

---

## Solving the Known Failure Modes

### 1. No Binding Power

The platform cannot legislate, but it can make ignoring the results politically costly.

- **Democratic Gap Score** — publish a per-MP score showing how often they vote against the platform's result in their constituency. Make it embeddable, shareable, and searchable by constituency. Journalists and voters can look up any MP at a glance.
- **The MP Pledge** — invite MPs to publicly sign a pledge committing to vote in line with their constituents' results on specific issues. Track who has signed and who hasn't. Holdouts look like they have something to hide.
- **Start local** — councils have far less party whipping than Parliament. Win a few local councils first, demonstrate the model, then use those case studies to drive national credibility.
- **Time data releases strategically** — around elections, MPs are maximally vulnerable. A democratic gap score released during a campaign cycle has ten times the impact of one released mid-term.

---

### 2. Democratic Fatigue

The root cause is asking too much of people too often. The fix is curation and personalisation.

- **Interest-based filtering** — on sign-up, users pick the issues they care about (NHS, housing, tax, foreign policy, etc.). They only get surfaced votes relevant to their stated interests, with opt-in expansion later.
- **Weekly digest model** — instead of real-time notifications, a weekly "here are the 3 most important votes this week" summary. Low commitment, high signal.
- **Make abstention meaningful** — "I don't know enough to vote" should be a first-class option, not a fallback. It surfaces where the public feels under-informed, which is itself useful data.
- **Prioritise the moments that matter** — Budget Day, major legislation, general elections. Don't give a statutory instrument on agricultural subsidies the same prominence as a vote on NHS funding. Editorial hierarchy matters.

---

### 3. Representation Bias

Verified users will still skew digitally literate, educated, and politically engaged. Make the bias visible, then work to reduce it.

- **Show who is and isn't represented** — every result page should display the demographic breakdown of respondents (age, region, gender) alongside the result. "This result mostly reflects 25–44 year olds in England — here's where we need more voices."
- **Demographically weighted results** — show both the raw result and a version weighted to match the UK's actual census profile. This turns a known weakness into a feature rather than something to hide.
- **Offline onboarding partnerships** — partner with libraries, Citizens Advice, and community centres to run assisted sign-up sessions for people without digital confidence. Onfido and Yoti have in-person verification options.

---

### 4. Security / Blockchain Mismatch

The Voatz lesson: blockchain is an audit log, not a security mechanism. Be precise about what it does.

- **Reframe the claim** — never say "blockchain makes voting secure." Say "all vote tallies are anchored to a public blockchain so they can be independently verified and cannot be altered after the fact." That's true and defensible. Security is a separate layer.
- **Cryptographic commitment scheme** — when a user submits a vote, the device commits to a hash of the vote before transmitting. This prevents a network observer seeing the vote in transit. Publish the commitment on-chain; reveal the vote after the poll closes. Anyone can verify the tally matches the commitments.
- **Annual third-party security audit, published in full** — including the findings. Platforms that suppress audit results lose trust permanently when results leak. Publishing findings and fixes builds more trust than silence.
- **Clear threat model** — publish a plain-English document explaining exactly what the system protects against and what it doesn't. Users who understand the limits are more forgiving of them.

---

### 5. Question Neutrality

Every question is a potential vector for manipulation. Make the drafting process auditable.

- **Use official parliamentary language as the base** for shadow parliament votes — harder to accuse the platform of bias when the question is drawn directly from the bill text, with an AI plain-English translation alongside it.
- **AI bias detection before publishing** — before any question goes live, run it through a structured check for loaded language, false dichotomies, and framing effects. Publish the review output.
- **Community flagging** — let users flag questions they believe are biased, with a public resolution log. A question that gets challenged, reviewed, and kept (with reasoning) is more trustworthy than one that was never questioned.
- **Published editorial standard** — a written charter for how questions are written, reviewed, and approved. The equivalent of a newspaper's editorial guidelines.

---

### 6. Financial Model

No data selling leaves fewer options, but there are clean ones.

- **Donations** — Wikipedia proves this works for civic infrastructure. Users who believe in the platform will fund it.
- **Institutional grants** — the Joseph Rowntree Foundation, Nuffield Foundation, and Nesta all fund UK civic technology. DCMS and Innovate UK have digital democracy remits. Non-trivial money, no data compromise.
- **Aggregate data licensing for research** — universities, think tanks, and political scientists would pay for API access to anonymised, aggregated vote data. This is selling statistical outputs, not personal records.
- **B2B polling infrastructure** — the verified identity layer is hard to build and valuable. Newspapers, charities, and councils could pay to run verified polls on the platform under their own branding. YouGov charges heavily for this; The Public Ledger can undercut them with higher-quality verification.

---

### 7. No Institutional Buy-In

This is the long game. The platform needs to become the default source of verified public opinion.

- **Make the data irresistible to journalists** — build a public API and a press dashboard. If The Guardian, BBC, and Sky News cite platform data in coverage, the government has to respond to it.
- **Partner with academics early** — offer free research access in exchange for published papers. Academic citations confer legitimacy that marketing cannot buy.
- **Position against traditional polling** — YouGov polls ~1,000 unverified respondents. The Public Ledger aims for hundreds of thousands of identity-verified citizens. That's a credibility argument. Lean into it explicitly and publicly.
- **Name the long-term ask** — formal recognition by Parliament as a citizen data source, or a statutory citizens' assembly mechanism, is a 5–10 year goal. Naming it publicly frames everything the platform does as building toward something real.

---

## User Acquisition

### Organic / Content

- **"See how your MP voted vs. you"** — this mechanic is inherently shareable. After a user casts a vote, show them their MP's position on the same question with a one-tap share card. Political outrage is the most viral emotion on UK social media.
- **Constituency leaderboards** — show which constituencies have the highest verified participation. Creates local pride and friendly competition between areas.
- **SEO around political events** — Budget Day, King's Speech, major bills, election cycles. Create indexed result pages for every major vote that rank in search when people are looking for public opinion on a current issue.
- **Build in public** — share platform milestones, vote results, and democratic gap findings openly on social media. The data itself is the content.

### Partnerships

- **TheyWorkForYou / mySociety** — they have an enormous existing audience of civically engaged UK users. A data partnership or cross-promotion is a natural fit.
- **Democracy Club** — non-profit already embedded in UK civic tech. A partnership adds credibility and distribution.
- **Political YouTubers and podcasters** — TLDR News UK, The Rest Is Politics, and similar outlets reach exactly the target demographic. Provide them with early access to vote data as a content source in exchange for mention.
- **Student unions** — universities are full of first-time voters with high political engagement. Partner with student unions to run freshers' week sign-up drives.
- **Trade unions** — large, organised membership bases with strong political opinions. A partnership gives them a verified polling tool; the platform gets bulk verified users.

### PR and Events

- **Announce results on major vote days** — publish the platform's result on Budget Day, the day of a major Commons vote, or the night before a general election. Pitch it to journalists as a counterpoint to official results.
- **The Democratic Gap Report** — publish an annual report ranking every MP by their democratic gap score. This is inherently newsworthy, generates press coverage every year, and drives people to the platform to look up their own MP.
- **Rally and assembly tie-ins** — House of the People is already planning a rally at Parliament in October 2026. Events like this are natural recruitment moments for any platform in this space.

### Product-Led Growth

- **Results gating** — show a teaser of vote results but require sign-up to see the full breakdown (by region, age, party affiliation). The data is the incentive.
- **Referral with purpose** — "Invite a friend to vote — your constituency's result is stronger with more verified voices." Referrals framed as civic duty convert better than discount-based referrals.
- **Open source community** — contributors to the codebase become platform advocates. A healthy GitHub presence and a welcoming contribution process builds a distributed base of people who have personal investment in the platform's success.
- **Email alerts on issues users care about** — "A new vote has opened on NHS funding, which you said you care about." High-relevance notifications drive re-engagement without feeling like spam.

---

## AI Agent Looping Ideas

Ideas for applications that leverage AI agent loops — where an agent runs continuously or cyclically to automate high-volume, time-sensitive, or labour-intensive tasks.

### Perpetual Research & Knowledge Base Building

An agent continuously monitors sources (academic papers, news, forums, competitor sites) and distils findings into a structured, searchable knowledge base. The loop runs indefinitely: discover → read → synthesise → file → repeat.

### Autonomous Blog Generation & SEO Management

An agent identifies trending topics and keyword gaps, writes and publishes posts, monitors rankings, and iterates on underperforming content — all without human intervention.

### Porting Software to Other Languages

An agent takes a codebase in one language and systematically rewrites it in another, running tests after each module to verify correctness, then iterating on failures until the full port is green.

### Data Harvesting & Web Scraping

An agent crawls target sites on a schedule, extracts structured data, deduplicates and validates it, and writes to a database — handling pagination, rate limits, and schema changes automatically.

### Drop Sniping & Shopping Bots

An agent monitors product pages, stock APIs, and release calendars, then executes purchases at the moment inventory appears — sub-second response loops optimised for latency.

### Social Media & Forum Management

An agent monitors mentions, replies to comments, drafts and schedules posts, escalates edge cases to a human, and tracks engagement metrics — running a continuous content and community loop.

### & Much More

The pattern generalises to any domain where the work is repetitive, high-volume, time-sensitive, or too broad for a human to monitor continuously. The agent loop is the primitive; the application layer is unlimited.
