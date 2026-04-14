#!/bin/bash
# Backup state directory to timestamped archive
# Called by skills before writing to state files

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
STATE_DIR=".claude/state"
BACKUP_DIR=".claude/state.backups/state_${TIMESTAMP}"

if [ ! -d "$STATE_DIR" ]; then
  echo "Error: State directory not found at $STATE_DIR"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp -r "$STATE_DIR"/* "$BACKUP_DIR/"
echo "State backed up to $BACKUP_DIR"
