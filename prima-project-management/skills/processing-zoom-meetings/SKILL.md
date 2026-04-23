---
name: processing-zoom-meetings
description: Process Zoom meetings — fetch AI Companion summaries, pull transcripts, download recordings, export registrants, create and list meetings. Use when asked to "get the Zoom summary", "pull the meeting transcript", "process the Zoom session", "download the recording", "export registrants", "create a Zoom meeting", or "list upcoming meetings". Do NOT use for local VTT file processing (use processing-session-transcripts) or for YouTube transcripts (use extracting-youtube-transcripts).
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
---

# Processing Zoom Meetings

Interact with Zoom via MCP tools to fetch meeting summaries, transcripts, recordings, and registrant data. Also supports creating and listing meetings.

## When to Use

- After a client session to pull the AI Companion summary and/or transcript from Zoom
- When asked to "get the Zoom summary", "pull the meeting notes", or "process the Zoom session"
- When asked to download a Zoom recording
- When asked to export registrants from a Zoom webinar or workshop
- When asked to create or schedule a Zoom meeting
- When asked to list upcoming or recent meetings

## When NOT to Use

- Local VTT file already downloaded → use `processing-session-transcripts`
- YouTube video transcripts → use `extracting-youtube-transcripts`
- Audio file transcription → use `transcribing-audio`

## Prerequisites

- Zoom MCP server configured and running
- Zoom Server-to-Server OAuth app configured with scopes:
  - `meeting:write:admin`, `meeting:read:admin`, `user:read:admin`
  - `cloud_recording:read:list_user_recordings:admin`
  - `cloud_recording:read:list_recording_files:admin`
  - `cloud_recording:read:meeting_transcript:admin`
  - `meeting:read:summary:admin`

## Critical Knowledge

- `zoom_get_meeting_summary` and `zoom_get_transcript` require the meeting **UUID**, not the numeric meeting ID
- Get the UUID from `zoom_list_recordings` → each meeting entry includes its UUID
- AI Companion summaries work even when recording was not enabled
- Empty VTT transcripts (79 bytes) mean no cloud recording was active — this is normal, not an error
- UUIDs may contain `==` padding — pass as-is, the MCP server handles encoding

## Features

This skill has multiple features. Determine which to run from the user's request. Features can be combined (e.g. post-session processing runs summary + transcript + state update together).

### Feature 1: Fetch Meeting Summary

Pull the Zoom AI Companion meeting summary.

**Steps:**

1. **Find the meeting** — If user provides a meeting ID, use it. Otherwise:
   ```
   zoom_list_meetings type="previous_meetings"
   ```
   Match by topic name, date, or participant.

2. **Get the UUID** — Required for summary endpoint:
   ```
   zoom_list_recordings from="YYYY-MM-DD" to="YYYY-MM-DD"
   ```
   Find the matching meeting and extract its UUID.

3. **Fetch the summary:**
   ```
   zoom_get_meeting_summary meeting_id="<UUID>"
   ```

4. **Save to project folder:**
   - Client meetings: `Clients/[Client Name]/YYYY-MM-DD-Session-N-Summary.md` (per-session full detail)
   - Internal meetings: appropriate project folder
   - Format with heading, date, source, overview, sections, and next steps

5. **Update Session-Log.md** (client meetings only) — per `client-session-logs.md` rule:
   - Append a new section to `Clients/[Client Name]/Session-Log.md` with format, duration, type, 2-4 sentence summary, key decisions/homework, and a link to the per-session summary file
   - Add a row to the Session Cadence Summary table at the bottom
   - Update the "Total to date" line
   - Never log session detail in the client `CLAUDE.md` — that file is for project context only

### Feature 2: Fetch Meeting Transcript

Pull and process the VTT transcript from a cloud-recorded meeting.

**Steps:**

1. **Find the meeting** — Same as Feature 1 steps 1-2.

2. **Fetch the transcript:**
   ```
   zoom_get_transcript meeting_id="<UUID>"
   ```

3. **Check for empty transcript** — If result is under 100 bytes, inform user that no cloud recording was active. The AI Companion summary (Feature 1) may still be available.

4. **If transcript exists**, save raw VTT:
   - `Clients/[Client Name]/Session Record/YYYY-MM-DD-[session-slug]/transcript.vtt`

5. **Clean the VTT** (if `Scripts/vtt-to-text.sh` exists):
   ```bash
   Scripts/vtt-to-text.sh "<vtt-path>"
   ```

6. **Produce structured summary** — Delegate to agent for long transcripts (over 200 lines). Use the same summary structure as `processing-session-transcripts`:
   - Session Overview, Key Discussion Points, Decisions Made, Action Items, Next Session

### Feature 3: Download Recording

Download meeting recording files (MP4, M4A) to local storage.

**Steps:**

1. **Get recording files:**
   ```
   zoom_get_meeting_recordings meeting_id="<meeting_id_or_UUID>"
   ```

2. **Present available files** to user with type and size:
   ```
   | File | Type | Size |
   |------|------|------|
   | shared_screen_with_speaker_view | MP4 | 245 MB |
   | audio_only | M4A | 18 MB |
   ```

3. **Ask user for download location** — These are large files. Suggest cloud storage (~~drive) or an external volume rather than the workspace folder.

4. **Download selected files:**
   ```
   zoom_download_recording download_url="<url>" file_path="<absolute_path>"
   ```

### Feature 4: Export Registrants

Export meeting/webinar registrant list to CSV.

**Steps:**

1. **Export to CSV:**
   ```
   zoom_export_registrants_csv meeting_id="<meeting_id>" file_path="<absolute_path>"
   ```
   Default path: `~/Downloads/YYYY-MM-DD-[meeting-topic]-registrants.csv`

2. **Report count and offer Kit sync:**
   ```
   Exported [N] registrants to [path].
   Sync to Kit? (uses syncing-event-contacts skill)
   ```

### Feature 5: Meeting Lookup

Find a specific meeting by name, date, or list recent/upcoming meetings.

**Steps:**

1. **List meetings:**
   ```
   zoom_list_meetings type="<type>" page_size=30
   ```
   Types: `scheduled`, `live`, `upcoming`, `previous_meetings`

2. **For specific meeting details:**
   ```
   zoom_get_meeting meeting_id="<numeric_id>"
   ```

3. **Present results** as a table:
   ```
   | Topic | Date | Duration | ID |
   |-------|------|----------|----|
   ```

### Feature 6: Create Meeting

Schedule a new Zoom meeting.

**Steps:**

1. **Gather details** from user request:
   - Topic (required)
   - Date and time
   - Duration (default 60 minutes)
   - Timezone (default `Europe/Dublin`)

2. **Create the meeting:**
   ```
   zoom_create_meeting topic="<topic>" type=2 start_time="<ISO8601>" duration=<mins> timezone="Europe/Dublin"
   ```

3. **Return meeting details:**
   ```
   Meeting created: [topic]
   Date: [date and time]
   Join URL: [url]
   Meeting ID: [id]
   Password: [password]
   ```

### Feature 7: List Upcoming Meetings

Quick view of scheduled meetings — useful for daily briefing.

**Steps:**

1. **Fetch upcoming:**
   ```
   zoom_list_meetings type="upcoming"
   ```

2. **Present as table:**
   ```
   | Topic | Date | Time | Duration |
   |-------|------|------|----------|
   ```

### Feature 8: Post-Session Processing (Compound)

Full post-meeting workflow combining multiple features. Use when asked to "process the Zoom session" or "update the project with today's meeting".

**Steps:**

1. **Find the meeting** (Feature 5)
2. **Fetch AI Companion summary** (Feature 1)
3. **Attempt transcript fetch** (Feature 2) — gracefully handle empty transcripts
4. **Save outputs** to client/project folder
5. **Update project CLAUDE.md** — Add session entry to Session Log:
   ```markdown
   ### Session [N] — [date] ([duration], Zoom)

   **Summary:** [2-3 sentence overview from AI Companion summary]

   **Key topics covered:**
   - [List from summary sections]

   **Decisions made:**
   - [List]

   **Action items — You:**
   - [List]

   **Action items — Client:**
   - [List]

   **Next session:** [Date/time if mentioned]

   **Full summary:** `[path to summary file]`
   ```

6. **Send client recap email** — Draft and send a client-facing session summary via the user's ~~email integration.

   **Present checkpoint before sending:**
   ```
   **Action needed:** Send session recap email to [client name]?

   Options: Send / Skip / Edit first
   ```

   - **Send** → send immediately to client email (from client CLAUDE.md), CC the user's email address if one is configured in `.claude/company/team.md`
   - **Skip** → skip the email, proceed to state update
   - **Edit first** → show draft for user review, then send or skip

   **Email format:**
   - **Subject:** `AI Business OS Session [N] Summary`
   - **Format:** HTML (for bold headings and lists)
   - **Structure:**
     - Greeting and thanks
     - **What we covered today:** — bullet list of topics from summary sections (plain language, no jargon)
     - **Suggested next steps before our next session:** — numbered list of action items for the client (framed as suggestions, not obligations)
     - Next session confirmation (date, time, any notes)
     - Sign-off
   - **Tone:** Collaborative, consultative. Use "we", "suggested", "at whatever pace suits you". Do not push responsibility onto the client — frame homework as suggestions with an offer to help if stuck.
   - **Footer:** `P.S. This email is sent from within VS Code using Claude to construct it — it forms part of the end of session workflow.`

7. **Update state.json** — Follow state validation rules:
   - `lastWorked` → today's date
   - `lastAction` → "Session [N] processed — [brief description]"
   - `stoppedAt` → null (cleared)
   - `notes` → update engagement status

## Output Format

| Feature | Output | Location |
|---------|--------|----------|
| Meeting summary | Markdown file | `Clients/[name]/YYYY-MM-DD-[slug]-SUMMARY.md` |
| Transcript (raw) | VTT file | `Clients/[name]/Session Record/YYYY-MM-DD-[slug]/transcript.vtt` |
| Transcript (clean) | Text file | Alongside VTT as `-clean.txt` |
| Transcript summary | Markdown file | `~/Documents/Agent Outputs/[project-id]/YYYY-MM-DD-HHMM-[slug].md` |
| Recording | MP4/M4A | User-specified path (outside the workspace folder) |
| Registrant export | CSV | `~/Downloads/` or user-specified path |
| Session log update | Inline edit | Client's `CLAUDE.md` |
| Client recap email | HTML email | Sent via user's ~~email integration, CC user's configured email if any |
| State update | Inline edit | `.claude/state/state.json` |

## Examples

### Example 1: Pull meeting summary after a client session

**User says:** "Get the Zoom summary from today's session with Acme Client"

**Actions:**
1. `zoom_list_meetings type="previous_meetings"` — find the meeting
2. `zoom_list_recordings` — get UUID
3. `zoom_get_meeting_summary meeting_id="<UUID>"` — fetch AI Companion summary
4. Save to `Clients/P001-Acme Client/2026-02-25-Session-2-SUMMARY.md`

**Result:** Summary file saved, content presented to user.

### Example 2: Full post-session processing

**User says:** "Process the Zoom session from today's call with Acme Client, update the project"

**Actions:**
1. Find meeting and get UUID
2. Fetch AI Companion summary → save to client folder
3. Attempt transcript fetch → handle empty gracefully
4. Update `Clients/P001-Acme Client/CLAUDE.md` session log
5. Draft and send client recap email (or skip if user declines)
6. Update `state.json` P001 entry

**Result:** Summary saved, CLAUDE.md updated with session entry, recap email sent to client, state.json updated.

### Example 3: Export workshop registrants and sync to Kit

**User says:** "Export registrants from the GenAI workshop Zoom and sync to Kit"

**Actions:**
1. `zoom_export_registrants_csv` → save CSV to Downloads
2. User confirms Kit sync
3. Trigger `syncing-event-contacts` skill with Zoom meeting ID

**Result:** CSV exported, contacts synced to Kit with "zoom" and "AI" tags.

### Example 4: Create a meeting

**User says:** "Create a Zoom meeting with Acme Client tomorrow at 10am for 90 minutes"

**Actions:**
1. Parse: topic="Acme Client Session 3", date=tomorrow 10:00, duration=90, timezone=Europe/Dublin
2. `zoom_create_meeting` with parameters
3. Return join URL and meeting details

**Result:** Meeting created with join URL provided.

### Example 5: List upcoming meetings

**User says:** "What Zoom meetings do I have coming up?"

**Actions:**
1. `zoom_list_meetings type="upcoming"`
2. Present as formatted table

**Result:** Table of upcoming meetings with dates and times.

## Troubleshooting

### 400 error on zoom_get_meeting_summary

**Cause:** Numeric meeting ID used instead of UUID.
**Solution:** Always get UUID from `zoom_list_recordings` first. The summary endpoint requires UUID format.

### Empty or 79-byte VTT transcript

**Cause:** No cloud recording was active during the meeting. AI Companion runs on the live audio stream independently.
**Solution:** This is expected behaviour, not an error. Use the AI Companion summary instead (Feature 1).

### 500 error from Zoom API

**Cause:** Intermittent API instability.
**Solution:** Retry once. If it persists, wait a few minutes and try again.

### Meeting not found in zoom_list_meetings

**Cause:** Meeting is older than the default listing window, or was deleted.
**Solution:** Use `zoom_list_recordings` with explicit `from` and `to` date range to find older meetings.

### Registrant export returns zero results

**Cause:** Meeting does not have registration enabled, or no registrants yet.
**Solution:** Check meeting settings — registration must be enabled for registrant tools to return data.

## Additional Resources

- Requires a Zoom MCP server to be installed and configured separately — this plugin does not bundle one. See the README for prerequisites.
- For local VTT processing: [processing-session-transcripts](../processing-session-transcripts/SKILL.md)
- For Zoom API reference: [references/zoom-api-reference.md](references/zoom-api-reference.md)
