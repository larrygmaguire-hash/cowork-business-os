---
description: Daily briefing showing active projects, priorities, and recommended next steps
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

## Step 1: Sync and Get Time

```bash
git status --porcelain && date "+%A, %d %B %Y %H:%M"
```

**IMPORTANT:** Use the day name from the date output exactly as shown (e.g., "Friday"). Never calculate the day of week from the date — always use the system-provided day name.

**Before pulling:**
- If `git status --porcelain` returns output (uncommitted local changes exist):
  - Do NOT pull immediately — local changes could conflict
  - Report: "You have uncommitted local changes. Run `/prima-project-management:sync` first to commit and push, then `/prima-project-management:day` will pull cleanly."
  - Stop here and wait for user action
- If working tree is clean:
  ```bash
  git pull origin main
  ```
  - Handle conflict if it arises (see `/prima-project-management:sync` Conflict Resolution section)

## Step 2: Gather Data (Parallel)

Run these in parallel:

1. **Extract project index** (non-archived projects, slim fields):
   ```bash
   jq '{workspace: .workspace, projects: [.projects[] | select(.status == "in-progress" or .status == "paused" or .status == "overdue") | {id, name, status, priority, lastWorked, dueDate, startDate, taskCount, tasksDone, tasksBlocked, milestoneCount, milestonesDone}], sessionHistory: .sessionHistory[:3], priorities: .priorities, pendingItems: .pendingItems, selectedCalendars: .selectedCalendars}' .claude/state/state.json
   ```

   **v2 detail reads:** For projects where `status == "in-progress"` and `lastWorked` is within 7 days, read the detail file to get `stoppedAt` and `lastAction`:
   ```bash
   jq '{stoppedAt, lastAction}' .claude/state/projects/P###.json
   ```
   For `status == "paused"` projects, read `pausedReason` from the detail file.
   Only read detail files for these filtered projects — never for all projects.

2. **Read integrations config**: `.claude/config/integrations.json`

3. **Fetch calendar events** (if `selectedCalendars` exists in state data):
   - `gcal_list_events`: today to 14 days out
   - `zoom_list_meetings`: type "upcoming"
   - Deduplicate and merge

4. **Recent git activity**:
   ```bash
   git log --oneline --since="48 hours ago"
   ```

Do not call PRIMA Memory MCP tools (if that plugin is installed, you can use it separately). Use `sessionHistory[0]` from state.json for "where you left off".

5. **Repo drift check** — for projects whose `notes` or `description` reference an external repo path (e.g. `Developer/unpublished/ai-business-os/`):
   ```bash
   # For each repo path found, check latest commit and version
   cd "[repo-path]" && git log --oneline -3 && head -5 CHANGELOG.md 2>/dev/null; cd -
   ```
   Compare the repo's latest version/commit against the project's `stoppedAt` and `lastAction` in state.json. If the repo has moved ahead (newer commits, higher version), flag it in the briefing under a **Repo Drift Detected** section. Only check repos for non-archived, in-progress projects. Skip if the repo path does not exist on disk.

## Step 3: Generate Briefing

```markdown
WORKSPACE: [workspace.name from state data]

## Daily Briefing

**Today:** [Day name from Step 1 output], [full date from Step 1 output]

### Where You Left Off
[From sessionHistory[0].summary — 1-2 sentences]
[If any projects have stoppedAt set, show per project:]
**[ID] ([Project Name])** — stopped at: [stoppedAt]

### Active Projects
| ID | Project | Status | Last Worked | Due | Notes |
|----|---------|--------|-------------|-----|-------|
[From projects where status is not archived — apply traffic light indicators:]

**Traffic light rules (indicator + Status column text):**
- 🟢 Active — in-progress and lastWorked within 7 days
- 🟡 Stale — in-progress but lastWorked 7-27 days ago
- 🔴 Needs attention — status is `overdue`, OR in-progress with lastWorked 28+ days ago
- 🟠 Paused — status is `paused`

The Status column must show the display text (Active/Stale/Needs attention/Paused/Archived), NOT the raw state.json value.

### Upcoming Events (Next 7 Days)
| Date | Time | Event | Link |
|------|------|-------|------|
[From merged calendar data — omit section if calendar not configured]

### Repo Drift Detected
[Only show this section if drift was found in Step 2.5. Omit entirely if all repos match state.]
| ID | Project | State Says | Repo Shows |
|----|---------|-----------|------------|
[e.g. P003 | AI Business OS | v1.4.0 | v1.5.0 (commit abc1234) ]

⚠️ Run `/prima-project-management:night` or manually update state.json to correct.

### Task Summary
[Only show this section if any active project has taskCount > 0]
| ID | Project | Tasks | Blocked |
|----|---------|-------|---------|
[From index: show projects where taskCount > 0, display tasksDone/taskCount and tasksBlocked]

### Priorities
**Immediate:** [from priorities.immediate]
**This Week:** [from priorities.thisWeek]

### Pending Items
[From pendingItems array — omit section if empty]

### Recommended Actions
[Apply priority routing:]
1. **Overdue projects** — any project with status `overdue` or dueDate past today
2. **Projects with stoppedAt** — resume where you left off (show ID and stoppedAt)
3. **Priorities.immediate** — user-declared immediate priorities
4. **Stale projects** — in-progress but lastWorked 7+ days ago
5. **Priorities.thisWeek** — user-declared weekly priorities
```

## Step 4: Overdue Detection

After generating the briefing, scan all projects:
- If `dueDate` is set and is before today, and status is `in-progress`:
  - Auto-set status to `overdue`
  - Report: "[ID] ([Project Name]) marked overdue — due [dueDate]"
  - Run `${CLAUDE_PLUGIN_ROOT}/scripts/backup-state.sh` then update state.json, then `${CLAUDE_PLUGIN_ROOT}/scripts/validate-state.sh`

## Step 5: Project Actions

When user says:
- "complete [project]" or "archive [project]" → Update index (status to `archived`, `lastWorked` to today). Update detail file (clear `stoppedAt`/`lastAction`). Run backup/validate.
- "pause [project]" → Ask for reason. Update index (status to `paused`). Update detail file (`pausedReason`). Run backup/validate.
- "resume [project]" → Update index (status to `in-progress`). Update detail file (clear `pausedReason` and `stoppedAt`). Run backup/validate.
- "add project [name]" → Add new entry in index + create detail file at `.claude/state/projects/P###.json` with default fields. Run backup/validate.

---

Begin by syncing and gathering data.
