---
description: Save session context and update project records
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

## Step 1: Write Final Checkpoint

Write a checkpoint to `~/Documents/Agent Outputs/[project-id]/YYYY-MM-DD-session-checkpoint.md` following the format in `context-checkpoint.md` rule. Include:

- Summary of what was worked on this session
- Key decisions made
- Files modified
- Unfinished work
- Next action

If a checkpoint file already exists for today, append to it.

## Step 2: Update Project Records

Review the current session context — files modified, topics discussed, tasks completed. Map each piece of work to its project in `state.json` by matching against project names, folder paths, and descriptions.

If projects can be identified:

1. Backup state: `bash ${CLAUDE_PLUGIN_ROOT}/scripts/backup-state.sh` (warn if missing, proceed)
2. Read `.claude/state/state.json` (index) to identify project IDs
3. For each project worked on, apply **Pattern F (Split Write)** using **Bash + jq only** — NEVER Edit/Write tools (see `state-io.md` for jq patterns and rationale):

   **Detail file** (`.claude/state/projects/P###.json`) — use jq Patterns 3 and 4:

   ```bash
   TODAY=$(date +%Y-%m-%d)
   STOPPED="<where work stopped>"
   ACTION="<last completed action>"
   SUMMARY="<1-2 sentence summary>"
   TMP=$(mktemp)
   jq --arg stopped "$STOPPED" --arg action "$ACTION" --arg date "$TODAY" --arg summary "$SUMMARY" \
     '.stoppedAt = $stopped
      | .lastAction = $action
      | .sessionHistory = ([{date: $date, summary: $summary}] + .sessionHistory)[0:20]' \
     .claude/state/projects/P###.json > "$TMP" && mv "$TMP" .claude/state/projects/P###.json
   ```

   **Index** (`.claude/state/state.json`) — use jq Patterns 1 and 2:

   ```bash
   TMP=$(mktemp)
   jq --arg id "P###" --arg today "$TODAY" \
     '(.projects[] | select(.id == $id) | .lastWorked) = $today' \
     .claude/state/state.json > "$TMP" && mv "$TMP" .claude/state/state.json
   ```

   Status changes only if warranted (separate jq call, Pattern 2). Do NOT change `name`, `category`, `id`, or other unrelated fields.

4. Validate JSON syntax: `jq empty .claude/state/state.json` and `jq empty .claude/state/projects/P###.json`. Run `${CLAUDE_PLUGIN_ROOT}/scripts/validate-state.sh` if available.

If no projects can be identified, skip this step.

## Step 3: Get Session Timestamp

Run:
```bash
date "+%H:%M"
```

## Step 4: Return Reference

Output exactly:

```
**Session saved — [HH:MM]**

Topics: [1-line summary of what was worked on]
Projects updated: [P###, P###, ...] (or "none" if no projects identified)

Use `/resume P###` to continue in a new session. Add HH:MM for additional context.
```

If multiple projects were updated, list the primary one (the project with the most work this session) in the resume suggestion. If only one project, use that.

If no projects were identified, fall back to:
```
Use `/resume [HH:MM]` to continue in a new session.
```

Nothing else. No additional explanation or questions.
