# State Project Details

This folder holds one JSON file per project, keyed by project ID (e.g. `P001.json`, `P002.json`). Each file contains the rich detail for that project: description, notes, session history, milestones, todos, recent work, `stoppedAt`, `lastAction`, `pausedReason`.

The slim index — status, priority, dates, counts — lives in `.claude/state/state.json`. This split keeps the index fast to read while keeping detailed per-project data separate.

**Why this file exists:** scaffolding marker so the folder persists in git. Once you have real project detail files (`P001.json`, etc.), you can delete this README.

**Do not delete** the folder itself — skills like `creating-projects`, `resuming-session`, and `saving-session` write to it.
