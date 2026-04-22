<!-- ENGINE CRITICAL — Do not modify. To add custom blocked commands, create .claude/rules/my-blocked-commands.md instead. See .claude/rules/engine-protection.md -->

# Blocked Commands

Require explicit user confirmation before execution:

| Command | Risk |
|---------|------|
| `rm -rf` | Recursive deletion — confirm path and scope |
| `sudo` | Privilege escalation — confirm necessity |
| `git push --force` | Destructive push — never to main/master |
| `git reset --hard` | Discards local changes — confirm no uncommitted work lost |
| `DROP TABLE`, `DELETE FROM` (no WHERE) | Data loss |

**Never execute without explicit request:**
- Commands affecting files outside workspace
- System-level package installs
- Global git config changes
- Commands exposing credentials or tokens
