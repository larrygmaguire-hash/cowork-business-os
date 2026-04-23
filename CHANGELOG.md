# Changelog

All notable changes to Cowork Business OS are recorded in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-04-22

### Added

- `prima-memory-mcp`, `prima-scholar-search-mcp`, and `prima-scholar-library-mcp` published to npm. The `prima-memory` and `prima-scholar` plugins now fetch their MCP servers via `npx` at runtime instead of bundling compiled output, so the `.plugin` artefacts stay small and get automatic updates when the npm packages are bumped.
- `document-processor` agent in `prima-project-management` now has a proper `<example>` block with commentary and a `color` field, matching the Cowork plugin spec.

### Changed

- Repository restructured as a Cowork marketplace containing four plugins: `cowork-business-os` (core), `prima-project-management`, `prima-memory`, and `prima-scholar`.
- Installation is now via the Cowork plugin marketplace rather than Finder drag or Terminal copy.
- Workspace scaffolding is bundled inside the `cowork-business-os` plugin and written to the user's chosen folder by the `/setup` command.
- `prima-memory` README rewritten end-to-end, licence aligned to MIT across every plugin.
- `prima-project-management` README documents the Zoom MCP prerequisite explicitly.
- `backup-state.sh` and `validate-state.sh` now take the workspace root as an explicit argument rather than walking up from the script directory. All commands that invoke them pass `"$CLAUDE_PROJECT_DIR"`.

### Removed

- The v2.0.1 workspace-only layout. The marketplace rebuild replaces the prior "clone this repo as your workspace" model.
- Org-admin install sections from all READMEs pending a real private mirror repo.
- Bundled compiled MCP server output (`dist/`, `build/`, `node_modules/`) from the `prima-memory` and `prima-scholar` plugins. Served via npm instead.
- All client names, personal paths, and repository-specific references from plugin content. Examples now use generic placeholders (`Acme Client`, `~/Downloads/...`).

## [2.0.1] — 2026-04-14

- Finder/Terminal deploy flow for skills. Superseded by the v2.1.0 plugin marketplace.

## [2.0.0] — Earlier

- Initial Cowork adaptation. State v2 split architecture.
