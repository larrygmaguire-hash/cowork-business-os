---
name: meeting-notes
description: Process meeting recordings, transcripts, or notes into structured summaries with action items. Use when user provides meeting content or asks to summarise a meeting.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit
---

## Purpose

Transform raw meeting content (transcripts, recordings, handwritten notes) into structured, actionable summaries. Extract decisions, action items, and key discussion points.

## Process

1. **Receive meeting content**
   - Transcript file path
   - Audio file path (for transcription)
   - Pasted notes or bullet points
   - Meeting context (project, participants, purpose)

2. **Process the content**
   - Identify key discussion topics
   - Extract decisions made
   - Identify action items with owners and deadlines
   - Note any follow-up meetings or deadlines mentioned

3. **Generate structured summary**
   - Meeting metadata (date, attendees, purpose)
   - Executive summary (2-3 sentences)
   - Key discussion points
   - Decisions made
   - Action items table
   - Next steps

4. **Save and distribute**
   - Save to project folder
   - Offer to create follow-up tasks
   - Suggest distribution to attendees

## Output Format

```markdown
# Meeting Notes: [Meeting Title]

**Date:** YYYY-MM-DD
**Attendees:** [Names]
**Purpose:** [Brief description]

## Summary

[2-3 sentence overview of meeting outcomes]

## Discussion Points

### [Topic 1]
- Key point
- Key point

### [Topic 2]
- Key point
- Key point

## Decisions

1. [Decision with context]
2. [Decision with context]

## Action Items

| Action | Owner | Due Date |
|--------|-------|----------|
| [Task] | [Name] | [Date] |

## Next Steps

- [Follow-up item]
- [Follow-up item]
```

## Context Sources

| Source | What It Provides | Auto-loaded? |
|--------|-----------------|--------------|
| `.claude/company/industry.md` | Organisation terminology for attendee identification | On demand (via CLAUDE.md) |
| `.claude/company/team.md` | Key contacts for attendee identification | On demand (via CLAUDE.md) |
| `rules/content-defaults.md` | Language variant, formality level | Yes (rule) |
| `rules/file-conventions.md` | Where to save outputs, naming conventions | Yes (rule) |
| `references/` | Company-specific meeting templates, default attendee lists, standard agenda formats | No — read when processing |

### Post-deployment customisation

Add to `references/` inside this skill folder:
- Meeting note templates for recurring meeting types
- Default attendee lists per project or team
- Standard agenda structures
- Action item tracking format preferences
