# Available Automations

Complete catalogue of skills available in your Cowork Business OS workspace.

All skills are auto-detected by Cowork. You can invoke them explicitly (`/session-briefing`) or just describe what you want to do ("show me my project status") and Cowork will pick the right one.

---

## Session Management

| Skill | Trigger phrases |
|-------|----------------|
| `session-briefing` | "start my day", "briefing", "what should I work on", "show active projects" |
| `session-close` | "end of day", "wrap up", "session close", "update project state" |
| `saving-session` | "save context", "checkpoint", "write session notes" |
| `resuming-session` | "resume project", "where did I leave off", "continue P001" |

## Project Management

| Skill | Trigger phrases |
|-------|----------------|
| `creating-projects` | "new project", "create a project", "start a project" |
| `creating-clients` | "new client", "onboard [name]", "set up [name] as a client" |
| `workspace-status` | "project status", "status report", "what's active", "show overdue" |
| `status-report` | "generate a status report", "weekly report", "project update for [name]" |

## Git Sync

| Skill | Trigger phrases |
|-------|----------------|
| `syncing-workspace` | "sync", "commit and push", "back up my work" |

## Content Creation

| Skill | Trigger phrases |
|-------|----------------|
| `copywriting` | "write copy", "rewrite", "write a blog post", "write an article", "LinkedIn post", "landing page copy" |
| `drafting-documents` | "draft a proposal", "write a report", "create a brief", "write a memo" |
| `email-drafting` | "write an email", "draft a reply", "compose email to [name]" |
| `meeting-notes` | "summarise this meeting", "process meeting notes", "extract action items" |
| `documenting-workflows` | "document this process", "write an SOP", "create a checklist", "build a playbook" |
| `creating-presentations` | "create a presentation", "build slides", "make a deck" |
| `search-engine-optimisation` | "optimise for SEO", "SEO audit", "keyword research" |

## Document Processing

| Skill | Trigger phrases |
|-------|----------------|
| `processing-pdfs` | "extract text from PDF", "merge PDFs", "fill PDF form", "annotate PDF" |
| `processing-documents` | "create a Word doc", "edit this .docx", "add tracked changes" |
| `processing-spreadsheets` | "create a spreadsheet", "analyse CSV", "add formulas", "build financial model" |

## Meta

| Skill | Trigger phrases |
|-------|----------------|
| `setup` | "run setup", "set up workspace", "first time configuration" |
| `creating-skills` | "create a skill", "scaffold a skill", "add a new skill" |

---

## Scheduled Tasks (Optional)

You can set up two scheduled tasks in Cowork that invoke the session skills automatically:

**Morning (e.g., 8:30am):**
> Run the session-briefing skill.

**Evening (e.g., 6:00pm):**
> Run the session-close skill.

Both can also be invoked manually at any time by asking Claude.
