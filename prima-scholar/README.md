# PRIMA Scholar

Search academic databases (PubMed, arXiv, Semantic Scholar, CrossRef) with discipline detection. Import and manage a local research library. Write academic prose with inline APA7 citations and confidence tags. Designed for researchers, students, and professionals who need systematic access to scholarly literature and support for evidence-based writing.

## Requires

None. This plugin works standalone and does not depend on other Cowork plugins.

## Installs

**Commands** (in a Cowork task, type `/` to open the command menu):

- **prima-scholar:scholar** — Start a research session across academic databases.
- **prima-scholar:cite** — Quick citation lookup by DOI or title.
- **prima-scholar:library** — Manage your research library (import, search, browse, organise).

**Skills:**
- `analysing-research` — Analyse papers, verify sources, synthesise findings with confidence tags
- `researching-topics` — Search academic databases and produce literature summaries
- `managing-research-library` — Import documents, organise collections, tag, search
- `writing-with-citations` — Draft academic prose with inline APA7 citations and reference lists

**MCP servers (bundled):**
- `prima-scholar-search` — Academic database search (10 sources, open access prioritisation)
- `prima-scholar-library` — Local SQLite research library with full-text search

## Install

1. Download `prima-scholar.plugin` from the [latest release](https://github.com/larrygmaguire-hash/cowork-business-os/releases/latest).
2. In the Claude desktop app, open the **Cowork** tab.
3. Left sidebar → **Customize** → **Browse plugins** → **Upload a custom plugin file** → select the downloaded file.

## Environment variables

The bundled MCP servers work without any configuration. Optional environment variables can increase rate limits for high-volume use:

| Variable | Server | Required | Purpose |
|----------|--------|----------|---------|
| `OPENALEX_MAILTO` | scholar-search | No | Polite pool for OpenAlex (higher rate limits) — use your email address |
| `CROSSREF_MAILTO` | scholar-search | No | Polite pool for CrossRef (higher rate limits) — use your email address |
| `PUBMED_API_KEY` | scholar-search | No | Higher PubMed rate limits — get from https://www.ncbi.nlm.nih.gov/account/ |
| `SEMANTIC_SCHOLAR_KEY` | scholar-search | No | Higher Semantic Scholar rate limits — get from https://www.semanticscholar.org/product/api |
| `CORE_API_KEY` | scholar-search | No | Required only to use CORE database — free from https://core.ac.uk/services/api |
| `RESEARCH_LIBRARY_PATH` | scholar-library | No | Path to the SQLite database file (default: `~/.research-library/library.db`) |

To configure: in your Claude desktop or Code setup, add these to the `env` object in the MCP server config for `prima-scholar-search` or `prima-scholar-library`.

**The plugin is fully functional without any keys.** Only CORE database requires a key; the other 9 sources work with no authentication. Keys are optional for higher rate limits.

## Licence

MIT — see [LICENSE](../LICENSE) at the repo root.

## Support

Report issues at https://github.com/larrygmaguire-hash/cowork-business-os/issues
