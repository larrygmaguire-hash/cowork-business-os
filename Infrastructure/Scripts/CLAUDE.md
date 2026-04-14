# Scripts

Workspace scripts and automation tooling.

## Subfolders

- **prima/** -- state management scripts (backup, validation) called by skills before and after writing to `.claude/state/`

## What goes here

- Bash, Python, or other scripts that support workspace operations
- Custom automation for your specific workflows
- Helper scripts called by skills

## Naming

Use descriptive names with the relevant extension: `backup-state.sh`, `validate-state.sh`, `migrate-naming.py`.

Make scripts executable: `chmod +x script-name.sh`.

## What does NOT go here

- Project-specific code (put in the project folder)
- Production application code (put in a separate code repository)
- Anything that produces client deliverables
