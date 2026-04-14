---
name: drafting-documents
description: Create business documents (proposals, reports, briefs, memos) from prompts or outlines. Use when asked to draft a proposal, write a report, compose a brief, or create business correspondence.
---

# Drafting Documents

Create professional business documents from user prompts, outlines, or reference materials. Handles proposals, reports, briefs, memos, and general business correspondence.

## Process

1. **Clarify requirements**
   - Document type (proposal, report, brief, memo, letter, other)
   - Intended audience (internal, client, executive, external)
   - Key points to include
   - Desired length and format
   - Any reference materials or templates to follow

2. **Review context**
   - Check for existing templates in `.claude/company/templates/` if available
   - Review any referenced source materials
   - Note organisation-specific terminology if applicable

3. **Draft the document**
   - Use appropriate tone for audience
   - Structure with clear headings and sections
   - Include executive summary for longer documents
   - Maintain professional, clear language

4. **Present for review**
   - Show draft to user
   - Incorporate feedback
   - Finalise when approved

## Context Sources

| Source | What It Provides | How to Use |
|--------|-----------------|-----------|
| `.claude/company/voice.md` | Voice, tone, language preferences | Ask user if not available |
| `.claude/company/brand.md` | Brand guidelines, templates | Ask user if not available |
| `.claude/company/audiences.md` | Target audiences | Ask user if not available |
| `.claude/company/industry.md` | Industry terminology | Ask user if not available |
| `.claude/company/templates/` | Branded document templates | Check if available |

## Document Types

| Type | Purpose | Typical Length | Key Elements |
|------|---------|---|---|
| **Proposal** | Pitch a solution to a client | 3-10 pages | Problem statement, solution, timeline, pricing, next steps |
| **Report** | Present findings or analysis | 5-20 pages | Executive summary, methodology, findings, recommendations |
| **Brief** | Concise summary of a topic | 1-3 pages | Objective, background, key points, recommendations |
| **Memo** | Internal communication | 1-2 pages | Purpose, key information, action items |
| **Letter** | Formal business correspondence | 1 page | Professional salutation, body, clear close |
| **Policy** | Organisational guidelines | 2-5 pages | Purpose, scope, policy statements, review date |

## Document Structure Guidelines

### Proposals
- Cover page with title and date
- Executive summary (1-2 paragraphs)
- Problem statement (what challenge does the client face?)
- Proposed solution (how you'll solve it)
- Timeline and deliverables
- Investment/pricing (if applicable)
- Next steps and call to action

### Reports
- Title page
- Executive summary
- Table of contents (for longer reports)
- Introduction
- Methodology (if applicable)
- Findings (organised by theme or topic)
- Analysis and interpretation
- Recommendations
- Appendices (supporting data)

### Briefs
- Title and date
- Objective (1-2 sentences)
- Background and context
- Key findings or requirements
- Recommendations
- Timeline or next steps

## Quality Checklist

Before presenting:

- [ ] Document type matches audience needs
- [ ] Clear, logical structure with proper headings
- [ ] Language appropriate to audience (formal/informal as needed)
- [ ] All key information included
- [ ] No jargon without explanation
- [ ] Specific recommendations or next steps provided
- [ ] Consistent formatting throughout
- [ ] Proofread for spelling and grammar

## When NOT to Use

- For individual emails (use email-drafting skill)
- For Word document formatting specifically (use processing-documents)
- For SOPs and procedures (use documenting-workflows)
