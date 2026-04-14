---
name: syncing-workspace
description: >
  Commit and push all changes to the remote repository. Automatically generates a descriptive commit message based on staged changes.
---

# Syncing Workspace

Commit all changes and push to the remote repository.

## Step 1: Check Status

```bash
git status
```

Review the output to see what files have been modified or created.

## Step 2: Stage All Changes

```bash
git add .
```

## Step 3: Generate Commit Message

Analyse the staged changes and generate a concise, descriptive message that captures what changed. Do not ask the user — decide autonomously based on the changes.

**Guidelines for commit message:**

- Reference project IDs (P###) if work was on a specific project
- Use active voice: "Add feature", "Fix bug", "Update documentation"
- Keep under 72 characters for the subject line
- Include a blank line then co-author trailer

Format:

```
[Brief description of changes]

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Step 4: Commit

```bash
git commit -m "$(cat <<'EOF'
[commit message]

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## Step 5: Push

```bash
git push
```

If a backup remote exists (check with `git remote -v`), push to backup as well:

```bash
git push backup
```

## Step 6: Confirm

Show:
- Number of files changed
- Commit hash (first 7 characters)
- Branch and remote updated

Example:

```
✓ Committed 12 files
Commit: a1b2c3d
Branch: main → origin
Ready to sync.
```

---

Begin by checking git status.
