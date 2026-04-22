# prima-project-management

Comprehensive project and client lifecycle management for Cowork. Tracks project state, session context, milestones, and tasks with daily briefings, session close-out, and resume workflows. Requires `cowork-business-os` to be installed first.

## Requires

- `cowork-business-os` (core plugin must be installed and workspace scaffolded via `/cowork-business-os:setup`)

## Installs

### Commands
- `/prima-project-management:day` — Daily briefing showing active projects, priorities, and recommended next steps
- `/prima-project-management:night` — Update project state and commit changes at end of session
- `/prima-project-management:save` — Save session context and update project records
- `/prima-project-management:resume` — Retrieve context from a previous session to continue where you left off
- `/prima-project-management:status` — Project health report showing status and priorities across all projects
- `/prima-project-management:newproject` — Create a new project with standardised structure
- `/prima-project-management:newclient` — Create a new client with standardised folder structure and profile
- `/prima-project-management:sync` — Commit and push changes to sync across devices
- `/prima-project-management:timeline` — Generate an interactive project timeline visualisation
- `/prima-project-management:dashboard` — Generate an interactive project dashboard visualisation

### Skills
- `project-tracking` — Add, update, pause, archive projects and manage milestones in state
- `processing-zoom-meetings` — Process Zoom meetings — fetch summaries, transcripts, recordings, registrants
- `processing-session-transcripts` — Process VTT transcripts into structured summaries

### Agents
- `document-processor` — Process long documents (transcripts, PDFs, reports) and return structured summaries

## Install

### Individual users (Free, Pro, or Max plans)

1. Open the latest release at https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest
2. Download `prima-project-management.plugin`
3. In the Claude desktop app, open Cowork.
4. Click **Customize** in the left sidebar.
5. Click **Browse plugins**.
6. Click **Upload a custom plugin file**.
7. Select the downloaded `.plugin` file.
8. Ensure `cowork-business-os` is installed first and run `/cowork-business-os:setup` to scaffold a workspace.

### Organisation admins (Team or Enterprise plans; Owner or Primary Owner)

Contact the plugin maintainer for read access to the private mirror repo, then:

1. Install the Claude GitHub App on the private mirror repo.
2. In the Claude desktop app, open **Organization settings** → **Plugins**.
3. Add source: GitHub repo `larrygmaguire-hash/cowork-business-os-private`.
4. Verify. All plugins will sync and become available to your organisation.

## Environment variables

None required. State is stored in `.claude/state/` directory created by `/cowork-business-os:setup`.

## Support

Report issues at https://github.com/larrygmaguire-hash/cowork-business-os/issues
