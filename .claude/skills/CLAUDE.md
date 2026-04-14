# Skills

Reusable workflows that Cowork auto-detects and invokes. Each skill is a folder containing a `SKILL.md` file with YAML frontmatter (`name`, `description`).

## How skills are detected

Cowork scans `.claude/skills/[name]/SKILL.md` files at session start. It uses the `description` field in the frontmatter to decide when to activate a skill based on the user's request.

## Naming convention

Skill folders use gerund-form-hyphenated naming:
- `drafting-documents`
- `processing-spreadsheets`
- `creating-projects`

The folder name is the skill's identifier. The SKILL.md file is always named `SKILL.md`.

## How to add a new skill

Use the `creating-skills` skill, or manually:
1. Create a folder `.claude/skills/[your-skill-name]/`
2. Create `SKILL.md` inside with YAML frontmatter:
   ```yaml
   ---
   name: your-skill-name
   description: >
     Clear 1-3 sentence description of what this does and when to use it.
     Cowork uses this to decide when to fire the skill.
   ---
   ```
3. Write the workflow as markdown below the frontmatter

## How to modify existing skills

Edit the SKILL.md file directly. Note: if you pull updates from the upstream template, your edits to standard skills may be overwritten. To preserve customisations, copy to a new name (e.g., `copywriting-custom`) and edit the copy.

## The 21 included skills

Listed in `.claude/docs/available-automations.md` with full descriptions and trigger phrases.
