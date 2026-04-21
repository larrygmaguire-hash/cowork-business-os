---
name: session-recall
description: Search and retrieve content from past Cowork conversation sessions. Use when the user references prior-conversation work, asks "what did we discuss", "where did we leave off", "what happened with X", or when resuming work after a context reset. Provides keyword and semantic search across all stored sessions.
---

# Session Recall

Surface content from past sessions using the `prima-memory` MCP server shipped with this plugin.

## When to use

- User references work from earlier sessions ("what did we discuss", "where did we leave off")
- A session hit context limits and continuity is needed
- Compiling progress reports or summaries spanning multiple sessions
- Any ambiguity about what was decided or changed in a prior session

## Retrieval discipline — MANDATORY

The MCP tools are powerful but expensive in context. Follow this discipline to protect the context budget.

### Step 1: Start with `search_history`

Use relevant keywords and a `time_filter`. Returns session IDs, timestamps, and brief summaries. Low context cost.

```
search_history(
  query: "liquidcool migration",
  mode: "both",
  time_filter: "this week",
  limit: 5
)
```

### Step 2: Present results to the user

Show the title, time, and summary of matching sessions. Let the user confirm which session is relevant. Do not proceed to detailed retrieval without confirmation unless only one session matched.

### Step 3: Only call `get_session_details` when

- The user confirms which session to load, OR
- The task explicitly requires full conversation detail (recovering exact decisions or file changes)

### Step 4: Extract only what is needed

Last action, decisions made, files modified, next step. Do not hold the full session transcript in context.

### Step 5: Never pull multiple full sessions preemptively

If cross-referencing is needed, pull one at a time and extract key points to a working summary before pulling the next.

### Step 6: Use `get_recent_sessions` to browse

When you only need to identify which session to look at, use `get_recent_sessions` — not `get_session_details`.

## Never do this

- Pull full session details without checking search results first
- Load 2-3 full sessions into context "to be thorough"
- Guess or approximate what happened in a prior session
- Ask the user to re-explain what was already discussed
- Assume context is lost — check memory first

## Available tools

| Tool | Purpose |
|------|---------|
| `search_history` | Keyword, semantic, or hybrid search with time filter |
| `get_recent_sessions` | List recent sessions (excludes empty) |
| `get_session_details` | Full detail for a specific session ID |
| `get_file_history` | Changes to a specific file across sessions |
| `rebuild_index` | Re-index after upgrades |
| `summarise_period` | Aggregate summary across a date range |

Refer to the MCP server's own tool schemas for exact parameters.

## Companion plugins

Works standalone. When `cowork-prima-pm` is also installed, its `/resume` and `/day` commands automatically use these tools for richer session recovery.
