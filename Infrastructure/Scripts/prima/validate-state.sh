#!/bin/bash
# Validate state.json is valid JSON and check required fields
# Called by skills after writing to state files

set -e

STATE=".claude/state/state.json"
SCHEMA=".claude/state/state.schema.json"

if [ ! -f "$STATE" ]; then
  echo "Error: State file not found at $STATE"
  exit 1
fi

# Check valid JSON
if command -v jq &> /dev/null; then
  if jq -e . >/dev/null 2>&1 < "$STATE"; then
    echo "Valid JSON: $STATE"
  else
    echo "Error: $STATE is not valid JSON"
    exit 1
  fi

  # Check required fields
  VERSION=$(jq -r '.version // empty' "$STATE")
  WORKSPACE=$(jq -r '.workspace.name // empty' "$STATE")
  PROJECTS=$(jq -r '.projects | length' "$STATE")

  echo "Version: ${VERSION:-not set}"
  echo "Workspace: ${WORKSPACE:-not set}"
  echo "Projects: $PROJECTS"

  # Check project detail files exist for each project
  for ID in $(jq -r '.projects[].id' "$STATE" 2>/dev/null); do
    DETAIL=".claude/state/projects/${ID}.json"
    if [ -f "$DETAIL" ]; then
      if jq -e . >/dev/null 2>&1 < "$DETAIL"; then
        echo "  $ID: valid"
      else
        echo "  $ID: invalid JSON in $DETAIL"
      fi
    else
      echo "  $ID: detail file missing ($DETAIL)"
    fi
  done
else
  echo "Warning: jq not found. Install jq for full validation."
  # Fallback: basic JSON check with Python
  if command -v python3 &> /dev/null; then
    python3 -c "import json; json.load(open('$STATE'))" 2>/dev/null && echo "Valid JSON (python3 check)" || echo "Error: Invalid JSON"
  else
    echo "Cannot validate: neither jq nor python3 available"
  fi
fi
