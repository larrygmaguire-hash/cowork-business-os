# Folder Structure Reference

## Overview

This workspace follows a consistent structure to keep work organised and enable Claude to assist effectively.

> **Note:** The examples below are typical — your actual folders and files will vary depending on your business, industry, and how you use the workspace. Use these as a guide, not a rigid prescription.

---

## Top-Level Folders

### `.claude/`
Claude Code configuration. Contains instructions, commands, skills, and documentation that define how Claude works in this workspace.

**You should not modify this folder** unless instructed by your administrator.

```
.claude/
├── CLAUDE.md       # Master instructions for Claude
├── commands/       # Slash commands (e.g., /report, /summarise)
├── skills/         # Reusable workflows
├── docs/           # Technical documentation
└── rules/          # Automatic behaviour rules
```

---

### `Projects/`
All active project work lives here. Each project gets its own folder. A project is any discrete body of work with a clear objective — a campaign, a rollout, a training programme, a product launch.

```
Projects/
├── P001 Website Redesign/        # Project ID + Title Case name
├── P002 Q2 Marketing Campaign/
├── P003 Staff Training Programme/
└── Workflows/                    # Recurring processes and templates
```

**Naming convention:** `{Project ID} {Project Name}` — e.g., `P001 Website Redesign`. The project ID is generated automatically by `/newproject` using the numbering format configured during `/setup`. The default format is `P001`, `P002`, etc., but this can be customised (e.g., `PRJ-001`, `WR0001`).

**Typical contents of a project folder:**
- `CLAUDE.md` — project context for Claude (ID, category, status, rules)
- `PRD.md` — Product Requirements Document (goals, requirements, phases)
- Research notes, drafts, working documents
- Subfolders as needed (e.g., `Design/`, `Docs/`, `Campaigns/`)

**Examples of projects you might create:**
- A website redesign with briefs, wireframes, and copy drafts
- A staff training programme with session outlines and materials lists
- A product launch with timeline, messaging, and channel plans
- A quarterly content calendar with topics and deadlines

---

### `Archive/`
Completed projects are moved here from `Projects/`. The folder name stays the same — only the location changes. This keeps the `Projects/` folder focused on active work.

```
Archive/
├── P001 Website Redesign/      # Same folder name, just moved
└── P004 Q1 Campaign/
```

You might archive a project when a campaign has launched, a training programme has been delivered, or a client engagement has concluded. Nothing is deleted — it is simply moved out of the active view.

---

### `Documentation/`
Reference materials, templates, and reports that are not tied to a specific project. If something belongs to a project, it goes in that project's folder. If it is reusable or general-purpose, it goes here.

```
Documentation/
├── Templates/      # Reusable document templates
└── Reports/        # Generated reports and analyses
```

**Templates/** — documents you use repeatedly as starting points:
- Proposal templates
- Meeting agenda formats
- Report layouts
- Letterheads or branded document shells
- Onboarding checklists

**Reports/** — generated analyses and summaries:
- Monthly or quarterly business reports
- Research summaries
- Audit or review outputs
- Status reports that span multiple projects

**Examples:**
- A consulting firm might keep a standard proposal template in `Templates/` and quarterly revenue reports in `Reports/`
- A marketing agency might store brand guideline documents in `Templates/` and campaign performance summaries in `Reports/`
- A training provider might keep session evaluation forms in `Templates/` and course completion reports in `Reports/`

---

### `Infrastructure/`
Technical assets and automation that support the workspace. This is the behind-the-scenes folder — things that make the system work, not deliverables you send to anyone.

```
Infrastructure/
└── Scripts/        # Shell scripts, Python scripts, automation
```

**Scripts/** — automation and utility scripts:
- Backup scripts (e.g., state file backups)
- Data import/export helpers
- Scheduled task scripts
- Integration scripts that connect services

**Examples of what different users might store here:**
- A property manager might have a script that syncs tenant data from a spreadsheet
- A consultancy might have a script that generates weekly time reports from calendar data
- An agency might have a script that backs up client folders to cloud storage
- Any user will find the PRIMA state backup and validation scripts here by default

Most users will not need to touch this folder directly — Claude manages the scripts it needs. But if you write your own automation or have technical workflows, this is where they belong.

---

### `Clients/`
If your business serves clients or customers, their work goes here. Each client gets a dedicated folder with a consistent internal structure.

```
Clients/
├── _Templates/     # Template for new client folders
├── Client-A/
│   ├── README.md           # Client overview and contacts
│   ├── Projects/           # Client-specific projects
│   ├── Communications/     # Email threads, meeting notes
│   └── Reference/          # Contracts, briefs, background
├── Client-B/
└── Client-C/
```

**README.md** — the client's profile: contact details, industry, relationship notes, links to cloud storage where heavy files live.

**Projects/** — work you are doing for this client. Each engagement or deliverable gets its own subfolder.

**Communications/** — meeting notes, email summaries, call logs. Anything that records what was discussed or agreed.

**Reference/** — background material the client has provided: contracts, briefs, brand guidelines, technical specs.

**Examples:**
- A design agency might have `Projects/Brand Refresh/` and `Reference/Style Guide.md` inside a client folder
- An accountancy practice might have `Projects/Year End 2026/` and `Communications/Tax Planning Call Notes.md`
- A training provider might have `Projects/Leadership Programme/` and `Reference/Participant List.md`

Not every business has clients. If yours does not, you can remove this folder or repurpose it (e.g., for suppliers, partners, or departments).

---

## Department Folders

The workspace includes seven department folders for internal business functions. These are separate from `Projects/` and `Clients/` — they hold standing reference material, processes, and ongoing function-specific work for your own organisation.

Department folders use a numeric prefix (`01`–`07`) for consistent sort order. Subfolders use the parent's number with a decimal suffix (e.g., `01.1`, `01.2`). This numbering scheme aligns with ISO 15489 hierarchical classification principles and ISO 8601 date formatting.

Each department folder contains a `CLAUDE.md` with a description, subfolder guide, and configuration notes. Customise these for your business.

### `01 Finance/`

Financial management — accounts, budgets, tax, and reporting.

```
01 Finance/
├── 01.1 Accounts Payable/     # Supplier invoices, payment tracking
├── 01.2 Accounts Receivable/  # Client invoices, revenue tracking
├── 01.3 Budgets/              # Annual budgets, forecasts
├── 01.4 Tax & Compliance/     # Tax returns, VAT records, regulatory filings
└── 01.5 Reports/              # Financial statements, P&L summaries
```

### `02 Human Resources/`

People management — recruitment, onboarding, policies, training, and employee records.

```
02 Human Resources/
├── 02.1 Recruitment/          # Job descriptions, candidate tracking
├── 02.2 Onboarding/           # New starter checklists, induction materials
├── 02.3 Policies/             # HR policies, handbooks, codes of conduct
├── 02.4 Training/             # Training plans, course materials
└── 02.5 Employee Records/     # Personnel files, contracts, performance reviews
```

### `03 Sales/`

Sales pipeline, proposals, and contracts.

```
03 Sales/
├── 03.1 Pipeline/             # Lead tracking, opportunity stages
├── 03.2 Proposals/            # Proposal drafts and templates
└── 03.3 Contracts/            # Sales contracts, agreements
```

### `04 Marketing/`

Brand, campaigns, content creation, social media, and analytics.

```
04 Marketing/
├── 04.1 Campaigns/            # Campaign briefs, plans, performance tracking
├── 04.2 Content/              # Blog drafts, newsletters, editorial calendars
├── 04.3 Brand Assets/         # Brand guidelines, logos, tone of voice docs
├── 04.4 Analytics/            # Marketing reports, channel performance
└── 04.5 Social Media/         # Social calendars, post drafts, platform strategies
```

### `05 Operations/`

Day-to-day business processes, vendor management, logistics, and quality.

```
05 Operations/
├── 05.1 Processes/            # SOPs, workflow documentation
├── 05.2 Vendors & Suppliers/  # Supplier agreements, contact lists
├── 05.3 Logistics/            # Delivery schedules, inventory tracking
└── 05.4 Quality/              # Quality standards, inspection records
```

### `06 Products/`

Product (or service) management — catalogue, development, and pricing.

```
06 Products/
├── 06.1 Catalogue/            # Product listings, specifications
├── 06.2 Development/          # Product roadmaps, feature requests
└── 06.3 Pricing/              # Pricing models, rate cards
```

### `07 Legal/`

Contracts, regulatory compliance, and intellectual property.

```
07 Legal/
├── 07.1 Contracts/            # Contract templates, executed agreements, NDAs
├── 07.2 Compliance/           # Regulatory requirements, GDPR records
└── 07.3 Intellectual Property/  # Trademarks, patents, IP agreements
```

---

## How to Organise Your Work

The workspace provides three main places for work: **Projects**, **Clients**, and **Department folders**. How you use them is flexible — it depends on your business model and preferences.

### Option A: Projects-Centred

All work lives in `Projects/` with project IDs. Department folders hold standing reference material only. `Clients/` is not used or holds minimal contact info.

**Best for:** Businesses organised around discrete deliverables, internal initiatives, or programmes of work. Consulting firms, agencies, training providers.

```
Projects/
├── P001 Website Redesign/          # Internal project
├── P002 Q2 Marketing Campaign/     # Internal project
├── P003 Acme Corp Engagement/      # Client work tracked as a project
└── P004 Annual Audit/              # Finance initiative as a project

04 Marketing/
└── 04.3 Brand Assets/              # Standing reference only
```

### Option B: Clients-Centred

Client work lives in `Clients/` with projects nested under each client. `Projects/` is used for internal work only. Department folders hold internal reference material.

**Best for:** Businesses where work is always tied to a specific client. Accountancy practices, legal firms, agencies with retainer clients.

```
Clients/
├── Acme-Corp/
│   ├── Projects/
│   │   ├── Brand Refresh/
│   │   └── Year End 2026/
│   └── Communications/

Projects/
├── P001 Office Relocation/         # Internal project only
```

### Option C: Department-Centred

Most day-to-day work lives in department folders. `Projects/` is used for cross-departmental initiatives. `Clients/` is used if the business has external clients.

**Best for:** Businesses where work is primarily functional — ongoing marketing, regular financial processes, continuous operations. Smaller businesses where most activity maps to a department.

```
04 Marketing/
├── 04.1 Campaigns/
│   ├── q2-2026-launch/
│   └── summer-sale/
├── 04.2 Content/
│   └── 2026-03-01-Blog-Editorial-Calendar.md

01 Finance/
├── 01.2 Accounts Receivable/
│   └── 2026-03-15-Outstanding-Invoices.md

Projects/
├── P001 CRM Migration/            # Cross-departmental initiative
```

### Option D: Hybrid

Mix and match. Use `Projects/` for tracked initiatives with deadlines, `Clients/` for external relationships, and department folders for standing processes. This is the most common approach for businesses with both client work and internal operations.

**The key principle:** Each piece of work should live in one place. If a marketing campaign is also a tracked project, decide whether it lives in `Marketing/Campaigns/` or `Projects/P005 Summer Campaign/` — not both. Whichever you choose, be consistent.

### Unused Folders

If a folder does not apply to your business, you can:
- **Delete it** — remove it entirely
- **Ignore it** — leave it empty; it will not interfere with anything
- **Repurpose it** — rename it to something that fits (e.g., rename `06 Products/` to `06 Services/`)

The `/setup` command will ask about your preferred organisation model and can remove irrelevant folders.

---

## What Belongs Where

| Content Type | Location |
|--------------|----------|
| Active project work | `Projects/{ID} {Project Name}/` |
| Completed projects | `Archive/{ID} {Project Name}/` |
| Recurring workflows | `Projects/Workflows/` |
| Reference documents | `Documentation/` |
| Document templates | `Documentation/Templates/` |
| Reports and analyses | `Documentation/Reports/` |
| Scripts and automation | `Infrastructure/Scripts/` |
| Client deliverables | `Clients/[client-name]/` |
| Financial records | `01 Finance/` |
| HR material | `02 Human Resources/` |
| Sales activity | `03 Sales/` |
| Marketing material | `04 Marketing/` |
| Operational processes | `05 Operations/` |
| Product/service info | `06 Products/` |
| Legal documents | `07 Legal/` |
| Agent outputs | `~/Documents/Agent Outputs/[project-id]/` |

---

### `~/Documents/Agent Outputs/`

Agent outputs from Claude Code subagents (Explore, Plan, Research, and long-running general agents) are saved here for long-term retrieval.

```
~/Documents/Agent Outputs/
├── P001/                     # Outputs for project P001
│   ├── 2026-02-15-1430-market-research.md
│   └── 2026-02-16-0900-competitor-analysis.md
├── P003/                     # Outputs for project P003
│   └── 2026-02-17-1837-agent-prima-memory.md
└── general/                  # Outputs without project context
    └── 2026-02-18-1100-codebase-exploration.md
```

**This folder lives outside the workspace** (in `~/Documents/`) because agent outputs span multiple workspaces and projects. It is read by Prima Memory when `deep: true` is used on `search_history`.

**Filename convention:** `YYYY-MM-DD-HHMM-description.md`

---

## Files NOT Stored Here

The following file types are excluded from this repository (via `.gitignore`):

- **Office documents:** `.docx`, `.xlsx`, `.pptx`
- **PDFs:** `.pdf`
- **Images:** `.png`, `.jpg`, `.gif`, `.svg`
- **Audio/Video:** `.mp3`, `.mp4`, `.mov`
- **Large files:** Anything over ~1MB

These files should remain on your cloud storage (Google Drive, OneDrive, Dropbox). Reference them by path when working with Claude.
