# AI Business OS - Glossary

A comprehensive glossary of terms used throughout the AI Business OS course.

---

## A

### Agent (Claude Code)
A context-isolated worker defined in `.claude/agents/` that runs in a separate context window via the Task tool. Agents handle delegated background tasks — research, grading, file sorting — and return results to the main conversation. Each agent has a YAML frontmatter header specifying its name, description, available tools, and model. Not to be confused with prompt personas, which are loaded into the main conversation.

### API (Application Programming Interface)
A set of protocols and tools that allow different software applications to communicate with each other. Claude Code uses APIs to connect with services like Notion and Google Drive.

### API Key
A unique identifier used to authenticate requests to an API. Required for some MCP server configurations.

### Automation
The use of scripts and tools to perform tasks automatically, reducing manual effort and ensuring consistency.

---

## B

### Bash
A command-line shell and scripting language commonly used on Mac and Linux systems. Used for automation scripts in AI Business OS.

### Batch Processing
Processing multiple items (files, documents, etc.) in a single automated operation rather than handling them individually.

---

## C

### CLI (Command Line Interface)
A text-based interface for interacting with software by typing commands. Claude Code operates through the CLI.

### Claude Code
Anthropic's official command-line interface for Claude AI. The core tool of your AI Business OS that enables file operations, project context, and AI assistance directly in your development environment.

### CLAUDE.md
A configuration file that provides Claude Code with project-specific context, preferences, and instructions. Claude reads this file automatically when working in a folder. The master CLAUDE.md sits at `.claude/CLAUDE.md`; project-specific versions can exist in subfolders and inherit master rules.

### Command (Slash Command)
A saved prompt stored as a Markdown file that can be executed by typing `/command-name`. Commands enable reusable workflows. Located in `.claude/commands/`.

### Compaction
The automatic process by which Claude Code compresses earlier conversation messages as the context window fills up. This allows conversations to continue beyond the model's context limit, though some detail from earlier messages may be summarised.

### Context
Information that helps Claude understand your situation, project, or request. Context can come from CLAUDE.md files, conversation history, or explicit instructions.

### Context Window
The amount of text an AI model can process and "remember" in a single conversation, measured in tokens. Larger context windows allow for longer, more complex interactions without the model losing track of earlier parts of the conversation. Modern models can handle hundreds of thousands of tokens, enabling work with large documents, extensive codebases, or long conversation histories whilst maintaining coherence throughout.

### Cron
A time-based job scheduler in Unix-like operating systems. Used to run scripts automatically on a schedule.

---

## D

### Directory
Another term for folder. A container for files and other directories in a file system.

---

## E

### Environment Variable
A variable set in the operating system that affects how processes run. Used in MCP configuration to store credentials securely.

### Extension (VS Code)
An add-on that extends VS Code's functionality. Examples include Markdown preview, spell checking, and icon themes.

---

## F

### File System
The structure used by an operating system to organise and store files. Claude Code operates within your file system.

### FRAMEWORK.md
A reference document at `.claude/FRAMEWORK.md` that defines how workspace components are structured — component types, naming conventions, file locations, creation checklists, and the execution hierarchy. Distinct from CLAUDE.md (which governs behaviour) and MEMORY.md (which captures learnings).

---

## G

### Git
A version control system for tracking changes in files. Useful for managing your AI Business OS configuration and content.

### Global Installation
Installing software so it's available system-wide, from any directory. Claude Code is typically installed globally via npm.

---

## H

### Homebrew
A package manager for macOS (and Linux) that simplifies installing software from the command line.

### Hook
A script or command that runs automatically in response to Claude Code events. Hooks can trigger before or after tool use (PreToolUse, PostToolUse), when a session starts or ends, when a notification fires, and more. Configured in `.claude/settings.local.json` under the `hooks` object. Useful for validation, logging, and automated side effects.

---

## I

### Integration
Connecting different software systems to work together. MCP servers provide integrations with external services.

---

## J

### JSON (JavaScript Object Notation)
A lightweight data format used for configuration files, data exchange, and structured information. Used in Claude configuration files.

---

## L

### LLM (Large Language Model)
An AI system trained on large amounts of text data to understand and generate human-like language. Claude is an LLM.

---

## M

### Markdown
A lightweight markup language for formatting text. Uses simple syntax like `#` for headings and `*` for emphasis. The standard format for notes, documentation, and CLAUDE.md files.

### MCP (Model Context Protocol)
An open protocol that enables Claude Code to connect with external services like Notion, Google Drive, and GitHub. MCP servers translate between Claude and service APIs.

### MCP Server
A program that implements the MCP protocol for a specific service. For example, the Notion MCP server enables Claude Code to interact with Notion.

### MEMORY.md
A file at `.claude/MEMORY.md` where Claude Code records learnings, preferences, and patterns discovered during conversations. Auto-loaded every session. Content should only be added with explicit user approval.

---

## N

### Node.js
A JavaScript runtime that allows running JavaScript outside a browser. Required for installing Claude Code via npm.

### npm (Node Package Manager)
A package manager for JavaScript/Node.js. Used to install Claude Code and MCP servers.

---

## O

### OAuth
An authorisation protocol that allows applications to access user data from other services without exposing passwords. Used by some MCP servers for authentication.

---

## P

### Path
The location of a file or folder in a file system. Can be absolute (from root) or relative (from current location).

### Permission
Authorisation for an action. Claude Code asks for permission before performing significant operations like creating files or running commands.

### Pipeline
A sequence of processing stages where the output of one stage becomes the input of the next. Content creation workflows are often designed as pipelines.

### Plugin
A packaged collection of Claude Code components (skills, commands, agents, hooks) that can be loaded as a unit. Plugins extend Claude Code's capabilities and are loaded via `claude --plugin-dir`. Each plugin has a `plugin.json` manifest defining its components.

### Prompt
Text input provided to an AI model to generate a response. Effective prompting is key to getting useful outputs from Claude.

---

## R

### Rule
A modular behavioural instruction stored as a Markdown file in `.claude/rules/`. Rules are auto-loaded every conversation and define standards Claude must follow — communication style, blocked commands, research standards, date handling, etc. Rules keep CLAUDE.md focused on high-level strategy while offloading specific policies.

---

## S

### Script
A file containing a sequence of commands to be executed. Shell scripts automate tasks in AI Business OS.

### Shell
A program that provides a command-line interface for interacting with the operating system. Common shells include bash and zsh.

### Skill (AI Skill)
A packaged AI capability consisting of a SKILL.md file (with YAML frontmatter and instructions) plus optional supporting files bundled together for reuse across projects. Skills use gerund naming (e.g., `writing-articles`, `summarising-meetings`). Located in `.claude/skills/`.

### SKILL.md
The definition file for a skill, containing YAML frontmatter (name, description, triggers) and detailed instructions. The frontmatter `description` field is what Claude uses to auto-match skills to tasks.

### Slash Command
A command prefixed with `/` that executes a predefined prompt or workflow. Example: `/research` or `/daily`.

### Syntax Highlighting
Displaying code or text with different colours to distinguish elements. VS Code provides syntax highlighting for many file types.

---

## T

### Task Tool
The Claude Code mechanism for spawning agents. When Claude determines a task needs context isolation or background processing, it uses the Task tool to launch an agent in a separate context window. Results return to the main conversation when complete.

### Template
A reusable file or folder structure used as a starting point. In AI Business OS, templates exist for projects, clients, workshops, and document types. Templates ensure consistent structure and reduce setup time.

### Terminal
The application or panel where you type command-line commands. VS Code has a built-in terminal where Claude Code runs.

### Token
1. In MCP context: A credential string used for authentication (e.g., Notion integration token).
2. In AI context: A unit of text that language models process. Tokens affect context limits and pricing.

---

## V

### Variable
A named container for storing data. In scripts, variables hold values like file paths or configuration options.

### Version Control
A system for tracking and managing changes to files over time. Git is the most common version control system.

### VS Code (Visual Studio Code)
A free, open-source code editor developed by Microsoft. The recommended environment for running AI Business OS.

---

## W

### Workspace
A folder opened in VS Code. Your AI Business OS workspace contains all your projects, configurations, and files. A workspace equals a git repository with its own `.claude/` folder.

### Workflow
A defined sequence of steps for accomplishing a task. AI Business OS helps you build and automate workflows.

---

## Y

### YAML Frontmatter
Metadata at the top of a Markdown file, enclosed between `---` markers. Used in skills, agents, and commands to define properties like name, description, model, and tools. Claude Code reads this frontmatter to understand how to use the component.

---

## Z

### zsh (Z Shell)
The default shell on macOS. Similar to bash but with additional features.

---

*Last Updated: February 2026*
