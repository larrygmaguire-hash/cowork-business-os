# Changelog

All notable changes to Cowork Business OS are recorded here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versioning follows [Semantic Versioning](https://semver.org/).

## [2.0.1] — 2026-04-14

Corrects the install model. v2.0.0 incorrectly assumed Cowork auto-discovers skills from `.claude/skills/` inside the workspace folder. Cowork reads skills from `~/.claude/skills/` on the user's machine, so the 22 skills that ship with this template must be deployed there before they are active.

### Fixed

- README Quick Start now documents the skill deployment step explicitly. Three deployment paths offered in order of convenience: Cowork-driven Finder automation (recommended), user-driven Finder drag-and-drop, or Terminal `cp -R`.
- The `setup` skill now includes a new Part 0 that checks whether skills are deployed, offers the three deployment options, and pauses for Claude Desktop restart before proceeding to Part 1.
- The `upgrade-workspace` skill now includes a Part 7a that redeploys changed skills to `~/.claude/skills/` after an upgrade, using the same three options.
- `.claude/docs/upgrading.md` updated with the redeploy step.
- README explicit that the full Claude Desktop quit-and-reopen is required (not just closing the window) for new or updated skills to register.

### Notes

- Nothing about the skill file format changed. The 22 SKILL.md files in `.claude/skills/` are unchanged and conform to the Claude Agent Skills standard — they work identically to how Claude Code auto-discovers them. The only change is that Cowork requires them at a different location on disk, so we document how to put them there.
- No conversion of skills needed. Users who had started exploring v2.0.0 can run through the deploy flow in v2.0.1 and the same skills become active.

## [2.0.0] — 2026-04-14

Initial public release.

### Added

- 21 skills covering session lifecycle, project and client management, content creation, document processing, and meta operations (creating skills, workspace setup)
- v2 split-state architecture: `state.json` index with per-project detail files in `.claude/state/projects/P###.json`
- Separate number spaces for projects (`P###`) and clients (`C###`)
- 7 department folders at the workspace root (Finance, Human Resources, Sales, Marketing, Operations, Products, Legal) each with default subfolders and a `CLAUDE.md` describing purpose and configuration items
- 4 sample projects and 4 sample clients with `CLAUDE.md` and `PRD.md` as worked examples
- Company knowledge files in `.claude/company/` (overview, voice, brand, audiences, team, industry) that Claude reads before producing content
- Infrastructure scripts in `Infrastructure/Scripts/prima/` for state backup and validation
- Comprehensive README covering installation, setup, daily use, customisation, multi-device sync, backups, troubleshooting
- Reference documentation in `.claude/docs/` (getting-started, folder-structure, specification, capabilities-reference, glossary, departments, upgrading, global-instructions, profile-preferences)
- Setup wizard skill that personalises the workspace through a guided Q&A flow
- Reference documentation for content-heavy skills: copywriting (editing-standards, platform-specs, frameworks), email-drafting (email-patterns), creating-presentations (slide-structure), search-engine-optimisation (seo-checklist)
- README explainer files in empty scaffolding folders so new users understand what each empty folder is for
- Engine manifest and `upgrade-workspace` skill establishing the contract for how future versions reach installed workspaces

### Known limitations

- First-run installations before this release do not have `templateVersion` in their `state.json`; the upgrade skill detects this and prompts the user to declare their installed version
