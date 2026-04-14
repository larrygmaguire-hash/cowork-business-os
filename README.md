# Cowork Business OS

**Version:** 2.0.0

A free, ready-made workspace for Claude Desktop (Cowork mode). Provides folder structure, project state management, a setup wizard, and documentation so you can start using Cowork productively from day one.

## Quick Start

1. Click **Use this template** on GitHub to create your own copy
2. Clone your new repository to your machine
3. Open the folder in Claude Desktop as a Cowork workspace
4. Say `/setup` to run the personalisation wizard
5. Follow the prompts. The wizard will ask about you and your business, create your folder structure, and generate the text you need for Profile Preferences and Global Instructions.

Detailed instructions are in [Getting Started](.claude/docs/getting-started.md).

## What You Get

### Workspace Structure
```
your-business/
├── Projects/              Active work (one folder per project)
├── Clients/               Client folders
├── Documentation/         Templates and reports
├── Archive/               Completed projects
├── Infrastructure/        Backup and validation scripts
└── .claude/               Configuration, state, skills, company knowledge
```

### State Management
Every project gets a unique ID (P001, P002, ...) and is tracked in `.claude/state/state.json`. Project details are stored in individual files at `.claude/state/projects/P###.json`. This gives you session continuity. Claude knows what you worked on, where you stopped, and what to do next.

### Company Knowledge
Six files in `.claude/company/` store your business context: what you do, who you serve, how you write, your brand identity, your team, and your industry. The setup wizard populates these. Claude reads them before creating content on your behalf.

### Setup Wizard
The `/setup` skill walks you through personalisation step by step. It asks one question at a time, builds your configuration, and tells you what to paste into Claude Desktop settings.

## Requirements

- [Claude Desktop](https://claude.ai/download) with Cowork mode enabled
- Git (for cloning the template)
- A GitHub account (for using the template)

## Documentation

- [Getting Started](.claude/docs/getting-started.md) -- step-by-step first use
- [Folder Structure](.claude/docs/folder-structure.md) -- what each folder is for
- [Specification](.claude/docs/specification.md) -- full technical reference

## Licence

Copyright Larry G. Maguire / Human Performance. All rights reserved.

Free to use for personal and commercial purposes. Redistribution, resale, or derivative works require written permission. Contact hello@humanperformance.ie for licensing enquiries.

## Author

Larry G. Maguire -- [Human Performance](https://humanperformance.ie)
