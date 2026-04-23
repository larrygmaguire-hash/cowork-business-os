# Cowork Business OS

A working operating system for running your business inside Cowork (the Claude desktop app's knowledge-work mode).

Four plugins that work together to turn Cowork into a complete business OS: core content skills plus a workspace scaffolder, project and session lifecycle, searchable session history, and academic research with citation management.

## The plugins

| Plugin | What it does | Required? |
|---|---|---|
| `cowork-business-os` | Core. Scaffolds a business workspace (`.claude/`, `Projects/`, `Clients/`, numbered business folders, PRIMA state scripts) into a folder you pick. Ships 10 content-production skills (copywriting, docs, spreadsheets, presentations, PDFs, email, meetings, SEO, workflows, skill scaffolding). | Install first |
| `prima-project-management` | Daily project tracking — daily briefing, session close, save, resume, status, new project, new client, sync, timeline, dashboard. Three skills for project tracking, session transcripts, Zoom meetings. | Requires `cowork-business-os` |
| `prima-memory` | Searchable history of your past Cowork conversations. Bundled MCP server for semantic + keyword session recall. | Standalone |
| `prima-scholar` | Academic research across PubMed, arXiv, Semantic Scholar, CrossRef, bioRxiv, OpenAlex, Europe PMC, CORE. Local research library. APA7 citations. Bundled MCP servers. | Standalone |

## Installing — individual users (Free, Pro, or Max plans)

This repo is where you **download** the plugin files. You **install** them inside the Claude desktop app. GitHub is the distribution host; Cowork is the install surface. You do not paste a repo URL anywhere.

**Step 1 — Download the plugin files from the latest release**

Open the [latest release](https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest) and download the `.plugin` file for each plugin you want. Start with `cowork-business-os.plugin`; add the others as needed.

**Step 2 — Upload each file in Cowork**

1. Open the Claude desktop app and switch to the **Cowork** tab.
2. In the left sidebar, click **Customize**.
3. Click **Browse plugins**.
4. Click **Upload a custom plugin file**.
5. Select the `.plugin` file you downloaded.
6. Repeat steps 3–5 for each additional `.plugin` file.

**Step 3 — Scaffold your workspace (first time only)**

In a Cowork task, type `/` to open the command menu and select **cowork-business-os:setup**. The wizard asks you for company name, industry, cloud storage path and a few other details, then writes the workspace structure into a folder you choose.

You're done. The other plugins (`prima-project-management`, `prima-memory`, `prima-scholar`) work immediately after upload — no scaffolding step.

## Installing — Claude Code CLI users

If you're a developer using Claude Code rather than Cowork desktop, install the whole marketplace in one command:

```bash
/plugin marketplace add larrygmaguire-hash/cowork-business-os
/plugin install cowork-business-os@cowork-business-os
/plugin install prima-project-management@cowork-business-os
/plugin install prima-memory@cowork-business-os
/plugin install prima-scholar@cowork-business-os
/reload-plugins
```

## Installing — Team or Enterprise organisations

Centralised organisation install via Cowork's GitHub-sync path is not yet available. It requires a private mirror of this repo, which isn't set up. If you represent an organisation and want Cowork Business OS deployed centrally, open an issue and I'll arrange the mirror.

## Updates

Download the new `.plugin` files from a newer release and upload them in Cowork. The upload replaces the previous version. No auto-update for individual installs.

## Per-plugin documentation

- [cowork-business-os/README.md](cowork-business-os/README.md)
- [prima-project-management/README.md](prima-project-management/README.md)
- [prima-memory/README.md](prima-memory/README.md)
- [prima-scholar/README.md](prima-scholar/README.md)

## Versioning

Semver. All four plugins share the bundle version. Current: **2.1.0**. See [CHANGELOG.md](CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Support

Open an issue at https://github.com/larrygmaguire-hash/cowork-business-os/issues.

## Licence

MIT. See [LICENSE](LICENSE).
