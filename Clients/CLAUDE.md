# Clients Folder

This folder holds your client and customer work. Each client gets its own subfolder.

## How to use this folder

- **Create a new client:** ask Cowork to create a new client, or run `/creating-clients`. The skill creates the folder, populates the contact information, and optionally creates a first project under the client.
- **Folder naming:** Title Case with hyphens for multi-word names (`Acme-Corp`, `Smith-Consulting`).
- **Templates:** the `_Templates/` folder contains starter structure for new client folders.

## What goes in a client folder

Every client folder contains:

- `CLAUDE.md` -- client-specific context (background, contacts, communication preferences, engagement history)
- Sub-projects in their own `P### Project Name/` folders (each registered in state.json)
- Shared assets, contracts, and reference materials at the client root level

## Sample client

`Sample-Client/` is a placeholder showing the structure. Delete or replace it when you onboard real clients.

## Templates

`_Templates/` contains a `Project Folder Template/` showing the standard structure for projects within a client folder. The `creating-projects` skill copies from this template when creating a new project under a client.
