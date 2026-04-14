# P000 Sample Client Project

This is a placeholder client project showing the standard structure. Delete or replace when you create real client projects.

## Project context

- **ID:** P000
- **Client:** Sample-Client
- **Status:** sample (not tracked in state.json)

## Standard structure

The same structure as internal projects:

```
P### Project Name/
├── CLAUDE.md           # This file
├── Research/           # Background and references
├── Drafts/            # Work in progress
└── Final/             # Completed deliverables
```

The difference between an internal project (in `Projects/`) and a client project (in `Clients/[Client]/`) is location. Internal projects are work for your own business. Client projects are work delivered to a customer. Both use the same P### ID system and are registered in `.claude/state/state.json` with their full path.

## What to put in this CLAUDE.md when you create a real client project

The `creating-projects` skill generates a CLAUDE.md with:

- **Client:** which client this is for
- **Scope:** what the project covers and what it does not
- **Deliverables:** the specific outputs to produce
- **Deadline:** when work is due
- **Approval process:** who signs off and how
- **Communication plan:** how status updates flow back to the client
- **Conventions:** any client-specific naming, formatting, or process rules

The full workspace operational context is inherited from `.claude/CLAUDE.md`. The client context is inherited from `Clients/[Client]/CLAUDE.md`. You do not need to repeat either here.
