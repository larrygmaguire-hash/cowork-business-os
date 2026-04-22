# Cowork Business OS

A working operating system for running your business inside Cowork (the Claude desktop app's knowledge-work mode).

Four plugins that work together to turn Cowork into a complete business OS: core content skills plus a workspace scaffolder, project and session lifecycle, searchable session history, and academic research with citation management.

## What this repo contains

This repo is a **Cowork plugin marketplace**. Four plugins, one logical bundle.

| Plugin | What it does | Required? |
|---|---|---|
| `cowork-business-os` | Core. Scaffolds a business workspace (`.claude/`, `Projects/`, `Clients/`, numbered business folders, PRIMA state scripts) into a folder you pick. Ships 10 content-production skills (copywriting, docs, spreadsheets, presentations, PDFs, email, meetings, SEO, workflows, skill scaffolding). | Install first |
| `prima-project-management` | Daily project tracking: `/day`, `/night`, `/save`, `/resume`, `/status`, `/newproject`, `/newclient`, `/sync`, `/timeline`, `/dashboard`. Three skills for project tracking, session transcripts, Zoom meetings. State lifecycle scripts. | Requires `cowork-business-os` |
| `prima-memory` | Searchable history of your past Cowork conversations. Ships a bundled MCP server for semantic + keyword session recall. | Standalone |
| `prima-scholar` | Academic research: PubMed, arXiv, Semantic Scholar, CrossRef, bioRxiv, OpenAlex, Europe PMC, CORE, Unpaywall. Local research library. APA7 citations. Two bundled MCP servers. | Standalone |

See the [specification](#specification) for build, packaging, and distribution details.

## Install

### Individual users (Free, Pro, or Max plans)

1. Open the latest release at https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest
2. Download the `.plugin` files for the plugins you want:
   - `cowork-business-os.plugin` — core (install first)
   - `prima-project-management.plugin` — project and client lifecycle (requires core)
   - `prima-memory.plugin` — session history recall
   - `prima-scholar.plugin` — academic research workflow
3. In the Claude desktop app, open Cowork.
4. Click **Customize** in the left sidebar.
5. Click **Browse plugins**.
6. Click **Upload a custom plugin file**.
7. Select the downloaded `.plugin` file.
8. Repeat steps 6–7 for each plugin you want to install.
9. After installing `cowork-business-os`, run `/cowork-business-os:setup` to scaffold a workspace.

### Organisation admins (Team or Enterprise plans; Owner or Primary Owner)

Contact Larry (larrygmaguire@pm.me) for read access to the private mirror repo, then:

1. Install the Claude GitHub App on the private mirror repo.
2. In the Claude desktop app, open **Organization settings** → **Plugins**.
3. Add source: GitHub repo `larrygmaguire-hash/cowork-business-os-private`.
4. Verify. All four plugins will sync and become available to your organisation.

## Updates

- **Individual users:** download the new `.plugin` files from a newer release and upload again. Cowork replaces the previous version.
- **Org admin installs:** sync automatically on the next scheduled sync after the private mirror updates.

## Per-plugin documentation

- [cowork-business-os/README.md](cowork-business-os/README.md)
- [prima-project-management/README.md](prima-project-management/README.md)
- [prima-memory/README.md](prima-memory/README.md)
- [prima-scholar/README.md](prima-scholar/README.md)

## Versioning

Semver. All four plugins share the bundle version. Current: **2.1.0**.

See [CHANGELOG.md](CHANGELOG.md).

## Specification

The authoritative build, packaging, and distribution spec is in the internal development folder: `Claude Projects/P003-AI-Business-OS/Cowork Development/PLUGIN-BUILD-SPEC.md` (not in this repo).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Support

Open an issue at https://github.com/larrygmaguire-hash/cowork-business-os/issues.

## Licence

MIT. See [LICENSE](LICENSE).
