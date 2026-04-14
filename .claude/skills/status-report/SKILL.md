---
name: status-report
description: >
  Generate a status report for projects, clients, or overall workspace activity. Summarise current work, progress, and next steps. Use when asked for status, progress update, project health check, or overall activity summary.
---

# Status Report

Generate status reports summarising current work, progress, and next steps. Can report on individual projects, specific clients, or overall workspace activity.

## Purpose

Create professional status reports that communicate project health, progress, and upcoming priorities to stakeholders or for personal tracking.

## Process

1. **Determine scope**
   - Single project status
   - Client portfolio status
   - Overall workspace status
   - Time period (this week, this month, custom)

2. **Gather information**
   - Scan relevant project folders
   - Review project documentation
   - Check for completed deliverables
   - Identify pending action items
   - Note any blockers or issues

3. **Generate report**
   - Executive summary
   - Project-by-project breakdown
   - Completed items
   - In-progress work
   - Upcoming deadlines
   - Blockers or risks

4. **Present and save**
   - Display report to user
   - Offer to save to Documentation/Reports/
   - Suggest distribution if appropriate

## Output Format

### Project Status Report

```markdown
# Status Report: [Project Name]

**Period:** YYYY-MM-DD to YYYY-MM-DD
**Generated:** YYYY-MM-DD

## Summary

[2-3 sentence overview of project status]

## Progress

### Completed
- [Completed item]
- [Completed item]

### In Progress
- [Current work item] — [percentage or status]
- [Current work item] — [percentage or status]

### Upcoming
- [Next milestone] — Due: YYYY-MM-DD
- [Next milestone] — Due: YYYY-MM-DD

## Blockers

| Issue | Impact | Resolution |
|-------|--------|------------|
| [Blocker] | [Impact] | [Proposed resolution] |

## Next Steps

1. [Immediate priority]
2. [Secondary priority]
```

### Workspace Status Report

```markdown
# Workspace Status Report

**Period:** YYYY-MM-DD to YYYY-MM-DD
**Generated:** YYYY-MM-DD

## Active Projects Summary

| Project | Client | Status | Next Milestone |
|---------|--------|--------|----------------|
| [Name] | [Client] | On track | [Date] |

## This Period

### Completed
- [Project]: [Deliverable]
- [Project]: [Deliverable]

### Key Activities
- [Activity summary]
- [Activity summary]

## Upcoming Deadlines

| Date | Project | Deliverable |
|------|---------|-------------|
| YYYY-MM-DD | [Project] | [Deliverable] |

## Notes

[Any additional context or observations]
```

## Context Sources

When available, read from:

- Project metadata or state files for status and dates
- README or documentation files for summary context
- Recent file modifications to identify active work

## Customisation

Add custom report templates or KPI definitions to the references/ folder within this skill if needed. Reports can be tailored for specific audiences or client types.

## Quality Checklist

Before presenting any report:

- [ ] All active projects included
- [ ] Dates and milestones accurate
- [ ] Blockers clearly stated with proposed resolutions
- [ ] Next steps are specific and actionable
- [ ] Tone is professional and clear
- [ ] Report length appropriate for audience

## When NOT to Use

- For real-time dashboard displays (use a dedicated dashboard skill if available)
- For financial reporting without proper accounting integration
- For informal status messages (use direct written communication instead)

## Error Handling

- **Project data missing:** Gather information from file system structure or ask user for clarification
- **No clear blockers:** Ask user what impediments or concerns exist
- **Unclear next steps:** Propose specific milestones or deliverables based on project scope
