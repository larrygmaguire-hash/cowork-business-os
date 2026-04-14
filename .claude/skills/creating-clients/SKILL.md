---
name: creating-clients
description: >
  Create a new client folder with a sequential C### ID, standardised structure (Projects/, Communications/, Contracts/), and CLAUDE.md with contact information. Use when the user wants to onboard a new client or set up a client folder.
---

# Creating Clients

Create a new client folder with a sequential C### ID and consistent structure.

## Step 1: Gather Client Details

Ask these questions one at a time:

1. **Client name** (required)
2. **Industry** (optional)
3. **Engagement type** (retainer / project-based / hourly / other)
4. **Primary contacts** -- at least one (name, role, email)
5. **Communication preferences** -- preferred channel, response time expectations, tone

## Step 2: Assign Next C### ID

Read `.claude/state/state.json` and find the highest existing C### ID under client tracking. Assign the next sequential number, zero-padded to 3 digits (C001, C002, ..., C099, ..., C999).

If no clients exist yet, start at C001.

If client tracking is not yet present in state.json, add a `clients` array alongside `projects` and a `nextClientNumber` field alongside `nextProjectNumber`.

## Step 3: Generate Folder Name

Format: `C### Client Name` in Title Case (e.g., `C001 Acme Corp`, `C002 Smith Consulting`).

## Step 4: Create Folder Structure

Create the client folder at the workspace root under `Clients/`:

```
Clients/C### Client Name/
├── CLAUDE.md
├── Projects/
├── Communications/
└── Contracts/
```

The subfolders do NOT have CLAUDE.md files. Only the top-level client folder does.

## Step 5: Generate CLAUDE.md

Create `Clients/C### Client Name/CLAUDE.md` with this structure:

```markdown
# C### Client Name

## Client context

- **ID:** C###
- **Name:** [Client name]
- **Industry:** [Industry]
- **Engagement type:** [Retainer / Project-based / Hourly]
- **Status:** active

## Primary contacts

| Name | Role | Email | Notes |
|------|------|-------|-------|
| [Name] | [Role] | [email] | [Notes] |

## Communication preferences

- **Preferred channel:** [Email / Slack / Phone / Other]
- **Response time:** [e.g., within 24 hours]
- **Tone:** [Formal / Friendly / Technical]
- **Cadence:** [e.g., weekly status updates]

## Subfolders

- `Projects/` -- client projects (each numbered P###, registered in state.json)
- `Communications/` -- emails, meeting notes, correspondence
- `Contracts/` -- engagement letters, statements of work, signed agreements

## Engagement history

| Date | Activity | Notes |
|------|----------|-------|
| [Today's date] | Client onboarded | [Initial scope notes] |

## Notes

[Any additional context that does not fit elsewhere]
```

## Step 6: Update state.json

Backup state, then add the client to the `clients` array in state.json:

```json
{
  "id": "C###",
  "name": "Client Name",
  "folderName": "C### Client Name",
  "industry": "...",
  "engagementType": "retainer",
  "status": "active",
  "created": "YYYY-MM-DD",
  "path": "Clients/C### Client Name",
  "contacts": ["Name 1", "Name 2"]
}
```

Increment `nextClientNumber`. Validate state.

## Step 7: Optional First Project

Ask: "Create a first project for this client now?"

If yes, invoke the `creating-projects` skill with the client folder as the location. The new project will live at `Clients/C### Client Name/Projects/P### Project Name/`.

## Step 8: Confirm

Report:

```
**Client created**

- ID: C###
- Folder: Clients/C### Client Name/
- Subfolders: Projects/, Communications/, Contracts/
- CLAUDE.md: populated with contact details
- state.json: updated

What next?
```

## Workflow Notes

- Client IDs (C001, C002, ...) are sequential and never reused
- Project IDs and Client IDs are independent number spaces
- A client can have many projects, each with its own P### ID
- Subfolders inside the client folder do NOT have CLAUDE.md -- only the client root
- When a client engagement ends, change status in state.json to `inactive` (not deleted) and optionally move to `Archive/`
