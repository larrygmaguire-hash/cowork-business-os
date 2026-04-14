---
name: processing-pdfs
description: Extract text and tables, merge, split, fill forms, and annotate PDF files. Handles single and bulk PDF operations.
---

# PDF Processing

Process PDF files — extract text and tables, merge, split, create, fill forms, and annotate.

## When to Use

- Extracting text or tables from PDFs
- Merging or splitting PDFs
- Creating new PDFs
- Filling PDF forms
- Adding watermarks or annotations
- OCR on scanned documents
- Bulk processing multiple PDFs in a folder

## When NOT to Use

- Word documents — use processing-documents skill
- Spreadsheets — use processing-spreadsheets skill
- Presentations — use presentation processing skill if available

## Workflow

### Step 1: Check Size (MANDATORY)

Before reading any PDF, classify it using the PDF Processing Scale below. Never skip this step.

```bash
ls -lh "/path/to/file.pdf"
python3 -c "from pypdf import PdfReader; r = PdfReader('/path/to/file.pdf'); print(f'Pages: {len(r.pages)}')"
```

### PDF Processing Scale

| Scale | Size | Pages | Approach |
|-------|------|-------|----------|
| **1 — Trivial** | Under 1MB | Under 10 | Read directly, extract what is needed |
| **2 — Small** | 1–5MB | 10–50 | Read directly, summarise findings |
| **3 — Medium** | 5–20MB | 50–200 | Read in sections (20 pages at a time) |
| **4 — Large** | 20–50MB | 200–500 | Split first, then process sections |
| **5 — Massive** | Over 50MB | Over 500 | Split into sections, delegate to parallel processing |

**Rules:**
- Never skip the size check
- Always use the file path; do not attach/drag PDFs at Scale 3+
- Read the first 5 pages at Scale 3+ to find structure (table of contents, section headings)
- Write findings to disk as you go at Scale 2+ so progress survives context limits

### Step 2: Choose Approach

| Task | Best Method |
|------|-----------|
| Extract text | Use PDF reader library (pdfplumber, pypdf) |
| Extract tables | Use pdfplumber for structured table extraction |
| Merge PDFs | Combine multiple PDFs into single file |
| Split PDFs | Extract individual pages or ranges |
| Create PDFs | Generate new PDF from structured data |
| OCR scanned PDFs | Convert to images, apply optical character recognition |
| Fill forms | Use form-filling libraries with field mapping |
| Split large files | Use command-line tools for efficient splitting |

### Step 3: Process

- **Single PDF (Scale 1–2):** Read directly, extract what is needed
- **Large PDF (Scale 3+):** Follow chunked reading approach — read 20 pages at a time, summarise, continue
- **Bulk (3+ PDFs):** Ask user for extraction purpose first, process sequentially, write findings to summary file after each PDF

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
**Actions:** Check size → classify using scale → read appropriate sections → return text
**Result:** Full text content returned

### Example 2: Bulk folder processing
**User says:** "Review the PDFs in this folder for key information"
**Actions:** Ask purpose → process each sequentially with extraction → write consolidated summary
**Result:** Summary file with per-document findings and consolidated insights

## Troubleshooting

### PDF returns no text
**Cause:** Image-based (scanned) PDF.
**Solution:** Convert pages to images, then use optical character recognition.

### Context overflow with multiple PDFs
**Cause:** Reading several large PDFs fills context.
**Solution:** Use chunked reading — process one PDF at a time, save findings to disk, continue with next.

### "File too large" error
**Cause:** PDF exceeds single-pass read limit.
**Solution:** Ask for file path (do not attach). Classify using PDF Processing Scale, follow Scale 3/4/5 workflow.

### Table extraction returns malformed data
**Cause:** Complex table layouts with merged cells.
**Solution:** Adjust extraction settings or fall back to text extraction and manual parsing.

## Quality Checklist

Before presenting results:

- [ ] Extracted content verified against original
- [ ] File paths confirmed
- [ ] No incomplete or truncated extractions
- [ ] Tables properly formatted (if applicable)
- [ ] All requested content included
- [ ] Output saved to correct location (if applicable)
