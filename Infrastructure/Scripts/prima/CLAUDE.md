# PRIMA Scripts

State management scripts called by skills before and after writing to `.claude/state/`.

## Files

- `backup-state.sh` -- copies the current `.claude/state/` directory to a timestamped backup at `.claude/state.backups/state_YYYYMMDD_HHMMSS/`. Skills must call this BEFORE any state write.
- `validate-state.sh` -- validates `state.json` is valid JSON, checks required fields, and confirms each project's detail file exists. Skills must call this AFTER any state write.

## Why this exists

State integrity is critical -- corrupt state.json breaks project tracking. The backup-then-validate pattern ensures that:
1. You always have a recent backup if a write goes wrong
2. Corruption is detected immediately rather than silently propagating
3. Recovery is one `cp` command away

## Engine-managed

These scripts are template-managed. If you pull updates from upstream, they may be overwritten. Do not modify them. To add custom validation, create new scripts alongside (e.g., `validate-projects-paths.sh`).

## How skills use these

Every skill that writes to state follows this pattern:

```bash
# 1. Backup
Infrastructure/Scripts/prima/backup-state.sh

# 2. Make the change (jq, edit, etc.)

# 3. Validate
Infrastructure/Scripts/prima/validate-state.sh

# 4. If validation fails, restore from .claude/state.backups/
```
