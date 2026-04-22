---
name: project-tracking
description: Add, update, pause, archive projects and manage milestones in PRIMA state. Use when user mentions adding a project, changing status, archiving completed work, or managing milestones.
user-invocable: false
---

# Project Tracking

Manage projects using the v2 split state architecture (index in `state.json`, detail in `projects/P###.json`, tasks in `tasks/P###.json`). See `state-io.md` for read/write patterns and jq examples.

## CRITICAL: All State Writes Use Bash + jq

The Claude Code CLI hardcodes `.claude/` as a protected path for Edit/Write/MultiEdit. **Every state mutation in this skill must go through `jq` via the Bash tool.** Never use Edit, Write, or MultiEdit on `.claude/state/state.json`, `.claude/state/projects/P###.json`, or `.claude/state/tasks/P###.json`. See `state-io.md` "jq Patterns" section for the canonical patterns referenced below.

## When to Use

- Adding a new project, client, or body of work to PRIMA state
- Changing project status (pause, resume, archive)
- Managing milestones, dates, categories, or tags
- "Add project [name]", "archive [project]", "pause [project]", "add milestone"

## When NOT to Use

- Viewing project status overview → use `/status`
- Creating project folder structure → use `/newproject` or `/newclient`
- Session-level state updates → handled by `/night`

## Operations

### Add Project
When user says "add project [name]" or describes new work:

1. Read `.claude/state/state.json` (index) via `jq`
2. **Check for duplicates** — search all existing projects (including archived) for matching or similar names. If a potential match is found, STOP and present it to the user before proceeding (see `state-validation.md` Duplicate Detection rule)
3. Get next project ID from `nextProjectNumber`
4. **Add index entry and create detail file via Bash + jq** (Pattern 8 in `state-io.md`). Both writes go through Bash — never Edit/Write:

```bash
TODAY=$(date +%Y-%m-%d)
NEXT=$(jq '.nextProjectNumber' .claude/state/state.json)
ID=$(printf "P%03d" "$NEXT")
NEW_NEXT=$((NEXT + 1))

# Add to index
TMP=$(mktemp)
jq --arg id "$ID" --arg today "$TODAY" --arg name "[name]" --arg cat "[category]" --argjson next "$NEW_NEXT" \
  '.projects += [{
     id: $id, name: $name, status: "in-progress", priority: "medium",
     category: $cat, tags: [],
     created: $today, startDate: $today, dueDate: null, lastWorked: $today, path: null,
     taskCount: 0, tasksDone: 0, tasksBlocked: 0,
     milestoneCount: 0, milestonesDone: 0
   }] | .nextProjectNumber = $next' \
  .claude/state/state.json > "$TMP" && mv "$TMP" .claude/state/state.json

# Create detail file (jq writes JSON via Bash redirection — bypasses Edit block)
jq -n --arg id "$ID" \
  '{id: $id, description: "", notes: "", stoppedAt: null, lastAction: null,
    pausedReason: null, sessionHistory: [], milestones: [], todos: [], recentWork: []}' \
  > ".claude/state/projects/$ID.json"
```

5. Confirm: "Added [ID]: [name] (category: [category])"

**Category is required.** If user does not specify, ask before creating.

### Update Project
When user references a project by ID or name:

1. Find project in index (`state.json`) by ID (P001) or name match
2. Read detail file (`.claude/state/projects/P###.json`) if detail fields need updating
3. Update requested fields in the correct file:
   - **Index fields** (state.json): `status`, `priority`, `category`, `tags`, `startDate`, `dueDate`, `lastWorked`, `path`
   - **Detail fields** (projects/P###.json): `description`, `notes`, `stoppedAt`, `lastAction`, `pausedReason`, `milestones`, `sessionHistory`
4. Always update `lastWorked` to today in the index
5. Clear `stoppedAt` in detail file when project is actively being worked on
6. If changing to `paused`: require `pausedReason` (detail file)
7. If `dueDate` is past and status is `in-progress`: warn about overdue
8. Run backup, then validate state before writing
9. Confirm changes

### Archive Project
When user says "complete", "done", "archive":

1. Find project in index
2. Set `status` to `archived` in index, update `lastWorked` to today
3. Clear `stoppedAt`, `lastAction` in detail file (`.claude/state/projects/P###.json`)
4. Confirm: "Archived P043: [name]"

### Pause Project
When user says "pause", "hold", "wait":

1. Find project in index
2. Ask for reason if not provided
3. Set `status` to `paused` in index
4. Set `pausedReason` in detail file
5. Confirm: "Paused P043: [name] — [reason]"

### Resume Project
When user says "resume", "unpause", "restart":

1. Find project with status `paused` in index
2. Set `status` to `in-progress` in index, update `lastWorked` to today
3. Set `pausedReason` to null, clear `stoppedAt` in detail file
4. Confirm: "Resumed P043: [name]"

### Add Milestone
When user says "add milestone to [project]" or "milestone for [project]":

1. Find project in index by ID or name
2. Ask for milestone name and target date if not provided
3. Read detail file (`.claude/state/projects/P###.json`)
4. Append to `milestones` array in detail file:
   ```json
   { "name": "[name]", "date": "[YYYY-MM-DD]", "status": "pending" }
   ```
5. Recalculate and update `milestoneCount` and `milestonesDone` in index
6. Update `lastWorked` to today in index
7. Confirm: "Added milestone '[name]' (due [date]) to P043: [project name]"

### Complete Milestone
When user says "complete milestone", "milestone done", "mark [milestone] done":

1. Find project in index by ID or name
2. Read detail file, list pending milestones if user didn't specify which one
3. Set milestone `status` to `done` in detail file
4. Recalculate and update `milestonesDone` in index
5. Update `lastWorked` to today in index
6. Confirm: "Completed milestone '[name]' on P043: [project name]"

**Rule:** Milestone status only transitions `pending` → `done`. No revert.

### Update Delivery Dates
When user says "set start date", "change due date", "update dates for [project]":

1. Find project by ID or name
2. Update `startDate` and/or `dueDate` as specified
3. Update `lastWorked` to today
4. Confirm changes

### Change Category
When user says "change category", "recategorise", "move to [category]":

1. Find project by ID or name
2. Validate new category is one of: `client`, `product`, `internal`, `marketing`, `research`, `operations`, `finance`, `sales`, `legal`, `it`
3. Update `category` field
4. Update `lastWorked` to today
5. Confirm: "Changed P043 category: [old] → [new]"

### Add Tags
When user says "tag [project]", "add tag", "label":

1. Find project by ID or name
2. Present seed list: `automation · integration · compliance · training · reporting · procurement · hr · crm · content · strategy · website · events · infrastructure · documentation · customer-support`
3. User can pick from list or add custom tags (comma-separated)
4. Append to `tags` array (deduplicate)
5. Update `lastWorked` to today
6. Confirm: "Added tags [tags] to P043: [name]"

### Remove Tags
When user says "remove tag", "untag":

1. Find project by ID or name
2. Show current tags
3. Remove specified tag(s) from `tags` array
4. Update `lastWorked` to today
5. Confirm: "Removed tag [tag] from P043: [name]"

## Rules
- **All state mutations use Bash + jq (Patterns 1-9 in `state-io.md`).** Never Edit/Write on `.claude/state/**`. Update Project, Archive, Pause, Resume, Add Milestone, Complete Milestone, Update Dates, Change Category, Add Tags, Remove Tags — every one of these uses `jq` against the index file or detail file as appropriate, with `mktemp` + `mv` to write atomically.
- IDs are P001-P999, zero-padded, sequential
- IDs are NEVER reused, even after archiving
- Always run backup before state modifications
- Always validate state.json against schema before writing (`jq empty <file>` plus `Scripts/prima/validate-state.sh` if available)
- Status values: `in-progress`, `paused`, `overdue`, `archived` — no others
- `pausedReason` is required when status is `paused`, null otherwise
- `stoppedAt` is cleared when a project is actively worked on or resumed
- `category` is required on all projects — valid values: `client`, `product`, `internal`, `marketing`, `research`, `operations`, `finance`, `sales`, `legal`, `it`
- `tags` are optional freeform strings — use seed list for consistency

## Examples

### Example 1: Add a new project

**User says:** "Add a project for the DCU Rooms web app"

**Actions:**
1. Read state.json, check for duplicates (search "DCU")
2. Next ID: P044. Ask user for category
3. Add entry with status `in-progress`

**Result:** "Added P044: DCU Rooms Web App (category: client)"

### Example 2: Pause a project with reason

**User says:** "Pause P032, waiting on collaborator feedback"

**Actions:**
1. Find P032 in state.json
2. Set status to `paused`, pausedReason to "Waiting on collaborator feedback"

**Result:** "Paused P032: Prima Memory — Waiting on collaborator feedback"

## Troubleshooting

### state.json validation fails after edit
**Cause:** Malformed JSON (missing comma, unmatched bracket).
**Solution:** Run `jq . .claude/state/state.json` to identify the syntax error. Fix and retry.

### Duplicate project detected but it's genuinely different
**Cause:** Name similarity triggers the duplicate check.
**Solution:** Explain why it's different when prompted. The skill will proceed with creation after user confirmation.
