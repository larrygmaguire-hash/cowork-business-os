#!/bin/bash
# PRIMA — Validate state.json
# Usage: validate-state.sh <workspace-root>
#
# <workspace-root> is the absolute path to the Cowork Business OS workspace
# (the folder containing .claude/state/). Passed explicitly by the caller.

set -e

WORKSPACE_ROOT="$1"

if [ -z "$WORKSPACE_ROOT" ]; then
  echo "Usage: validate-state.sh <workspace-root>"
  echo "  <workspace-root> is the absolute path to the workspace folder (the folder containing .claude/state/)."
  exit 2
fi

if [ ! -d "$WORKSPACE_ROOT/.claude/state" ]; then
  echo "No .claude/state/ directory at $WORKSPACE_ROOT"
  exit 1
fi

STATE_FILE="$WORKSPACE_ROOT/.claude/state/state.json"
SCHEMA_FILE="$WORKSPACE_ROOT/.claude/state/state.schema.json"

# Check state file exists
if [ ! -f "$STATE_FILE" ]; then
  echo "❌ State file not found: $STATE_FILE"
  exit 1
fi

# Validate JSON syntax
if ! jq empty "$STATE_FILE" 2>/dev/null; then
  echo "❌ Invalid JSON in $STATE_FILE"
  exit 1
fi

echo "✅ JSON syntax valid"

# Check required fields
VERSION=$(jq -r '.version // empty' "$STATE_FILE")
WORKSPACE=$(jq -r '.workspace // empty' "$STATE_FILE")
PROJECTS=$(jq -r '.projects // empty' "$STATE_FILE")

if [ -z "$VERSION" ]; then
  echo "❌ Missing required field: version"
  exit 1
fi

if [ -z "$WORKSPACE" ]; then
  echo "❌ Missing required field: workspace"
  exit 1
fi

if [ "$PROJECTS" = "" ]; then
  echo "❌ Missing required field: projects"
  exit 1
fi

echo "✅ Required fields present (version: $VERSION)"

# Validate workspace identity
WS_NAME=$(jq -r '.workspace.name // empty' "$STATE_FILE")
WS_ID=$(jq -r '.workspace.id // empty' "$STATE_FILE")
WS_TYPE=$(jq -r '.workspace.type // empty' "$STATE_FILE")

if [ -z "$WS_NAME" ] || [ -z "$WS_ID" ] || [ -z "$WS_TYPE" ]; then
  echo "⚠️  Workspace identity incomplete (name: '$WS_NAME', id: '$WS_ID', type: '$WS_TYPE')"
fi

# Validate workspace type
if [ -n "$WS_TYPE" ] && [ "$WS_TYPE" != "personal" ] && [ "$WS_TYPE" != "client" ] && [ "$WS_TYPE" != "internal" ]; then
  echo "❌ Invalid workspace type: $WS_TYPE (must be personal, client, or internal)"
  exit 1
fi

# Validate project IDs are unique
DUPLICATE_IDS=$(jq -r '[.projects[].id] | group_by(.) | map(select(length > 1)) | .[0][0] // empty' "$STATE_FILE")
if [ -n "$DUPLICATE_IDS" ]; then
  echo "❌ Duplicate project ID: $DUPLICATE_IDS"
  exit 1
fi

echo "✅ Project IDs unique"

# Validate project names are unique
DUPLICATE_NAMES=$(jq -r '[.projects[].name] | map(ascii_downcase) | group_by(.) | map(select(length > 1)) | .[0][0] // empty' "$STATE_FILE")
if [ -n "$DUPLICATE_NAMES" ]; then
  echo "⚠️  Duplicate project name detected: $DUPLICATE_NAMES"
fi

# Validate project ID format
INVALID_IDS=$(jq -r '.projects[] | select(.id | test("^[A-Za-z]{1,10}[-]?[0-9]{3,6}$") | not) | .id' "$STATE_FILE")
if [ -n "$INVALID_IDS" ]; then
  echo "❌ Invalid project ID format:"
  echo "$INVALID_IDS"
  exit 1
fi

echo "✅ Project ID format valid"

# Validate status values
INVALID_STATUS=$(jq -r '.projects[] | select(.status != "in-progress" and .status != "paused" and .status != "overdue" and .status != "archived") | .id + ": " + .status' "$STATE_FILE")
if [ -n "$INVALID_STATUS" ]; then
  echo "❌ Invalid status value(s):"
  echo "$INVALID_STATUS"
  exit 1
fi

echo "✅ Status values valid"

# Validate category values
MISSING_CATEGORY=$(jq -r '.projects[] | select(.category == null or .category == "") | .id' "$STATE_FILE")
if [ -n "$MISSING_CATEGORY" ]; then
  echo "⚠️  Project(s) missing category: $MISSING_CATEGORY"
fi

INVALID_CATEGORY=$(jq -r '.projects[] | select(.category != null and .category != "") | select(.category | IN("client","product","internal","marketing","research","operations","finance","sales","legal","it") | not) | .id + ": " + .category' "$STATE_FILE")
if [ -n "$INVALID_CATEGORY" ]; then
  echo "⚠️  Invalid category value(s):"
  echo "$INVALID_CATEGORY"
fi

# Validate paused projects have pausedReason
PAUSED_NO_REASON=$(jq -r '.projects[] | select(.status == "paused" and (.pausedReason == null or .pausedReason == "")) | .id' "$STATE_FILE")
if [ -n "$PAUSED_NO_REASON" ]; then
  echo "⚠️  Paused project(s) without reason: $PAUSED_NO_REASON"
fi

# Check session history length
HISTORY_COUNT=$(jq '.sessionHistory | length' "$STATE_FILE")
if [ "$HISTORY_COUNT" -gt 20 ]; then
  echo "⚠️  Session history has $HISTORY_COUNT entries (max 20). Trim oldest."
fi

# Project count summary
TOTAL=$(jq '.projects | length' "$STATE_FILE")
ACTIVE=$(jq '[.projects[] | select(.status == "in-progress")] | length' "$STATE_FILE")
PAUSED=$(jq '[.projects[] | select(.status == "paused")] | length' "$STATE_FILE")
OVERDUE=$(jq '[.projects[] | select(.status == "overdue")] | length' "$STATE_FILE")
ARCHIVED=$(jq '[.projects[] | select(.status == "archived")] | length' "$STATE_FILE")

echo "✅ Projects: $TOTAL total ($ACTIVE active, $PAUSED paused, $OVERDUE overdue, $ARCHIVED archived)"

# Schema validation (if ajv-cli installed)
if [ -f "$SCHEMA_FILE" ]; then
  if command -v ajv &>/dev/null; then
    if ajv validate -s "$SCHEMA_FILE" -d "$STATE_FILE" 2>/dev/null; then
      echo "✅ Schema validation passed"
    else
      echo "❌ Schema validation failed"
      exit 1
    fi
  else
    echo "ℹ️  ajv-cli not installed — schema validation skipped (install: npm install -g ajv-cli)"
  fi
else
  echo "ℹ️  Schema file not found — schema validation skipped"
fi

echo ""
echo "✅ State validation passed"
exit 0
