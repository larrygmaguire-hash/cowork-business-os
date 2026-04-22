# Plugin Package Templates

Use these templates when creating plugin packages (bundling multiple components for distribution). **Most needs are skills, not plugins** — only create a plugin when you need to bundle multiple skills/agents, include MCP server configuration, or distribute via the official plugin directory.

## When to Create a Plugin

| Create a Skill | Create a Plugin |
|----------------|-----------------|
| Single capability or workflow | Multiple related capabilities |
| Instructions-only extension | Includes MCP servers or external dependencies |
| Direct distribution (copy folder) | Distribution via plugin directory |
| Workspace-specific tool | Shareable package for community |
| Quick internal automation | Professional distribution with versioning |

---

## Directory Structure

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json       # Plugin metadata (REQUIRED)
├── README.md             # Documentation (REQUIRED)
├── skills/               # If skills included
│   └── skill-1/
│       └── SKILL.md      # Each skill follows standard SKILL.md format
├── agents/               # If agents included
│   └── agent-1.md
├── commands/             # If commands included
└── .mcp.json            # If MCP server config included
```

---

## plugin.json Scaffold

```json
{
  "name": "[plugin-name]",
  "version": "1.0.0",
  "description": "[Purpose description]",
  "author": "[Your Name]",
  "repository": "https://github.com/[username]/[plugin-name]",
  "type": "[skill|agent|mcp|hybrid]",
  "trust_level": "[internal|verified]"
}
```

**type values:**
- `skill` — contains only skills
- `agent` — contains only agents
- `mcp` — contains only MCP configuration
- `hybrid` — contains multiple component types

**trust_level values:**
- `internal` — internal use only
- `verified` — reviewed for distribution

---

## Plugin README.md Scaffold

```markdown
# [Plugin Name]

**Version:** 1.0.0
**Author:** [Your Name]
**Type:** [skill|agent|mcp|hybrid]

## Overview

[Purpose description — focus on outcomes.]

## Installation

### For Claude Code

```bash
# Via plugin directory
/plugin install [plugin-name]@claude-plugin-directory

# Manual installation
[Provide manual steps]
```

## Components

### Skills
- **[skill-name]**: [Description]

### Agents
- **[agent-name]**: [Description]

### MCP Servers
- **[server-name]**: [Description]

## Usage

[Examples for each component]

## Security & Trust

**Data Access:**
- [What files, folders, or data the plugin accesses]

**External Dependencies:**
- [Any external APIs, services, or libraries]

**Trust Implications:**
- [What users are trusting by installing this plugin]

**Privacy:**
- [Whether any data leaves the local machine]

**Required Permissions:**
- [File system, network, or API permissions needed]

## Configuration

```bash
# Required environment variables
API_KEY=your_key_here
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| [Issue] | [Cause] | [Fix] |

## Changelog

### 1.0.0 ([YYYY-MM-DD])
- Initial release
- [List features]

## Licence

[Specify licence]
```

---

## .mcp.json Scaffold

```json
{
  "mcpServers": {
    "[server-name]": {
      "command": "node",
      "args": ["path/to/server.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

---

## .gitignore (Shareable Plugins Only)

```
# Environment variables
.env
.env.local

# API keys and secrets
*_key.txt
secrets/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
logs/
```

---

## Security Requirements — MANDATORY for Plugins

Every plugin README.md must explicitly document:

1. **Data Access:** What files, APIs, or services accessed
2. **External Dependencies:** Third-party libraries, MCP servers, API keys
3. **Trust Implications:** What users trust by installing
4. **Privacy:** What data (if any) leaves the local machine
5. **Required Permissions:** File system, network, API permissions

For shareable plugins: Anthropic security review required before public distribution.
