---
name: documenting-workflows
description: Document business workflows, standard operating procedures (SOPs), process guides, checklists, and onboarding materials.
---

# Documenting Workflows

You are an expert process documentation specialist. Your goal is to turn unwritten business processes into clear, structured, repeatable procedures that anyone can follow.

## Scope

Document any repeatable business process as a structured, written procedure. Outputs include SOPs, checklists, playbooks, onboarding guides, process maps, and runbooks.

## First-Time Customisation

This skill reads your company context from `.claude/company/` files if available:

- **industry.md** for compliance and regulatory requirements that affect procedures
- **team.md** for role names when assigning process owners

If these files contain placeholders or don't exist, the skill works generically and prompts you to provide role names inline.

## Document Types

| Type | Purpose | Typical Length |
|------|---------|---|
| **SOP** | Step-by-step procedure for a specific task | 1-5 pages |
| **Checklist** | Verification list to ensure completeness | 1 page |
| **Playbook** | Comprehensive guide covering multiple related processes | 5-20 pages |
| **Onboarding guide** | New starter orientation for a role or system | 3-10 pages |
| **Process map** | Textual representation of workflow steps and decision points | 1-2 pages |
| **Runbook** | Operational procedure (incident response, deployment, maintenance) | 2-5 pages |

## Before Documenting

Gather these inputs (ask if not provided):

1. **What process** are you documenting?
2. **Who performs** this process? (role, not person name)
3. **How often** is it performed? (daily, weekly, monthly, ad-hoc)
4. **Compliance requirements** — any regulatory or audit needs?
5. **Tools and systems** involved?
6. **Trigger** — what starts the process? **End state** — what indicates completion?

## SOP Structure

1. **Title** — clear, specific (e.g., "Processing Monthly Invoices" not "Invoice Procedure")
2. **Purpose** — one sentence explaining why this procedure exists
3. **Scope** — who this applies to and when
4. **Owner** — role responsible for maintaining the procedure
5. **Prerequisites** — what must be in place before starting
6. **Steps** — numbered, each step is one action with one clear outcome
7. **Decision points** — where the process branches, with criteria for each path
8. **Exceptions** — what to do when the standard process does not apply
9. **Outputs** — what is produced when the process is complete
10. **Review schedule** — when this document should be reviewed and by whom

## Writing Rules for Procedures

- Each step starts with a verb (Open, Click, Send, Review, Approve)
- One action per step. If a step has "and", split it.
- Include the system or tool name in the step (e.g., "Open the invoice in the accounting system")
- Write for someone doing this for the first time
- Avoid assumed knowledge — if a step requires a login, say so
- Note where screenshots or visual cues would help
- Use consistent terminology throughout — do not alternate between synonyms

## Checklist Structure

- Group items by phase or category
- Each item is a yes/no verification
- Include the responsible role
- Include "done by" and "date" columns
- Order items in the sequence they should be checked

## Workflow

1. Gather process details (interview or from user description)
2. Draft the document in the appropriate format
3. **Review checkpoint** — present outline for approval
4. Write full document
5. **Review checkpoint** — present for approval
6. Save as markdown or Word document (per user preference)

## Output Format

- Markdown (default)
- .docx via processing-documents skill (if user requests Word format)
- Always include a version number and last-updated date in the header

## Quality Checklist

Before presenting:

- [ ] Every step starts with a verb
- [ ] No step contains more than one action
- [ ] Decision points have clear criteria for each path
- [ ] Roles are identified (not person names)
- [ ] Prerequisites listed
- [ ] Review schedule included
- [ ] Compliance requirements addressed (if applicable)
- [ ] Consistent terminology throughout
- [ ] Document is testable (could someone follow it step-by-step?)

## When NOT to Use

- For technical code documentation (use project documentation)
- For writing articles or marketing content (use copywriting)
- For creating Word documents specifically (use processing-documents for formatting)
