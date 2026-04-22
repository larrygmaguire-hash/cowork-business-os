# CLAUDE.md

## Workspace Identity

- **Company Name:** [COMPANY_NAME]
- **Workspace ID:** [workspace-id]
- **Workspace Type:** [workspace|client|personal]
- **Set Up:** [YYYY-MM-DD]

This identity is used by the prima-project-management plugin (if installed) for workspace validation.

---

## Business Context

**Organisation:** [COMPANY_NAME]
**Industry:** [INDUSTRY]
**Primary Use Cases:** [PRIMARY USE CASES]

**Company Knowledge:** `.claude/company/` — overview, team, audiences, voice, brand, industry. Consult the relevant file before creating any content, communications, or documents.

---

## Workspace Structure

```
[workspace-id]/
├── .claude/                    Cowork configuration for this workspace
│   ├── CLAUDE.md              This file — master instructions
│   ├── company/               Organisation knowledge (voice, brand, team, audiences, industry)
│   ├── rules/                 Auto-loaded behaviour rules
│   ├── state/                 Persistent state (prima-project-management)
│   ├── config/                Integration configuration
│   └── docs/                  Reference documentation
│
├── Projects/                   Active work and tracked initiatives
├── Clients/                    Client/customer work
├── Archive/                    Completed projects
├── Documentation/              Reference materials, reports, templates
│
├── 01 Finance/                 Accounts, budgets, tax, reporting
├── 02 Human Resources/         Recruitment, policies, training
├── 03 Sales/                   Pipeline, proposals, contracts
├── 04 Marketing/               Campaigns, content, social media
├── 05 Operations/              Processes, vendors, logistics
├── 06 Products/                Catalogue, development, pricing
├── 07 Legal/                   Contracts, compliance, intellectual property
│
└── Infrastructure/             Technical assets and scripts
    └── Scripts/prima/          State backup and validation scripts
```

Not every business uses every folder. Delete or rename the ones that do not apply.

---

## File Organisation Rules

Do not create files in the workspace root. Place each file in the correct subfolder:

| Type | Location |
|------|----------|
| Project work | `Projects/{ID} {Project Name}/` |
| Completed projects | `Archive/{ID} {Project Name}/` |
| Documentation | `Documentation/` |
| Templates | `Documentation/Templates/` |
| Reports | `Documentation/Reports/` |
| Scripts | `Infrastructure/Scripts/` |
| Client deliverables | `Clients/[client-name]/` |
| Financial records | `01 Finance/` |
| HR material | `02 Human Resources/` |
| Sales activity | `03 Sales/` |
| Marketing material | `04 Marketing/` |
| Operational processes | `05 Operations/` |
| Product/service info | `06 Products/` |
| Legal documents | `07 Legal/` |

**Large files** (PDFs, Office documents, images, videos) belong in cloud storage — `~~drive` — not in this workspace.

---

## Cloud Storage

Large files are stored in cloud storage and referenced from this workspace, not stored here.

**Cloud storage location:** [CLOUD_STORAGE_PATH]

When referencing external files, use a consistent path notation such as `[Drive]/Contracts/2026-01-agreement.pdf`.

---

## Communication Standards

- Direct and factual. No preamble, no filler.
- Execute without asking permission unless genuinely ambiguous.
- When blocked, ask one specific question.

---

## Session Continuity

Cowork preserves your conversations automatically. Resume a prior conversation from the history picker.

For deeper session recall — searchable history, checkpoint files, and a `/resume` command — install the `prima-memory` plugin. For project-level session lifecycle (daily briefing, session close, progress tracking across sessions), install `prima-project-management`.

---

## Customisation Log

| Date | Change | Reason |
|------|--------|--------|
| [SETUP_DATE] | Initial setup | — |
