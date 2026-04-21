# Changelog

All notable changes to Cowork Business OS are recorded in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Repository restructured as a Cowork marketplace containing four plugins: `cowork-business-os` (core), `prima-project-management`, `prima-memory`, and `prima-scholar`.
- Installation is now via the Cowork plugin marketplace rather than Finder drag or Terminal copy.
- Workspace scaffolding is now bundled inside the `cowork-business-os` plugin and written to the user's chosen folder by the `/setup` command.

### Removed

- The v2.0.1 workspace-only layout. The marketplace rebuild replaces the prior "clone this repo as your workspace" model.

## [2.0.1] — 2026-04-14

- Finder/Terminal deploy flow for skills. Superseded by the v2.1.0 plugin marketplace.

## [2.0.0] — Earlier

- Initial Cowork adaptation. State v2 split architecture.
