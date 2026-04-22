# Skill Scaffold Templates

Use these templates when generating new skills. Adapt to the user's requirements.

## Directory Structure

```
skill-name/
├── SKILL.md              # Main skill definition (REQUIRED)
├── references/           # If detailed reference docs needed
│   ├── api-guide.md
│   └── examples.md
├── scripts/              # If executable code needed
│   └── helper.py
└── assets/               # If templates, fonts, icons needed
    └── template.md
```

**No README.md inside skill folders.** All documentation goes in SKILL.md or references/. README is only for repo-level distribution (shareable skills hosted on GitHub).

---

## SKILL.md Scaffold

```yaml
---
name: [skill-name]
description: [What it does]. Use when [trigger conditions]. [Key capabilities].
---

# [Skill Name]

[One-sentence overview of what this skill does.]

## When to Use

- [Trigger condition 1]
- [Trigger condition 2]
- [Trigger condition 3]

## Workflow

### Step 1: [First Major Step]

[Clear explanation of what happens.]

### Step 2: [Second Major Step]

[Clear explanation with specific actions.]

### Step 3: [Third Major Step]

[Clear explanation with expected output.]

## Output Format

[Specify what the output looks like — file format, structure, location.]

## Examples

### Example 1: [Common scenario]

**User says:** "[Natural language request]"

**Actions:**
1. [First action]
2. [Second action]

**Result:** [What gets produced]

## Troubleshooting

### [Common error or issue]
**Cause:** [Why it happens]
**Solution:** [How to fix it]

## Additional Resources

- For [detailed topic], see [references/topic.md](references/topic.md)
- For [examples], see [references/examples.md](references/examples.md)
```

---

## Supporting File Templates

### references/ file

```markdown
# [Topic] Reference

Detailed documentation for [aspect of the skill].

## [Section 1]

[Comprehensive reference material]

## [Section 2]

[Additional detail]
```

### scripts/ file

```bash
#!/usr/bin/env bash
# [Script description]
# Usage: [how to call this script]

set -euo pipefail

# Script implementation
```

### assets/template file

```markdown
# [Template Name]

<!-- Instructions: Claude fills in the bracketed sections based on user input -->

## [Section]

[Template structure with placeholders]
```

---

## Shareable Skill README (Repo-Level Only)

When mode is `shareable`, create a README.md **at the repository root** (not inside the skill folder):

```markdown
# [Skill Name]

**Version:** 1.0.0
**Author:** [Your Name]

## Overview

[Purpose description — focus on outcomes, not technical structure.]

## Installation

```bash
# For personal skills (all projects)
cp -r [skill-name] ~/.claude/skills/

# For project skills (this project only)
cp -r [skill-name] .claude/skills/
```

## Usage

### Automatic Invocation
[When Claude will use this automatically]

### Manual Invocation
```
/[skill-name] [arguments if applicable]
```

## Examples

[2-3 usage examples]

## Configuration

[Any configuration needed]

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| [Issue] | [Cause] | [Fix] |

## Licence

[Specify licence]
```

---

## Locations

| Mode | Skill Location | README Location |
|------|---------------|-----------------|
| Internal | `.claude/skills/[skill-name]/` | None needed |
| Shareable | Your development directory | Repository root |

## Shareable Workflow Reminder

When building shareable skills or automations:

1. **Generic version first** — built in your development directory with no personal data
2. **Test standalone** — must work with only its README
3. **Customise for your workspace** — adapt generic version for internal use
4. **Document differences** — track what's customised vs shareable
