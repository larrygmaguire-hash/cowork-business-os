---
name: workspace-status
description: >
  Generate a comprehensive status report showing all active projects, clients, and recent work. Displays traffic light indicators, task/milestone counts, and activity summary.
---

# Workspace Status

Generate a full overview of workspace health and activity.

## Step 1: Get Current Date

```bash
date "+%A, %d %B %Y"
```

## Step 2: Read Project State

Read `.claude/state/state.json`. Extract:

1. All projects (including archived)
2. For each project: `id`, `name`, `status`, `lastWorked`, `taskCount`, `milestoneCount`, `priority`
3. Identify which projects are active, paused, overdue, and archived

For each in-progress or paused project, read the detail file at `.claude/state/projects/P###.json` to get:
- `description` (1-line summary)
- `dueDate` (if applicable)

If state.json does not exist, proceed with manual inspection of project folders instead.

## Step 3: Determine Project Status Indicators

For each project, calculate its traffic light indicator:

**Traffic light rules:**
- 🟢 Active — status is `in-progress` and `lastWorked` within 7 days
- 🟡 Stale — status is `in-progress` but `lastWorked` 7-27 days ago
- 🔴 Needs attention — status is `overdue`, OR `in-progress` with `lastWorked` 28+ days ago, OR `dueDate` has passed
- 🟠 Paused — status is `paused`
- ⚪ Archived — status is `archived`

## Step 4: Generate Status Report

```markdown
# Workspace Status

**Generated:** [Date]

---

## All Projects

| | Project | Status | Last Worked | Tasks | Milestones | Notes |
|---|---------|--------|-------------|-------|-----------|-------|
| 🟢 | P### Name | Active | [N] days ago | [done/total] | [done/total] | [priority] |
| 🟡 | P### Name | Stale | [N] days ago | [done/total] | [done/total] | Review needed |
| 🔴 | P### Name | Needs attention | [N] days ago | [done/total] | [done/total] | Not worked in [N] days |
| 🟠 | P### Name | Paused | [date] | [done/total] | [done/total] | Paused |
| ⚪ | P### Name | Archived | [date] | [done/total] | [done/total] | Completed |

**Sort order:** 🟢 (Active), 🟡 (Stale), 🔴 (Needs attention), 🟠 (Paused), ⚪ (Archived)

---

## Project Summary by Status

**Active (🟢):** [Count] projects worked recently
**Stale (🟡):** [Count] projects need review
**Needs attention (🔴):** [Count] projects overdue or dormant
**Paused (🟠):** [Count] projects on hold
**Archived (⚪):** [Count] projects completed

---

## Quick Actions

- View project details: Use `/resuming-session P###` to resume work on a project
- Create new project: Use `creating-projects` skill
- Create new client: Use `creating-clients` skill
```

## Step 5: Handle Follow-up Actions

If user requests:
- **"archive [project]"** or **"archive P###"**: Update status to `archived` in state.json. Clear `stoppedAt` and `lastAction` in detail file. Update `lastWorked` to today.
- **"pause [project]"** or **"pause P###"**: Ask for reason. Update status to `paused`, set `pausedReason` in detail file.
- **"resume [project]"** or **"resume P###"**: Update status to `in-progress`, clear `pausedReason` and `stoppedAt` in detail file.
- **"show details for [project]"**: Read the project detail file and CLAUDE.md, present full overview.
- **"update priorities"**: Ask for new immediate/thisWeek/upcoming items. Update `priorities` and `pendingItems` in state.json index.

Before writing any changes, backup state with `Infrastructure/Scripts/prima/backup-state.sh` if available. After writing, validate with `Infrastructure/Scripts/prima/validate-state.sh`.

---

Begin by reading project state and generating the status report.
