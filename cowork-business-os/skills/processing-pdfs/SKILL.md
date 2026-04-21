---
name: processing-pdfs
description: Extract text and tables, merge, split, fill forms, and annotate PDF files. Use when processing PDFs, extracting data from PDF documents, merging or splitting PDF pages, or filling PDF forms. Handles single and bulk PDF operations.
---

# PDF Processing

Process PDF files — extract text and tables, merge, split, create, fill forms, and annotate. For code examples and detailed workflows, see [workflows.md](references/workflows.md). For advanced libraries, see [reference.md](references/reference.md). For form filling, see [forms.md](references/forms.md).

## When to Use

- Extracting text or tables from PDFs
- Merging or splitting PDFs
- Creating new PDFs
- Filling PDF forms
- Adding watermarks or annotations
- OCR on scanned documents
- Bulk processing multiple PDFs in a folder

## When NOT to Use

- Word documents → `processing-documents`
- Spreadsheets → `processing-spreadsheets`
- Presentations → `processing-presentations`

## Workflow

### Step 1: Check Size (MANDATORY)

Before reading ANY PDF, check its size and page count first, then use the PDF Processing Scale below to determine approach.

```bash
ls -lh "/path/to/file.pdf"
python3 -c "from pypdf import PdfReader; r = PdfReader('/path/to/file.pdf'); print(f'Pages: {len(r.pages)}')"
```

#### PDF Processing Scale

| Scale | Size | Pages | Approach | Summary to Disk |
|-------|------|-------|----------|-----------------|
| **1 — Trivial** | Under 1MB | Under 10 | Read directly, return in context | No |
| **2 — Small** | 1–5MB | 10–50 | Read directly, write summary to disk | Yes |
| **3 — Medium** | 5–20MB | 50–200 | Chunked reading (20 pages at a time via `pages` param) | Yes — after each chunk |
| **4 — Large** | 20–50MB | 200–500 | Split with `qpdf` first, then chunked processing | Yes — after each chunk |
| **5 — Massive** | Over 50MB | Over 500 | Split with `qpdf`, delegate chunks to parallel agents, each writing to disk | Yes — each agent writes independently |

#### Rules

- **Never skip the size check.** A 36MB PDF read without chunking returns "file too large" and wastes a turn.
- **Always use the file path** — do not attach/drag PDFs at Scale 3+. Attachment forces a full load that will fail.
- **When both size and page count are available, use whichever places the file at the higher scale level.** A 3MB file with 180 pages is Scale 3 (medium), not Scale 2.
- **Read the first 5 pages** at Scale 3+ to find structure (table of contents, section headings) before planning page ranges.
- **Target relevant sections** rather than reading cover-to-cover. Use structure from the first 5 pages to plan.
- **Write findings to disk as you go** at Scale 2+ so progress survives context limits.

For detailed Scale 3/4/5 workflows with code examples, see [workflows.md](references/workflows.md).

### Step 2: Choose Approach

| Task | Best Tool |
|------|-----------|
| Extract text | pdfplumber `page.extract_text()` |
| Extract tables | pdfplumber `page.extract_tables()` |
| Merge PDFs | pypdf `writer.add_page(page)` |
| Split PDFs | pypdf — one page per file |
| Create PDFs | reportlab — Canvas or Platypus |
| OCR scanned PDFs | pytesseract — convert to image first |
| Fill forms | See [forms.md](references/forms.md) |
| Split large files | qpdf CLI |

For code examples of each, see [workflows.md](references/workflows.md).

### Step 3: Process

- **Single PDF (Scale 1–2):** Read directly, extract what's needed
- **Large PDF (Scale 3+):** Follow the scale-specific workflow in [workflows.md](references/workflows.md)
- **Bulk (3+ PDFs):** Use Extract-Summarise-Release workflow in [workflows.md](references/workflows.md) — ask user for extraction purpose first, process sequentially, write findings to summary file after each PDF

## Output Format

| Output | Format |
|--------|--------|
| Extracted text | Returned in context or saved to `.txt` / `.md` |
| Extracted tables | Markdown tables or saved to `.csv` / `.xlsx` |
| Merged/split PDFs | Saved to same folder as source or user-specified location |
| Bulk summaries | Summary markdown file in same folder as PDFs |
| Filled forms | Completed PDF saved alongside the original |

## Examples

### Example 1: Extract text from a PDF
**User says:** "Extract the text from this PDF"
**Actions:** Check size → read with pdfplumber → return text
**Result:** Full text content returned

### Example 2: Bulk folder processing
**User says:** "Review the PDFs in this folder for competitive analysis"
**Actions:** Ask purpose → process each sequentially with Extract-Summarise-Release → write consolidated summary
**Result:** Summary file with per-document findings and consolidated insights

## Troubleshooting

### PDF returns no text
**Cause:** Image-based (scanned) PDF.
**Solution:** Convert pages to images, then use pytesseract for OCR. See [reference.md](references/reference.md).

### Context overflow with multiple PDFs
**Cause:** Reading several large PDFs fills context.
**Solution:** Use Extract-Summarise-Release workflow in [workflows.md](references/workflows.md).

### "File too large" error
**Cause:** PDF exceeds Read tool's single-pass limit.
**Solution:** Ask for file path (don't attach). Classify using PDF Processing Scale above, follow Scale 3/4/5 workflow.

### Table extraction returns malformed data
**Cause:** Complex table layouts with merged cells.
**Solution:** Adjust `table_settings` parameter or fall back to text extraction and manual parsing.
