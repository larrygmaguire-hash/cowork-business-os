---
name: creating-skills
description: >
  Scaffold new skills following the Cowork Business OS standard. Interactive workflow for creating new capabilities with structured workflows, documentation, and trigger descriptions. Use when asked to create a skill, build a skill, scaffold a skill, new skill, or add a skill.
---

# Creating Skills

Interactive workflow for creating new Cowork Business OS skills following the standard format.

## When to Use

- User says "create a skill", "new skill", "scaffold a skill", "build a skill", or "add a skill"
- User wants to create a SKILL.md file from scratch
- User asks how to structure a new Cowork capability

## Step 1: Gather Information

Ask these questions **one at a time, sequentially**:

1. **Name** — kebab-case (e.g., `code-reviewer`, `knowledge-manager`)
2. **Purpose** — one sentence: what does it do and when should it trigger?
3. **Mode** — `internal` (workspace-specific) or `shareable` (generic for distribution)

## Step 2: Configuration

Ask **one at a time**:

1. **Supporting files needed?** (or "none")
   - `references` — detailed reference documentation
   - `scripts` — utility scripts (Python, Bash)
   - `assets` — templates, icons

2. **Special configurations?** (or "none")
   - `restricted-tools` — limit tool access (will specify which tools)

## Step 3: Write the Description

This is the most critical step. The description determines whether the skill is invoked at the right time.

**Required structure:** `[What it does] + [When to use it] + [Key capabilities]`

- Include 3-4 natural language trigger phrases users would actually say
- Mention relevant file types if applicable
- Add negative triggers if the skill could conflict with another
- Keep under 1024 characters (aim for 150-250)

## Step 4: Generate the Skill

Consult the template below for the complete scaffold.

**Location:**
- Internal: `.claude/skills/[skill-name]/`
- Shareable: Your preferred development directory (e.g., `~/Developer/[skill-name]/`)

**Create these files:**

1. **SKILL.md** — frontmatter + core instructions. Structure:
   - `# [Skill Name]` — one-sentence overview
   - `## When to Use` — trigger conditions (mirrors description)
   - `## Workflow` — numbered steps with clear actions
   - `## Output Format` — what gets produced
   - `## Examples` — 1-2 common scenarios
   - `## Troubleshooting` — common errors and fixes

2. **Supporting files** as requested (references/, scripts/, assets/)

## SKILL.md Template

```markdown
---
name: [skill-name]
description: >
  [What it does] + [When to use it]. Include 3-4 trigger phrases.
---

# [Skill Name]

[One-sentence overview]

## When to Use

[Describe the situations where this skill applies]

## Scope

[Define what this skill covers and what it doesn't]

## Workflow

1. [First step — what to gather or check]
2. [Second step — processing or analysis]
3. [Third step — review or present]
4. [Final step — save or deliver]

## Output Format

[Describe what gets produced — files, formats, structure]

## Examples

### Example 1: [Common scenario]

[What the user would ask]

[What the skill produces]

### Example 2: [Another scenario]

[What the user would ask]

[What the skill produces]

## Quality Checklist

Before presenting results:

- [ ] [Check item 1]
- [ ] [Check item 2]
- [ ] [Check item 3]

## Troubleshooting

### [Common error]

**Cause:** [Root cause]
**Solution:** [How to fix]

## When NOT to Use

- For [what this skill doesn't do]
- For [what other skills handle]

## Error Handling

- **Scenario 1:** [Error condition and response]
- **Scenario 2:** [Error condition and response]
```

## Step 5: Validate

Summary checklist:

- [ ] `SKILL.md` has valid YAML frontmatter with `---` delimiters
- [ ] `name` is kebab-case, matches folder name
- [ ] `description` includes WHAT + WHEN + trigger phrases
- [ ] Instructions are specific and actionable (not vague)
- [ ] Error handling included
- [ ] Supporting files referenced from SKILL.md with links
- [ ] No hardcoded credentials (shareable mode)

## Step 6: Next Steps

Inform the user:

1. **Review** the generated SKILL.md — fill in detailed workflow steps
2. **Test triggering** — describe the skill to someone else and see if they understand when to use it
3. **Test manually** — try invoking the skill
4. **Iterate on description** if the skill isn't clear (refine trigger phrases, add examples)
5. **Shareable mode:** test that the README provides complete standalone instructions

### Shareable Workflow Reminder

When building shareable skills:
1. Generic version first in your development directory — no personal data
2. Test standalone — must work with only its README
3. Customise for your workspace — adapt for internal use
4. Document differences between versions

## Output Format

- `[skill-name]/SKILL.md` — frontmatter + instructions
- `[skill-name]/references/` — supporting documentation (if requested)
- `[skill-name]/scripts/` — utility scripts (if requested)
- `[skill-name]/assets/` — templates, icons (if requested)

## Examples

### Example 1: Internal skill for grading assignments

**User says:** "Create a skill for grading student assignments"

**Actions:**
1. Name → `grading-assignments`
2. Purpose → Grade submissions against rubrics and generate feedback documents
3. Mode → internal
4. Supporting files → references (rubric templates)
5. Generate SKILL.md at `.claude/skills/grading-assignments/SKILL.md`

**Result:** Skill folder with SKILL.md containing workflow steps, rubric handling, and output format specification

### Example 2: Shareable skill for data analysis

**User says:** "Create a skill that analyses spreadsheet data and generates reports"

**Actions:**
1. Name → `spreadsheet-analysis`
2. Purpose → Analyse spreadsheet data, identify trends, generate summary reports
3. Mode → shareable
4. Supporting files → references (statistical methods, report templates)
5. Generate scaffold in development directory

**Result:** Complete skill ready for distribution

## Troubleshooting

### Skill not clear when to use
**Cause:** Description too vague or missing trigger phrases.
**Solution:** Add 3-4 natural language phrases users would actually say. Ensure the description answers "When should someone use this?"

### YAML frontmatter parse error
**Cause:** Malformed YAML syntax or special characters in fields.
**Solution:** Ensure `---` delimiters are on their own lines with no trailing spaces. Remove any special characters from name and description.

### Skill conflicts with another skill
**Cause:** Descriptions overlap — unclear which skill to load.
**Solution:** Add negative triggers to the description (e.g., "Do NOT use for transaction processing — use ledger-sync instead").

## Additional Resources

- Cowork Business OS skill standards
- Template examples in `.claude/skills/` directory of this workspace
