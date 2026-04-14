---
name: upgrade-workspace
description: >
  Check for, plan, and apply upgrades to the Cowork Business OS template installed in this workspace.
  Use when the user asks to "check for template updates", "upgrade the template",
  "is there a new version of Cowork Business OS", or similar.
  Backs up the workspace, updates only engine-owned files, leaves user-owned files untouched,
  and handles conflicts on customised files.
---

# Upgrade Workspace

Safely applies Cowork Business OS template upgrades to this workspace. Reads `.claude/engine-manifest.json` to know what to update. Follows the process documented in `.claude/docs/upgrading.md`.

## Pre-flight

Before starting, verify dependencies on the user's machine:

```bash
for cmd in curl tar jq diff; do
  if ! command -v $cmd &> /dev/null; then
    echo "Missing: $cmd"
  fi
done
```

If anything is missing, stop and tell the user to install it. Install hints live in `.claude/docs/upgrading.md`.

---

## Part 1: Check for updates

Read the user's current version:

```bash
CURRENT_VERSION=$(jq -r '.templateVersion // empty' .claude/state/state.json)
```

**If `templateVersion` is empty or missing:** the workspace was installed before the upgrade skill existed. Use a Decision checkpoint:

```
I cannot determine which version of the Cowork Business OS template you installed.
The templateVersion field is missing from your state.json.

What version did you install?

A) 2.0.0 -- the first public release (April 2026)
B) I don't know -- treat as 2.0.0 and apply all updates since then
C) Check the VERSION file at my repo root -- I'll read it and use that

Which? (A / B / C)
```

If C, read the `VERSION` file at the repo root and use that value. If A or B, set `CURRENT_VERSION=2.0.0`. Write the chosen value to `state.json.templateVersion` before proceeding.

Fetch the latest release version from GitHub:

```bash
LATEST_VERSION=$(curl -sL https://api.github.com/repos/larrygmaguire-hash/cowork-business-os/releases/latest | jq -r '.tag_name' | sed 's/^v//')
```

Handle failure cases:

- If `curl` fails (no network): report that and stop
- If the response doesn't parse (API rate limit, GitHub down): report the HTTP status and stop
- If `LATEST_VERSION == CURRENT_VERSION`: report "Already up to date" and stop
- If `LATEST_VERSION` sorts earlier than `CURRENT_VERSION`: warn that the user is on a newer version than the latest published release and stop

Present the outcome:

```
Current template version: [CURRENT]
Latest available: [LATEST]

Update available.
```

## Part 2: Show the changelog

Fetch `CHANGELOG.md` for the latest version and extract the sections between the user's current version and latest:

```bash
CHANGELOG=$(curl -sL "https://raw.githubusercontent.com/larrygmaguire-hash/cowork-business-os/v${LATEST_VERSION}/CHANGELOG.md")
```

Show the user the changelog entries between their version and latest. Then ask:

```
Proceed to build an upgrade plan? (yes / no)
```

If no, stop. If yes, proceed.

## Part 3: Fetch the new version

Download the new version to a temp directory:

```bash
TMPDIR="/tmp/cowork-upgrade-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$TMPDIR"
curl -sL "https://github.com/larrygmaguire-hash/cowork-business-os/archive/refs/tags/v${LATEST_VERSION}.tar.gz" -o "$TMPDIR/template.tar.gz"
tar -xzf "$TMPDIR/template.tar.gz" -C "$TMPDIR" --strip-components=1
```

Verify the extraction succeeded and the new `engine-manifest.json` exists:

```bash
if [ ! -f "$TMPDIR/.claude/engine-manifest.json" ]; then
  echo "Error: engine manifest missing from downloaded template"
  exit 1
fi
```

## Part 4: Build the plan

Compare every file in the new manifest against the user's workspace:

1. **For each path in `classifications.engine`:**
   - If file doesn't exist in user workspace: mark as ADD
   - If file exists and is identical: SKIP (silently, no action)
   - If file exists and differs: check if the user has modified it since install (see "Detecting user modifications" below)
     - If not modified: mark as UPDATE (safe)
     - If modified: mark as CONFLICT (needs user decision)

2. **For each path in `classifications.seed`:**
   - If file doesn't exist in user workspace: mark as ADD
   - If file exists and is identical to new version: SKIP
   - If file exists and differs: mark as SEED_CHANGED (user must decide)

3. **For each path in `classifications.user`:** always SKIP, do not compare

4. **For each path in `classifications.sample`:** always SKIP (samples are treated as user-owned after setup)

5. **For each file in the current workspace matching `classifications.engine` that is NOT in the new manifest:** mark as REMOVE (the new version removed it)

### Detecting user modifications

For engine files, compare the user's current file against the same file in the version they installed (the "installed baseline"). If they match, the user has not modified. If they differ, they have.

The installed baseline is fetched the same way as the new version:

```bash
BASELINE_DIR="/tmp/cowork-baseline-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BASELINE_DIR"
curl -sL "https://github.com/larrygmaguire-hash/cowork-business-os/archive/refs/tags/v${CURRENT_VERSION}.tar.gz" -o "$BASELINE_DIR/baseline.tar.gz"
tar -xzf "$BASELINE_DIR/baseline.tar.gz" -C "$BASELINE_DIR" --strip-components=1
```

For each engine file, `diff` the user's current file against the baseline. Identical means unmodified. Different means user has modified.

Present the plan in a structured way:

```
**Upgrade plan: [CURRENT] → [LATEST]**

Engine files to update (safe):
  ~ .claude/skills/copywriting/SKILL.md (changed upstream)
  ~ .claude/FRAMEWORK.md (changed upstream)

Engine files you've modified (CONFLICT):
  ! .claude/skills/email-drafting/SKILL.md
    Options: Overwrite / Keep mine / Show diff / Fork to new name

New engine files to add:
  + .claude/skills/scheduling-appointments/

Engine files removed upstream:
  - .claude/skills/deprecated-skill/ (no longer in template)

Seed files that changed (you may have customised):
  ! .claude/docs/getting-started.md
    Options: Keep mine / Take new / Show diff

Your files (will not be touched):
  ✓ [count] projects, [count] clients, state, company knowledge, your CLAUDE.md

Ready to proceed? (yes / no / resolve conflicts first)
```

If there are conflicts, walk through them one at a time using Decision checkpoints. Record decisions in `.claude/config/upgrade-preferences.json` so the skill doesn't re-ask on future upgrades (unless the user explicitly asks to reset preferences).

## Part 5: Back up

Before any change, tar the whole workspace:

```bash
BACKUP="/Users/[user]/Documents/Agent Outputs/upgrade-backups/pre-upgrade-${CURRENT_VERSION}-$(date +%Y%m%d_%H%M%S).tar.gz"
mkdir -p "$(dirname "$BACKUP")"
tar -czf "$BACKUP" \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.DS_Store' \
  .
echo "Backup: $BACKUP"
```

Store the backup path for the final report.

## Part 6: Apply changes

Apply each action from the plan:

```bash
# UPDATE and ADD: copy from TMPDIR to workspace
cp -r "$TMPDIR/.claude/skills/copywriting/" ".claude/skills/copywriting/"

# REMOVE: delete the file or folder
rm -rf ".claude/skills/deprecated-skill/"

# CONFLICT resolutions:
#   Overwrite: cp from TMPDIR
#   Keep mine: no action
#   Fork to new name: mv user's version to new path, then cp from TMPDIR
```

Then update `templateVersion` in `state.json`:

```bash
TMP=$(mktemp)
jq --arg v "$LATEST_VERSION" '.templateVersion = $v' .claude/state/state.json > "$TMP" && mv "$TMP" .claude/state/state.json
```

## Part 7: Verify

Run validation:

```bash
bash Infrastructure/Scripts/prima/validate-state.sh
```

If validation fails, alert the user and offer to restore from the backup.

## Part 8: Clean up and report

Delete the temp directories:

```bash
rm -rf "$TMPDIR" "$BASELINE_DIR"
```

Report to the user:

```
**Upgrade complete: [CURRENT] → [LATEST]**

Changes applied:
  - [N] engine files updated
  - [N] new files added
  - [N] files removed
  - [N] seed files updated (or kept)
  - [N] conflicts resolved

Backup: [BACKUP_PATH]
Rollback command: tar -xzf "[BACKUP_PATH]" -C [workspace-root]

New capabilities in this version:
  [Summarise from the changelog — new skills, new docs, new conventions]

Anything requiring your attention:
  [Highlight any manual steps from the changelog, e.g. "New integrations.json
  fields — see .claude/config/CLAUDE.md for what to configure"]
```

## Error handling

### Network failure during fetch
Stop and report. The user can retry later.

### Disk space issue
Check `df -h "$TMPDIR"` before extracting. If under 100MB free, abort.

### Backup fails
Never proceed without a backup. If `tar -czf` fails, stop and report.

### Post-upgrade validation fails
Offer to restore:

```
Validation failed after upgrade. state.json has errors.

Restore from backup? (yes / no)

If yes: tar -xzf "[BACKUP_PATH]" -C [workspace-root]
```

### User aborts mid-upgrade
If the user says stop after Part 5 has run (backup exists) but before Part 6 completes, no files have changed yet. Just clean up temp dirs.

If the user says stop during Part 6 (changes in progress), offer to restore from the backup since the workspace may be in a partial state.

## Preferences file

The skill writes user decisions to `.claude/config/upgrade-preferences.json`:

```json
{
  "deletedEngineFiles": [
    ".claude/skills/deprecated-skill/"
  ],
  "customisedEngineFiles": {
    ".claude/skills/email-drafting/SKILL.md": {
      "decision": "fork",
      "forkPath": ".claude/skills/email-drafting-custom/SKILL.md",
      "recordedAt": "2026-04-14"
    }
  }
}
```

The skill reads this on each upgrade to avoid re-asking settled questions. The user can reset preferences by deleting the file or asking "reset my upgrade preferences".

## Manifest drift detection

If a file exists in the workspace that matches an `engine` path in the OLD manifest but is no longer in the NEW manifest (and not classified elsewhere in the new manifest), treat it as REMOVE. If a file in the workspace is not classified in either manifest, flag it to the user and ask what it is (possibly a user-created file that shouldn't be touched, or a leftover from a previous customisation).

## What this skill does NOT do

- Modify user-owned files (ever, under any circumstance except `.templateVersion` in state.json)
- Touch sample project/client folders once setup has completed
- Push or commit git changes (user handles git separately)
- Install missing dependencies (reports what's missing, doesn't install)
- Run migration scripts for major version bumps — those are separate skill invocations triggered when MAJOR version differs (e.g., 2.x → 3.0). The upgrade skill aborts on a major version change and directs the user to the migration skill.
