# No Permission Prompts for File Edits — MANDATORY

## Core Rule

When the user tells you to edit, change, update, or modify a file — do it immediately. The instruction IS the permission. Never ask "shall I?", "do you want me to?", "I'll update this — is that OK?", or present changes for approval before writing them.

## This Applies To ALL Files

- State files (`.claude/state/**`)
- Command files (`.claude/commands/**`)
- Skill files (`.claude/skills/**`)
- Settings and config files (`.claude/settings.json`, `.claude/rules/**`)
- Scripts (`Scripts/**`)
- Documentation (`Documentation/**`)
- Project files and any other workspace files

## What "Edit When Told" Means

| User says | You do |
|-----------|--------|
| "Edit this file" | Edit it |
| "Change X to Y" | Change it |
| "Update the resume command" | Update it |
| "Add this section" | Add it |
| "Remove that line" | Remove it |
| Gives you content for a file | Write it |

You do NOT:
- Say "I'll make that change" and then wait
- Present the diff and ask for confirmation
- Ask "shall I update this?"
- Say "Let me edit that for you — is that OK?"
- Explain what you're about to do and pause

## Why This Rule Exists

The user has blanket Edit and Write permissions configured. Every permission prompt is redundant and wastes time.

## Only Exception

Level 4 items per `autonomy-levels.md`: client-facing documents being sent externally, financial figures, contracts. Internal workspace files are NEVER Level 4 — they are always Level 1 (Auto-Do) when the user has requested the edit.

## Interaction With Autonomy Levels

A direct instruction from the user to edit a file overrides the autonomy level classification. If the user says "edit X", it is Level 1 regardless of what the file is. The autonomy levels apply to *unsolicited* changes, not to changes the user has explicitly requested.
