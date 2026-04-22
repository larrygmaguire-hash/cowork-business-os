---
name: creating-skills
description: Scaffold new Claude Code skills or plugin packages following the Agent Skills standard. Use when user says "create a skill", "new skill", "scaffold a skill", "build a skill", "add a skill", or "create a plugin". Determines skill vs plugin based on requirements.
---

# Skill & Plugin Creation

Interactive workflow for creating new Claude Code skills or plugin packages following official Anthropic standards.

**Standards:** `.claude/rules/plugin-development.md`

## When to Use

- User says "create a skill", "new skill", "scaffold a skill", "build a skill", or "add a skill"
- User says "create a plugin", "new plugin", or "set up a plugin package"
- User wants to create a SKILL.md file or plugin package from scratch
- User asks how to structure a new Claude Code capability

## Step 1: Determine Type

Ask the user:

1. **Single skill** — One capability/workflow (e.g., "process spreadsheets", "review code")
2. **Plugin package** — Bundle multiple skills/agents/MCPs for distribution

**Default to single skill** — most needs are skills, not plugins.

## Step 2: Gather Information

Ask these questions **one at a time, sequentially**:

1. **Name** — kebab-case (e.g., `code-reviewer`, `knowledge-manager`)
2. **Purpose** — one sentence: what does it do and when should it trigger?
3. **Mode** — `internal` (workspace-specific) or `shareable` (generic for distribution)

## Step 3: Configuration

Ask **one at a time**:

1. **Invocation control:**
   - `both` — user and Claude can invoke (default)
   - `manual-only` — only user invokes with `/skill-name` (sets `disable-model-invocation: true`)
   - `claude-only` — Claude invokes automatically (sets `user-invocable: false`)

2. **Supporting files needed?** (or "none")
   - `references` — detailed reference documentation
   - `scripts` — utility scripts (Python, Bash)
   - `assets` — templates, fonts, icons

3. **Special configurations?** (or "none")
   - `subagent` — run in isolated subagent (adds `context: fork`)
   - `restricted-tools` — limit tool access (will prompt for list)
   - `specific-model` — force model (will prompt: haiku/sonnet/opus)

## Step 4: Write the Description

This is the most critical step. The description determines whether Claude loads the skill at the right time.

**Required structure:** `[What it does] + [When to use it] + [Key capabilities]`

CRITICAL: Before writing the description, consult [references/description-guide.md](references/description-guide.md) for examples of good and bad descriptions, trigger phrase patterns, and debugging advice.

- Include 3-4 natural language trigger phrases users would actually say
- Mention relevant file types if applicable
- Add negative triggers if the skill could conflict with another
- Keep under 1024 characters (aim for 150-250)

## Step 5: Generate the Skill

### For single skills

Consult [references/skill-template.md](references/skill-template.md) for the complete scaffold.

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
   - `## Additional Resources` — links to reference files if any

2. **Supporting files** as requested (references/, scripts/, assets/)

For complete YAML frontmatter field reference, see [references/frontmatter-reference.md](references/frontmatter-reference.md).

### For plugin packages

Consult [references/plugin-template.md](references/plugin-template.md) for the complete scaffold.

**Location:**
- Internal: `.claude/plugins/[plugin-name]/`
- Shareable: Your preferred development directory (e.g., `~/Developer/[plugin-name]/`)

**Create these files:**

1. `.claude-plugin/plugin.json` — metadata
2. `README.md` — with mandatory Security & Trust section
3. Component directories as needed (skills/, agents/, commands/)
4. `.mcp.json` if MCP server included

Each skill within the plugin follows the same SKILL.md standard above.

## Step 6: Validate

Consult [references/skills-standard.md](references/skills-standard.md) for the full compliance checklist. Summary below.

### For skills

- [ ] `SKILL.md` has valid YAML frontmatter with `---` delimiters
- [ ] `name` is kebab-case, matches folder name
- [ ] `description` includes WHAT + WHEN + trigger phrases
- [ ] No XML angle brackets in frontmatter
- [ ] Instructions are specific and actionable (not vague)
- [ ] Error handling included
- [ ] Supporting files referenced from SKILL.md with links
- [ ] No hardcoded credentials (shareable mode)
- [ ] README at repo root only (shareable mode)

### For plugins

- [ ] `.claude-plugin/plugin.json` present and complete
- [ ] `README.md` includes Security & Trust section
- [ ] All skills follow SKILL.md standard
- [ ] No hardcoded credentials (shareable mode)

## Step 7: Next Steps

Inform the user:

1. **Review** the generated SKILL.md — fill in detailed workflow steps
2. **Test triggering** — ask Claude something matching the description
3. **Test manually** — run `/[skill-name]` directly
4. **Iterate on description** if Claude doesn't invoke when expected (see [description-guide.md](references/description-guide.md))
5. **Shareable mode:** test that the README provides complete standalone instructions

### Shareable Workflow Reminder

When building shareable skills or automations:
1. Generic version first in your development directory — no personal data
2. Test standalone — must work with only its README
3. Customise for your workspace — adapt for internal use
4. Document differences between versions

## Output Format

### For single skills
- `[skill-name]/SKILL.md` — frontmatter + instructions
- `[skill-name]/references/` — supporting documentation (if requested)
- `[skill-name]/scripts/` — utility scripts (if requested)
- `[skill-name]/assets/` — templates, fonts, icons (if requested)

### For plugin packages
- `[plugin-name]/.claude-plugin/plugin.json` — metadata
- `[plugin-name]/README.md` — documentation with Security & Trust section
- `[plugin-name]/skills/` — bundled skills (each as SKILL.md)
- `[plugin-name]/.mcp.json` — MCP server config (if applicable)

## Examples

### Example 1: Internal skill for grading assignments

**User says:** "Create a skill for grading student assignments"

**Actions:**
1. Type → single skill
2. Name → `grading-assignments`
3. Purpose → Grade submissions against rubrics and generate feedback documents
4. Mode → internal
5. Invocation → both (default)
6. Supporting files → references (rubric templates)
7. Generate SKILL.md at `.claude/skills/grading-assignments/SKILL.md`

**Result:** Skill folder with SKILL.md containing workflow steps, rubric handling, and output format specification

### Example 2: Shareable plugin package

**User says:** "Create a plugin that bundles my knowledge management skills"

**Actions:**
1. Type → plugin package
2. Name → `knowledge-management`
3. Purpose → Bundle note-taking, tagging, and search skills for distribution
4. Mode → shareable
5. Generate scaffold at your development directory
6. Create plugin.json, README.md with Security & Trust, and skill subfolders

**Result:** Complete plugin package ready for standalone distribution

## Troubleshooting

### Skill not triggering after creation
**Cause:** Description too vague or missing trigger phrases.
**Solution:** Revisit the description using [references/description-guide.md](references/description-guide.md). Ensure it includes 3-4 natural language phrases users would actually say. Test by asking Claude "When would you use the [skill-name] skill?"

### YAML frontmatter parse error
**Cause:** XML angle brackets (`<` `>`) in frontmatter, or malformed YAML syntax.
**Solution:** Remove any angle brackets from the description or name fields. Ensure `---` delimiters are on their own lines with no trailing spaces.

### Skill conflicts with another skill
**Cause:** Descriptions overlap — Claude cannot distinguish which skill to load.
**Solution:** Add negative triggers to the description (e.g., "Do NOT use for transcript extraction — use extracting-youtube-transcripts instead").

## Additional Resources

- **For the complete skills standard** (design principles, structure requirements, instruction quality, workflow patterns, troubleshooting, compliance checklist), see [references/skills-standard.md](references/skills-standard.md)
- For YAML frontmatter fields and options, see [references/frontmatter-reference.md](references/frontmatter-reference.md)
- For writing effective descriptions, see [references/description-guide.md](references/description-guide.md)
- For skill scaffold templates, see [references/skill-template.md](references/skill-template.md)
- For plugin scaffold templates, see [references/plugin-template.md](references/plugin-template.md)
- Official skills docs: https://code.claude.com/docs/en/skills
- Agent Skills standard: https://agentskills.io
