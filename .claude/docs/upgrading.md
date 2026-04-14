# Upgrading Cowork Business OS

This guide explains how template updates reach your workspace, what gets changed and what is left alone, and how to recover if something goes wrong.

When a new version of the Cowork Business OS template is released, your workspace does not update automatically. You decide when to pull in the changes. This document explains the mechanics so you know what to expect.

---

## The short version

1. Ask Cowork: "check for template updates"
2. Cowork shows you what changed between your version and the latest
3. You review the plan and approve
4. Cowork backs up your workspace, updates the template-owned files, and leaves your own content alone
5. If any skills changed, Cowork redeploys them to `~/.claude/skills/` (via the same three options as the initial install — Cowork-driven Finder, user Finder, or Terminal)
6. You fully quit and reopen Claude Desktop so the updated skills register
7. Your `state.json` records the new version

---

## How the template tracks versions

Every release of Cowork Business OS has a version number following semantic versioning:

- **Patch** (`2.0.1`) — bug fixes, no changes to structure or behaviour
- **Minor** (`2.1.0`) — new skills, new reference docs, additive changes
- **Major** (`3.0.0`) — breaking changes to state schema, folder structure, or skill contracts (rare)

Three places in the repository carry the version:

- `VERSION` at the repo root — plain text, one line
- `CHANGELOG.md` at the repo root — dated entries for every release
- Git tags on GitHub (`v2.0.0`, `v2.1.0`, etc.)

Your workspace records which version you installed in `.claude/state/state.json` under a top-level `templateVersion` field. The `setup` skill sets this on first run; the `upgrade-workspace` skill updates it after a successful upgrade.

---

## What gets updated, what gets left alone

This is the most important part to understand. Every file in the template is classified as one of three types in `.claude/engine-manifest.json`:

### Engine files — updated automatically

Files the template owns. Your upgrades overwrite these without asking because they are meant to be the same across every installation.

- All files under `.claude/skills/` (the skill definitions, their reference docs)
- `.claude/FRAMEWORK.md`
- `.claude/docs/specification.md`
- `.claude/docs/departments.md`
- `.claude/docs/upgrading.md` (this file)
- `.claude/state/state.schema.json`
- Scripts under `Infrastructure/Scripts/prima/`

If you have modified an engine file, your modification will be flagged before overwrite. See "Conflicts" below.

### User files — never touched

Files you own. Upgrades skip these entirely.

- `.claude/CLAUDE.md` (your customised master instructions)
- `.claude/company/*` (overview, voice, brand, audiences, team, industry)
- `.claude/config/*`
- `.claude/state/state.json` (except the `templateVersion` field)
- `.claude/state/projects/*`
- `Projects/`, `Clients/`, `Archive/`
- `Documentation/`
- Department folders (`01 Finance/`, `02 Human Resources/`, etc.) and their `CLAUDE.md` files — once you've configured them, they're yours

### Seed files — installed once, flagged on upgrade

Files the template ships as starting points for you to customise. The upgrade skill compares your version to the new version and asks what to do when they differ.

- `.claude/docs/getting-started.md`
- `.claude/docs/folder-structure.md`
- `.claude/docs/global-instructions.md`
- `.claude/docs/profile-preferences.md`
- `.claude/docs/capabilities-reference.md`
- `.claude/docs/glossary.md`
- `.claude/docs/cloud-sync-warning.md`
- `.claude/docs/available-automations.md`

For each changed seed file, you can choose:

- **Keep mine** — your customised version stays
- **Take new** — replace with the latest template version (your customisations are lost)
- **Show diff** — see what changed, decide later

---

## The upgrade process step by step

### Step 1: Check for updates

Ask Cowork:

```
"Check for template updates"
```

or

```
"Is there a new version of Cowork Business OS?"
```

The `upgrade-workspace` skill activates and runs:

```bash
curl -sL https://api.github.com/repos/larrygmaguire-hash/cowork-business-os/releases/latest
```

This returns the latest published version. The skill compares it to your `templateVersion` in `state.json`.

Outcomes:
- **Already up to date** — the skill reports no updates available and stops
- **Updates available** — the skill proceeds to the next step

### Step 2: Show what changed

The skill fetches the `CHANGELOG.md` for the new version and shows you what's new between your version and the latest. You see things like:

```
Available: 2.0.0 → 2.1.0

Changes:
- Added scheduling-appointments skill
- Updated copywriting skill with new platform-specs reference
- Fixed a bug in validate-state.sh
- New doc: .claude/docs/departments.md

Proceed to plan? (yes / no / show me the detailed changelog)
```

### Step 3: Build the upgrade plan

The skill downloads the new template version to a temporary folder (`/tmp/cowork-upgrade-<timestamp>/`) and reads its engine manifest. It then compares every file in the manifest against your workspace and builds a plan.

You see:

```
Upgrade plan: 2.0.0 → 2.1.0

Engine files to update:
  ~ .claude/skills/copywriting/SKILL.md (changed)
  ~ .claude/FRAMEWORK.md (changed)
  ~ Infrastructure/Scripts/prima/validate-state.sh (bugfix)
  + .claude/skills/scheduling-appointments/ (new skill)
  + .claude/docs/departments.md (new)

Seed files that changed (you may have customised these):
  ! .claude/docs/getting-started.md
     → Keep mine / Take new / Show diff

Files you've modified that will be overwritten:
  (none)

Your files — untouched:
  ✓ 12 projects, 4 clients, 6 company knowledge files, state, your CLAUDE.md

Proceed with upgrade? (yes / no / customise)
```

If you chose `customise`, you can exclude specific engine files from being updated or keep specific seed files unchanged.

### Step 4: Backup

Before any file changes, the skill creates a full backup:

```bash
tar -czf .claude/state.backups/pre-upgrade-2.0.0-20261015_1430.tar.gz \
  .claude/ Projects/ Clients/ Archive/ Documentation/ \
  "01 Finance/" "02 Human Resources/" ... etc.
```

The backup path is shown in the report at the end so you can restore if anything is wrong.

### Step 5: Apply changes

The skill copies engine files from the temp folder into your workspace, adds new engine files, removes deleted engine files (if any), and applies your decisions on seed files. It then updates `templateVersion` in `state.json`.

### Step 6: Verify

The skill runs `Infrastructure/Scripts/prima/validate-state.sh` to confirm `state.json` is still valid after the upgrade.

### Step 6a: Redeploy changed skills

If the upgrade changed any files under `.claude/skills/`, those changes are in the workspace repo but not yet in Cowork's active skills registry at `~/.claude/skills/`. The skill offers the same three options as the initial install:

- **Option A** — Cowork drives Finder to copy the changed skill folders into `~/.claude/skills/`
- **Option B** — You do the copy in Finder yourself
- **Option C** — You run a `cp -R` command in Terminal

After the copy completes, Claude Desktop must be fully quit and reopened before the updated skills register. The upgrade skill reminds you of this at the end.

If no skills changed in the upgrade, this step is skipped.

### Step 7: Clean up and report

The skill deletes the temp folder and reports:

```
Upgrade complete: 2.0.0 → 2.1.0

Changes applied:
  - Updated 2 skills (copywriting, email-drafting)
  - Added 1 new skill (scheduling-appointments)
  - Added 1 reference doc (departments.md)
  - Kept your customised getting-started.md

Backup: .claude/state.backups/pre-upgrade-2.0.0-20261015_1430.tar.gz

New capability available:
  The scheduling-appointments skill triggers on "schedule a call",
  "book an appointment", "find a time". Read .claude/skills/scheduling-appointments/SKILL.md
  for full details.
```

---

## Conflicts

### You have modified an engine file

The skill flags this before the upgrade runs:

```
Conflict: you have modified an engine file.

File: .claude/skills/copywriting/SKILL.md
Your changes differ from both version 2.0.0 and 2.1.0 of the template.

Options:
A) Overwrite with 2.1.0 — your modifications are lost
B) Keep your version — you miss the upstream update
C) Show both files side by side — I'll open them in a diff tool
D) Save my version to a fork — copy your modified version to
   .claude/skills/copywriting-customised/SKILL.md (a new skill you own),
   then take the upstream update to the original

Which? (A / B / C / D)
```

**Recommendation:** if you want to customise an engine file, fork it (option D) so your version lives as a new skill or file that won't conflict with upstream updates.

### You have deleted an engine file

For example, you removed a skill you didn't need. The skill detects this:

```
You've removed an engine file that exists in 2.1.0.

File: .claude/skills/creating-presentations/
Upstream status: updated in 2.1.0

Options:
A) Leave removed — I'll remember your choice for future upgrades
B) Restore with the 2.1.0 version

Which? (A / B)
```

The skill records deletion choices in `.claude/config/upgrade-preferences.json` so it doesn't re-ask on every upgrade.

### Breaking schema change

Major version upgrades (e.g., 2.x → 3.0) may change the state schema or folder structure. Each such release ships a migration script in `Infrastructure/Scripts/migrations/v<old>-to-v<new>.sh`. The upgrade skill runs it as part of the process and reports what the migration did.

You will always see a warning before a major upgrade runs, and a full backup is made before any migration script executes.

---

## Rolling back an upgrade

If something breaks after an upgrade, restore from the pre-upgrade backup:

```bash
# Show the backup path
ls -lt .claude/state.backups/pre-upgrade-*.tar.gz | head -1

# Stop any in-progress work first, then restore
cd [your workspace root]
tar -xzf .claude/state.backups/pre-upgrade-2.0.0-20261015_1430.tar.gz
```

The backup restores the whole workspace to its state before the upgrade. Your `templateVersion` also reverts so the skill sees you as being on the old version again.

---

## Dependencies

The upgrade skill uses standard Unix tools. You need:

- `curl` — for fetching releases and API responses (standard on macOS, Linux, and WSL)
- `tar` — for backup and extraction (standard on macOS, Linux, and WSL)
- `jq` — for reading the engine manifest and state.json
- `diff` — for showing file differences (standard)

If `jq` is not installed, Cowork will tell you before starting. Install with:

- macOS: `brew install jq`
- Ubuntu/Debian/WSL: `sudo apt install jq`
- Windows without WSL: not supported — use WSL

---

## How often to upgrade

- **Patch releases** (bug fixes) — upgrade whenever you see them
- **Minor releases** (new skills, reference docs) — upgrade when the new features interest you
- **Major releases** (breaking changes) — review the migration notes before upgrading; test on a backup first if you rely on the workspace for daily work

The `CHANGELOG.md` in the repo root always describes what changed. Read it before you run the upgrade.

---

## If you installed before the upgrade skill existed

Some early clones of Cowork Business OS do not have a `templateVersion` field in `state.json`. The upgrade skill will detect this and ask you to declare your installed version:

```
I cannot determine which version of the template you installed.
Cowork Business OS introduced the upgrade skill in 2.1.0.

What version did you install? (check `VERSION` at the repo root if present,
or guess the closest match. If unsure, say "unknown" — I'll treat you as
being on 2.0.0 and apply all upgrades since then.)
```

After a successful upgrade, `templateVersion` is set correctly and you are on the automated path for all future upgrades.

---

## Summary

| If you… | Outcome |
|---------|---------|
| Never run the upgrade skill | Your workspace stays on the version you installed, indefinitely |
| Run it on a clean workspace (no customised engine files) | Upgrade is automatic, non-interactive, safe |
| Run it after modifying engine files | You'll be prompted per file — choose carefully |
| Run it after modifying seed files | You'll be prompted per file with a keep/take/diff option |
| Run it and hit a problem | Restore from the pre-upgrade backup |

The upgrade skill is conservative by default. It never touches your projects, clients, state data, company knowledge, or anything else you've created. Engine file updates and bug fixes reach you without losing your work.
