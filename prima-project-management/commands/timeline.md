---
description: Generate an interactive project timeline visualisation
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

Generate an HTML Gantt-style timeline of projects with delivery data.

## Workflow

### 1. Read State and Select Scope

Read `.claude/state/state.json` (index) and filter to projects that have both `startDate` and `dueDate` set (non-null). Skip projects without delivery data — they cannot be plotted.

If no projects have delivery data, inform the user:
```
No projects have delivery dates set. Use the project-tracking skill to add startDate and dueDate to your projects, or set them during /newproject.
```

If qualifying projects exist, present a scope selection:

```
**Timeline scope:**

1. All active projects ([N] projects with delivery dates)
2. Single project — choose from:
   [P001] Project Name (status)
   [P002] Project Name (status)
   ...

Which option?
```

- **Option 1:** Include all non-archived projects with delivery dates
- **Option 2:** Generate a timeline for just that one project (showing its milestones in detail)

Wait for the user's choice before proceeding.

### 2. Prepare Project Data

For each selected project, extract from the **index** (`state.json`):
- `id`, `name`, `status`, `priority`, `startDate`, `dueDate`

Then read the **detail file** (`.claude/state/projects/P###.json`) for projects with `milestoneCount > 0` to get the `milestones` array. Projects with `milestoneCount == 0` have no milestones — skip the detail read.

Sort projects by `startDate` ascending.

### 3. Generate HTML

Generate a self-contained HTML file with **zero external dependencies**. The HTML must include all CSS and JS inline.

**Output path:**

- **All active projects:** `Documentation/Reports/project-timeline.html`
- **Single project:** `[project-folder]/project-timeline.html` (the project's own folder from state.json `path` field)

Create the target directory if it does not exist.

**Visual specification:**

- **Theme:** Dark background (#1e1e1e) matching VS Code aesthetic
- **Layout:** Project labels on the left (200px), horizontal bar chart on the right
- **Bars:** Horizontal bar per project from startDate to dueDate
- **Bar colours by status:**
  - `in-progress` → #2196F3 (blue)
  - `paused` → #FF9800 (amber)
  - `overdue` → #F44336 (red)
  - `archived` → #666666 (grey)
- **Priority dots:** Coloured dot before each project label
  - `high` → #F44336 (red)
  - `medium` → #FF9800 (amber)
  - `low` → #4CAF50 (green)
- **Milestones:** Diamond markers on the bar
  - `done` → filled green (#4CAF50)
  - `pending` → outlined (#999 border, transparent fill)
- **Today line:** Red dashed vertical line (#F44336) with "Today" label
- **Month grid:** Vertical grid lines at month boundaries with month/year labels
- **Hover tooltips:** On bars (project name, date range, days remaining/overdue) and milestones (name, date, status)
- **Legend:** Status colours + milestone markers explained at top
- **Generated date:** Subtitle showing when the timeline was generated

**HTML template reference:**

Use the structure from the prototype. Key implementation notes:
- Calculate timeline range from earliest startDate to latest dueDate across all projects, padded to month boundaries
- Use `dayWidth = 3` pixels per day for readable spacing
- All date calculations in JavaScript using the embedded project data
- Project data is embedded as a `const projects = [...]` array in a `<script>` tag
- Map `dueDate` to the bar end position (the prototype used `targetDate` — use `dueDate` instead)
- Milestone dates that fall outside the project's start–due range should still be plotted at their correct position

### 4. Open the Timeline

After writing the HTML file:

1. **Open in default browser** and **copy the `file://` URL to clipboard** for the integrated browser:

**macOS:**
```bash
TIMELINE_PATH="$(pwd)/[output-path]"
open "$TIMELINE_PATH"
echo "file://$TIMELINE_PATH" | pbcopy
```

**Windows:**
```bash
TIMELINE_PATH="$(pwd)/[output-path]"
start "$TIMELINE_PATH"
echo "file://$TIMELINE_PATH" | clip
```

2. **Print hint:**
```
Timeline opened in browser. URL also copied to clipboard — paste into VS Code's Integrated Browser (Cmd+Shift+P → "Browser: Open Integrated Browser") to view inside the editor.
```

### 5. Summary

After opening, confirm:
```
Timeline generated with [N] projects. Showing [start month] to [end month].
[N] milestones plotted ([done] done, [pending] pending).
```

## Rules

- Never include archived projects unless they have delivery dates (they appear greyed out for historical context)
- The HTML file is regenerated on every `/timeline` call — it is not cached
- No Python dependencies, no matplotlib, no external JS libraries
- The file must render correctly in VS Code Simple Browser and any modern web browser
