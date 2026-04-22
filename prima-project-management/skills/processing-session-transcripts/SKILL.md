---
name: processing-session-transcripts
description: Process client session VTT transcripts into structured summaries and update project records. Use when a Zoom session recording transcript needs to be summarised, when asked to "process the session transcript", "summarise the meeting", or when a .vtt file path is provided after a client meeting. Do NOT use for audio transcription (use transcribing-audio) or YouTube transcripts (use extracting-youtube-transcripts).
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
---

# Processing Session Transcripts

Process a Zoom VTT transcript from a client session into a structured summary, then update the project CLAUDE.md and state.json.

## When to Use

- After a client session when a VTT transcript is available
- When asked to "process the session transcript" or "summarise the meeting"
- When a `.vtt` file path is provided in the context of client work
- When asked to "update the project with today's session"

## When NOT to Use

- Raw audio files needing transcription → use `transcribing-audio`
- YouTube video transcripts → use `extracting-youtube-transcripts`
- Non-client meetings or internal notes → handle manually

## Prerequisites

- VTT file from Zoom recording (or other source)
- Project must be registered in `.claude/state/state.json`

## Workflow

### Step 1: Identify Context

Determine from conversation or file path:
- **Client name** and **project ID** (check state.json)
- **Session number** (check project CLAUDE.md session log)
- **VTT file path**

If any are ambiguous, ask.

### Step 2: Clean the VTT

Run the preprocessing script:

```bash
Scripts/vtt-to-text.sh "<vtt-file-path>"
```

This produces a `-clean.txt` file alongside the VTT with ~40% size reduction (timestamps, sequence numbers removed; consecutive same-speaker lines merged).

### Step 3: Summarise

Delegate to a general-purpose agent with this prompt structure:

```
Read the cleaned transcript at [clean-txt-path].

Client: [name], [company]
Session: [number] of [engagement type, e.g. AI Business OS deployment]

Produce a structured summary with these sections:

1. **Session Overview** — Duration, attendees, format
2. **Key Discussion Points** — What was covered, in order
3. **Client's Current Situation** — Role, challenges, tools, team (Session 1 only; skip for subsequent sessions unless significant changes)
4. **Workflows Identified** — Tasks discussed as candidates for AI assistance
5. **What Was Demonstrated** — Any live demos
6. **Decisions Made** — Anything agreed
7. **Action Items** — For you and for the client, with deadlines if mentioned
8. **Next Session** — Date/time if scheduled, planned topics
9. **Notable Quotes** — Useful statements with approximate context

Write the full summary to: ~/Documents/Agent Outputs/[project-id]/YYYY-MM-DD-HHMM-[client-slug]-session-[n]-summary.md

Return to me: Only the file path and a 3-line summary of key takeaways.
```

**Agent constraint:** The agent reads the cleaned file (not the raw VTT). If the cleaned file still exceeds the read limit, the agent reads it in chunks.

### Step 4: Update Project CLAUDE.md

Add a session entry to the Session Log section of the client's CLAUDE.md:

```markdown
### Session [N] — [date] ([duration], Zoom)

**Summary:** [2-3 sentence overview]

**Key insight:** [Most important takeaway]

**Decisions made:**
- [List]

**Priority workflows confirmed:**
1. [Ranked list]

**Client homework:**
- [List]

**Your actions:**
- [List]

**Full summary:** `[path to summary file]`
```

Update the "Next Session" entry if a follow-up was scheduled.
Add a line to Working Notes with the session date and status.

### Step 5: Update state.json

Update the project entry:
- `lastWorked` → today's date
- `lastAction` → "Session [N] complete — [brief description]. Session [N+1] scheduled [date]."
- `description` → update if scope or status has changed
- `notes` → update with current engagement status

Follow state validation rules (backup first, validate JSON).

## Output Format

| Output | Location |
|--------|----------|
| Cleaned transcript | Alongside original VTT as `-clean.txt` |
| Full summary | `~/Documents/Agent Outputs/[project-id]/YYYY-MM-DD-HHMM-[client-slug]-session-[n]-summary.md` |
| Updated session log | Client's `CLAUDE.md` → Session Log section |
| Updated state | `.claude/state/state.json` → project entry |

## Examples

### Example 1: Process a client session after a Zoom call

**User says:** "Process the session transcript at /Users/larrymaguire/Google Drive/Private Practice/Clients/Sabino Moreira/Session Record/2026-02-18-Session-One/GMT20260218-140017_Recording.transcript.vtt"

**Actions:**
1. Identify client (Sabino Moreira, P043) and session number (Session 1) from path and state
2. Run `Scripts/vtt-to-text.sh` on the VTT → produces `-clean.txt` (91KB → 54KB)
3. Spawn agent to read cleaned file and write structured summary
4. Update `Clients/P043-Sabino Moreira/CLAUDE.md` session log
5. Update `state.json` P043 entry (lastWorked, lastAction, notes)

**Result:** Summary at `~/Documents/Agent Outputs/P043/2026-02-18-1630-sabino-session-one-summary.md`, CLAUDE.md and state.json updated.

### Example 2: Update project after a follow-up session

**User says:** "Here's the VTT from today's session with Sabino, update the project"

**Actions:**
1. Identify client and session number (Session 2, based on existing Session 1 in CLAUDE.md)
2. Clean VTT, summarise via agent
3. Append Session 2 entry to CLAUDE.md session log
4. Update state.json

**Result:** Session 2 appended to session log, next session details updated.

## Troubleshooting

### vtt-to-text.sh fails with "File not found"
**Cause:** Path contains spaces and was not quoted, or file has moved.
**Solution:** Ensure the full path is quoted. Check the file exists at the specified location.

### Agent cannot read the cleaned file (exceeds token limit)
**Cause:** Very long session (2+ hours) produces a cleaned file over 25,000 tokens.
**Solution:** The agent should read in chunks using offset/limit parameters. The skill prompt already instructs this.

### No Session Log section in CLAUDE.md
**Cause:** Client project was set up before the session log format was standardised.
**Solution:** Create the `## Session Log` section in CLAUDE.md before appending the entry.

### Project ID not found in state.json
**Cause:** Client project not yet added to PRIMA state.
**Solution:** Ask user to confirm the project ID, or add the project to state.json first using the project-tracking skill.
