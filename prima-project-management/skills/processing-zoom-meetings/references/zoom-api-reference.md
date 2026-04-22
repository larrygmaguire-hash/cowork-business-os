# Zoom MCP Tools Reference

Quick reference for all Zoom MCP server tools available via `MCP Servers/P067-Zoom/`.

## Meeting Management

### zoom_create_meeting

Creates a new Zoom meeting.

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `topic` | Yes | — | Meeting title |
| `type` | No | 2 | 1=Instant, 2=Scheduled, 3=Recurring (no fixed), 8=Recurring (fixed) |
| `start_time` | No | — | ISO 8601 format |
| `duration` | No | 60 | Minutes |
| `timezone` | No | — | e.g. `Europe/Dublin` |
| `agenda` | No | — | Description text |
| `password` | No | — | Custom password |
| `registration_required` | No | false | Enables registration; returns registration URL instead of join URL |
| `host_video` | No | — | Boolean |
| `participant_video` | No | — | Boolean |
| `audio` | No | — | `both`, `telephony`, `voip`, `thirdParty` |
| `waiting_room` | No | — | Boolean |
| `meeting_authentication` | No | — | Authenticated users only |
| `join_before_host` | No | — | Boolean |
| `mute_upon_entry` | No | — | Boolean |
| `auto_recording` | No | — | `local`, `cloud`, `none` |
| `alternative_hosts` | No | — | Comma-separated emails |
| `meeting_invitees` | No | — | Array of emails for calendar invites |

### zoom_list_meetings

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `user_id` | No | `me` | — |
| `type` | No | — | `scheduled`, `live`, `upcoming`, `upcoming_meetings`, `previous_meetings` |
| `page_size` | No | 30 | Max 300 |
| `page_number` | No | 1 | — |

### zoom_get_meeting

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | Numeric ID |

### zoom_update_meeting

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | Numeric ID |
| All create params | No | Only supplied fields are changed |

### zoom_delete_meeting

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | Irreversible |

## Registrants

### zoom_list_registrants

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `meeting_id` | Yes | — | Auto-paginates (returns all) |
| `status` | No | `approved` | `pending`, `approved`, `denied` |

### zoom_add_registrant

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | — |
| `email` | Yes | — |
| `first_name` | Yes | — |
| `last_name` | No | — |

### zoom_export_registrants_csv

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | — |
| `file_path` | Yes | Absolute path including filename. Creates directories. |

CSV columns: Email, First Name, Last Name, Registration Date, Status.

## Recordings and Transcripts

### zoom_list_recordings

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `user_id` | No | `me` | — |
| `from` | No | — | YYYY-MM-DD (max 6 months ago) |
| `to` | No | — | YYYY-MM-DD (max 1 month range from `from`) |
| `page_size` | No | — | Max 300 |
| `trash` | No | false | List trashed recordings |

Auto-paginates. Returns meetings with recording file metadata.

### zoom_get_meeting_recordings

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | Numeric ID or UUID |

Returns: download URLs, file types (MP4, M4A, TRANSCRIPT, CHAT, CC, CSV), file sizes, timestamps.

### zoom_get_transcript

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | **UUID required** (not numeric ID) |

Returns: raw VTT text. Requires cloud recording with transcript enabled.

### zoom_get_meeting_summary

| Parameter | Required | Notes |
|-----------|----------|-------|
| `meeting_id` | Yes | **UUID required** (not numeric ID) |

Returns: AI Companion summary — overview, sections, next steps. Requires AI Companion enabled on account.

### zoom_download_recording

| Parameter | Required | Notes |
|-----------|----------|-------|
| `download_url` | Yes | From `zoom_get_meeting_recordings` output |
| `file_path` | Yes | Absolute path with filename and extension. Creates directories. |

Returns: file size in MB.

## UUID vs Numeric ID

| Endpoint | Accepts |
|----------|---------|
| `zoom_list_meetings` | Returns numeric IDs |
| `zoom_get_meeting` | Numeric ID |
| `zoom_update_meeting` | Numeric ID |
| `zoom_delete_meeting` | Numeric ID |
| `zoom_list_registrants` | Numeric ID |
| `zoom_add_registrant` | Numeric ID |
| `zoom_export_registrants_csv` | Numeric ID |
| `zoom_get_meeting_recordings` | Numeric ID or UUID |
| `zoom_list_recordings` | Returns UUIDs |
| `zoom_get_transcript` | **UUID only** |
| `zoom_get_meeting_summary` | **UUID only** |
| `zoom_download_recording` | Uses download URL (no ID needed) |

**Workflow to get UUID:** `zoom_list_recordings` → find meeting → extract UUID from response.
