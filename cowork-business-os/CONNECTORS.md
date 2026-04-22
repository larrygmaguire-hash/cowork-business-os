# Connectors

## How tool references work

Plugin files use `~~category` as a placeholder for whatever tool the user connects in that category. The plugin is tool-agnostic — workflows are described in terms of categories rather than specific products.

When a skill says `~~chat`, it means "whatever chat tool you use — Slack, Microsoft Teams, Discord, and so on". The same skill works regardless of which tool you actually have.

## Connectors for this plugin

| Category   | Placeholder   | Common options                          |
|------------|---------------|-----------------------------------------|
| Chat       | `~~chat`      | Slack, Microsoft Teams, Discord         |
| Email      | `~~email`     | Gmail, Proton Mail, Outlook, Fastmail   |
| Calendar   | `~~calendar`  | Google Calendar, Outlook Calendar, Fastmail |
| Drive      | `~~drive`     | Google Drive, Dropbox, OneDrive, iCloud |
| Docs       | `~~docs`      | Google Docs, Microsoft Word online, Notion |
| Newsletter | `~~newsletter`| Kit, Mailchimp, Substack, Beehiiv       |
| Website    | `~~website`   | WordPress, Webflow, Squarespace, Ghost  |

## Standards referenced literally

Some external references are industry standards, not tool names, and appear verbatim in skill content:

- **Yoast-aligned readability standards** — Yoast is the de-facto reference for on-page SEO readability metrics (Flesch reading ease, active voice percentage, transition words, paragraph length). The term is used as a readability standard name, not a directive to use the Yoast WordPress plugin.
- **APA7** — citation style, used as a format standard.
- **File format names** (`.docx`, `.xlsx`, `.pdf`, `.csv`) — file formats, not product names.

These are not placeholder candidates because substituting them would change the meaning of the skill.
