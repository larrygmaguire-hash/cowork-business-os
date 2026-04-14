---
name: meeting-notes
description: Process meeting recordings, transcripts, or notes into structured summaries with action items.
---

# Meeting Notes

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
   - Save to project folder if applicable
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

## Workflow

1. Receive meeting content
2. Identify all participants and key topics
3. Extract discussion points by topic
4. Identify and list all decisions
5. Extract action items (task, owner, deadline)
6. Create summary table with action owners and dates
7. **Review checkpoint** — present summary for approval
8. Save to appropriate location

## Quality Checklist

Before presenting:

- [ ] All attendees identified
- [ ] Meeting date and purpose clear
- [ ] Each decision documented with context
- [ ] Every action item has owner and due date
- [ ] Topics organised logically
- [ ] Summary captures key outcomes
- [ ] No orphaned action items (all have owners)
- [ ] Next steps or follow-up meetings identified

## When NOT to Use

- For creating project tasks (use task management in your system)
- For writing formal meeting minutes with legal significance (add more formal structure as needed)
