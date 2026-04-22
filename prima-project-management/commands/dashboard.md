---
description: Generate an interactive project dashboard visualisation
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

Generate a self-contained HTML dashboard showing project health, task status, timelines, and dependency maps. Opens in the default browser.

## Workflow

### 1. Read State Data

Read `.claude/state/state.json` (index) to get all projects using **Pattern A** (index only for the overview).

For active projects that need detail (stoppedAt, lastAction, sessionHistory, milestones), read their detail files from `.claude/state/projects/P###.json` using **Pattern B** (selective detail). Only read detail for projects with `status == "in-progress"` or `milestoneCount > 0`.

For each project that has tasks (`taskCount > 0` in index), read `.claude/state/tasks/P###.json`.

Run `date "+%Y-%m-%d %H:%M"` to get the current timestamp for the dashboard header.

### 2. Prepare Data

Build a JavaScript data array from the state. Each project object needs:

```javascript
{
  id: "P045",
  name: "Project Name",
  status: "in-progress",     // in-progress | paused | overdue | archived
  priority: "high",          // high | medium | low
  category: "client",        // client | internal
  created: "2026-02-13",
  lastWorked: "2026-03-19",
  dueDate: "2026-04-15",     // or null
  startDate: "2026-02-13",
  tags: ["webapp", "client"],
  taskCount: 8,
  tasksDone: 3,
  tasksBlocked: 1,
  focus: "Current focus text",
  next: "Next action text",
  milestones: [
    { name: "MVP complete", date: "2026-03-01", status: "done" },
    { name: "Go live", date: "2026-04-15", status: "pending" }
  ],
  sessions: [
    { date: "19 Mar", summary: "What happened" }
  ],
  tasks: [
    {
      id: "T001",
      title: "Task title",
      status: "done",           // done | in-progress | todo
      dependsOn: [],            // array of task IDs
      dueDate: "2026-03-10",    // or null
      completed: "2026-03-19"   // or null
    }
  ]
}
```

**Field mapping from state.json:**
- `focus` → use `stoppedAt` or first `todos` item or "—"
- `next` → use `lastAction` or "—"
- `sessions` → last 3 entries from `sessionHistory`, formatted as `{ date: "DD Mon", summary: "..." }`
- `taskCount`, `tasksDone`, `tasksBlocked` → compute from task file if exists, otherwise use state.json values if present, otherwise 0
- For `tasksBlocked`: count tasks where any item in `dependsOn` references a task that is not `done`

**Filter out archived projects** unless they have delivery dates.

### 3. Generate HTML

Generate a **single self-contained HTML file** with zero external dependencies. All CSS and JavaScript inline.

**Output path:** `Documentation/Reports/prima-dashboard.html`

Create the `Documentation/Reports/` directory if it does not exist.

**IMPORTANT — Context Protection:** The HTML file is large (500+ lines). To avoid context overflow:
1. Write the complete HTML directly to the output file using the Write tool
2. Do NOT read it back into context after writing
3. Do NOT hold the full HTML in a variable — stream it to the Write tool

**Design Specification:**

#### Theme System
- Dark mode default, with light mode toggle (persists to localStorage under key `prima-theme`)
- Dark theme colours:
  - Backgrounds: `#0a0a1a` (deep), `#1a1a2e` (base), `#16213e` (surface), `#1c2a4a` (elevated)
  - Borders: `#0f3460` (primary), `#1a3a6a` (light)
  - Brand: `#cc2157` (pink — accent/CTAs only, never body text), `#3a1028` (pink-dim), `#1f4d78` (blue), `#222832` (dark blue)
  - Derived: `#7ec8e3` (cyan — from brand blue)
  - Text: `#e7e3dd` (brand white — primary readable text on dark), `#dcdcdc` (text), `#b8b8b8` (dim), `#888` (faint)
  - Pink is for borders, badges, buttons, active indicators. Readable text uses brand white or text colours.
  - Status: `#5cb85c` (green), `#1a3a2a` (green-dim), `#f0ad4e` (amber), `#3d2e00` (amber-dim), `#d9534f` (red), `#3a1a1a` (red-dim)
- Light theme colours:
  - Backgrounds: `#f0f0f4`, `#e8e8ee`, `#ffffff`, `#f8f8fc`
  - Borders: `#d0d0da`, `#dddde6`
  - Brand: `#cc2157` (pink — accent only), `#fce8ef` (pink-dim), `#1f4d78` (blue), `#222832` (dark blue)
  - Derived: `#1a6b8a` (cyan)
  - Text: `#222832` (brand dark blue — primary readable text on light), `#3a3a4a` (text), `#6a6a7a` (dim), `#9a9aaa` (faint)
  - Status: `#3a8a3a`, `#e6f5e6`, `#b8860b`, `#fef5e0`, `#c0392b`, `#fce8e6`

#### Typography
- Font: `'SF Mono', 'Fira Code', 'Consolas', 'Monaco', monospace`
- Base size: `18px`
- Line height: `1.6`
- All sub-sizes use `rem` units (never hardcoded pixel values below 18px)

#### Layout
- Fixed left sidebar: `300px` wide, full height, `bg-base` background
- Main content: `margin-left: 300px`, `padding: 32px 40px`

#### Sidebar Contents
- Logo: "PRIMA" in pink, "v2.0 — Project Intelligence" subtitle
- Nav sections: Overview (Dashboard, Timeline), Projects (dynamic list with status dots and task badges), System (Architecture)
- Theme toggle: sliding track with thumb
- Footer: workspace name in cyan, current date
- Active item: pink left border, pink text, pink-dim background
- Nav item font size: `1rem`, section labels: `0.85rem`

#### Dashboard View (default)
- **KPI cards row** (5 cards): Active Projects (cyan), Total Tasks (pink), Tasks Done (green), Blocked (red), Due This Week (amber)
  - Each card: surface background, border, rounded corners, 3px coloured top accent, large value (2.2rem bold), uppercase label, subtitle
- **Project table**: ID (pink bold), name, status with dot, priority dot, task count, progress bar (red/amber/green), due date, tags
  - Filter buttons: All, Active, Paused, Overdue
  - Clickable rows → drill into project detail view
- **Activity feed**: recent session entries with coloured dots (task=pink, milestone=green, session=cyan, status=amber)

#### Timeline View
- **Project selector buttons** at top: "All Projects" default + one per project with dates
- **All Projects mode**: Gantt bars per project, milestone diamonds, today line, month grid
- **Project mode**: project bar + milestone rows + task bars with status colours
- **Click popovers** on bars/milestones/tasks showing full detail:
  - Project: name, status, priority, dates, task progress, milestones, focus
  - Milestone: name, target date, status, days remaining/overdue
  - Task: ID, title, status, due date, dependencies with names and statuses, what it unblocks

#### Project Detail View
- Two-column layout (main + 320px sidebar)
- **Left**: task cards with status-coloured left border (4px), checkbox, ID, title, due date, dependencies, status badge. Dependency graph below as coloured node chains.
- **Right**: project summary card, milestones card, current focus, next action, recent sessions
- **"View Visual" button** (pink accent) → opens dependency map

#### Dependency Map View (per project)
- Full-width canvas, left-to-right flow
- Task nodes: `240×110px`, coloured by status, rounded corners
  - ID in pink, title in white, due date in faint, status badge
- Curved SVG arrows between dependent tasks:
  - Green: dependency satisfied (source task done)
  - Red dashed: blocked (source task not done)
  - Grey: pending
- Auto-layout: tasks grouped in columns by dependency depth
- Columns vertically centred
- Click any node for detail popover (status, dates, dependencies, what it unblocks)
- Legend bar at top
- Back button returns to project detail

#### Architecture View
- File structure tree (cyan folders, pink new files)
- Context budget bars (command → token cost, comparing v2 vs v1.x)
- Index fields vs detail fields breakdown
- Data flow diagram

#### Interaction
- Navigation between views via sidebar clicks (JavaScript show/hide, no page reloads)
- Filter buttons on tables
- Popovers: click to show, click outside or Escape to dismiss
- Hover effects: scale on nodes, background highlight on rows
- Smooth transitions on theme toggle

#### "Today" Reference
- Use the current date (from step 1) for all "today" calculations: days remaining, overdue detection, today line position

### 4. Open the Dashboard

After writing the HTML file:

**macOS:**
```bash
DASHBOARD_PATH="$(pwd)/Documentation/Reports/prima-dashboard.html"
open "$DASHBOARD_PATH"
echo "file://$DASHBOARD_PATH" | pbcopy
```

**Linux/WSL:**
```bash
DASHBOARD_PATH="$(pwd)/Documentation/Reports/prima-dashboard.html"
xdg-open "$DASHBOARD_PATH" 2>/dev/null || echo "Open manually: file://$DASHBOARD_PATH"
```

### 5. Summary

After opening, confirm:

```
Dashboard generated — [timestamp]

Projects: [N] total ([active] active, [paused] paused, [overdue] overdue)
Tasks: [total] across [N] projects ([done] done, [blocked] blocked)
Milestones: [total] ([done] done, [pending] pending)

Opened in browser. URL copied to clipboard.
```

## Rules

- The HTML file is regenerated on every `/dashboard` call — it is not cached
- No Python, no external JS libraries, no CDN links — everything inline
- Must render correctly in any modern browser (Chrome, Firefox, Safari, Edge)
- All project data is embedded as a JavaScript variable, not fetched from an API
- Do not read the generated HTML back into context after writing it
- The generated file should be gitignored (it contains a point-in-time snapshot, not source material)
- If state.json does not exist, inform the user and exit:
  ```
  No state.json found. Run /setup to initialise PRIMA, or create .claude/state/state.json manually.
  ```
