# State

Project state storage. The v2 split architecture splits state across three locations to keep reads fast and writes safe.

## Files and folders

| Path | Contents |
|------|----------|
| `state.json` | Project index (slim fields for all projects) + top-level workspace metadata |
| `state.schema.json` | JSON validation schema for state.json |
| `projects/P###.json` | Per-project detail file (description, notes, stoppedAt, lastAction, sessionHistory, milestones) |
| `tasks/P###.json` | Per-project task list (optional, created when needed) |

## Read patterns

| Operation | Reads |
|-----------|-------|
| Portfolio overview | state.json only |
| Status report | state.json + detail files for relevant projects only |
| Working on a project | state.json + that project's detail file |
| Managing tasks | state.json + detail file + task file |

Never read all detail files. Filter from the index first.

## Write discipline

Before every state write:
1. Run `Infrastructure/Scripts/prima/backup-state.sh`
2. Make the change
3. Run `Infrastructure/Scripts/prima/validate-state.sh`
4. If validation fails, restore from `.claude/state.backups/`

## Engine-managed vs user-owned

The schema (`state.schema.json`) is engine-managed. The actual state files (`state.json`, `projects/*.json`, `tasks/*.json`) are user-owned -- they contain your project data and are never overwritten by template updates.

## Backups

`backup-state.sh` writes timestamped backups to `.claude/state.backups/state_YYYYMMDD_HHMMSS/`. These are gitignored. To restore:

```bash
ls .claude/state.backups/
cp -r .claude/state.backups/state_YYYYMMDD_HHMMSS/* .claude/state/
```
