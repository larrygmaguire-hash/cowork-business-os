---
description: Update project state and commit changes at end of session
argument-hint: "[session summary]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

## Step 1: Gather Activity (Parallel)

Run in parallel:

1. **Time and git activity**:
   ```bash
   date "+%Y-%m-%d %H:%M" && git status && git log --oneline --since="6 hours ago"
   ```

2. **Extract project index** (matching fields only):
   ```bash
   jq '{workspace: .workspace, projects: [.projects[] | select(.status == "in-progress" or .status == "paused" or .status == "overdue") | {id, name, status, lastWorked}]}' .claude/state/state.json
   ```

Use the conversation context and git log as the primary source for what was done this session. Do not call PRIMA Memory MCP tools (if that plugin is installed, you can use it separately).

## Step 2: Project Reconciliation — Review Checkpoint

### 2a: Match work to existing projects

For each distinct piece of work done today, match it to an existing project by `name` or topic. Build a list of matched project IDs.

### 2b: Identify unmatched work

Any significant work that doesn't match an existing project is a candidate for a new project entry. Ignore trivial edits (typo fixes, formatting).

### 2c: Propose updates

Present a single summary for approval. **Show the exact `stoppedAt` and `lastAction` values** so they can be verified before writing.

```
**Review:** Session state updates

**Projects updated:**
- 🟢 P003 Project Name — Active
  - **lastAction:** [exact value to be written]
  - **stoppedAt:** [exact value to be written]
- 🟠 P032 Project Name — Paused
  - **lastAction:** [exact value to be written]
  - **stoppedAt:** [exact value to be written]

**New projects proposed:**
- [Name] — [1-line description]. Suggested path: [path]
- (or: No new projects)

**Status changes:**
- 🔴 P009 — Needs attention (dueDate passed)
- (or: No status changes)

**Options:** Approve / Revise / Skip state update
```

**Critical:** The `stoppedAt` and `lastAction` values shown here are exactly what will be written to state.json. The user must be able to see and correct them before they are committed. If the user says "Revise", apply corrections and re-present the checkpoint.

**Traffic light rules:**
- 🟢 Active — in-progress and lastWorked within 7 days
- 🟡 Stale — in-progress but lastWorked 7-27 days ago
- 🔴 Needs attention — status is `overdue`, OR in-progress with lastWorked 28+ days ago
- 🟠 Paused — status is `paused`

**Behaviour:**
- **Approve** → write all updates, create new projects with next sequential ID
- **Revise** → user provides corrections, re-present
- **Skip** → proceed to commit without state changes

## Step 3: Write State Updates

After approval:

1. Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/backup-state.sh "$CLAUDE_PROJECT_DIR"`
2. Read `.claude/state/state.json` (index)
3. Apply updates using **v2 split writes via Bash + jq only**. Edit/Write tools are blocked on `.claude/**` by the CLI's hardcoded protected-path check — every state mutation in this step must go through `jq` via Bash. See `state-io.md` "jq Patterns" for the full reference.

**Per-project index update** (loop for each touched project — Pattern 1):

```bash
TODAY=$(date +%Y-%m-%d)
TMP=$(mktemp)
jq --arg id "P###" --arg today "$TODAY" \
  '(.projects[] | select(.id == $id) | .lastWorked) = $today' \
  .claude/state/state.json > "$TMP" && mv "$TMP" .claude/state/state.json
```

For status changes, run a second jq pass (Pattern 2) targeting `.status` on the same project.

**Per-project detail update** (loop for each touched project — Patterns 3 and 4 combined):

```bash
TODAY=$(date +%Y-%m-%d)
STOPPED="<where work stopped>"
ACTION="<last completed action, past tense>"
SUMMARY="<1-2 sentence session summary for this project>"
TMP=$(mktemp)
jq --arg stopped "$STOPPED" --arg action "$ACTION" --arg date "$TODAY" --arg summary "$SUMMARY" \
   --argjson recent '["activity 1","activity 2","activity 3"]' \
  '.stoppedAt = $stopped
   | .lastAction = $action
   | .recentWork = $recent
   | .sessionHistory = ([{date: $date, summary: $summary}] + .sessionHistory)[0:20]' \
  .claude/state/projects/P###.json > "$TMP" && mv "$TMP" .claude/state/projects/P###.json
```

**Top-level state.json updates** (single combined jq call — Pattern 5 plus pendingItems/priorities/recentWork):

```bash
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
TMP=$(mktemp)
jq --arg date "$TODAY" --arg time "$TIME" \
   --arg summary "<session summary, under 150 chars>" \
   --argjson projects '["P###","P###"]' \
   --arg checkpoint "<absolute path to checkpoint file, or empty string for null>" \
   --argjson recentWork '["activity 1","activity 2","activity 3"]' \
   --argjson priorities '{"immediate":[],"thisWeek":[],"upcoming":[]}' \
   --argjson pending '[]' \
  '.sessionHistory = ([{
       date: $date,
       time: $time,
       summary: $summary,
       projectsWorked: $projects,
       checkpointFile: (if $checkpoint == "" then null else $checkpoint end)
     }] + .sessionHistory)[0:20]
   | .recentWork = $recentWork
   | .priorities = $priorities
   | .pendingItems = $pending' \
  .claude/state/state.json > "$TMP" && mv "$TMP" .claude/state/state.json
```

`checkpointFile`: resolve from workspace ID and today's date — set to null (empty string in the bash var above) if the file does not exist on disk. Verify with `[ -f "$path" ]` before passing.

**New projects** (if approved — Pattern 8):

```bash
TODAY=$(date +%Y-%m-%d)
NEXT=$(jq '.nextProjectNumber' .claude/state/state.json)
ID=$(printf "P%03d" "$NEXT")
NEW_NEXT=$((NEXT + 1))

# Add index entry
TMP=$(mktemp)
jq --arg id "$ID" --arg today "$TODAY" --arg name "Project Name" --arg cat "client" --argjson next "$NEW_NEXT" \
  '.projects += [{
     id: $id, name: $name, status: "in-progress", priority: "medium",
     category: $cat, tags: [],
     created: $today, startDate: $today, dueDate: null, lastWorked: $today, path: null,
     taskCount: 0, tasksDone: 0, tasksBlocked: 0,
     milestoneCount: 0, milestonesDone: 0
   }] | .nextProjectNumber = $next' \
  .claude/state/state.json > "$TMP" && mv "$TMP" .claude/state/state.json

# Create detail file via jq (writing JSON to disk through bash redirection — also bypasses Edit block)
jq -n --arg id "$ID" \
  '{id: $id, description: "", notes: "", stoppedAt: null, lastAction: null,
    pausedReason: null, sessionHistory: [], milestones: [], todos: [], recentWork: []}' \
  > ".claude/state/projects/$ID.json"
```

4. Validate after every write: `jq empty .claude/state/state.json` and `jq empty .claude/state/projects/P###.json` for each touched detail file. Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-state.sh "$CLAUDE_PROJECT_DIR"` if available — if validation fails, restore from backup and report error.

## Step 4: Learning Detection

Scan conversation for learnings worth persisting. **Most sessions have none — proceed silently if so.**

| Capture | Skip |
|---------|------|
| Non-obvious error fixes likely to recur | One-off fixes |
| Undocumented gotchas | General knowledge |
| Significant preference changes | Verbose explanations |

If any qualify:
```
Proposed: [One line]
Capture to [Master/Project] CLAUDE.md? (y/n)
```

## Step 5: Commit and Sync

**Workspace identity validation** (before push):
1. Read `workspace.githubRepo` from state data
2. If not empty, compare against `git remote get-url origin`
3. If mismatch: **ABORT** the push and show error

Then commit:
```bash
git add -A && git commit -m "$(cat <<'EOF'
[Session summary — reference project IDs where applicable]

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)" && git push origin main
```

Show:
- Commit hash
- Files changed count
- Learnings captured (if any)
- Projects updated (IDs and names)

---

If user provides context (e.g., `/night worked on X`), use that directly.
