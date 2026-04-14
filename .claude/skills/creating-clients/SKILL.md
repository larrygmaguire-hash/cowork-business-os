---
name: creating-clients
description: >
  Create a new client folder with sequential C### ID, standardised structure (Projects/, Communications/, Contracts/), CLAUDE.md operational context, and PRD.md client profile. Use when the user wants to onboard a new client.
---

# Creating Clients

Create a new client folder with a sequential C### ID, CLAUDE.md, and PRD.md (the client profile).

## Step 1: Gather Client Details

Ask these questions one at a time. Wait for each answer before asking the next.

### Operational details (for CLAUDE.md)
1. **Client name** (required)
2. **Engagement type** (retainer / project-based / hourly / other)

### Profile details (for PRD.md)
3. **Industry**
4. **Company size** (headcount, revenue range, market position)
5. **Headquarters location**
6. **Website**
7. **What the company does** (2-3 sentences -- who they serve, what makes them distinct)
8. **Products or services** (list)
9. **Key contacts** (name, role, email, decision-making authority -- ask for at least one, more if available)
10. **Decision-making structure** (who decides what -- budgets, creative direction, sign-offs)
11. **Communication preferences** (channel, response time, tone, cadence, anything to avoid)
12. **Brand voice** (how the client speaks about themselves -- their tone, vocabulary, taglines)
13. **Industry context** (trends, regulatory pressures, competitive moves affecting them)
14. **Things to know** (quirks, sensitivities, important context)
15. **Things to avoid** (topics, tones, references that have caused issues)

If the user does not have answers for some questions, mark `[TBD]` and proceed.

## Step 2: Assign Next C### ID

Read `.claude/state/state.json`:
- Read `nextClientNumber`
- Generate ID: `C` + zero-padded 3-digit number (`C001`, `C002`, ...)

If `nextClientNumber` is missing, count existing entries in `clients` array + 1.

If `clients` array is missing, add it to state.json.

## Step 3: Generate Folder Name

Format: `C### Client Name` in Title Case (e.g., `C001 Acme Corp`).

## Step 4: Create Folder Structure

Create at the workspace root under `Clients/`:

```
Clients/C### Client Name/
├── CLAUDE.md
├── PRD.md
├── Projects/
├── Communications/
└── Contracts/
```

Subfolders do NOT have CLAUDE.md files. Only the top-level client folder does.

## Step 5: Generate CLAUDE.md (operational context only)

Create `Clients/C### Client Name/CLAUDE.md`:

```markdown
# C### Client Name

## Client context

- **ID:** C###
- **Engagement type:** [from Step 1.2]
- **Status:** active
- **Onboarded:** [today's date]

## Files in this folder

- `CLAUDE.md` -- this file. Operational context for Cowork.
- `PRD.md` -- full client profile (company snapshot, products, leadership, communication preferences, brand voice, industry context, things to know). Read this before producing any client-facing work.

## Subfolders

- `Projects/` -- client projects (each numbered P###, registered in state.json)
- `Communications/` -- emails, meeting notes, correspondence
- `Contracts/` -- engagement letters, statements of work, signed agreements

## Client specification

See `PRD.md` for the full client profile.

## Conventions

[Any client-specific naming, formatting, or process rules that override workspace defaults -- e.g., "this client requires all deliverables in PDF, not Word"]
```

## Step 6: Generate PRD.md (the client profile)

Create `Clients/C### Client Name/PRD.md` populated from Step 1 answers (3-15):

```markdown
# C### Client Name -- Profile

## Company snapshot

- **Name:** [Step 1.1]
- **Industry:** [Step 1.3]
- **Size:** [Step 1.4]
- **Headquarters:** [Step 1.5]
- **Website:** [Step 1.6]
- **Engagement type:** [Step 1.2]
- **Onboarded:** [today]

## What they do

[Step 1.7]

## Products and services

| Product / Service | Description |
|-------------------|-------------|
| [From Step 1.8] | [Description] |

## Leadership and key contacts

| Name | Role | Email | Notes |
|------|------|-------|-------|
| [From Step 1.9] | [Role] | [Email] | [Decision-making authority] |

## Decision-making structure

[Step 1.10]

## Communication preferences

[Step 1.11 -- structured as preferred channel, response time, tone, cadence, things to avoid]

## Brand and voice

[Step 1.12 -- their brand, not yours. Match this when producing client-facing content.]

## Industry context

[Step 1.13]

## Things to know

[Step 1.14]

## Things to avoid

[Step 1.15]

## Engagement history

| Date | Activity | Notes |
|------|----------|-------|
| [Today] | Client onboarded | [Initial scope notes] |

## Active projects

See `Projects/` subfolder. Each project has its own P### folder with CLAUDE.md and PRD.md.

## Notes

[Free-form notes that do not fit elsewhere]
```

Present for review using the Review checkpoint:

```
**Review:** Client profile generated for C### Client Name

[Show full PRD.md]

**Options:** Approve / Revise (tell me what to change) / Add detail later
```

If "Add detail later": mark [TBD] sections and proceed.

## Step 7: Update state.json

1. Backup: run `Infrastructure/Scripts/prima/backup-state.sh`
2. Read state.json
3. If `clients` array does not exist, add it. If `nextClientNumber` does not exist, add it.
4. Append to `clients` array:

```json
{
  "id": "C###",
  "name": "[Client name]",
  "folderName": "C### Client Name",
  "industry": "[Step 1.3]",
  "engagementType": "[Step 1.2]",
  "status": "active",
  "created": "[today]",
  "path": "Clients/C### Client Name",
  "contacts": ["Contact 1", "Contact 2"]
}
```

5. Increment `nextClientNumber`
6. Validate: run `Infrastructure/Scripts/prima/validate-state.sh`
7. If validation fails, restore from `.claude/state.backups/`

## Step 8: Optional First Project

Ask: "Create a first project for this client now?"

If yes, invoke the `creating-projects` skill. The new project will live at `Clients/C### Client Name/Projects/P### Project Name/` and the project's state entry will reference the client.

## Step 9: Confirmation

```
**Client created**

- ID: C###
- Folder: Clients/C### Client Name/
- Files: CLAUDE.md, PRD.md
- Subfolders: Projects/, Communications/, Contracts/
- Registered in state.json

**Next steps:**
- Review and refine PRD.md (the client profile)
- Add engagement letter to Contracts/
- Create the first project (or do this later via /creating-projects)
```

## Workflow Notes

- Client IDs (C001, C002, ...) are sequential and never reused
- Project IDs and Client IDs are independent number spaces
- A client can have many projects, each with its own P### ID, all registered in the same `projects` array in state.json
- Subfolders inside the client folder do NOT have CLAUDE.md -- only the client root
- CLAUDE.md is short (operational only). PRD.md is the rich profile that skills read before producing client-facing work.
- When a client engagement ends, change status in state.json to `inactive` (not deleted) and optionally move to `Archive/`
