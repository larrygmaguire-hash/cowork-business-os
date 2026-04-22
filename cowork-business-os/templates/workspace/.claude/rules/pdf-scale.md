# PDF Processing Scale — MANDATORY

Before reading ANY PDF, check its size and page count first. Then use this scale to determine the approach.

```bash
ls -lh "/path/to/file.pdf"
python3 -c "from pypdf import PdfReader; r = PdfReader('/path/to/file.pdf'); print(f'Pages: {len(r.pages)}')"
```

| Scale | Size | Pages | Approach | Summary to Disk |
|-------|------|-------|----------|-----------------|
| **1 — Trivial** | Under 1MB | Under 10 | Read directly, return in context | No |
| **2 — Small** | 1–5MB | 10–50 | Read directly, write summary to disk | Yes |
| **3 — Medium** | 5–20MB | 50–200 | Chunked reading (20 pages at a time via `pages` param) | Yes — after each chunk |
| **4 — Large** | 20–50MB | 200–500 | Split with `qpdf` first, then chunked processing | Yes — after each chunk |
| **5 — Massive** | Over 50MB | Over 500 | Split with `qpdf`, delegate chunks to parallel agents, each writing to disk | Yes — each agent writes independently |

## Rules

- **Never skip the size check.** A 36MB PDF read without chunking returns "file too large" and wastes a turn.
- **Always use the file path** — do not attach/drag PDFs at Scale 3+. Attachment forces a full load that will fail.
- **When both size and page count are available, use whichever places the file at the higher scale level.** A 3MB file with 180 pages is Scale 3 (medium), not Scale 2.
- **Read the first 5 pages** at Scale 3+ to find structure (table of contents, section headings) before planning page ranges.
- **Target relevant sections** rather than reading cover-to-cover. Use structure from the first 5 pages to plan.
- **Write findings to disk as you go** at Scale 2+ so progress survives context limits.

## Scale 3+ Workflow Details

For detailed Scale 3/4/5 workflows with code examples, see the processing-pdfs skill's [workflows.md](../skills/processing-pdfs/references/workflows.md).
