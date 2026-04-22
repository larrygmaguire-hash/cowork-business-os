---
description: Create a new client with standardised folder structure and profile
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

Guide the user through creating a properly structured client folder with all necessary documentation.

## Stage 1: Gather Client Information

Collect information **one question at a time**:

1. Client/company name
2. Industry/sector
3. Primary contact name
4. Contact email
5. Contact phone (optional)
6. Website URL (if available)
7. Brief description of the engagement (what they want help with)
8. First meeting date and location (if scheduled)

---

## Stage 2: Company Research (If Website Provided)

If a website URL was provided:

1. Fetch the website using WebFetch
2. Extract:
   - Company description and services
   - Company size/scale indicators
   - Address/location
   - Any relevant credentials or affiliations
   - Team members if listed
3. Present findings to user for confirmation

---

## Stage 3: Folder Creation and PRIMA Registration

### 3a: Create folder structure

This creates:
```
Clients/[Client Name]/
├── Agents/
├── Processes/
├── Skills/
├── Databases/
├── Conversations/
├── Documentation/
├── Deliverables/
├── Archive/
├── CLAUDE.md (project context)
└── Session-Log.md (per `client-session-logs.md` rule — empty scaffold, populated as sessions are delivered)
```

**Session-Log.md scaffold:**
```markdown
# Session Log — [Client Name] ([P###])

[One-line client identifier and a note on session formats — placeholder until first session.]

---

*No sessions delivered yet.*

---

## Session Cadence Summary

| # | Date | Day | Format | Duration | Module/Phase |
|---|------|-----|--------|----------|--------------|

**Total to date:** 0 sessions.
```

### 3b: PRIMA Registration (Pattern G)

If `.claude/state/state.json` exists:

1. Run `${CLAUDE_PLUGIN_ROOT}/scripts/backup-state.sh`
2. Read `.claude/state/state.json` (index)
3. **Check for duplicates** — search all existing projects (including archived) for matching or similar names
4. Generate next project ID from `nextProjectNumber`
5. **Add index entry** to `projects` array in `state.json`:
   ```json
   {
     "id": "{ID}",
     "name": "{Client Name}",
     "status": "in-progress",
     "priority": "medium",
     "category": "client",
     "tags": [],
     "created": "{YYYY-MM-DD}",
     "startDate": "{YYYY-MM-DD}",
     "dueDate": null,
     "lastWorked": "{YYYY-MM-DD}",
     "path": "Clients/{Client Name}",
     "taskCount": 0,
     "tasksDone": 0,
     "tasksBlocked": 0,
     "milestoneCount": 0,
     "milestonesDone": 0
   }
   ```
6. **Create detail file** at `.claude/state/projects/{ID}.json`:
   ```json
   {
     "id": "{ID}",
     "description": "{Brief engagement description from Stage 1}",
     "notes": "",
     "stoppedAt": null,
     "lastAction": "Client created",
     "pausedReason": null,
     "sessionHistory": [],
     "milestones": [],
     "todos": [],
     "recentWork": [],
     "companyName": "{Full company name}",
     "contacts": [{"name": "{contact}", "email": "{email}", "phone": "{phone}"}]
   }
   ```
7. Increment `nextProjectNumber` by 1
8. Run `${CLAUDE_PLUGIN_ROOT}/scripts/validate-state.sh`
9. Confirm: "Registered as {ID} in PRIMA state."

---

## Stage 4: Populate CLAUDE.md

Update `Clients/[Client Name]/CLAUDE.md` with all gathered information. This file serves as both the project context for Claude Code (auto-loaded when working in this folder) and the client reference document.

### Required Sections

```markdown
# [Client Name] ([Trading Name if different])

## Client Information
- **Client Name:** [Full legal name if known]
- **Industry:** [Industry/sector]
- **Contact Person:** [Name]
- **Email:** [email]
- **Phone:** [phone or "TBC"]
- **Website:** [URL or "N/A"]
- **Start Date:** [YYYY-MM-DD]
- **Status:** Active

## Company Profile

### About [Client Name]
[Company description from research or user input]

### Key Metrics
[Size indicators, staff count, revenue, assets under management, etc. — if known]

### Address
[Physical address if known]

### Credentials
[Professional memberships, licences, certifications — if applicable]

## Project Overview
[Description of what they want help with]

## Scope of Work
- Discovery meeting to understand current workflows and pain points
- Identify AI/automation opportunities
- Propose training and/or implementation solutions

## Potential AI Applications
*To be identified during discovery — likely areas:*
- [Industry-specific suggestions based on sector]

## Agents
*None created yet*

## Processes
*To be documented post-discovery*

## Skills
*None created yet*

## Databases
*None created yet*

## Key Files & Resources
- Session Log: `./Session-Log.md` (master record of all sessions delivered)
- Meeting Transcripts: `./Conversations/`

## Notes & Decisions
- **[YYYY-MM-DD]:** Initial contact from [contact name]. [Brief note about engagement]

## Timeline
- **Discovery Meeting:** [Date and location if known, or "TBC"]
- **Proposal:** TBC post-discovery
- **Delivery:** TBC

## Deliverables Tracking
- [ ] Discovery meeting completed
- [ ] Discovery notes documented
- [ ] Proposal prepared
- [ ] Proposal sent
- [ ] Proposal accepted
- [ ] Training/implementation scheduled
- [ ] Delivery completed

## Archive Notes
*(To be completed when project closes)*
```

---

## Stage 5: Industry-Specific Suggestions

Based on the client's industry, suggest potential AI applications:

| Industry | Likely Applications |
|----------|---------------------|
| **Property Management** | Tenant communications, lease analysis, inspection reports, budget reporting, maintenance requests |
| **Construction/QS** | Tender analysis, cost estimation, quantity extraction, BOQ preparation, contract review |
| **Legal** | Contract review, document drafting, research summaries, correspondence |
| **Accounting** | Report generation, data extraction, client communications, compliance checks |
| **Healthcare** | Patient communications, documentation, scheduling, report summarisation |
| **Education** | Content creation, assessment generation, administrative tasks, student feedback |
| **Consulting** | Research synthesis, proposal drafting, client reporting, knowledge management |

Add relevant suggestions to the "Potential AI Applications" section.

---

## Stage 6: Completion

1. **Confirm all files created** with paths
2. **Display summary**:
   - Client name and industry
   - Contact details
   - First meeting (if scheduled)
   - Folder location
3. **Remind user**:
   - Add meeting to calendar if not already there
   - Prepare discovery questions relevant to the industry
   - Review any existing similar client engagements for reference

---

## Quality Standards

- UK English throughout
- All paths absolute
- Date format: YYYY-MM-DD
- Phone format: +353 for Irish numbers
- Client folder naming: Use trading name or abbreviation if commonly used (e.g., "IREM" not "Indigo Real Estate Management")

---

## Error Handling

**Client folder already exists:**
Stop and ask: "Client folder '[Name]' already exists. Open existing folder, choose different name, or cancel?"

**Website unreachable:**
Proceed without research: "Couldn't fetch website. Continuing with provided information."

**Missing required info:**
Don't guess. Ask for the specific missing information.

---

## Post-Creation

Offer: "Would you like me to draft discovery questions for this meeting based on their industry?"
