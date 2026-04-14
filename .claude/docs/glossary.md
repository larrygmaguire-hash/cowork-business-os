# Glossary

Terminology used throughout the Cowork Business OS.

---

## Core Concepts

**Cowork Business OS** -- The template itself. A ready-made workspace for Claude Desktop Cowork mode, including skills, state management, company knowledge structure, and documentation.

**Workspace** -- The folder selected in Cowork. Everything inside it (projects, clients, documentation, configuration) makes up one workspace. You work in one workspace at a time.

**Project** -- A discrete body of work inside the workspace. Each project has a unique P### ID (P001, P002, ...) and lives in `Projects/`. Not the same as a workspace.

**Client** -- A customer or external relationship. Lives in `Clients/`. A client folder may contain projects.

**Skill** -- A reusable workflow in `.claude/skills/[name]/SKILL.md`. Auto-detected by Cowork. Invoked by name or by describing the task.

**State** -- Structured information about your projects, stored in `.claude/state/`. Split across the index (`state.json`), per-project detail files (`projects/P###.json`), and optional task files (`tasks/P###.json`).

**Session** -- A period of work in Cowork. Claude maintains session continuity via the `stoppedAt`, `lastAction`, and `sessionHistory` fields in state.

---

## File Types

**SKILL.md** -- The file inside a skill folder that defines the workflow. Has YAML frontmatter with `name` and `description`.

**CLAUDE.md** -- Master instructions for a workspace, project, client, or department. Inherits from parent CLAUDE.md files.

**state.json** -- The project index. Contains slim entries for all projects and top-level workspace metadata.

**P###.json** (in `.claude/state/projects/`) -- A per-project detail file. Contains description, notes, stoppedAt, lastAction, sessionHistory, milestones.

**state.schema.json** -- JSON schema that validates state.json structure.

---

## State Fields

**P### ID** -- Project identifier. Format: P + 3-digit zero-padded number. Sequential. Never reused.

**nextProjectNumber** -- Integer in state.json. The next P### number to assign when creating a project.

**status** -- Project status. One of: `in-progress`, `paused`, `overdue`, `archived`. No other values permitted.

**priority** -- Project priority. One of: `critical`, `high`, `medium`, `low`.

**category** -- Project type. One of: `client`, `product`, `internal`, `marketing`, `research`, `operations`, `finance`, `sales`, `legal`, `it`.

**stoppedAt** -- Where work stopped on a project. Set by session-close. Cleared when the project is next worked on.

**lastAction** -- The last completed action on a project. Set by session-close. Persists until the next update.

**pausedReason** -- Why a project is paused. Required when status is `paused`. Must be null otherwise.

**sessionHistory** -- Array of session summaries. Append-only (prepend new entries). Max 20 entries. Never modify existing entries.

**lastWorked** -- Date the project was last worked on. Format: YYYY-MM-DD.

---

## Operational Concepts

**Graduated Autonomy** -- Four levels that determine when Claude acts independently vs asks. Level 1 (auto-do), Level 2 (auto-add), Level 3 (auto-fix), Level 4 (stop and ask).

**Checkpoint Protocol** -- Standardised pause points in multi-step skills. Three types: Review (approval), Decision (user choice), Action (user must do something).

**Blocked Commands** -- Commands that require explicit confirmation: `rm -rf`, `sudo`, `git push --force`, `git reset --hard`, `DROP TABLE`.

**PDF Processing Scale** -- Five-level scale for handling PDFs by size and page count. Scales 1-5 from trivial to massive. Determines whether to read directly, chunk, split, or delegate.

**Engine Protection** -- Advisory system in Cowork (not hook-enforced). Some files are engine-managed and should not be modified. Others are user-owned.

---

## Instruction Layers

**Profile Preferences** -- Text in Settings > Profile. Personal identity and communication preferences. Applies to all Claude conversations.

**Global Instructions** -- Text in Settings > Cowork > Edit Global Instructions. Business identity, workspace bootstrap, operational rules. Applies to all Cowork tasks.

**Workspace CLAUDE.md** -- `.claude/CLAUDE.md`. Master workspace rules. Read at the start of every task via Global Instructions bootstrap.

**Project CLAUDE.md** -- CLAUDE.md inside a project folder. Project-specific context. Read when working on that project.

---

## Cowork vs Claude Code

**Cowork (Claude Desktop)** -- The chat interface for Anthropic's Claude Desktop app. Auto-detects `.claude/skills/`. No hooks, no `.claude/commands/`, no auto-loaded `.claude/rules/`. Runs via Settings > Cowork.

**Claude Code (VS Code extension)** -- The development environment for Claude Code. Supports hooks, `.claude/commands/`, auto-loaded `.claude/rules/`, and `.mcp.json`. Different template. Not this one.

This template is for Cowork. Features that depend on hooks, commands, or auto-loaded rules have been adapted to work without them.

---

## Common Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| **BOS** | Business OS |
| **MCP** | Model Context Protocol (server extensions) |
| **SOP** | Standard Operating Procedure |
| **PRD** | Product Requirements Document |
| **CTA** | Call to Action |
| **SEO** | Search Engine Optimisation |
| **UK** | United Kingdom (spelling conventions: colour, organise) |
| **US** | United States (spelling conventions: color, organize) |
