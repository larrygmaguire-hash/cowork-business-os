---
name: creating-clients
description: >
  Create a new client folder with standardised structure, contact tracking, and project registry. Generates README with company information and contact details.
---

# Creating Clients

Create a new client folder with consistent structure.

## Step 1: Gather Client Details

Ask for:

1. **Client/company name** (required)
2. **Contact names** (required — at least one person associated with this client). Accept comma-separated or list format.
3. **Industry** (optional)

If user provided name with initial input (e.g., "creating-clients Acme Corp"), use that directly and ask for contacts.

Example prompt for contacts:

```
Who are the main contacts for this client? (names only — full details can be added later)
```

## Step 2: Generate Folder Name

Convert client name to folder format:

- Format: Title-Case with hyphens for spaces
- Example: `Acme-Corporation`

## Step 3: Create Folder Structure

Create in `Clients/`:

```
Clients/{Client-Name}/
├── README.md
├── Projects/
├── Communications/
└── Reference/
```

## Step 4: Generate README.md

```markdown
# {Client Name}

**Industry:** [Industry or "To be added"]
**Relationship started:** [Today's date]
**Cloud storage:** To be configured

## Overview

[To be added — brief description of client relationship]

## Contacts

| Name | Role | Email | Phone |
|------|------|-------|-------|
| {Contact 1} | To be added | To be added | To be added |
| {Contact 2} | To be added | To be added | To be added |

## Active Projects

| Project | Status | Location |
|---------|--------|----------|
| [None yet] | | |

## Notes

Relationship notes and key information to be added.

## Cloud Storage

Heavy files for this client are stored at:
- Path to be configured
```

## Step 5: Confirm Client Creation

```markdown
## Client Folder Created

**Location:** `Clients/{Client-Name}/`
**Company:** {Client Name}
**Contacts:** {Contact names}

Structure:
- README.md ✓
- Projects/ ✓
- Communications/ ✓
- Reference/ ✓

Ready to add projects and documents for this client.

---

Want me to create a project for this client?
```

## Step 6: Handle Follow-up

If user says yes to creating a project:

Invoke the `creating-projects` skill with:
- Category pre-selected as `client`
- `companyName` field: {Client Name}
- `contacts` field: [Contact names array]

Otherwise, workflow ends. README.md can be updated manually as the relationship develops.

---

Begin by asking for client name and primary contact.
