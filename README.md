# Cowork Business OS

A working operating system for running your business inside the Claude Desktop app.

**Status:** v2.1.0 in active development. The full README with install instructions and screenshots lands when the four plugins are ready for test installation. For now this file is a placeholder.

## What this repo contains

This repo is a **Cowork plugin marketplace**. It holds four plugins that work together to turn the Claude Desktop app into a complete business operating system.

| Plugin | What it does | Status |
|---|---|---|
| `cowork-business-os` | Core plugin. Creates your business workspace on your computer and provides content-production skills. Required. | In development |
| `prima-project-management` | Daily project tracking, session lifecycle, client and project creation. | In development |
| `prima-memory` | Searchable history of your past Cowork conversations. | In development |
| `prima-scholar` | Academic research, citation management, research library. | In development |

## For users

The full user guide is in progress. If you are not a developer, please wait until v2.1.0 is published. Installation details, folder setup, and daily use will be explained with screenshots in the final README.

## For developers

The marketplace manifest is at [.claude-plugin/marketplace.json](.claude-plugin/marketplace.json). Each plugin subfolder contains its own `.claude-plugin/plugin.json`. Local development via a directory marketplace in the Claude Desktop app.

See [CHANGELOG.md](CHANGELOG.md) for version history.
