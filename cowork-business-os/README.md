# cowork-business-os (core)

Core plugin for Cowork Business OS. Scaffolds a business workspace into a folder of your choice and ships the content-production skills used across every business task — writing, editing, document production, presentation creation, spreadsheets, SEO, meeting notes, and more.

This is the foundation plugin for the marketplace. Install this first. The other three plugins (`prima-project-management`, `prima-memory`, `prima-scholar`) build on the workspace it creates.

## Requires

Nothing. This is a standalone plugin. It is the base for the rest of the Cowork Business OS marketplace.

## Installs

### Command

- **cowork-business-os:setup** — scaffolds a Cowork Business OS workspace into a folder you pick. In Cowork, type `/` in the chat and pick it from the menu.

### Skills

- `copywriting` — write, rewrite, edit, or improve any written content.
- `processing-documents` — create, edit, and analyse Word documents (.docx).
- `processing-spreadsheets` — create, edit, and analyse spreadsheets (.xlsx, .csv).
- `processing-presentations` — create slide decks with speaker notes and visual direction.
- `processing-pdfs` — extract, merge, split, annotate, and fill PDF forms.
- `email-drafting` — compose professional business emails.
- `meeting-notes` — process meeting recordings, transcripts, or notes into structured summaries.
- `seo-writing` — on-page SEO, technical audits, keyword placement, meta descriptions.
- `documenting-workflows` — document SOPs, process guides, checklists, onboarding materials.
- `creating-skills` — scaffold new Cowork skills or plugin packages.

### Templates

The `/setup` command writes a full workspace scaffolding (`.claude/`, `Projects/`, `Clients/`, `Archive/`, numbered business folders, `Infrastructure/Scripts/prima/`) into the folder you pick, populated with your company details.

## Install

1. Download `cowork-business-os.plugin` from the [latest release](https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest).
2. In the Claude desktop app, open the **Cowork** tab.
3. Left sidebar → **Customize** → **Browse plugins** → **Upload a custom plugin file** → select the downloaded file.
4. In a Cowork task, type `/` to open the command menu and select **cowork-business-os:setup**. A wizard collects a few details and scaffolds your workspace.

Claude Code CLI users: see the [repo root README](../README.md#installing--claude-code-cli-users) for the marketplace install.

## Tool references

This plugin is designed to work regardless of which tools you use (email provider, chat app, cloud drive, and so on). Skills use `~~category` placeholders for third-party tools — see [CONNECTORS.md](CONNECTORS.md) for the category list.

## Licence

MIT — see [LICENSE](../LICENSE) at the repo root.

## Support

Issues: https://github.com/larrygmaguire-hash/cowork-business-os/issues
