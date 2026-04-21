# cowork-prima-memory

**Searchable session recall for Cowork.**

Indexes past Cowork conversation sessions and exposes keyword, semantic, and hybrid search as MCP tools. Companion plugin to `cowork-prima-pm` — when both are installed, the `/resume` and `/day` commands use session history for richer session recovery.

## What it provides

| Tool | Purpose |
|------|---------|
| `search_history` | Keyword, semantic, or hybrid search with time filter |
| `get_recent_sessions` | List recent sessions |
| `get_session_details` | Full transcript for a specific session |
| `get_file_history` | Changes to a specific file across sessions |
| `rebuild_index` | Re-index after upgrades |
| `summarise_period` | Aggregate summary across a date range |

Plus a `session-recall` skill that documents retrieval discipline — when to search, when to load detail, how to protect context.

## Install

Via the `cowork-plugins` marketplace:

1. In Cowork: add marketplace `larrygmaguire-hash/cowork-plugins`
2. Install `cowork-prima-memory`
3. The MCP server starts automatically on session load

## How it works

- Reads Cowork conversation logs (stored as `.jsonl` files in `~/.claude/projects/`)
- Builds a SQLite index at `.prima-memory/index.db` inside the current workspace
- Provides MCP tools for keyword + semantic search
- Workspace-scoped — never leaks data from other workspaces

## Companion plugins

- [cowork-prima-pm](https://github.com/larrygmaguire-hash/cowork-prima-pm) — project management. `/resume` uses session recall for richer recovery when this plugin is installed.

## Prerequisites

- Cowork (Claude Desktop)
- Node.js 18+ (shipped with Cowork in most installs)

## Related

The Claude Code version lives at [larrygmaguire-hash/prima-memory](https://github.com/larrygmaguire-hash/prima-memory). Same underlying server, different host.

## Licence

Proprietary. Copyright Larry G. Maguire / Human Performance. Contact hello@humanperformance.ie for licensing enquiries.
