# .claude/ Folder

This is the workspace configuration root. Everything Cowork needs to operate in this workspace lives here.

## Subfolders

| Folder | Purpose |
|--------|---------|
| `company/` | Six business knowledge files (overview, voice, brand, audiences, team, industry). Skills read these before producing content. |
| `config/` | Integration configuration (API keys, service IDs, cloud paths) |
| `docs/` | Reference documentation for users (getting-started, folder-structure, glossary, specification) |
| `skills/` | Reusable skills (auto-detected by Cowork). Each skill is a folder containing a SKILL.md file. |
| `state/` | Project state (v2 split storage). Index in `state.json`, per-project detail in `projects/P###.json`. |

## Key files

- `CLAUDE.md` -- master workspace instructions. Read by Cowork on every task via Global Instructions bootstrap.
- `FRAMEWORK.md` -- structural reference for components and conventions.

## Why `.claude/` is committed to git

This folder IS the product. Without it, the template would be empty. Your personal settings (`.claude/settings.local.json`, credentials) are gitignored separately.

## Engine-managed vs user-owned

| Engine-managed (do not edit, will be overwritten on updates) | User-owned (edit freely) |
|-------------------------------------------------------------|--------------------------|
| `CLAUDE.md` | `company/` (all 6 files) |
| `FRAMEWORK.md` | `state/` (state.json, projects/) |
| `skills/` (existing skills) | `config/` |
| `docs/` | New skills you create in `skills/` |
