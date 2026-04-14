---
name: resuming-session
description: >
  Resume a previous session by retrieving context and showing where work was left off. Supports resuming by project ID, timestamp, or browsing recent sessions.
---

# Resuming Session

Resume a previous session by retrieving its context.

## Routing — Determine Path from Argument

Parse the argument provided. Route to the correct path immediately.

| Argument | Example | Path |
|----------|---------|------|
| Project ID | `/resuming-session P063` | **Project Path** |
| Project ID + time | `/resuming-session P063 15:40` | **Project Path with time** |
| Time string | `/resuming-session 15:40` | **Time Path** |
| Search term | `/resuming-session liquidcool` | **Search Path** |
| No argument | `/resuming-session` | **Browse Path** |

---

## Project Path — `/resuming-session P063` or `/resuming-session P063 15:40`

The user knows which project to resume.

**Step 1:** Read `.claude/state/state.json` and find the project entry:

```bash
jq '.projects[] | select(.id == "P063") | {id, name, status, stoppedAt, lastAction}' .claude/state/state.json
```

**Step 2:** Read the project detail file at `.claude/state/projects/P063.json`:

- `stoppedAt` — where work stopped
- `lastAction` — the last completed action
- `sessionHistory` — previous session entries

**Step 3:** If a time was provided (e.g., `/resuming-session P063 15:40`), look for a checkpoint file:

```
~/Documents/Agent Outputs/P063/YYYY-MM-DD-1540-session-checkpoint.md
```

Read the checkpoint section matching that timestamp. Otherwise, find the most recent `*-session-checkpoint.md` file and read the latest checkpoint section.

**Step 4:** Present in one block:

```
**Resuming P063 — [Project Name]**

**Last session:** [date]
[2-3 line summary from checkpoint or sessionHistory]

**Stopped at:** [stoppedAt from state.json]
**Next:** [next action from checkpoint]

Ready to continue.
```

---

## Time Path — `/resuming-session 15:40`

The user has a timestamp from `/saving-session`.

**Step 1:** Normalise to `HHMM` format (strip colon). Get today's date:

```bash
date "+%Y-%m-%d"
```

**Step 2:** Check for checkpoint file at:

```
~/Documents/Agent Outputs/*/YYYY-MM-DD-1540-session-checkpoint.md
```

**Step 3:** If checkpoint exists, read the latest section and present as resumption context.

**Step 4:** Read state.json and show project context for any projects with `stoppedAt != null`:

```bash
jq '[.projects[] | select(.stoppedAt != null) | {id, name, stoppedAt, lastAction}]' .claude/state/state.json
```

**Step 5:** Present in compact format:

```
**Resuming from [Time]**

**Active work:**
- P### Name — Stopped at: [stoppedAt]
- P### Name — Stopped at: [stoppedAt]

Ready to continue.
```

---

## Search Path — `/resuming-session liquidcool`

The user knows a keyword but not the project or time.

**Step 1:** Search checkpoint files in `~/Documents/Agent Outputs/` for the term. Also search project CLAUDE.md files and descriptions in state.json.

**Step 2:** If exactly one match, load it directly as Project Path. If multiple matches, present a short table (max 5 rows):

```
| # | Project | Last Activity |
|---|---------|---------------|
| 1 | P### Name | [date] — [summary] |
| 2 | P### Name | [date] — [summary] |

Which one? (number or "search [term]" for more results)
```

**Step 3:** Once selected, present in Project Path format.

---

## Browse Path — `/resuming-session` (no argument)

Interactive menu for when the user does not know what to resume.

**Step 1:** Read state.json and find projects with status `in-progress` or `paused`, ordered by `lastWorked` (most recent first):

```bash
jq '[.projects[] | select(.status == "in-progress" or .status == "paused") | {id, name, lastWorked, status}] | sort_by(.lastWorked) | reverse' .claude/state/state.json
```

**Step 2:** Present a table (max 10 rows):

```
## Recent Projects

| # | Project | Status | Last Worked |
|---|---------|--------|-------------|
| 1 | P### Name | Active | [days] ago |
| 2 | P### Name | Paused | [date] |

Which project? (number, project ID, or "search [term]")
```

**Step 3:** Handle selection:
- If number: load as Project Path
- If project ID: load as Project Path
- If "search [term]": switch to Search Path

---

## Rules for All Paths

- Never ask detail level or any clarifying questions — assume the user knows what they want
- Never present options when there is only one match — load it directly
- Always end with "Ready to continue." — this is not a question, the user will tell you what to work on
- If checkpoint file does not exist, read sessionHistory from state.json instead
- If state.json does not exist or is invalid, work from checkpoint files only

---

Begin by parsing the provided argument and routing to the appropriate path.
