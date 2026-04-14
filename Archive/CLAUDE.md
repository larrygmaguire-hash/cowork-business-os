# Archive

Completed or dormant projects. Move project folders here when work is done rather than deleting them.

## How to archive a project

1. Move the entire project folder from `Projects/` (or `Clients/[Client]/`) into `Archive/`
2. Update the project's status in `.claude/state/state.json` to `archived`
3. Update the project's `path` field in state.json to point to the new location

The `creating-projects` skill provides an archive option that does this automatically.

## Why archive instead of delete

- Project history stays searchable
- Past decisions and context remain available for future reference
- State tracking remains intact
- IDs are never reused, so the project ID stays valid

## When to actually delete

Only delete archived projects if:
- They contain sensitive information that must be removed
- A retention policy requires it
- The project was created in error

Even then, prefer to move outside the workspace rather than git-delete -- that way the GitHub history retains the record.
