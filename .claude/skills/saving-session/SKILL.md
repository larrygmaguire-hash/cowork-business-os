---
name: saving-session
description: >
  Save the current session context by creating a checkpoint file and updating project records. Enables resumption of work in a new conversation.
---

# Saving Session

Save the current session so it can be resumed later.

## Step 1: Get Session Timestamp

```bash
date "+%H:%M"
```

Store this as `[HH:MM]` — it will be used in the return reference.

## Step 2: Write Checkpoint File

Create or append to a checkpoint file at:

```
~/Documents/Agent Outputs/[project-id]/YYYY-MM-DD-HHMM-session-checkpoint.md
```

Use the timestamp from Step 1 (without colon). For example: `2026-04-14-1430-session-checkpoint.md`

**File format (append-based):**

If this is the first checkpoint of the day for this project, create the file with a header:

```markdown
# Session Checkpoints — [Project Name] — YYYY-MM-DD
```

Then append a new section:

```markdown
---

## Checkpoint HH:MM

**Work Type:** [audit/development/research/content/other]

### Summary
[2-3 sentence overview of progress — what was accomplished this session]

### Findings / Progress
[Numbered list of key achievements, changes, or findings]

### Decisions Made
- [Decision — include the why, not just what was decided]

### Files Modified
| File | Change |
|------|--------|
[List files touched with one-line explanation]

### Unfinished Work
- [Specific items with enough context to resume without re-reading files]

### Next Action
[The single most important thing to do next]
```

**What goes in this file:**
- Include specific details: file paths, line numbers, metric values, error messages
- Include rationale for decisions made
- Be specific enough that the next session can start immediately without re-reading files
- Keep findings/progress as precise lists, not summaries

Create the directory if it does not exist:

```bash
mkdir -p ~/Documents/Agent Outputs/[project-id]/
```

If project ID cannot be determined, use `general` as the directory name.

## Step 3: Update Project Records

Review the current session and identify which projects were worked on by matching conversation topics against project names and IDs in state.json.

For each project identified:

1. Read `.claude/state/projects/P###.json`
2. Update:
   - `lastAction` — brief description of the last completed action this session (past tense, under 100 characters)
   - `stoppedAt` — where work stopped. Set to `null` if fully complete. Specific enough to resume without re-reading files.
   - `sessionHistory` — prepend a new entry with today's date and a 1-2 sentence summary. Drop oldest if array exceeds 20.
3. Write updated detail file

Then update the index:

1. Read `.claude/state/state.json`
2. For each touched project, update `lastWorked` to today's date
3. Validate JSON syntax
4. Write state.json

Before writing state, run backup if available:

```bash
bash Infrastructure/Scripts/prima/backup-state.sh
```

After writing, validate if available:

```bash
bash Infrastructure/Scripts/prima/validate-state.sh
```

If no projects can be identified from the conversation, skip this step.

## Step 4: Return Reference

Output exactly:

```
**Session saved — HH:MM**

Topics: [1-line summary of what was worked on]
Projects updated: [P###, P###, ...] (or "none")

Use `/resuming-session P###` to continue in a new session.
```

Or if no projects identified:

```
**Session saved — HH:MM**

Use `/resuming-session` to continue in a new session.
```

Nothing else. No additional explanation or questions.

---

Begin by getting the session timestamp and reviewing what was accomplished.
