# Capabilities Reference

What Cowork can and cannot do in this workspace.

---

## What Cowork Can Do

### File operations
- Read any file in the workspace
- Create new files and folders
- Edit existing files (documents, spreadsheets, code, configuration)
- Delete files (with confirmation for anything destructive)
- Move and rename files

### Document creation
- Word documents (.docx)
- Excel spreadsheets (.xlsx)
- PowerPoint presentations (.pptx)
- PDFs (via processing-pdfs skill)
- Markdown and plain text

### Document processing
- Extract text from PDFs (including large ones via chunking)
- Merge, split, and annotate PDFs
- Fill PDF forms
- Convert between formats (Word to PDF, etc.)
- Analyse spreadsheet data with formulas
- Process meeting transcripts

### Content creation
- Write articles, blog posts, newsletters, emails
- Generate social media content
- Draft proposals, reports, briefs
- Create presentations from outlines
- Rewrite and edit existing content
- SEO optimisation

### Project management
- Track projects in state.json
- Maintain session continuity
- Generate status reports
- Assign project IDs (P001, P002, ...)
- Track milestones and tasks

### Git operations
- Stage and commit changes
- Push to remote repositories
- Pull updates
- View history and diffs

### Research and analysis
- Web searches (via WebSearch tool)
- Read web pages (via WebFetch)
- Analyse data from spreadsheets
- Summarise long documents

---

## What Cowork Cannot Do

### Hooks
Cowork does not support `PreToolUse` or `PostToolUse` hooks. Engine protection and command validation are advisory, not enforced. If you modify engine files, nothing blocks you -- your changes may be overwritten when pulling template updates.

### MCP Servers
Cowork does not load MCP servers from `.mcp.json` automatically. If you want MCP functionality (like PRIMA Memory, PRIMA CRM, or third-party servers), you install them manually in Claude Desktop settings. This template does not include MCP dependencies.

### Slash Commands
Cowork does not have a `/commands/` system like Claude Code. This template replaces commands with skills. You invoke them by name or by describing what you want.

### Auto-loaded Rules
Cowork does not automatically load files from `.claude/rules/`. Operational rules are embedded in `.claude/CLAUDE.md` and in your Global Instructions (Settings > Cowork > Edit Global Instructions).

### Terminal Commands Outside Workspace
Cowork can run bash commands, but only within the workspace. System-wide operations (installing packages, changing global config, etc.) are blocked by default and require explicit confirmation.

### Direct API Calls
Cowork does not have built-in integrations with services like Gmail, Slack, or Google Calendar unless you have configured MCP servers. For calendar briefings, email processing, or Slack posting, you need to set up the relevant MCP servers separately.

### Real-time Collaboration
Cowork is single-user. Multiple people cannot edit the same workspace simultaneously.

---

## What This Template Provides

The template includes:

- 21 skills (session management, project management, content creation, document processing, meta)
- Full state management system (v2 split architecture)
- Setup wizard (`/setup`)
- Company knowledge files (overview, voice, brand, audiences, team, industry)
- State backup and validation scripts
- Documentation (this file, getting-started, folder-structure, specification)

The template does NOT include:

- MCP server configurations (you add these via Claude Desktop settings)
- Third-party API integrations
- Pre-populated content (everything is generic -- you customise via `/setup`)
- Personal templates or client data

---

## Extending the Template

### Add a new skill
Use the `creating-skills` skill. It walks through naming, purpose, and workflow, then writes the SKILL.md file.

### Add a new department
Ask the setup wizard or manually create a folder with the next numeric prefix (08+) and a CLAUDE.md with domain-specific rules.

### Customise skills
Create a new skill rather than editing an existing one. Copy the existing SKILL.md to a new folder, rename it (e.g., `copywriting-custom`), and modify.

### Connect MCP servers
Install MCP servers via Claude Desktop Settings > Extensions. Popular options:
- Gmail / Calendar (for email and calendar access)
- Slack (for posting and reading messages)
- Database connectors (Postgres, MySQL)
- Custom MCP servers for business-specific tools

---

## Troubleshooting

### "Skill not found"
Check `.claude/skills/[name]/SKILL.md` exists and has valid frontmatter. Cowork should auto-detect it on next task.

### "state.json invalid"
Run `Infrastructure/Scripts/prima/validate-state.sh` to see the specific error. Restore from `.claude/state.backups/` if needed.

### "Cannot write to .claude/CLAUDE.md"
The CLAUDE.md is advisory-protected. You can edit it, but changes may be overwritten on template updates. Consider creating a custom rules file or adding your changes to `.claude/company/` instead.

### Skills not firing automatically
Cowork's skill detection is based on the description field in frontmatter. If a skill is not firing when expected, check its description field covers the trigger phrases you use.
