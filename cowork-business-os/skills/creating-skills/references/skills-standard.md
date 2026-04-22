# Claude Skills Standard

Comprehensive reference for building, auditing, and modifying Claude Code skills. Based on Anthropic's official guide "The Complete Guide to Building Skills for Claude" and the Agent Skills open standard.

---

## What Is a Skill

A skill is a folder containing instructions that teach Claude how to handle specific tasks or workflows. Skills are the knowledge layer — capturing workflows, best practices, and domain expertise so Claude can apply them consistently.

A skill folder contains:

- **SKILL.md** (required) — instructions in Markdown with YAML frontmatter
- **scripts/** (optional) — executable code (Python, Bash)
- **references/** (optional) — documentation loaded as needed
- **assets/** (optional) — templates, fonts, icons used in output

No other files at root level. No README.md inside skill folders (README is only for repo-level distribution of shareable skills).

---

## Core Design Principles

### Progressive Disclosure

Skills use a three-level system to minimise token usage:

| Level | Content | When Loaded |
|-------|---------|-------------|
| **Level 1: YAML frontmatter** | Name and description only | Always — appears in Claude's system prompt |
| **Level 2: SKILL.md body** | Full instructions and guidance | When Claude determines the skill is relevant |
| **Level 3: Linked files** | Detailed reference, templates, examples | Only when Claude navigates to them during execution |

**Implications:**
- Frontmatter must contain enough information for Claude to decide when to load the skill, without loading all of it
- SKILL.md body should stay focused on core instructions (under 5,000 words)
- Detailed documentation, API references, and extensive examples belong in `references/`

### Composability

Claude can load multiple skills simultaneously. Skills should work alongside others and not assume they are the only capability available. Avoid instructions that override general behaviour unless essential.

### Portability

Skills work across Claude.ai, Claude Code, and the API without modification, provided the environment supports any dependencies the skill requires. Use the `compatibility` frontmatter field to note environment requirements.

---

## Skill Structure Requirements

### File and Folder Naming

| Rule | Correct | Incorrect |
|------|---------|-----------|
| Skill file must be exactly `SKILL.md` (case-sensitive) | `SKILL.md` | `skill.md`, `SKILL.MD`, `Skill.md` |
| Folder name in kebab-case | `code-reviewer` | `Code Reviewer`, `code_reviewer`, `CodeReviewer` |
| Folder name matches `name` field | `processing-pdfs/` with `name: processing-pdfs` | Mismatched names |
| No "claude" or "anthropic" in name | `skill-builder` | `claude-helper` (reserved) |
| No README.md inside skill folder | Documentation in SKILL.md or references/ | README.md at skill root |

### YAML Frontmatter

Must be enclosed in `---` delimiters. Only `description` is strictly required. The `name` field is strongly recommended but defaults to the folder name if omitted.

```yaml
---
name: skill-name-in-kebab-case
description: What it does. Use when [trigger conditions]. [Key capabilities].
---
```

**Security restrictions:**
- No XML angle brackets (`<` `>`) anywhere in frontmatter
- Safe YAML parsing enforced — no code execution in values

For the complete field reference, see [frontmatter-reference.md](frontmatter-reference.md).

---

## Writing Effective Descriptions

The description is the single most important part of the skill. It determines whether Claude loads the skill at the right time. This is Level 1 of progressive disclosure.

### Required Structure

```
[What it does] + [When to use it] + [Key capabilities]
```

### The Description Must Include

1. **What the skill does** — clear, specific purpose statement
2. **When to use it** — explicit trigger conditions with natural language phrases users would actually say
3. **Key capabilities** — differentiate from related skills if needed

### Trigger Phrase Patterns

Include 3-4 ways users might phrase the same request:

- **Action phrases:** "create a...", "set up a...", "process this...", "review my..."
- **File references:** ".pdf files", ".docx", "spreadsheet", "presentation"
- **Domain terms:** "sprint planning", "code review", "SEO package"
- **Negation (when needed):** "Do NOT use for..." to prevent conflicts with similar skills

### Good vs Bad Descriptions

**Good — specific with trigger phrases:**
```yaml
description: Grade student assignments against rubrics and generate Word feedback documents. Use when grading essays, exams, or reports, or batch processing submissions.
```

**Good — differentiates from related skill:**
```yaml
description: Generate YouTube SEO packages — titles, descriptions, timestamps, and thumbnails. Use when optimising videos. For transcript extraction only, use extracting-youtube-transcripts.
```

**Bad — too vague, no triggers:**
```yaml
description: Helps with projects.
```

**Bad — lists capabilities but no trigger phrases:**
```yaml
description: Extract, merge, split, fill forms, annotate PDFs.
```

### Description Constraints

- Under 1024 characters (hard limit)
- Aim for 150-250 characters for best results
- No XML angle brackets
- No multiline YAML block syntax (`|` or `>`) — use single-line strings

For extended guidance with more examples, see [description-guide.md](description-guide.md).

---

## SKILL.md Body Structure

After the frontmatter, write instructions in Markdown. The recommended structure:

```markdown
# [Skill Name]

[One-sentence overview]

## When to Use

- [Trigger condition 1]
- [Trigger condition 2]
- [Trigger condition 3]

## Workflow

### Step 1: [First Major Step]
[Clear, specific explanation with concrete actions]

### Step 2: [Second Major Step]
[Include expected output where relevant]

## Output Format

[What gets produced — file format, structure, location]

## Examples

### Example 1: [Common scenario]
**User says:** "[Natural language request]"
**Actions:**
1. [Action]
2. [Action]
**Result:** [What gets produced]

## Troubleshooting

### [Common error or issue]
**Cause:** [Why it happens]
**Solution:** [How to fix it]

## Additional Resources

- For [topic], see [references/topic.md](references/topic.md)
```

### Instruction Quality Standards

**Be specific and actionable:**
```
# Good
Run `python scripts/validate.py --input {filename}` to check data format.
If validation fails, common issues include:
- Missing required fields (add them to the CSV)
- Invalid date formats (use YYYY-MM-DD)

# Bad
Validate the data before proceeding.
```

**Include error handling:**
```markdown
## Common Issues

### MCP Connection Failed
If you see "Connection refused":
1. Verify MCP server is running
2. Confirm API key is valid
3. Try reconnecting
```

**Put critical instructions at the top:**
- Use `## Important` or `## Critical` headers for must-follow rules
- Don't bury essential instructions in the middle of long sections
- Repeat key constraints if the skill is long

**Avoid ambiguous language:**
```
# Bad
Make sure to validate things properly

# Good
CRITICAL: Before calling create_project, verify:
- Project name is non-empty
- At least one team member assigned
- Start date is not in the past
```

### Size Guidelines

- Keep SKILL.md under 5,000 words
- Move detailed documentation to `references/`
- Link to reference files so Claude knows when to load them
- For critical validations, consider bundling a script rather than relying on language instructions — code is deterministic, language interpretation is not

---

## Skill Use Case Categories

### Category 1: Document & Asset Creation

Creating consistent, high-quality output (documents, presentations, apps, designs, code).

**Key techniques:**
- Embedded style guides and brand standards
- Template structures for consistent output
- Quality checklists before finalising
- Typically no external tools required

### Category 2: Workflow Automation

Multi-step processes that benefit from consistent methodology.

**Key techniques:**
- Step-by-step workflow with validation gates
- Templates for common structures
- Built-in review and improvement suggestions
- Iterative refinement loops

### Category 3: MCP Enhancement

Workflow guidance layered on top of MCP server tool access.

**Key techniques:**
- Coordinates multiple MCP calls in sequence
- Embeds domain expertise
- Provides context users would otherwise need to specify
- Error handling for common MCP issues

---

## Workflow Patterns

### Pattern 1: Sequential Workflow Orchestration

Use when users need multi-step processes in a specific order.

- Explicit step ordering
- Dependencies between steps
- Validation at each stage
- Rollback instructions for failures

### Pattern 2: Multi-MCP Coordination

Use when workflows span multiple services.

- Clear phase separation
- Data passing between MCPs
- Validation before moving to next phase
- Centralised error handling

### Pattern 3: Iterative Refinement

Use when output quality improves with iteration.

- Explicit quality criteria
- Validation scripts or checks
- Know when to stop iterating

### Pattern 4: Context-Aware Tool Selection

Use when the same outcome requires different tools depending on context.

- Clear decision criteria
- Fallback options
- Transparency about choices made

### Pattern 5: Domain-Specific Intelligence

Use when the skill adds specialised knowledge beyond tool access.

- Domain expertise embedded in logic
- Compliance or quality checks before action
- Comprehensive documentation of decisions

---

## Invocation Control

| Frontmatter | User Invokes | Claude Invokes | When Loaded |
|-------------|------------|----------------|-------------|
| (default) | Yes | Yes | Description in system prompt; full content when invoked |
| `disable-model-invocation: true` | Yes | No | Not in system prompt; loads only on `/skill-name` |
| `user-invocable: false` | No | Yes | Description in system prompt; Claude invokes when relevant |

**Use `disable-model-invocation: true` for:**
- Workflows with side effects (deploy, commit, send messages)
- Tasks where the user controls timing
- Actions Claude should not decide when to execute

**Use `user-invocable: false` for:**
- Background knowledge (conventions, patterns, context)
- Information Claude uses but is not an actionable user command

---

## Testing

### Triggering Tests

Verify the skill loads at the right times:

- Does it trigger on obvious, direct requests?
- Does it trigger on paraphrased or indirect requests?
- Does it avoid triggering on unrelated topics?

**Debugging:** Ask Claude "When would you use the [skill name] skill?" — Claude will quote the description back. Adjust based on what's missing.

### Functional Tests

Verify the skill produces correct outputs:

- Valid outputs generated
- API/tool calls succeed
- Error handling works
- Edge cases covered

### Performance Comparison

Compare the same task with and without the skill:

- Number of back-and-forth messages needed
- Failed tool calls requiring retry
- Token consumption
- User corrections needed

---

## Troubleshooting

### Skill Doesn't Trigger

**Cause:** Description too vague or missing trigger phrases.

**Fix:**
- Is it too generic? ("Helps with projects" won't trigger reliably)
- Does it include phrases users would actually say?
- Does it mention relevant file types?
- Add more keywords, especially technical terms

### Skill Triggers Too Often

**Cause:** Description too broad or overlaps with other skills.

**Fix:**
- Add negative triggers ("Do NOT use for...")
- Be more specific about scope
- Clarify boundaries with related skills

### Instructions Not Followed

**Causes and fixes:**

1. **Too verbose** — keep instructions concise, use bullets and numbered lists, move detail to references/
2. **Critical instructions buried** — put essential rules at the top, use prominent headers
3. **Ambiguous language** — replace vague instructions with specific, verifiable actions
4. **Model skipping steps** — add "CRITICAL:" prefix, repeat key constraints

### Large Context Issues

**Symptom:** Skill seems slow or responses degraded.

**Fixes:**
- Move detailed docs from SKILL.md to references/
- Keep SKILL.md under 5,000 words
- Evaluate whether 20+ skills need to be enabled simultaneously
- Consider `disable-model-invocation: true` for infrequently used skills

---

## Compliance Checklist

Use this to validate any skill — new or existing.

### Structure
- [ ] File named exactly `SKILL.md` (case-sensitive)
- [ ] Folder named in kebab-case
- [ ] YAML frontmatter enclosed in `---` delimiters
- [ ] No README.md inside skill folder
- [ ] No XML angle brackets in frontmatter

### Frontmatter
- [ ] `name` field present (recommended; defaults to folder name if omitted), kebab-case, matches folder name
- [ ] `description` field present
- [ ] Description includes WHAT the skill does
- [ ] Description includes WHEN to use it (trigger phrases)
- [ ] Description under 1024 characters
- [ ] No "claude" or "anthropic" in name

### Description Quality
- [ ] Follows `[What] + [When] + [Capabilities]` structure
- [ ] Includes 3-4 natural language trigger phrases
- [ ] Mentions relevant file types (if applicable)
- [ ] Differentiates from related skills (if applicable)
- [ ] Not too vague ("Helps with projects" fails)
- [ ] Not too broad (doesn't trigger on unrelated queries)

### Instructions
- [ ] Clear, specific, actionable steps (not vague guidance)
- [ ] Error handling / troubleshooting section included
- [ ] Examples provided (at least one common scenario)
- [ ] Critical instructions at the top, not buried
- [ ] References to supporting files use relative links

### Progressive Disclosure
- [ ] SKILL.md under 5,000 words
- [ ] Detailed reference material in `references/` (if skill is large)
- [ ] Supporting files linked from SKILL.md so Claude knows they exist
- [ ] Templates and scaffolds in separate files (not inline in SKILL.md)

### Security (Shareable Skills)
- [ ] No hardcoded credentials or personal paths
- [ ] No API keys or tokens in any file
- [ ] README.md at repository root (not inside skill folder)
- [ ] Works standalone with only its README for installation

---

## References

- Official skills documentation: https://code.claude.com/docs/en/skills
- Agent Skills open standard: https://agentskills.io
- Official plugins repository: https://github.com/anthropics/claude-plugins-official
- Anthropic engineering blog: "Equipping Agents for the Real World"
