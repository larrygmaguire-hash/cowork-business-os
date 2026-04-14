---
name: setup
description: >
  First-time workspace setup wizard for Cowork Business OS.
  Use when asked to "set up the workspace", "run setup", or when the
  workspace structure is incomplete. Walks the user through creating folders,
  populating company knowledge, configuring state, and generating the text
  for Profile Preferences and Global Instructions.
  Ask questions one at a time. Do not dump all questions at once.
---

# Workspace Setup Wizard -- Cowork Business OS

This skill walks the user through setting up a Cowork Business OS workspace. It asks questions one at a time and builds the configuration progressively.

## Pre-flight

Before starting:
1. Check if the workspace folder is accessible
2. Check if `.claude/` directory exists (create if not)
3. Read `.claude/state/state.json` to check current state
4. Determine whether this is a fresh setup or a reconfiguration

Present the situation:
```
Workspace: [current folder path]
State version: [version from state.json, or "not found"]
Mode: [Fresh setup / Reconfiguration]
```

Ask: "Ready to proceed?"

---

## Part 1: About You (Profile Preferences)

Ask these questions **one at a time**. Wait for each answer before asking the next.

1. "What is your name?"
2. "What is your role or title?"
3. "Where are you based?"
4. "What do you do professionally? (1-2 sentences)"
5. "Do you use UK English or US English?"
6. "How do you prefer Claude to communicate with you? For example: direct and factual, friendly, formal? Anything to avoid?"

After collecting all answers, generate the Profile Preferences text and present it:

```
Here is your Profile Preferences text. Paste this into Settings > Profile:

---
[Generated text from answers]
---

**Action needed:** Paste the text above into Settings > Profile in the Claude Desktop app.
Tell me when done and I will continue.
```

---

## Part 2: About Your Business (Global Instructions)

Ask these questions **one at a time**:

1. "What is your business or organisation name?"
2. "What does your business do? Who do you serve? (2-3 sentences)"
3. "Do you have multiple brands or roles? If so, list each with a 1-line description."
4. "How should I write on your behalf? (tone, formality, use of evidence, things to avoid)"
5. "Who are your primary audiences? (who they are and what they need from you)"

After collecting all answers, generate the Global Instructions text by combining the user's answers with the fixed sections below. Present the complete text.

**Fixed sections to include in every Global Instructions output:**

```
## Workspace Bootstrap

At the start of every task where the workspace folder is accessible:

1. Read .claude/CLAUDE.md -- this is the master instruction document for the workspace. Follow all rules in it.
2. When working on a specific project folder, also read that project folder's CLAUDE.md if one exists.
3. Before producing any content, communications, or documents, read .claude/company/overview.md and .claude/company/voice.md.

These workspace files are the authoritative source for how to operate. If instructions in these files conflict with anything else, the workspace files take precedence.

## Graduated Autonomy

### Level 1: Auto-Do (Fix Immediately, No Mention)
Obvious errors with a single correct resolution: spelling, grammar, formatting, broken links, naming convention violations.

### Level 2: Auto-Add (Apply Professional Standards, Mention Briefly)
Additions any competent professional would include: language corrections, missing headers, template compliance, standard disclaimers.

### Level 3: Auto-Fix (Unblock Progress, Explain)
Issues blocking the current task: missing folder structure, broken cross-references, untracked projects.

### Level 4: STOP (Ask Before Proceeding)
Changes that alter scope, intent, audience, or commitments: tone changes, client-facing content, financial figures, external communications, deleting files, archiving projects.

When unsure, move up one level. The cost of asking is low.

## Blocked Commands

Require explicit confirmation before execution:
- rm -rf -- confirm path and scope
- sudo -- confirm necessity
- git push --force -- never to main/master
- git reset --hard -- confirm no uncommitted work lost

## Checkpoint Protocol

Multi-step workflows must pause for input using these formats:

Review: After producing output the user needs to approve. Options: Approve / Revise / Reject.
Decision: When multiple valid approaches exist. Present options with tradeoffs.
Action: When the user must do something Claude cannot. State clearly and wait.
```

Present the complete Global Instructions text:

```
Here is your Global Instructions text. Paste this into Settings > Cowork > Edit Global Instructions:

---
[Business identity from answers + fixed operational sections above]
---

**Action needed:** Paste the text above into Settings > Cowork > Edit Global Instructions.
Tell me when done and I will continue.
```

---

## Part 3: Workspace Folders

Create missing directories. Do not overwrite existing ones.

**Always create:**
- `Projects/`, `Archive/`, `Clients/`, `Clients/_Templates/`
- `Documentation/`, `Documentation/Templates/`, `Documentation/Reports/`
- `Infrastructure/`, `Infrastructure/Scripts/`, `Infrastructure/Scripts/prima/`
- `Scripts/`
- `.claude/state/`, `.claude/state/projects/`
- `.claude/company/`, `.claude/config/`, `.claude/docs/`

**Ask about department folders:**
"Which department folders do you need? (answer with numbers, or 'none', or 'all')"
- 01 Finance
- 02 Human Resources
- 03 Sales
- 04 Marketing
- 05 Operations
- 06 Products
- 07 Legal

Create only the ones requested.

---

## Part 4: Configure State

Update `.claude/state/state.json` with the workspace identity from the user's answers:

```json
{
  "version": "2.0.0",
  "workspace": {
    "name": "[Business name from Part 2]",
    "id": "[kebab-case-id from business name]",
    "type": "personal",
    "githubRepo": "[org/repo if known, otherwise empty]",
    "created": "[today's date]"
  },
  "nextProjectNumber": 1,
  "projects": [],
  "sessionHistory": [],
  "recentWork": [],
  "priorities": {
    "immediate": [],
    "thisWeek": [],
    "upcoming": []
  },
  "pendingItems": [],
  "selectedCalendars": []
}
```

---

## Part 5: Company Knowledge Files

For each file in `.claude/company/`, ask the user for content (one at a time):

| File | Question |
|------|----------|
| `overview.md` | "Tell me about your business. What do you do, who do you serve, core value proposition?" |
| `voice.md` | "How should I write on your behalf? Tone, formality, language preferences, things to avoid?" |
| `brand.md` | "Brand colours, fonts, logos, visual identity? Where are assets stored?" |
| `audiences.md` | "Who are your primary and secondary audiences? What do they need from you?" |
| `team.md` | "Key people -- team members, collaborators, contacts?" |
| `industry.md` | "Industry terminology, regulations, context I should know?" |

If the user says "skip", leave the placeholder text in the file.

Write each file as answers are collected. Use this format:

```markdown
# [Topic]

[User's answer, structured with headings and bullet points where appropriate]
```

---

## Part 6: Update Workspace CLAUDE.md

Update `.claude/CLAUDE.md` with the values collected during setup:

- Replace `[Set by /setup]` placeholders in the Workspace Identity section with actual values
- Set the language preference in Content Defaults
- Leave all other sections as they are (they are already correct for v2.0.0)

---

## Part 7: Scheduled Tasks

Present the scheduled task descriptions:

```
Optionally, set up these two scheduled tasks in Cowork:

**Session Briefing (morning):**
"Read .claude/state/state.json. Show projects where status is 'in-progress', ordered by lastWorked descending. For each, show the project name, last worked date, and stoppedAt value from .claude/state/projects/P###.json. Flag any projects with lastWorked older than 7 days. End with priorities and pendingItems from state.json."

**Session Close (evening):**
"Review what was worked on today. For each project touched, read .claude/state/projects/P###.json and update stoppedAt (where work stopped), lastAction (what was completed), and prepend a sessionHistory entry with today's date and a summary. Update .claude/state/state.json with lastWorked dates. Update top-level sessionHistory, recentWork, priorities, and pendingItems. Back up the state directory before writing any changes."

These are optional. You can also just ask Claude to do these things manually at any time.
```

---

## Part 8: Verify and Report

1. Read `.claude/state/state.json` -- confirm version "2.0.0" and workspace identity is populated
2. Confirm `.claude/company/` files exist (even if placeholder)
3. Confirm `.claude/CLAUDE.md` exists
4. List workspace folder structure

Report:

```
## Setup Complete

**Workspace:** [name] at [path]
**Version:** 2.0.0
**Company files:** [list created/skipped]
**Department folders:** [list created]

### Manual steps remaining:
1. [ ] Profile Preferences pasted (Settings > Profile)
2. [ ] Global Instructions pasted (Settings > Cowork)
3. [ ] Scheduled tasks created (optional)

### What you can do now:
- Ask Claude to create a new project
- Ask Claude for a session briefing
- Ask Claude to help with any business task -- it will read your company knowledge files automatically
```
