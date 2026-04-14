# Cowork Business OS

**Version:** 2.0.0

A free, ready-made business workspace for Claude Desktop (Cowork mode). Includes 21 pre-built skills, project state management, a setup wizard, and full documentation. Clone this template, run `/setup`, and have a complete business operating system running in Cowork in under 10 minutes.

---

## Table of Contents

1. [What is Cowork Business OS](#what-is-cowork-business-os)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [First-Time Setup](#first-time-setup)
5. [Daily Use](#daily-use)
6. [What You Get](#what-you-get)
7. [Workspace Structure](#workspace-structure)
8. [Customisation](#customisation)
9. [Updating from Upstream](#updating-from-upstream)
10. [Multi-Device Sync](#multi-device-sync)
11. [Backups](#backups)
12. [Troubleshooting](#troubleshooting)
13. [Cowork vs Claude Code](#cowork-vs-claude-code)
14. [Documentation](#documentation)
15. [Licence](#licence)

---

## What is Cowork Business OS

Cowork Business OS is a complete, opinionated workspace template for Claude Desktop. It gives you:

- A folder structure that handles projects, clients, departments, and archives
- A project tracking system with unique IDs (P001, P002...) and session continuity
- 21 pre-built skills covering content creation, document processing, project management, and session lifecycle
- Operational rules for autonomy, safety, file conventions, and content standards
- Six company knowledge files that Claude reads before producing any content on your behalf
- A setup wizard that personalises everything for your business in one session

You clone the template once. The setup wizard configures it for you. From then on, Cowork knows your business, your projects, your conventions, and how you want it to work.

---

## Requirements

- **[Claude Desktop](https://claude.ai/download)** -- the macOS or Windows app, with Cowork mode enabled. Cowork is the workspace mode in Claude Desktop where Claude can read and write files in a folder you select.
- **Git** -- installed on your machine. macOS comes with it. On Windows, install from [git-scm.com](https://git-scm.com).
- **A GitHub account** -- to clone the template. Create one at [github.com](https://github.com) if you do not have one.
- **Optional: a code editor** -- such as VS Code. You do not need one to use Cowork Business OS, but it helps for inspecting files.

You do not need:
- Programming knowledge
- Command-line experience beyond basic git
- Any paid subscriptions (Claude Desktop has a free tier)

---

## Installation

### Step 1: Create your copy of the template

1. Click the green **Use this template** button at the top of [this repository on GitHub](https://github.com/larrygmaguire-hash/cowork-business-os)
2. Choose **Create a new repository**
3. Pick an account (your personal account is fine)
4. Name your repository (e.g., `acme-business-os`)
5. Set visibility to **Private** (recommended -- this folder will hold your business state)
6. Click **Create repository**

### Step 2: Clone your repository to your machine

Open Terminal (macOS) or Git Bash (Windows). Choose where you want the workspace to live. **Do not put it inside iCloud, Dropbox, OneDrive, or Google Drive folders** ([cloud sync causes problems with state files](.claude/docs/cloud-sync-warning.md)).

A safe location: `~/Developer/your-business-name/` or `~/Documents/your-business-name/` (provided Documents is not iCloud-synced).

```bash
cd ~/Developer
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and the name you gave the repository.

### Step 3: Open the workspace in Claude Desktop

1. Open Claude Desktop
2. Switch to Cowork mode (look for the workspace selector in the app)
3. Select **Open Folder** or **Add Workspace** and navigate to the folder you just cloned
4. Cowork loads the workspace. You should see the file tree.

### Step 4: Run the setup wizard

In the Cowork chat, type:

```
/setup
```

The wizard begins. See the next section for what to expect.

---

## First-Time Setup

The `/setup` skill is an interactive wizard. It asks questions one at a time, generates configuration text, and tells you exactly what to paste where.

### Phase 1: About you (Profile Preferences)

The wizard asks six questions about you:

1. Your name
2. Your role or title
3. Where you are based
4. What you do professionally
5. UK or US English
6. Communication preferences (tone, detail level, things to avoid)

It then generates **Profile Preferences text** and shows it to you. You paste this into:

**Settings > Profile** in Claude Desktop

The wizard pauses and waits for you to confirm the paste before continuing.

### Phase 2: About your business (Global Instructions)

The wizard asks five questions about your business:

1. Business or organisation name
2. What the business does and who it serves
3. Multiple brands or roles (if any)
4. How Claude should write on your behalf (tone, formality)
5. Primary audiences

It then generates **Global Instructions text** -- a comprehensive block that includes:
- Your business identity
- A workspace bootstrap directive (tells Cowork to read CLAUDE.md, state.json, project CLAUDE.md files at correct paths, company knowledge files)
- The full skills inventory (so Cowork knows what is available)
- Graduated autonomy levels
- Blocked commands
- Checkpoint protocol
- State management discipline
- PDF processing rules
- Language and style standards

You paste this into:

**Settings > Cowork > Edit Global Instructions** in Claude Desktop

The wizard pauses and waits for you to confirm.

### Phase 3: Workspace folders

The wizard creates the standard workspace folders (`Projects/`, `Clients/`, `Documentation/`, etc.) automatically. It then asks which department folders you want:

- 01 Finance
- 02 Human Resources
- 03 Sales
- 04 Marketing
- 05 Operations
- 06 Products
- 07 Legal

You can pick any combination, all of them, or none. The wizard creates only the ones you select.

### Phase 4: Configure state

The wizard updates `.claude/state/state.json` with your workspace identity (name, ID, type, GitHub repo, created date). This is the project tracking system. From this point on, every project you create will be registered here.

### Phase 5: Company knowledge

The wizard asks about each of the six company knowledge files:

| File | Question |
|------|----------|
| `overview.md` | What does your business do? Who do you serve? Core value proposition? |
| `voice.md` | How should Claude write on your behalf? Tone, formality, language preferences? |
| `brand.md` | Brand colours, fonts, logos, visual identity? Where are assets stored? |
| `audiences.md` | Primary and secondary audiences? What do they need from you? |
| `team.md` | Key people, team members, collaborators, contacts? |
| `industry.md` | Industry terminology, regulations, context to know? |

You can answer each in detail or say "skip" to leave a placeholder for later. The wizard writes each file as you go.

### Phase 6: CLAUDE.md update

The wizard updates `.claude/CLAUDE.md` to fill in your workspace identity placeholders and content defaults (language, tone, formality from your earlier answers).

### Phase 7: Scheduled tasks (optional)

The wizard tells you about two optional scheduled tasks you can set up in Cowork:

- **Morning briefing** -- runs the `session-briefing` skill at a time you choose (e.g., 8:30am)
- **Evening close** -- runs the `session-close` skill at a time you choose (e.g., 6:00pm)

These keep your project state up to date automatically. You can set them up in Cowork's scheduled tasks panel, or skip them and run the skills manually whenever you want.

### Phase 8: Verify

The wizard reads back the key files to confirm everything is in place. It produces a final report showing what was created, what was skipped, and any manual steps remaining.

**Total time:** 10 to 20 minutes depending on how much detail you give for the company knowledge files.

---

## Daily Use

Once setup is complete, here is how the workspace operates day to day.

### Starting a session

Type `/session-briefing` (or just say "what should I work on today"). Cowork:
- Reads your project state
- Shows in-progress projects ordered by last worked date
- For each, displays where you stopped and what you completed last
- Flags projects not worked on for 7+ days
- Shows your priorities and pending items

### Working on projects

To create a new project: say "create a new project" or `/creating-projects`. The wizard:
- Asks for the name, category, priority, due date
- Assigns the next P### ID (P001, P002...)
- Creates the folder `Projects/P### Project Name/`
- Adds a `CLAUDE.md` inside the project folder with project-specific context
- Updates `.claude/state/state.json` with the index entry
- Creates `.claude/state/projects/P###.json` with project detail

To work on an existing project: just open files in that project folder. Cowork reads the project's CLAUDE.md automatically (because the Global Instructions bootstrap directs it to).

### Creating clients

Say "new client" or `/creating-clients`. The wizard:
- Asks for the client name, contacts, communication preferences
- Creates `Clients/[Client Name]/` with a CLAUDE.md
- Optionally creates a first project under the client

### Content creation

Just describe what you want:
- "Write a blog post about [topic]" → `copywriting` skill
- "Draft a proposal for [client]" → `drafting-documents` skill
- "Write a follow-up email to [name]" → `email-drafting` skill
- "Summarise this meeting transcript" → `meeting-notes` skill
- "Create a presentation about [topic]" → `creating-presentations` skill

Cowork picks the right skill, reads your `.claude/company/voice.md` for tone, reads `.claude/company/audiences.md` for context, and produces the work.

### Document processing

- "Extract text from this PDF" → `processing-pdfs`
- "Create a Word doc with..." → `processing-documents`
- "Build a spreadsheet that tracks..." → `processing-spreadsheets`

### Closing a session

Type `/session-close` (or say "wrap up for the day"). Cowork:
- Updates each project you touched today
- Records `stoppedAt` (where you left off), `lastAction` (what you completed)
- Prepends a `sessionHistory` entry
- Updates the top-level state with `recentWork`, priorities, and pending items
- Backs up state before writing

### Syncing to GitHub

Type `/syncing-workspace` (or say "sync"). Cowork commits all changes with an auto-generated message and pushes to your GitHub repository. This gives you backup and version history.

---

## What You Get

### 21 Pre-Built Skills

Cowork auto-detects these from `.claude/skills/[name]/SKILL.md`. Invoke by name (`/skill-name`) or just describe what you want.

| Category | Skills |
|----------|--------|
| Session management | session-briefing, session-close, saving-session, resuming-session |
| Project management | creating-projects, creating-clients, workspace-status, status-report |
| Git | syncing-workspace |
| Content creation | copywriting, drafting-documents, email-drafting, meeting-notes, documenting-workflows, creating-presentations, search-engine-optimisation |
| Document processing | processing-pdfs, processing-documents, processing-spreadsheets |
| Meta | setup, creating-skills |

Full descriptions and trigger phrases in [Available Automations](.claude/docs/available-automations.md).

### State Management

Every project gets a unique ID (P001, P002, ...) and is tracked in `.claude/state/state.json`. Project details live in individual files at `.claude/state/projects/P###.json`. Cowork knows what you worked on, where you stopped, and what to do next. Session continuity persists across context limits and conversations.

### Company Knowledge

Six files in `.claude/company/` store your business context. Skills read these automatically before producing content.

### Operational Rules

The template includes:
- **Graduated Autonomy** -- four levels determining when Claude acts vs asks
- **Checkpoint Protocol** -- standardised Review/Decision/Action pause points
- **Blocked Commands** -- confirmation required for destructive operations
- **No Permission Prompts** -- when you say edit, Claude edits
- **PDF Processing Scale** -- five-level approach for handling PDFs by size
- **State Validation** -- backup before write, validate after

All embedded in `.claude/CLAUDE.md` and your Global Instructions.

---

## Workspace Structure

```
your-business-name/
├── Projects/                   Active projects (P### Project Name/)
├── Clients/                    Client work (C### Client Name/)
├── Documentation/
│   └── Reports/               Generated reports and analyses
├── Archive/                    Completed or dormant projects
├── [Department folders]        Optional (01 Finance, 02 HR, 03 Sales, etc.)
├── Infrastructure/Scripts/     Backup and validation scripts (custom scripts go here too)
└── .claude/                    Configuration root
    ├── CLAUDE.md              Master workspace instructions
    ├── FRAMEWORK.md           Component reference
    ├── company/               Business context (6 files)
    ├── config/                Integration configuration
    ├── docs/                  Reference documentation
    ├── skills/                21 pre-built skills
    └── state/                 Project state
        ├── state.json         Project index
        ├── state.schema.json  Validation schema
        └── projects/          Per-project detail files (P###.json)
```

### Why `.claude/` is committed

Most repositories gitignore `.claude/`. This template does the opposite. The `.claude/` folder IS the product -- it contains the setup wizard, skills, state, company knowledge, and master instructions that make everything work. Without it, the template would be an empty folder structure. Your personal settings (`.claude/settings.local.json`, credentials) are still gitignored.

---

## Customisation

### Add your own skills

Use the `creating-skills` skill, or manually create a folder at `.claude/skills/[your-skill-name]/SKILL.md`. The SKILL.md needs YAML frontmatter with `name` and `description`. Cowork auto-detects new skills.

### Modify existing skills

Edit the SKILL.md file directly. Note that if you pull updates from the upstream template (this repository), your edits to standard skills may be overwritten. To preserve customisations, copy the skill to a new name (e.g., `copywriting-custom`) and edit that copy instead.

### Add departments

Run `/setup` again and select additional departments, or manually create a folder `## Department Name/` (numbered prefix). Add a CLAUDE.md inside with department-specific guidance.

### Update company knowledge

Edit any file in `.claude/company/` directly. Skills will pick up your changes on the next task. You can also re-run `/setup` to update via the wizard.

### Change workspace identity

Edit `.claude/state/state.json` directly under the `workspace` key, or re-run `/setup`.

### Adjust autonomy and rules

Operational rules live in `.claude/CLAUDE.md`. Edit that file to customise. Note: significant changes may affect how skills behave. The Global Instructions in Settings > Cowork mirror these rules -- if you change CLAUDE.md substantially, regenerate Global Instructions via `/setup`.

---

## Updating from Upstream

This template will be updated over time with new skills, bug fixes, and refinements. To pull updates from the upstream template into your workspace:

```bash
cd /path/to/your-business-name
git remote add upstream https://github.com/larrygmaguire-hash/cowork-business-os.git
git fetch upstream
git merge upstream/main
```

You will need to resolve conflicts manually if you have edited template files. To minimise conflicts:
- Do not edit `.claude/skills/` files directly -- copy and rename instead
- Do not edit `.claude/CLAUDE.md`, `.claude/FRAMEWORK.md`, or `.claude/docs/` -- these are template-managed
- Edit `.claude/company/`, `.claude/state/`, `.claude/config/`, and your project folders freely -- these are user-owned

---

## Multi-Device Sync

To use the same workspace on multiple machines:

1. On Machine A: complete setup, commit changes, push to GitHub via `/syncing-workspace`
2. On Machine B: clone the same repository, open in Cowork, paste the same Profile Preferences and Global Instructions into Settings (these are stored in Claude Desktop, not in the workspace, so they need to be set on each machine)
3. Pull latest changes before each session, push at the end

**Do not use cloud sync** (iCloud, Dropbox, OneDrive, Google Drive) for this folder. Use git only. See [Cloud Sync Warning](.claude/docs/cloud-sync-warning.md).

---

## Backups

The workspace has two backup layers:

1. **State backups** -- `Infrastructure/Scripts/prima/backup-state.sh` runs before any state write. Backups land in `.claude/state.backups/state_YYYYMMDD_HHMMSS/`. These are gitignored so they stay local.

2. **Git history** -- every time you run `/syncing-workspace`, your changes commit and push to GitHub. Full history is recoverable.

To restore from a state backup:
```bash
ls .claude/state.backups/
cp -r .claude/state.backups/state_YYYYMMDD_HHMMSS/* .claude/state/
```

To restore from git history:
```bash
git log .claude/state/state.json
git checkout COMMIT_HASH .claude/state/state.json
```

---

## Troubleshooting

### The setup wizard does not start when I type /setup

Check that `.claude/skills/setup/SKILL.md` exists. If you see it but the skill does not invoke, check that your Global Instructions are pasted into Settings > Cowork (the bootstrap directive there tells Cowork to read the workspace's skills directory).

### Cowork is not reading my CLAUDE.md or company files

Your Global Instructions need the workspace bootstrap directive. Re-run `/setup` to regenerate Global Instructions, or manually copy the bootstrap section from `.claude/docs/global-instructions.md` into Settings > Cowork > Edit Global Instructions.

### state.json is corrupted or invalid JSON

Run `Infrastructure/Scripts/prima/validate-state.sh` to see the specific error. Restore from `.claude/state.backups/` if needed (see Backups above).

### Skills are not firing automatically

Cowork's skill detection is based on the `description` field in the skill's frontmatter. If a skill is not firing when expected, check that its description covers the trigger phrases you use. Update the description, save, and try again.

### git push fails

Check your remote: `git remote -v`. If you see `https://...` and authentication fails, switch to SSH (`git remote set-url origin git@github.com:USER/REPO.git`) and ensure you have an SSH key registered with GitHub.

### Cloud sync is creating conflicts

Move the workspace OUT of any cloud-synced folder. Use a local folder (e.g., `~/Developer/`). Use git for sync across machines, not iCloud or Dropbox.

### A skill is producing output that does not match my brand

Update `.claude/company/voice.md` with more specific tone guidance. Skills read this file before producing content. You may also need to update the brand voice section of your Global Instructions (re-run `/setup` to regenerate).

### How do I see all my projects?

Type `/workspace-status` or just "show me my projects".

---

## Cowork vs Claude Code

This template is specifically for **Cowork (Claude Desktop)**.

If you are looking for the **Claude Code (VS Code extension)** version, that is a different template at [larrygmaguire-hash/ai-business-os](https://github.com/larrygmaguire-hash/ai-business-os). It supports hooks, slash commands in `.claude/commands/`, MCP servers via `.mcp.json`, and auto-loaded `.claude/rules/`.

This Cowork version is adapted because Cowork does not support those features. What you get instead:
- Skills replace commands (`.claude/skills/` is the only execution layer)
- Operational rules are embedded in CLAUDE.md and Global Instructions (no `.claude/rules/` auto-loading)
- Engine protection is advisory only (no PreToolUse hooks)
- MCP servers are installed manually via Claude Desktop Settings (not from `.mcp.json`)

Skills, state management, and company knowledge work identically in both environments.

---

## Documentation

Inside this repository:

- [Getting Started](.claude/docs/getting-started.md) -- step-by-step first use
- [Folder Structure](.claude/docs/folder-structure.md) -- what each folder is for
- [Available Automations](.claude/docs/available-automations.md) -- full skills catalogue with trigger phrases
- [Capabilities Reference](.claude/docs/capabilities-reference.md) -- what Cowork can and cannot do
- [Cloud Sync Warning](.claude/docs/cloud-sync-warning.md) -- do not put this in iCloud or Dropbox
- [Glossary](.claude/docs/glossary.md) -- terminology reference
- [Specification](.claude/docs/specification.md) -- full technical reference
- [Global Instructions template](.claude/docs/global-instructions.md) -- reference copy of what /setup generates
- [Profile Preferences template](.claude/docs/profile-preferences.md) -- reference copy of what /setup generates
- [FRAMEWORK.md](.claude/FRAMEWORK.md) -- component definitions and decision matrix
- [Master CLAUDE.md](.claude/CLAUDE.md) -- workspace instructions and operational rules

---

## Licence

Copyright Larry G. Maguire / Human Performance. All rights reserved.

Free to use for personal and commercial purposes. Redistribution, resale, or derivative works require written permission. Contact hello@humanperformance.ie for licensing enquiries.

Full licence terms in [LICENCE](LICENCE).

---

## Author

Larry G. Maguire -- [Human Performance](https://humanperformance.ie)

For issues, suggestions, or contributions: open an issue on the [GitHub repository](https://github.com/larrygmaguire-hash/cowork-business-os).
