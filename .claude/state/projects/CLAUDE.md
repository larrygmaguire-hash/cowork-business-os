# Project Detail Files

Per-project detail files in v2 split state architecture. Each file is named `P###.json` matching the project ID.

## Structure

```json
{
  "id": "P001",
  "description": "Long-form project description",
  "notes": "Working notes, context, decisions",
  "stoppedAt": "Where work paused",
  "lastAction": "Last completed action",
  "pausedReason": null,
  "sessionHistory": [
    { "date": "2026-04-14", "summary": "Session summary" }
  ],
  "milestones": [],
  "todos": [],
  "recentWork": []
}
```

## When files are created

The `creating-projects` skill creates a detail file when a new project is registered. The filename matches the project ID exactly (`P001.json` for P001, `P042.json` for P042).

## When files are read

Only when working on that specific project. Skills filter from the index in `state.json` first, then read only the detail files they need. Never read all detail files at once.

## When files are deleted

When a project is archived, the detail file stays in place (status changes to `archived` in the index). When a project is deleted entirely (rare), the detail file is removed. Both patterns preserve historical context.
