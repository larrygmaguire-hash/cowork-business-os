# Infrastructure

Workspace infrastructure: scripts, automation, and tooling that supports the workspace itself rather than producing client work.

## Subfolders

- **Scripts/prima/** -- state backup and validation scripts called by the project tracking system

## What goes here

- Scripts that support workspace operations (state management, backups, validation)
- Custom automation that supports your workflows
- Tools shared across projects

## What does NOT go here

- Project-specific scripts (put in the project folder)
- One-off scripts for a single task
- Anything that produces client deliverables

## Engine-managed

The `Scripts/prima/` subfolder contains template-managed scripts. If you pull updates from upstream, these may be overwritten. Do not modify them. To add custom scripts, create new files alongside (e.g., `Infrastructure/Scripts/my-custom-script.sh`).
