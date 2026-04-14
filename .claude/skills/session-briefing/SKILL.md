---
name: session-briefing
description: >
  Start-of-session briefing showing active projects, priorities, and what needs attention. Displays project status with traffic light indicators, flags projects not worked in 7+ days, and suggests what to focus on.
---

# Session Briefing

Start your session with a quick overview of what needs attention.

## Step 1: Get Current Date and Time

Run:
```bash
date "+%A, %d %B %Y %H:%M"
```

Use the day name from this output exactly as shown. Never calculate the day of week from the date.

## Step 2: Read Project State

Read `.claude/state/state.json` and extract:

1. All projects with their status, lastWorked date, and priority
2. Task and milestone counts for each project
3. Any projects marked as overdue or paused
4. Pending items and priorities from the index

If state.json does not exist or is not valid JSON, proceed with manual inspection instead.

## Step 3: Determine Project Status

For each in-progress or paused project, calculate its status indicator based on lastWorked date and current status:

**Traffic light rules:**
- 🟢 Active — status is `in-progress` and `lastWorked` within 7 days
- 🟡 Stale — status is `in-progress` but `lastWorked` 7-27 days ago
- 🔴 Needs attention — status is `overdue`, OR `in-progress` with `lastWorked` 28+ days ago
- 🟠 Paused — status is `paused`

## Step 4: Read Project Detail Files

For projects where status is `in-progress` or `paused`, read their detail files at `.claude/state/projects/P###.json` to retrieve:
- `stoppedAt` — where work stopped
- `lastAction` — the last completed action
- `pausedReason` — if status is `paused`

## Step 5: Generate Briefing

Present a markdown briefing:

```markdown
## Good [Morning/Afternoon]

**Today:** [Day], [Date] [Time]

### Active Projects

| | Project | Status | Last Worked | Notes |
|---|---------|--------|-------------|-------|
| 🟢 | P### Project Name | Active | [days] days ago | [task/milestone count if applicable] |
| 🟡 | P### Project Name | Stale | [days] days ago | Needs attention |
| 🔴 | P### Project Name | Needs attention | [days] days ago | Not worked in [N] days |
| 🟠 | P### Project Name | Paused | [date] | Reason: [pausedReason] |

### Project Details

For each 🟡 (Stale) or 🔴 (Needs attention) project:

**[Project ID] — [Project Name]**
- Stopped at: [stoppedAt]
- Last action: [lastAction]
- Days inactive: [N]

### Suggested Priorities

1. [Most urgent project with brief rationale]
2. [Secondary priority]
3. [Tertiary priority]

---

**What would you like to focus on?**
```

## Step 6: Handle Follow-up Actions

If user says:
- **"archive [project]"** or **"archive P###"**: Update the project status to `archived` in state.json. Read the detail file, clear `stoppedAt` and `lastAction`, then write the updated detail file. Update `lastWorked` to today in the index.
- **"pause [project]"** or **"pause P###"**: Ask for the reason. Update status to `paused` in state.json, set `pausedReason` in the detail file.
- **"resume [project]"** or **"resume P###"**: Update status to `in-progress` in state.json, clear `pausedReason` and `stoppedAt` in the detail file.
- **"add project [name]"** or **"new project"**: Invoke the `creating-projects` skill.
- **"show me [project name]"** or **"tell me about P###"**: Read the project detail file and CLAUDE.md, then present an overview.

Before writing any state changes, run the backup script at `Infrastructure/Scripts/prima/backup-state.sh` if available. After writing, validate with `Infrastructure/Scripts/prima/validate-state.sh` if available.

---

Begin by getting the current date and reading project state.
