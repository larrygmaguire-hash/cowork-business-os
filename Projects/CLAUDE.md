# Projects Folder

This folder holds your active internal projects. Each project gets its own subfolder named `P### Project Name` (e.g., `P001 Website Redesign`, `P002 Q2 Marketing Campaign`).

## How to use this folder

- **Create a new project:** ask Cowork to create a new project, or run `/creating-projects`. The skill assigns the next P### ID, creates the folder, and registers the project in `.claude/state/state.json`.
- **Find existing projects:** project IDs are sequential (P001, P002, ...). Look for the folder name or ask Cowork for a status report (`/workspace-status`).
- **Move completed projects:** when a project is done, move it to `Archive/` rather than deleting. Update its status in state.json to `archived`.

## What goes in a project folder

Every project folder contains:

- `CLAUDE.md` -- project-specific context (scope, deliverables, conventions, current state). Inherits from the workspace `.claude/CLAUDE.md`.
- Working files (documents, spreadsheets, drafts, research)
- Optional subfolders for organisation (e.g., `Research/`, `Drafts/`, `Final/`)

The project's tracked state (description, stoppedAt, lastAction, sessionHistory, milestones) lives in `.claude/state/projects/P###.json` -- not in the project folder itself.

## Recurring workflows

For processes you run repeatedly (weekly reports, monthly reconciliations, etc.), create a folder under `Projects/Workflows/` rather than a P### project. Workflows do not need state tracking.

## Sample project

`P000 Sample Project/` is a placeholder showing the structure. Delete or replace it when you start using the workspace properly.
