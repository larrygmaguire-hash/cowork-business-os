#!/bin/bash
# PRIMA — Backup state.json before modifications
# Usage: backup-state.sh <workspace-root>
#
# <workspace-root> is the absolute path to the Cowork Business OS workspace
# (the folder containing .claude/state/). It is passed explicitly so this
# script never has to guess which workspace it is being run against.

set -e

WORKSPACE_ROOT="$1"

if [ -z "$WORKSPACE_ROOT" ]; then
  echo "Usage: backup-state.sh <workspace-root>"
  echo "  <workspace-root> is the absolute path to the workspace folder (the folder containing .claude/state/)."
  exit 2
fi

if [ ! -d "$WORKSPACE_ROOT/.claude/state" ]; then
  echo "No .claude/state/ directory at $WORKSPACE_ROOT"
  echo "Either the path is wrong or the workspace has not been scaffolded yet (run /cowork-business-os:setup)."
  exit 1
fi

STATE_FILE="$WORKSPACE_ROOT/.claude/state/state.json"
BACKUP_DIR="$WORKSPACE_ROOT/.claude/state/backups"
BACKUP_FILE="$BACKUP_DIR/$(date +%Y-%m-%d).json"

mkdir -p "$BACKUP_DIR"

if [ -f "$STATE_FILE" ]; then
  cp "$STATE_FILE" "$BACKUP_FILE"
  echo "State backed up to $BACKUP_FILE"

  # Keep only last 30 days of backups
  find "$BACKUP_DIR" -name "*.json" -mtime +30 -delete 2>/dev/null || true
else
  echo "State file not found: $STATE_FILE"
  exit 1
fi
