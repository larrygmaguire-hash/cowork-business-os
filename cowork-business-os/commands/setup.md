---
description: Scaffold a Cowork Business OS workspace into a folder you choose
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

First-time workspace setup for Cowork Business OS. Runs a short wizard to collect basic details, then writes the workspace scaffolding into a folder of the user's choice by reading templates bundled with this plugin.

Run this once, the first time you install `cowork-business-os`.

## Step 1 — Introduce the setup

Tell the user what is about to happen:

```
I will scaffold a Cowork Business OS workspace for you. This takes about 5 minutes.

I will ask for a few details (company name, industry, cloud storage location), then write the workspace structure into a folder you pick. I will ask you to confirm before writing anything to disk.
```

## Step 2 — Collect details sequentially

Ask these questions one at a time. Wait for each answer before moving to the next.

1. **Target folder** — "Where should the workspace be created? Give me the full path to the folder (it will be created if it does not exist). Example: `/Users/you/Documents/Acme-Biz-OS`."
2. **Company name** — "What is your company or organisation name?"
3. **Workspace type** — "Is this a `workspace` (mixed work), a `client` workspace (work for one specific client), or a `personal` workspace?"
4. **Industry** — "What industry are you in?"
5. **Primary use cases** — "What are the main things you plan to use this workspace for? One or two lines."
6. **Cloud storage** — "Where do you keep large files? Give me the provider (Google Drive / OneDrive / Dropbox / iCloud / Local) and the full path to the synced folder."
7. **Language variant** — "UK English or US English?"
8. **Primary contact** — "What name should Cowork use when addressing you?"

## Step 3 — Confirm before writing

Show the user a summary:

```
I am about to scaffold the workspace:

  Folder:         [target folder]
  Company:        [COMPANY_NAME]
  Workspace ID:   [workspace-id — derived from company name, lowercased with hyphens]
  Type:           [workspace-type]
  Industry:       [INDUSTRY]
  Cloud storage:  [CLOUD_STORAGE_PATH]
  Language:       [UK | US English]

I will write the full workspace tree including `.claude/` (rules, company files, state, docs), the Projects/Clients/Archive folders, and the numbered business folders (01 Finance, 02 Human Resources, and so on).

Write now? (yes / edit / cancel)
```

If the user says `edit`, go back to Step 2 for whichever field needs changing. If `cancel`, stop and say nothing was written.

## Step 4 — Write the workspace

On confirmation:

1. If the target folder does not exist, create it (and any parent directories).
2. For each file and folder under `${CLAUDE_PLUGIN_ROOT}/templates/workspace/`:
   - Read the file from the plugin template directory.
   - Substitute placeholders (see Step 4a).
   - Write to the corresponding path inside the target folder using the Write tool.
3. Expect Cowork to prompt the user for write permission on the target folder. This is normal — tell them to approve it.

### Step 4a — Placeholder substitution

Replace these placeholders in every file written:

| Placeholder | Value |
|-------------|-------|
| `[COMPANY_NAME]` | Company name |
| `[workspace-id]` | kebab-case derived from company name |
| `[INDUSTRY]` | Industry |
| `[PRIMARY USE CASES]` | Primary use cases |
| `[CLOUD_STORAGE_PATH]` | Cloud storage path |
| `[YYYY-MM-DD]` | Today's date (from the system) |
| `[SETUP_DATE]` | Today's date (from the system) |
| `[workspace\|client\|personal]` | Workspace type chosen at Step 2 |

Files to substitute placeholders in:
- `.claude/CLAUDE.md`
- `.claude/state/state.json`
- `.claude/config/integrations.json`
- `.claude/company/*.md` (if the placeholder text matches — some files use `[ORGANISATION_NAME]` etc.)

### Step 4b — Language variant

If the user chose `US English`, update `.claude/rules/content-defaults.md` to reflect US spelling. If `UK English`, leave as-is (UK is the default).

## Step 5 — Summary

After writing, show:

```
Workspace created at [target folder].

Written:
  .claude/          (CLAUDE.md, rules, company files, state, docs, config)
  Projects/
  Clients/
  Archive/
  Documentation/
    Onboarding/     (Personal Preferences + Cowork Global Instructions guides)
  01 Finance/ through 07 Legal/ (standard business folders)
  Infrastructure/Scripts/prima/ (state backup and validate scripts)

Your workspace structure is ready — but there is one more step before you start using it. See Step 6.
```

## Step 6 — Set up your Cowork preferences (required, ~10 minutes)

This is the step people forget. Without it, Cowork does not know who you are or how you want it to work with you on your machine. Both pieces have been written to your workspace as guides — you run them in a **fresh Claude Desktop chat** (not inside this workspace, not inside any project), and they walk you through producing two pasteable blocks.

Show this to the user:

```
Two final things before Cowork Business OS is ready to use. Each takes under ten minutes using the Fast Path.

Both guides are already in your workspace at:

  [TARGET_FOLDER]/Documentation/Onboarding/

Do them in order:

1. Personal Preferences (~5 min).
   Open Onboarding-Guide-1-Personal-Preferences.md.
   Follow the steps under "How to Use This Document".
   Final output goes into Claude Desktop → Settings → General → Personal Preferences.

   This is the account-wide profile about you (your role, organisation, typical
   work, terminology). It loads into every Claude conversation from then on.

2. Cowork Global Instructions (~8 min).
   Open Onboarding-Guide-2-Cowork-Global-Instructions.md.
   Follow the same pattern.
   Final output goes into Claude Desktop → Settings → Cowork → Global Instructions.

   This is the standing brief for how Claude should behave when it is working on
   your computer (language conventions, tone, file-handling rules, stopping
   rules). It loads into every Cowork session.

Important: Do each one in a FRESH Claude Desktop chat — not this conversation,
not inside your new workspace, not inside any project. The interview needs a
clean slate because Cowork will load your new preferences into every future
session once you save them.

Once both are saved, Cowork Business OS is ready to use. Open this workspace
folder in Cowork and start asking Claude for help with your work.

Optional next plugins:
  - prima-project-management for /day, /night, /newproject, /status and more
  - prima-memory for searchable session history
  - prima-scholar for academic research workflows
```

## Step 7 — Re-run behaviour

If `/setup` is invoked on a folder that already contains a `.claude/` directory, stop and warn:

```
This folder already contains a Cowork Business OS workspace (.claude/ is present). Running setup again will overwrite configuration files.

Do you want to:
  1. Cancel (recommended)
  2. Proceed and overwrite everything

Type 1 or 2.
```

Never overwrite without explicit confirmation.

## Notes on what this command does and does not do

- It **writes files to disk** at a path the user chooses. The user will see a permission prompt from Cowork — that is expected, not a bug.
- It does **not** commit anything to git. If the user wants git version control, they run `git init` themselves after.
- It does **not** install other plugins. The recommended `prima-*` plugins must be installed separately through Cowork's plugin manager.
- It does **not** modify any files outside the target folder.
