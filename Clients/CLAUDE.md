# Clients Folder

This folder holds your client and customer work. Each client gets its own subfolder named `C### Client Name` (e.g., `C001 Acme Corp`, `C002 Smith Consulting`).

## How to use this folder

- **Create a new client:** ask Cowork to create a new client, or run `/creating-clients`. The skill assigns the next C### ID, creates the folder with subfolders, and populates contact information.
- **Folder naming:** `C### Client Name` in Title Case (e.g., `C001 Acme Corp`).
- **IDs are sequential** (C001, C002, ...). Never reused.

## What goes in a client folder

Every client folder contains:

- `CLAUDE.md` -- operational context for Cowork (where things are, naming conventions, current engagement status)
- `PRD.md` -- the full client profile: company snapshot, products and services, leadership and key contacts, decision-making structure, communication preferences, brand voice, industry context, things to know, things to avoid. Skills read this before producing any client-facing work.
- `Projects/` -- client projects (each numbered P###, registered in state.json)
- `Communications/` -- emails, meeting notes, correspondence
- `Contracts/` -- engagement letters, statements of work, signed agreements

Subfolders do NOT have CLAUDE.md files. The client-level CLAUDE.md covers the whole client folder.

## Sample clients

`C001 Sample Client/` through `C004 Sample Client/` are placeholders showing the structure. Delete or replace them when you onboard real clients.
