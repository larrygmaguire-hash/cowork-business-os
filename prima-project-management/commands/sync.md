---
description: Commit and push changes to sync across devices
allowed-tools: Read, Bash
model: haiku
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

Commit local changes, push to remote, and pull any remote changes — keeping all devices in sync.

## Session Lifecycle Context

`/sync` is the standalone sync command. It is part of a three-command session lifecycle:

| Command | When | Git operation |
|---------|------|---------------|
| `/prima-project-management:day` | Start of session | `git pull` then briefing |
| `/prima-project-management:sync` | Mid-session or when not using `/day`/`/night` | commit + push + pull |
| `/prima-project-management:night` | End of session | state update + commit + `git push` |

If you ran `/prima-project-management:day` at the start and plan to run `/prima-project-management:night` at the end, `/prima-project-management:sync` is not needed mid-session unless you want to checkpoint work to remote. Use `/prima-project-management:sync` when:
- Switching machines without a full `/night` → `/day` cycle
- Working without a structured session (no `/day` or `/night`)
- Pushing a checkpoint mid-session to protect work in progress

## Process

0. **Workspace identity validation**:
   - Read `workspace.githubRepo` from `.claude/state/state.json`
   - If not empty, compare against `git remote get-url origin`
   - If mismatch: **ABORT** and show error. Never push to wrong remote.

1. **Check git status** to see what will be committed:
   ```bash
   git status
   ```

2. **If there are local changes — commit and push**:

   a. Stage all changes:
   ```bash
   git add .
   ```

   b. Generate commit message automatically:
   - Analyse the staged changes
   - Create a concise, descriptive commit message based on what changed
   - Never ask the user for a message — decide autonomously

   c. Create commit:
   ```bash
   git commit -m "$(cat <<'EOF'
   [commit message here]

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

   d. Push to remote:
   ```bash
   git push
   ```

3. **Pull from remote** (always — whether or not there were local changes):
   ```bash
   git pull
   ```

   Handle the outcome:

   - **Clean pull** → proceed to step 4
   - **Already up to date** → proceed to step 4
   - **Merge conflict** → see Conflict Resolution below

4. **Confirm completion** by showing:
   - Files committed and pushed (if any)
   - Files pulled from remote (if any)
   - Current branch and remote status

---

## Conflict Resolution

If `git pull` results in merge conflicts:

1. **Stop immediately** — do not attempt to auto-resolve
2. **List conflicted files**:
   ```bash
   git diff --name-only --diff-filter=U
   ```
3. **Report to the user** with this format:
   ```
   Merge conflict in N file(s):
   - path/to/file1
   - path/to/file2

   Options:
   A) Keep local version (ours)
   B) Keep remote version (theirs)
   C) Open files and resolve manually, then tell me when done
   ```
4. **Wait for the user to choose** — never auto-resolve without instruction
5. **Apply the chosen resolution**:
   - Option A: `git checkout --ours <file>` for each, then `git add .` and `git commit`
   - Option B: `git checkout --theirs <file>` for each, then `git add .` and `git commit`
   - Option C: Wait for user confirmation, then `git add .` and `git commit`

**Never use `git merge --abort` without asking.** Aborting discards the pull and leaves the branches out of sync — only do this if the user explicitly requests it.

---

**Usage examples**:
- `/sync` — Commits local changes, pushes, then pulls remote changes
- `/sync` — No arguments needed; commit message is always auto-generated
