---
description: Project health report showing status and priorities across all projects
allowed-tools: Read, Glob, Grep, Bash
model: haiku
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

## Step 1: Get Current Date

```bash
date "+%Y-%m-%d"
```

## Step 2: Read State and Git Activity (Parallel)

**Never emit the raw state.json JSON into context.** With 100+ projects state.json is ~50KB+ and will exceed tool output limits. Always use line-oriented `jq -r` with pipe-delimited rows from the first read.

Run in parallel:

1. **Project index as rows** (one line per project, pipe-delimited). This replaces the old `jq '{...}'` JSON extraction. Includes traffic-light computation inline so no post-processing is needed:

   ```bash
   TODAY=$(date +%Y-%m-%d)
   jq -r --arg today "$TODAY" '
   def icon(c): if c=="client" then "🤝" elif c=="product" then "📦" elif c=="internal" then "⚙️" elif c=="marketing" then "📣" elif c=="research" then "🔬" elif c=="operations" then "📋" elif c=="finance" then "💰" elif c=="sales" then "📈" elif c=="legal" then "⚖️" elif c=="it" then "💻" else (c//"-") end;
   def ageDays: ((($today|strptime("%Y-%m-%d")|mktime) - (.lastWorked|strptime("%Y-%m-%d")|mktime))/86400|floor);
   def light: if .status=="paused" then "🟠" elif .status=="archived" then "⚪" elif .status=="overdue" then "🔴" elif ageDays<=7 then "🟢" elif ageDays<=27 then "🟡" else "🔴" end;
   "WORKSPACE|\(.workspace.name)|\(.workspace.type)",
   (.projects[] | "\(light)|\(.id)|\(.name)|\(.status)|\(icon(.category))|\((.tags//[])|join(","))|\(.priority//"-")|\(.lastWorked)|\(.dueDate//"-")|\(.taskCount)/\(.tasksDone)/\(.tasksBlocked)|\(.milestonesDone)/\(.milestoneCount)|\(ageDays)")
   ' .claude/state/state.json
   ```

2. **Priorities, pending, session history** (small — safe to emit as JSON):
   ```bash
   jq '{priorities, pendingItems, sessionHistory: .sessionHistory[:8]}' .claude/state/state.json
   ```

3. **Counts by status**:
   ```bash
   jq -r '.projects | group_by(.status) | .[] | "\(.[0].status): \(length)"' .claude/state/state.json
   ```

4. **Recent git activity**:
   ```bash
   git log --oneline --since="7 days ago" 2>/dev/null | head -20
   ```

**v2 detail reads** (after Step 2 completes):
- For `status == "paused"` projects: `jq -r '"\(.id)|\(.pausedReason//"-")"' .claude/state/projects/P###.json`
- For 🟢 Active projects: `jq -r '.stoppedAt // "none"' .claude/state/projects/P###.json`
- For projects where `milestoneCount > 0`: `jq -r '.milestones[]? | "\(.name)|\(.date)|\(.status)"' .claude/state/projects/P###.json`
- Batch these in a single Bash call with a for-loop. Never emit the full detail JSON.

**Guard against null/missing fields.** `.tags` and `.category` can be null on some projects — always use `(.tags//[])` and `(.category//"-")`. A single null field will abort the whole `jq` run mid-stream.

Do not call PRIMA Memory MCP tools. Use `sessionHistory` from state.json for session activity data.

## Step 3: Generate Report

```markdown
[Workspace banner — from workspace.type and workspace.name]

# PRIMA Status Report
**Generated:** [date and time]

---

## Projects by Status

### In Progress ([count])
| ID | Project | Category | Tags | Priority | Last Worked | Due Date | Tasks | Milestones | Stopped At |
|----|---------|----------|------|----------|-------------|----------|-------|------------|------------|

**Tasks column format:** `[done]/[total]` with blocked count if > 0 — e.g., `3/8 (1 blocked)`. Show `—` if project has no tasks.
**Milestones column format:** `[done]/[total]` — e.g., `2/5`. Show `—` if project has no milestones.
**Tags column format:** comma-separated, or `—` if empty.

### Paused ([count])
| ID | Project | Category | Reason | Last Worked | Due Date |
|----|---------|----------|--------|-------------|----------|

### Overdue ([count])
| ID | Project | Category | Due Date | Days Overdue | Last Worked |
|----|---------|----------|----------|-------------|-------------|

### Archived (Recent — last 30 days) ([count])
| ID | Project | Category | Last Worked | Notes |
|----|---------|----------|-------------|-------|

---

**Traffic light rules (indicator + Status column text):**
- 🟢 Active — in-progress and lastWorked within 7 days
- 🟡 Stale — in-progress but lastWorked 7-27 days ago
- 🔴 Needs attention — status is `overdue`, OR in-progress with lastWorked 28+ days ago
- 🟠 Paused — status is `paused`
- ⚪ Archived — status is `archived` (show last 10 only)

Sort order: 🟢 first, then 🟡, then 🔴, then 🟠, then ⚪.

---

## Projects by Category

Show a compact breakdown of non-archived projects grouped by category. Only show categories that have at least one project.

| Category | Count | Projects |
|----------|-------|----------|
| [Category title case] | [N] | [P001, P002, ...] |

**Category icons** (use in category column across all tables):
- 🤝 Client
- 📦 Product
- ⚙️ Internal
- 📣 Marketing
- 🔬 Research
- 📋 Operations
- 💰 Finance
- 📈 Sales
- ⚖️ Legal
- 💻 IT

---

## Filtering

If the user passes an argument with `/status`, apply it as a filter:

- `/status marketing` — show only projects with category `marketing`
- `/status --tag compliance` — show only projects tagged `compliance`
- `/status --tag automation,integration` — show projects with ANY of the listed tags
- `/status client --tag training` — show projects matching category AND tag

When filtered, show the filter at the top of the report:
```
**Filter:** Category: marketing | Tags: compliance
```

Show only matching projects in all sections (status tables, category summary, warnings, recommendations). Counts reflect filtered results.

If no projects match the filter, show: "No projects match the filter `[filter]`."

---

## Priorities

### Immediate
- [items from priorities.immediate]

### This Week
- [items from priorities.thisWeek]

### Upcoming
- [items from priorities.upcoming]

---

## Pending Items
- [items from pendingItems array — or "None"]

---

## Recent Session Activity
**Sessions recorded:** [count from sessionHistory]

| Date | Summary | Projects |
|------|---------|----------|
[From sessionHistory array — up to 10 entries]

---

## Warnings

### Stale Projects (No Activity 7+ Days)
[List in-progress projects with lastWorked > 7 days ago]

### Overdue
[List projects with dueDate past today]

---

## Delivery Overview

Show this section only if any projects have milestones.

### Upcoming Milestones (Next 30 Days)
| Project | Milestone | Due | Days Left |
|---------|-----------|-----|-----------|
[List pending milestones with dates within 30 days of today, sorted by date ascending]

### Recently Completed Milestones
| Project | Milestone | Completed |
|---------|-----------|-----------|
[List milestones with status "done" — show last 5 only, sorted by date descending]

### Overdue Milestones
| Project | Milestone | Due | Days Overdue |
|---------|-----------|-----|-------------|
[List pending milestones with dates in the past]

If a section has no entries, omit it (don't show empty tables).

**Tip line** (show once at bottom of Delivery Overview):
```
Run /timeline to view the interactive Gantt chart.
```

---

## Recommended Actions
[Apply priority routing:]
1. **Overdue projects** — any project with status `overdue` or dueDate past today
2. **Projects with stoppedAt** — resume where you left off (show ID and stoppedAt)
3. **Priorities.immediate** — user-declared immediate priorities
4. **Stale projects** — in-progress but lastWorked 7+ days ago
5. **Priorities.thisWeek** — user-declared weekly priorities
```

## Step 4: Handle Follow-up Actions

If user requests:

- **"complete [project]"** or **"archive [project]"**: Update index (status to `archived`, `lastWorked` to today). Update detail file (clear `stoppedAt`/`lastAction`). Run backup/validate.
- **"pause [project]"**: Update index (status to `paused`). Update detail file (`pausedReason`). Run backup/validate.
- **"resume [project]"**: Update index (status to `in-progress`). Update detail file (clear `pausedReason` and `stoppedAt`). Run backup/validate.
- **"add project [name]"**: Add index entry + create detail file at `.claude/state/projects/P###.json`. Run backup/validate.
- **"update priorities"**: Update `priorities` in state.json index. Run backup/validate.

---

Begin by reading state data and git log, then generate the report.
