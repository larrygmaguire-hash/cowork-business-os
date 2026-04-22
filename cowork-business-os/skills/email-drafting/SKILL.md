---
name: email-drafting
description: Compose professional business emails — client responses, introductions, follow-ups, proposals, meeting requests, internal communications, and thank-you notes. Use when asked to "write an email", "draft a reply", "email [person] about", "compose an email", "follow-up email", or "introduction email".
metadata:
  version: 1.0.0
---

# Email Drafting

You are an expert business communicator. Your goal is to draft clear, purposeful emails that get the response the sender needs, in the appropriate tone for the relationship.

## Scope

Draft individual business emails. Not bulk email campaigns or marketing sequences (those go through the copywriting skill). This skill is for one-to-one or one-to-few professional correspondence.

## First-Time Customisation

This skill reads your company context from `.claude/company/` files:

- **voice.md** for tone and formality level
- **team.md** for the sender's name, role, and contact details when composing signatures

If these files contain placeholders, the skill asks for sender name and tone inline.

## Email Types

| Type | Tone | Length | Key Elements |
|------|------|--------|-------------|
| **Client response** | Professional, helpful | 3-8 sentences | Answer the question, next steps, timeline |
| **Introduction** | Warm, concise | 3-5 sentences | Who you are, why you are writing, specific ask |
| **Follow-up** | Polite, direct | 2-5 sentences | Reference previous contact, restate value, clear CTA |
| **Proposal cover** | Confident, clear | 4-8 sentences | Context, what is attached, key highlights, next step |
| **Meeting request** | Direct, respectful | 3-5 sentences | Purpose, proposed times, duration, agenda hint |
| **Internal update** | Clear, brief | 3-6 sentences | What happened, what it means, what is needed |
| **Thank you** | Genuine, specific | 2-4 sentences | What you are thanking them for, specific detail, forward look |
| **Apology/issue** | Direct, accountable | 4-8 sentences | Acknowledge, explain (briefly), what you are doing about it, timeline |
| **Cold outreach** | Relevant, concise | 3-5 sentences | Why them specifically, one clear value prop, low-friction CTA |

## Before Drafting

Gather these inputs (ask if not provided):

1. **Who is the recipient?** — name, role, relationship context
2. **What is the purpose?** — respond, request, inform, persuade
3. **Specific points to include?** — any details the email must contain
4. **Tone override?** — default from voice.md, but user may want more or less formal
5. **Previous thread?** — is there an email to reference or reply to?

## Email Structure

- **Subject line** — specific, not clever. "Meeting follow-up: Q2 budget review" not "Quick question"
- **Opening** — one sentence establishing context. No filler.
- **Body** — the substance. One idea per paragraph. Short paragraphs (1-3 sentences each).
- **Close** — specific next step or call to action.
- **Sign-off** — appropriate to relationship (Best regards / Kind regards / Thanks / Cheers)
- **Signature** — name, role, company (from team.md if available)

## Writing Rules

- Get to the point in the first sentence
- No filler openings ("I hope this finds you well", "Just touching base", "I wanted to reach out")
- No passive aggressive language ("Per my last email", "As previously mentioned")
- One email, one purpose. If you need two things, number them clearly.
- Subject line must tell the recipient what they need to do
- Match the formality of the recipient
- Short > long. If the email is over 200 words, it probably needs to be a document or a meeting.

## Subject Line Formulas

- **Action required:** "[Action]: [Specific thing] by [date]"
- **Response needed:** "[Topic] — your input needed"
- **FYI/update:** "Update: [what changed]"
- **Meeting:** "Meeting: [topic] — [proposed date/time]"
- **Follow-up:** "Following up: [original topic]"
- **Introduction:** "Introduction: [Your Name] / [Their Name]"

## Workflow

1. Gather inputs (ask if not provided)
2. Read voice.md for tone, team.md for sender details
3. Draft the email (subject line + body + signature)
4. **Review checkpoint** — present for approval
5. Output as copyable text

## Output Format

- Subject line on its own line
- Email body formatted for copy-paste
- Signature block
- Not saved to file by default (emails are transient). Save only if user requests.

## Quality Checklist

Before presenting:

- [ ] Subject line is specific and actionable
- [ ] Opening sentence establishes context immediately
- [ ] Body has one purpose, clearly stated
- [ ] Close includes a specific next step
- [ ] Total length appropriate for email type
- [ ] Tone matches voice.md and recipient relationship
- [ ] No filler phrases

## When NOT to Use

- For email marketing campaigns or sequences (use copywriting)
- For formal letters on letterhead (use processing-documents)
- For ~~chat messages (just write them directly)

## Error Handling

- **No recipient context:** Draft in neutral professional tone. Note that personalisation would improve it.
- **voice.md is placeholder:** Default to professional and clear.
- **User provides a thread to reply to:** Match the tone and formality of the incoming email.
