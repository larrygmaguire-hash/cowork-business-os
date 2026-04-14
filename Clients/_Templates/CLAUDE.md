# Client Templates

Reusable template folders for creating new client structure consistently.

## What goes here

- `Project Folder Template/` -- standard structure for projects within a client folder. The `creating-projects` skill uses this as the starting structure when creating a new project under a client.
- Other reusable client templates (engagement letter templates, kickoff document templates, etc.)

## How templates are used

When you create a new project for a client, the skill:
1. Reads the template structure from this folder
2. Copies it into the new project folder
3. Customises the placeholder content with the actual project details

You can edit any template here to change the default structure for future projects. Existing client folders are not affected.
