# prima-project-management

Project and client lifecycle management for Cowork Business OS. Tracks project state, session context, milestones, and tasks. Provides daily briefings, session close-out, resume workflows, and new project/client scaffolding. Requires `cowork-business-os` installed first.

## Requires

- `cowork-business-os` (core plugin — must be installed and a workspace scaffolded via **cowork-business-os:setup** before this plugin is useful).

### Optional (for the Zoom skill only)

The `processing-zoom-meetings` skill calls tools from a Zoom MCP server. This plugin does not bundle one. If you want to use that skill, install a Zoom MCP server separately and configure it with your Zoom API credentials. Every other command and skill in this plugin works without Zoom.

## Installs

### Commands
In a Cowork task, type `/` to open the command menu and pick one of:

- **prima-project-management:day** — Daily briefing showing active projects, priorities, and recommended next steps.
- **prima-project-management:night** — Update project state and commit changes at the end of a session.
- **prima-project-management:save** — Save session context and update project records mid-session.
- **prima-project-management:resume** — Retrieve context from a previous session.
- **prima-project-management:status** — Project health report.
- **prima-project-management:newproject** — Create a new project with standardised structure.
- **prima-project-management:newclient** — Create a new client with standardised folder structure and profile.
- **prima-project-management:sync** — Commit and push changes to sync across devices.
- **prima-project-management:timeline** — Generate an interactive project timeline visualisation.
- **prima-project-management:dashboard** — Generate an interactive project dashboard visualisation.

### Skills
- `project-tracking` — Add, update, pause, archive projects and manage milestones in state.
- `processing-zoom-meetings` — Process Zoom meetings via a separately-installed Zoom MCP server (see Requires).
- `processing-session-transcripts` — Process local VTT transcripts into structured summaries.

### Agents
- `document-processor` — Processes long documents in a fresh context and returns structured summaries.

## Install

1. Install `cowork-business-os` first and scaffold a workspace (pick **cowork-business-os:setup** from the `/` menu in Cowork).
2. Download `prima-project-management.plugin` from the [latest release](https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest).
3. In the Claude desktop app, open the **Cowork** tab.
4. Left sidebar → **Customize** → **Browse plugins** → **Upload a custom plugin file** → select the downloaded file.

## Environment variables

None required. State is stored in the `.claude/state/` directory created by **cowork-business-os:setup**.

## Licence

MIT — see [LICENSE](../LICENSE) at the repo root.

## Support

Report issues at https://github.com/larrygmaguire-hash/cowork-business-os/issues
