---
name: session-close
description: >
  End-of-session routine that captures what was done, reviews changes, and updates project records. Summarises work, updates project state files, and prepares for session resumption.
---

# Session Close

Capture what was done this session and update project records.

## Step 1: Gather Session Activity

From the current conversation context and any available git information, identify:

1. Which projects were worked on (match conversation topics against project names and IDs)
2. What work was completed this session
3. Files modified or created
4. Any new projects proposed or created
5. Unfinished work or items left pending

Use the conversation history as the primary source for what was accomplished.

## Step 2: Present Session Summary for Review

Generate a checkpoint summary:

```markdown
**Review:** Session Summary

**Projects updated:**
- P### Project Name — [1-line summary of work]
- P### Project Name — [1-line summary of work]
(or: No projects identified)

**New projects created:**
- [Project name] — [brief description]
(or: None)

**Unfinished work:**
- [Item with context for resumption]
(or: None)

**Options:** Approve / Revise / Skip state update
```

**Behaviour:**
- **Approve** — Proceed to write state updates
- **Revise** — User provides corrections; re-present with updates
- **Skip** — Skip state updates, provide a summary only

## Step 3: Write State Updates (If Approved)

If user approved or did not explicitly skip:

1. **Backup state:**
   ```bash
   bash Infrastructure/Scripts/prima/backup-state.sh
   ```
   Warn if script is missing but proceed anyway.

2. **Read state.json** and identify projects that were touched this session

3. **For each project worked on:**
   - Read the detail file at `.claude/state/projects/P###.json`
   - Update fields:
     - `lastAction` — brief description of the last completed action (past tense), under 100 characters
     - `stoppedAt` — where work stopped, specific enough to resume without re-reading files. Set to `null` if work is complete.
     - `sessionHistory` — prepend a new entry with today's date and 1-2 sentence summary (under 150 characters). Drop oldest if array exceeds 20.
   - Write updated detail file

4. **Update the index (state.json):**
   - For each touched project, update `lastWorked` to today's date
   - Add a new session history entry to the top-level `sessionHistory` array with:
     - `date` — today's date (YYYY-MM-DD)
     - `time` — session end time (HH:MM)
     - `summary` — 1-2 sentences describing what was accomplished
     - `projectsWorked` — array of project IDs touched this session
   - Drop oldest session entry if array exceeds 20

5. **Validate:**
   ```bash
   bash Infrastructure/Scripts/prima/validate-state.sh
   ```
   If validation fails, restore from backup and report the error. Do NOT proceed.

## Step 4: Output Session Summary

Whether or not state was updated, output exactly:

```
**Session saved**

Summary: [1-2 sentence description of what was worked on]
Projects updated: [P###, P###, ...] (or "none" if no projects identified)

[If multiple projects: Use] `/resuming-session P###` [to continue in a new session.]
[If one project: Use] `/resuming-session P###` [to continue in a new session.]
[If no projects identified: Use] `/resuming-session` [to continue in a new session.]
```

Nothing else. No additional explanation or questions.

---

Begin by reviewing the current session context and identifying work completed.
