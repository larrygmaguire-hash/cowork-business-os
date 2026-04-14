# Cloud Sync Warning

If you store this workspace inside a cloud-synced folder (iCloud, Dropbox, Google Drive, OneDrive), be aware of the following risks.

---

## The Risks

### 1. State file corruption
`.claude/state/state.json` is written frequently. Cloud sync clients can race with Claude's writes, leading to conflicts or truncated files. Worst case: you open Cowork and your project history is gone.

### 2. Git conflicts across machines
If you work on this workspace on multiple machines with cloud sync, you end up with conflicts between the sync'd copy and git. Cloud sync does not understand git. The safe pattern is git only, no cloud sync.

### 3. Large backups
State backups accumulate in `.claude/state.backups/`. Over time, these can slow cloud sync.

### 4. File locking issues
Some cloud sync clients lock files during upload. If Claude tries to write to state.json while it is locked, the write fails.

---

## Recommended Setup

### Option A: Git only (recommended)
1. Keep this workspace in a local, non-cloud-synced folder (e.g., `~/Developer/my-business-os/`)
2. Push to GitHub via the `syncing-workspace` skill
3. On another machine, clone from GitHub
4. Never store the working directory in iCloud, Dropbox, or similar

This is the cleanest pattern. Git handles versioning. Cloud sync is not needed.

### Option B: Cloud sync without git
1. Keep the workspace in a cloud-synced folder
2. Do not initialise git in the workspace
3. Rely on cloud sync for backup

This works but you lose git history, proper merging, and the ability to roll back changes.

### Option C: Both (risky)
1. Keep the workspace in a cloud-synced folder
2. Also use git

This is the combination that causes problems. If you must do this, add the sync folder's temp files to `.gitignore` (e.g., `.DS_Store`, `.dropbox.cache`, `*.icloud`), do not work on the same workspace simultaneously on multiple machines, and pause cloud sync before doing git operations.

---

## What to Do If You Are Already Cloud-Synced

1. Check for conflicts: `git status` should not show any `*.conflicting copy*` files
2. If you see corrupted state.json, restore from `.claude/state.backups/`
3. Consider migrating to a local folder and pushing only to GitHub
4. Add cloud-sync temp files to `.gitignore`:
   ```
   # macOS
   .DS_Store
   .AppleDouble
   .LSOverride

   # iCloud
   *.icloud

   # Dropbox
   .dropbox
   .dropbox.attr
   .dropbox.cache

   # OneDrive
   ~$*
   ```

The provided `.gitignore` already covers most of these.

---

## The Safe Default

**Keep this workspace in a local folder. Use git for version control. Use GitHub for sync across machines.** Cloud sync is a shortcut that creates real problems for Claude's state management.
