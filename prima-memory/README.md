# prima-memory

Searchable session recall for Cowork. Indexes past Cowork conversation sessions and exposes keyword, semantic, and hybrid search as MCP tools. Companion plugin to `prima-project-management` — when both are installed, the **resume** and **day** commands use session history for richer session recovery.

## Requires

Nothing. This plugin works standalone. It sits well alongside `prima-project-management`, which uses session recall for context when both are installed.

## Installs

**MCP server (bundled):**
- `prima-memory` — reads Cowork conversation logs, indexes them into a local SQLite database, and exposes the tools below.

**MCP tools provided:**
| Tool | Purpose |
|------|---------|
| `search_history` | Keyword, semantic, or hybrid search with time filter |
| `get_recent_sessions` | List recent sessions |
| `get_session_details` | Full transcript for a specific session |
| `get_file_history` | Changes to a specific file across sessions |
| `rebuild_index` | Re-index after upgrades |
| `summarise_period` | Aggregate summary across a date range |

**Skill:**
- `session-recall` — retrieval discipline for when to search, when to load detail, and how to protect context.

## Install

1. Download `prima-memory.plugin` from the [latest release](https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest).
2. In the Claude desktop app, open the **Cowork** tab.
3. Left sidebar → **Customize** → **Browse plugins** → **Upload a custom plugin file** → select the downloaded file.
4. The MCP server starts automatically on next Cowork session load.

## How it works

- Reads Cowork conversation logs (stored as `.jsonl` files in `~/.claude/projects/`)
- Builds a SQLite index at `.prima-memory/index.db` inside the current workspace
- Provides MCP tools for keyword and semantic search
- Workspace-scoped — never leaks data from one workspace into another

## Environment variables

None required.

## Licence

MIT — see [LICENSE](../LICENSE) at the repo root.

## Support

Report issues at https://github.com/larrygmaguire-hash/cowork-business-os/issues
