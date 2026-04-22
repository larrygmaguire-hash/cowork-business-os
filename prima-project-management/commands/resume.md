---
description: Retrieve context from a previous session to continue where you left off
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

**Note:** This command works best with the `prima-memory` plugin installed for session history retrieval. If it is not installed, checkpoint files under `~/Documents/Agent Outputs/` are used as the fallback for context recovery.

## Routing — Determine Path from Argument

Parse the argument provided with `/prima-project-management:resume`. Route to the correct path immediately. Do NOT fall through to another path.

| Argument | Example | Path |
|----------|---------|------|
| Project ID (P###) | `/resume P063` | **Project Path** — primary, recommended |
| Project ID + time (P### HH:MM) | `/resume P063 15:40` | **Project Path** with checkpoint refinement |
| Time string (HH:MM or HHMM) | `/resume 15:40` | **Time Path** |
| Search term | `/resume liquidcool` | **Search Path** |
| No argument | `/resume` | **Browse Path** — interactive menu |

---

## Project Path — `/resume P063` or `/resume P063 15:40`

The user knows which project. Get the most recent session for it with minimum context cost. If a time is also provided, use it to find a specific checkpoint.

**Step 1:** Single PRIMA Memory call — `search_history` with the project ID (e.g., `P063`) and `time_filter: "today"`. If no results, widen to `"yesterday"`, then `"this week"`. Stop at the first filter that returns results.

**Step 2:** Take the **first (most recent) result only**. Do not present a list.

**Step 3:** Check for checkpoint file at `~/Documents/Agent Outputs/P063/`:

- **If time was provided** (e.g., `/resume P063 15:40`): Look for a checkpoint file containing a section matching that timestamp. This provides more granular context than the latest checkpoint.
- **If no time provided:** Find the most recent `*-session-checkpoint.md` file.
- **If checkpoint exists:** Read the latest (or time-matched) checkpoint section. Present it as resumption context. Use "Next Action" as the suggested starting point.
- **If no checkpoint:** Call `get_session_details` with the session ID and `detail_level: "summary"`. Summarise: what was done, what's unfinished, next action.

**Step 4:** Read project state using v2 split storage (Pattern C):
```bash
# Index fields
jq '.projects[] | select(.id == "P063") | {id, name, status}' .claude/state/state.json
# Detail fields
jq '{stoppedAt, lastAction, sessionHistory}' .claude/state/projects/P063.json
```

**Step 5:** Present everything in one block:

```
**Resuming P063 — [Project Name]**

**Last session:** [date]
[2-3 line summary of what was done]

**Stopped at:** [stoppedAt from state.json]
**Next:** [next action from checkpoint, or inferred from session]

Ready to continue.
```

No menus. No detail level questions. No "which session" prompts. One lookup, one presentation, done.

---

## Time Path — `/resume 15:40`

The user has a timestamp from `/save`.

**Step 1:** Check for checkpoint file at `~/Documents/Agent Outputs/*/YYYY-MM-DD-session-checkpoint.md` with matching timestamp in filename.

- **If checkpoint exists:** Read the latest section and present as resumption context.
- **If no checkpoint:** Find the JSONL file in `~/.claude/projects/-Users-larrymaguire-LM-BIZ-OS/` whose modification time is closest to that timestamp (same day, or previous day if early morning). Use PRIMA Memory `get_recent_sessions` and match by time.

**Step 2:** Show project context for any referenced projects. Read index first to find projects with recent `lastWorked`, then read their detail files for `stoppedAt` and `lastAction`:
```bash
# Get recently-worked project IDs from index
jq '[.projects[] | select(.status == "in-progress") | {id, name, lastWorked}] | sort_by(.lastWorked) | reverse | .[0:5]' .claude/state/state.json
# Then for each: read .claude/state/projects/P###.json for stoppedAt, lastAction
```

**Step 3:** Present in the same compact format as Project Path. No menus.

---

## Search Path — `/resume liquidcool`

The user knows a keyword but not the project or time.

**Step 1:** Call PRIMA Memory `search_history` with the term and `time_filter: "this week"`. If no results, widen to `"this month"`.

**Step 2:** If exactly one result, load it directly (no menu). If multiple results, present a short table (max 5 rows) and ask which one to load.

**Step 3:** Once selected, present in the same compact format as Project Path.

---

## Browse Path — `/resume` (no argument)

Interactive menu for when the user does not know what to resume.

**Step 1:** Call PRIMA Memory `get_recent_sessions` with `limit: 10`. If not available, fall back to `sessionHistory` from state.json.

**Step 2:** List sessions:

```
## Recent Sessions

| # | Date | Summary | Projects |
|---|------|---------|----------|
| 1 | [date] | [summary] | [projectsWorked] |
| 2 | [date] | [summary] | [projectsWorked] |
...

Which session? (number, or "search [term]" for older sessions)
```

**Step 3: Handle Selection**

**Check for checkpoint file first.** If the session result includes a `Checkpoint:` path:
1. Read the checkpoint file
2. Present the latest checkpoint section as resumption context
3. Use "Next Action" as the suggested starting point
4. Skip detail level question

**If no checkpoint:** Call `get_session_details` with `detail_level: "summary"`. Do NOT ask the user what detail level they want — default to summary. The user can ask for more if needed.

**Step 4:** Present in the same compact format. Show project state for referenced projects.

---

## Rules for All Paths

- **Never ask detail level.** Default to summary. The user will ask for more if they need it.
- **Never present options when there is only one match.** Load it directly.
- **Minimum PRIMA Memory calls.** Project Path uses 1-2 calls max. Browse Path uses 2 calls max (list + one detail fetch).
- **Always end with "Ready to continue."** — not a question about what to pick up. The user already knows; they will tell you.
