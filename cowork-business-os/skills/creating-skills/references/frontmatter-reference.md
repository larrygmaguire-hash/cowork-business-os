# YAML Frontmatter Reference

Complete reference for SKILL.md frontmatter fields, string substitutions, and dynamic context injection.

## Required and Recommended Fields

```yaml
---
name: skill-name-in-kebab-case
description: What it does and when to use it. Include specific trigger phrases.
---
```

### name (strongly recommended)

- Defaults to the folder name if omitted — but always include it explicitly for clarity
- kebab-case only (`code-reviewer`, not `Code Reviewer` or `code_reviewer`)
- No spaces, underscores, or capitals
- Should match the folder name
- Must not contain "claude" or "anthropic" (reserved)

### description (required)

- Must include BOTH what the skill does AND when to use it
- Structure: `[What it does] + [When to use it] + [Key capabilities]`
- Under 1024 characters
- No XML angle brackets (`<` or `>`)
- Include specific trigger phrases users would say
- Mention file types if relevant
- See [description-guide.md](description-guide.md) for examples

## Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `argument-hint` | Hint shown during `/` autocomplete | `[filename]` or `[issue-number]` |
| `disable-model-invocation` | Prevent Claude auto-invoking (manual `/skill-name` only) | `true` |
| `user-invocable` | Hide from `/` menu (Claude-only invocation) | `false` |
| `allowed-tools` | Tools Claude can use without permission when skill is active | `Read, Grep, Glob` |
| `model` | Model to use when skill is active | `opus`, `sonnet`, or `haiku` |
| `context` | Run in subagent | `fork` |
| `agent` | Subagent type when `context: fork` | `Explore`, `Plan`, or `general-purpose` |
| `hooks` | Hooks scoped to skill lifecycle | See [Hooks docs](https://code.claude.com/docs/en/hooks) |
| `license` | License for open-source distribution | `MIT`, `Apache-2.0` |
| `compatibility` | Environment requirements (1-500 chars) | `Requires Python 3.10+, macOS only` |
| `metadata` | Custom key-value pairs | See below |

### metadata example

```yaml
metadata:
  author: Your Name
  version: 1.0.0
  mcp-server: server-name
  category: productivity
  tags: [project-management, automation]
```

## Invocation Control

| Frontmatter | User Invokes | Claude Invokes | When Loaded |
|-------------|------------|----------------|-------------|
| (default) | Yes | Yes | Description in context, full content when invoked |
| `disable-model-invocation: true` | Yes | No | Not in context, loads only on `/skill-name` |
| `user-invocable: false` | No | Yes | Description in context, Claude invokes when relevant |

**Use `disable-model-invocation: true` for:**
- Workflows with side effects (deploy, commit, send messages)
- Tasks where timing matters
- Actions Claude shouldn't decide when to execute

**Use `user-invocable: false` for:**
- Background knowledge (conventions, patterns, context)
- Information Claude uses but isn't a user-facing command

## String Substitutions

| Variable | Description | Example |
|----------|-------------|---------|
| `$ARGUMENTS` | All arguments passed to skill | `/fix-issue 123` → `$ARGUMENTS` = `123` |
| `$ARGUMENTS[N]` or `$N` | Specific argument by index | `$0` = first arg, `$1` = second |
| `${CLAUDE_SESSION_ID}` | Current session ID | For logging or session-specific files |

## Dynamic Context Injection

Use `` !`command` `` syntax to run shell commands before skill content is sent to Claude. The command output replaces the placeholder.

```yaml
---
name: pr-summary
description: Summarise changes in a pull request
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`

## Your task
Summarise this pull request...
```

## Security Restrictions

**Forbidden in frontmatter:**
- XML angle brackets (`<` `>`) — frontmatter appears in system prompt; malicious content could inject instructions
- Skills named with "claude" or "anthropic" prefix (reserved by Anthropic)
- Code execution in YAML values (safe YAML parsing enforced)
