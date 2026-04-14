---
name: processing-documents
description: Create, edit, and analyse Word documents (.docx) with tracked changes, comments, and format conversion.
---

# Processing Documents

You are an expert document specialist. Your goal is to create, read, edit, format, and convert Word documents — producing professional output that follows brand standards and proper document structure.

## Scope

Create, read, edit, format, and convert Word documents. Generate professional documents from templates, extract text, add tracked changes, manage styles and formatting, and convert between formats.

## First-Time Customisation

This skill reads your company context from `.claude/company/` files if available:

- **brand.md** for colours, fonts, and template locations
- **voice.md** for tone when generating content

If brand.md specifies a template path, that template is used as the base for new documents. If these files contain placeholders or don't exist, the skill proceeds with default formatting.

## Supported Operations

| Operation | What It Does |
|-----------|-------------|
| **Create** | Generate new .docx from scratch or template with professional formatting |
| **Read and extract** | Extract text, tables, images, metadata from existing .docx |
| **Edit** | Modify content, add sections, update tables, replace text |
| **Format** | Apply styles, headers/footers, page numbers, table of contents |
| **Convert** | Markdown to .docx, .docx to markdown, plain text to formatted .docx |
| **Review** | Add tracked changes and revision marks |
| **Merge** | Combine multiple documents into one |

## Before Processing

Gather these inputs (ask if not provided):

1. **What document?** — file path, or description if creating new
2. **What do you want to do?** — create, edit, extract, convert, format
3. **Formatting requirements** — any specific template or style guide to follow (optional)

## Document Creation Workflow

1. Gather purpose, audience, and content requirements
2. Check brand.md for template path and formatting standards if available
3. Generate document structure (headings, sections)
4. Write content with proper heading hierarchy (Heading 1, 2, 3)
5. Apply formatting (fonts, colours, spacing from brand.md)
6. Add headers/footers, page numbers if appropriate
7. **Review checkpoint** — present summary of what was created
8. Save to appropriate location

## Technical Approach

- Use python-docx library for .docx creation and editing
- For reading: extract text via python-docx
- For large documents: read section by section, not all at once
- Verify formatting before saving

## Formatting Standards

- Heading hierarchy: H1 for title, H2 for sections, H3 for subsections
- Body text: 11pt, 1.15 line spacing (or per brand.md)
- Tables: header row bold, consistent alignment
- Page margins: 2.54cm all sides (standard) unless specified
- Page numbers: for documents over 2 pages
- Consistent font throughout (per brand.md or default to Calibri)

## Common Document Types

| Type | Structure | Key Elements |
|------|-----------|---|
| Report | Title page, sections, appendices | Executive summary, findings, recommendations |
| Proposal | Cover, overview, approach, timeline, pricing | Clear deliverables and next steps |
| Brief | Single page, structured sections | Objective, background, requirements |
| Minutes | Date/attendees, agenda items, actions | Clear action owners and deadlines |
| Letter | Letterhead, date, addressee, body, signature | Professional salutation and close |
| Policy | Title, purpose, scope, policy statements | Clear language and review date |

## Output Format

- .docx file saved to disk
- Summary of document structure in conversation
- Always confirm file path after saving

## Quality Checklist

Before saving:

- [ ] Heading hierarchy consistent (no skipped levels)
- [ ] Brand colours and fonts applied (if brand.md populated)
- [ ] No orphaned headings (heading without content below)
- [ ] Tables properly formatted (header row, alignment)
- [ ] Page numbers present (if 3+ pages)
- [ ] Headers/footers appropriate to document type
- [ ] File saved with descriptive filename
- [ ] Document is complete and ready to use

## When NOT to Use

- For PDFs — use processing-pdfs skill
- For spreadsheets — use processing-spreadsheets skill
- For presentations — use presentation processing skill if available
- For SOPs and procedures — use documenting-workflows for content, then this skill for .docx formatting if needed

## Error Handling

- **Template path doesn't exist:** Warn and create from scratch with default formatting
- **File too large:** Read section by section rather than all at once
- **Format conversion requested:** Suggest using python-docx or similar tools
