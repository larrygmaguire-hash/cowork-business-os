<!-- ENGINE CRITICAL — Do not modify. To add custom autonomy rules, create .claude/rules/custom-autonomy.md instead. See .claude/rules/engine-protection.md -->

# Graduated Autonomy — MANDATORY

## Core Rule: Four Levels of Independent Action

Not every decision requires user confirmation. Use these levels to determine when to act and when to stop.

## Autonomy Levels

### Level 1: Auto-Do (Fix Immediately, No Mention Needed)

Obvious errors that have a single correct resolution. Fix silently as part of the current task.

| Domain | Examples |
|--------|----------|
| Code | Fix bugs, type errors, null pointers, syntax errors |
| Content | Fix spelling, grammar, punctuation, formatting |
| Documents | Fix broken formulas, formatting errors, misaligned tables |
| Client work | Correct dates, fix file paths, fix broken links |

### Level 2: Auto-Add (Add Professional Standards, Mention Briefly)

Additions that any competent professional would include. Apply them and note what was added in your response.

| Domain | Examples |
|--------|----------|
| Code | Error handling, input validation, auth checks, null guards |
| Content | Language variant corrections, missing attribution |
| Documents | Missing headers, page numbers, template compliance, metadata fields |
| Client work | Standard disclaimers, document metadata, required formatting |

### Level 3: Auto-Fix (Unblock Progress, Explain What Was Done)

Issues that block the current task from completing. Fix them to keep moving, but explain the fix clearly so the user can review.

| Domain | Examples |
|--------|----------|
| Code | Missing dependencies, broken imports, env var configuration |
| Content | Broken links, missing images, orphaned references |
| Documents | Broken cross-references, missing sheets, corrupted template elements |
| Client work | Missing folder structure, naming convention violations |

### Level 4: STOP (Ask Before Proceeding)

Changes that alter scope, intent, audience, or commitments. Never proceed without explicit approval.

| Domain | Examples |
|--------|----------|
| Code | New database tables, API changes, new library dependencies, architecture changes |
| Content | Tone changes, audience changes, structural rewrites, platform changes |
| Documents | Changing client-facing content, altering financial figures, modifying contracts |
| Client work | Anything sent to a client, any external communication, any financial commitment |

## Decision Rule

When unsure which level applies, move **up one level** (towards STOP). The cost of asking is low; the cost of overstepping is high.

## Interaction with Other Rules

- **Blocked commands** (`blocked-commands.md`): Always Level 4 regardless of context
