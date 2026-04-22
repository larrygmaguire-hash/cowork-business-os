#!/bin/bash
# Backup state.json before modifications
# Usage: Infrastructure/Scripts/prima/backup-state.sh [path-to-state.json]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Find workspace root by searching upward for .claude/state/
WORKSPACE_ROOT="$SCRIPT_DIR"
while [ "$WORKSPACE_ROOT" != "/" ]; do
  if [ -d "$WORKSPACE_ROOT/.claude/state" ]; then
    break
  fi
  WORKSPACE_ROOT="$(dirname "$WORKSPACE_ROOT")"
done

if [ "$WORKSPACE_ROOT" = "/" ]; then
  echo "Could not find workspace root (.claude/state/ not found)"
  exit 1
fi

STATE_FILE="${1:-$WORKSPACE_ROOT/.claude/state/state.json}"
BACKUP_DIR="$WORKSPACE_ROOT/.claude/state/backups"
BACKUP_FILE="$BACKUP_DIR/$(date +%Y-%m-%d).json"

mkdir -p "$BACKUP_DIR"

if [ -f "$STATE_FILE" ]; then
  cp "$STATE_FILE" "$BACKUP_FILE"
  echo "State backed up to $BACKUP_FILE"

  # Keep only last 30 days of backups
  find "$BACKUP_DIR" -name "*.json" -mtime +30 -delete 2>/dev/null
else
  echo "State file not found: $STATE_FILE"
  exit 1
fi
