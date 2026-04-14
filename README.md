# Cowork Business OS

**Version:** 2.0.0

A free, ready-made business workspace for Claude Desktop (Cowork mode). Includes 21 pre-built skills, project state management, setup wizard, and full documentation. Clone this template, run `/setup`, and have a complete business operating system running in Cowork in under 10 minutes.

## Quick Start

1. Click **Use this template** on GitHub to create your own copy
2. Clone your new repository to your machine
3. Open the folder in Claude Desktop as a Cowork workspace
4. Say `/setup` to run the personalisation wizard
5. Follow the prompts. The wizard asks about you and your business, creates your folder structure, populates company knowledge, and generates the text for Profile Preferences and Global Instructions.

Detailed instructions are in [Getting Started](.claude/docs/getting-started.md).

## What You Get

### 21 Pre-Built Skills

Cowork auto-detects these. Invoke by name or just describe what you want.

**Session management**
- `session-briefing` -- start-of-session overview with active projects
- `session-close` -- end-of-session update to project state
- `saving-session` -- write a mid-session checkpoint
- `resuming-session` -- pick up where you left off

**Project management**
- `creating-projects` -- new project with P### ID, folder, state entries
- `creating-clients` -- new client folder with contact info
- `workspace-status` -- project health report with traffic lights
- `status-report` -- generate reports for projects, clients, or workspace

**Git**
- `syncing-workspace` -- commit and push changes

**Content creation**
- `copywriting` -- articles, blogs, social posts, emails, landing pages, ads
- `drafting-documents` -- proposals, reports, briefs, memos
- `email-drafting` -- professional business emails
- `meeting-notes` -- structured summaries from transcripts
- `documenting-workflows` -- SOPs, checklists, onboarding guides
- `creating-presentations` -- slide decks with speaker notes
- `search-engine-optimisation` -- on-page SEO, audits, keyword research

**Document processing**
- `processing-pdfs` -- extract, merge, split, fill forms, annotate
- `processing-documents` -- create and edit Word documents
- `processing-spreadsheets` -- create and analyse spreadsheets

**Meta**
- `setup` -- first-time workspace personalisation wizard
- `creating-skills` -- scaffold new skills

### State Management

Every project gets a unique ID (P001, P002, ...) and is tracked in `.claude/state/state.json`. Project details live in individual files at `.claude/state/projects/P###.json`. Cowork knows what you worked on, where you stopped, and what to do next. Session continuity across context limits.

### Company Knowledge

Six files in `.claude/company/` store your business context:
- `overview.md` -- what you do, who you serve
- `voice.md` -- brand voice, tone, language preferences
- `brand.md` -- visual identity
- `audiences.md` -- who you are writing for
- `team.md` -- key people
- `industry.md` -- terminology and regulations

Skills read these automatically before creating content on your behalf.

### Operational Rules

The template includes:
- **Graduated Autonomy** -- four levels determining when Claude acts vs asks
- **Checkpoint Protocol** -- standardised Review/Decision/Action pause points
- **Blocked Commands** -- confirmation required for destructive operations
- **No Permission Prompts** -- when you say edit, Claude edits
- **PDF Processing Scale** -- five-level approach for handling PDFs by size
- **State Validation** -- backup before write, validate after

All embedded in `.claude/CLAUDE.md` and your Global Instructions.

### Workspace Structure

```
your-business/
├── Projects/              Active work (P### Project Name/)
├── Clients/               Client folders
├── Documentation/         Templates and reports
├── Archive/               Completed projects
├── Infrastructure/        Backup and validation scripts
└── .claude/               Configuration, state, skills, company knowledge
```

Optional department folders (01 Finance, 02 HR, 03 Sales, 04 Marketing, 05 Operations, 06 Products, 07 Legal) are created by the setup wizard based on your needs.

### Why `.claude/` is committed

Most repositories gitignore `.claude/`. This template does the opposite. The `.claude/` folder IS the product -- it contains the setup wizard, skills, state, company knowledge, and master instructions that make everything work. Without it, the template would be an empty folder structure. Your personal settings (`.claude/settings.local.json`, credentials) are still gitignored.

## Requirements

- [Claude Desktop](https://claude.ai/download) with Cowork mode enabled
- Git (for cloning the template)
- A GitHub account (for using the template)

## Cowork vs Claude Code

This template is specifically for Cowork (Claude Desktop). If you are looking for the Claude Code (VS Code) version, that is a different template with hooks, slash commands, and MCP server support. This version is adapted for Cowork, which does not support those features. Skills, state management, and company knowledge work identically in both.

## Documentation

- [Getting Started](.claude/docs/getting-started.md) -- step-by-step first use
- [Folder Structure](.claude/docs/folder-structure.md) -- what each folder is for
- [Available Automations](.claude/docs/available-automations.md) -- full skills catalogue with trigger phrases
- [Capabilities Reference](.claude/docs/capabilities-reference.md) -- what Cowork can and cannot do
- [Cloud Sync Warning](.claude/docs/cloud-sync-warning.md) -- do not put this in iCloud or Dropbox
- [Glossary](.claude/docs/glossary.md) -- terminology reference
- [Specification](.claude/docs/specification.md) -- full technical reference
- [Global Instructions template](.claude/docs/global-instructions.md) -- reference copy
- [Profile Preferences template](.claude/docs/profile-preferences.md) -- reference copy

## Licence

Copyright Larry G. Maguire / Human Performance. All rights reserved.

Free to use for personal and commercial purposes. Redistribution, resale, or derivative works require written permission. Contact hello@humanperformance.ie for licensing enquiries.

## Author

Larry G. Maguire -- [Human Performance](https://humanperformance.ie)
