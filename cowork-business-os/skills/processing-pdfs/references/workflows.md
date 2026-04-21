# PDF Processing Workflows

Detailed workflows, code examples, and patterns for PDF processing operations.

---

## Python Libraries

### pypdf — Basic Operations

```python
from pypdf import PdfWriter, PdfReader

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# Extract text
text = ""
for page in reader.pages:
    text += page.extract_text()

# Merge PDFs
writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)
with open("merged.pdf", "wb") as output:
    writer.write(output)

# Split PDF
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

### pdfplumber — Text and Table Extraction

```python
import pdfplumber

# Extract text
with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()

# Extract tables
with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                print(row)
```

### reportlab — Create PDFs

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
width, height = letter
c.drawString(100, height - 100, "Hello World!")
c.save()
```

---

## Command-Line Tools

```bash
# pdftotext (poppler-utils)
pdftotext input.pdf output.txt
pdftotext -layout input.pdf output.txt  # Preserve layout

# qpdf
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf
```

---

## Bulk Sequential Processing (Context-Efficient)

When processing **multiple PDFs** (more than 2-3), use this workflow to avoid filling the context window.

### The Problem
Reading multiple PDFs simultaneously consumes context rapidly. A folder of 10 dense PDFs can exhaust available context before analysis is complete.

### The Solution: Extract-Summarise-Release

Process each PDF sequentially, extracting key information into a persistent summary file. Once summarised, the full PDF content drops from context but the extracted knowledge persists.

### Workflow

1. **Ask the user for the extraction purpose** — This determines what to capture from each document
2. **Create or open the summary file** — Located in the same folder as the PDFs or a specified output location
3. **Process each PDF sequentially:**
   - Read the PDF
   - Extract relevant information based on purpose
   - Append findings to summary file
   - Move to next PDF (previous PDF content drops from context)
4. **Return the completed summary** — User has consolidated knowledge without context exhaustion

### Summary File Structure

```markdown
# [Purpose] Summary
**Source folder:** [path]
**Generated:** [date]
**Purpose:** [user-specified purpose]

---

## Document 1: [filename]
**Type:** [spec sheet / proposal / case study / report / etc.]
**Key findings:**
- [bullet points of relevant information]

**Notable quotes/figures:**
> [verbatim text worth preserving]

---

## Consolidated Insights
[After all documents processed, add cross-document patterns and summary]
```

### What to Extract (by Purpose)

| Purpose | Extract |
|---------|---------|
| Competitive analysis | Company names, product specs, pricing, market claims, differentiators |
| Technical research | Specifications, performance data, methodologies, limitations |
| Due diligence | Financial figures, risks, commitments, obligations, red flags |
| Proposal preparation | Requirements, evaluation criteria, decision-makers, timelines |
| Literature review | Key findings, methodologies, citations, gaps in research |

### Implementation Notes

- **Always ask purpose first** — Don't assume what the user needs
- **Update summary after each PDF** — Write to file immediately, don't batch
- **Use Read tool for PDFs** — Claude can read PDF files directly
- **Keep summaries concise** — Capture what matters, not everything
- **Note document quality** — Flag if a PDF is unreadable, image-only (needs OCR), or corrupted

---

## Large Single PDF — Scale 3+ Workflows

For PDFs at Scale 3 (medium) and above, use the workflows below. See the PDF Processing Scale section in [../SKILL.md](../SKILL.md) for classification.

### Scale 3 — Chunked Reading (5–20MB / 50–200 pages)

1. Run the mandatory size/page check
2. Read pages 1–5 (`pages: "1-5"`) to find structure
3. Plan page ranges — target relevant sections, not cover-to-cover
4. Read in 20-page chunks using the Read tool's `pages` parameter (max 20 per request)
5. Write findings to a summary file after each chunk (Extract-Summarise-Release pattern)

### Scale 4 — Split Then Chunk (20–50MB / 200–500 pages)

1. Run the mandatory size/page check
2. Split with `qpdf` into manageable chunks:

```bash
qpdf input.pdf --pages . 1-50 -- chunk1.pdf
qpdf input.pdf --pages . 51-100 -- chunk2.pdf
qpdf input.pdf --pages . 101-150 -- chunk3.pdf

# Or extract a specific section
qpdf input.pdf --pages . 25-40 -- section.pdf
```

3. Read pages 1–5 of chunk1 to find structure
4. Process relevant chunks using the Scale 3 chunked reading workflow
5. Write findings to summary file after each chunk

### Scale 5 — Parallel Agents (Over 50MB / 500+ pages)

1. Run the mandatory size/page check
2. Split with `qpdf` into ~50-page chunks
3. Read pages 1–5 for structure and plan which chunks are relevant
4. Spawn parallel agents — each agent processes assigned chunks and writes findings to disk
5. Agents return file path + 1-line summary only (per parallel-agents rule)
6. Orchestrator consolidates from disk

### Example

**User says:** "Process this 300-page tender document at ~/Documents/tender.pdf"

**Workflow:**
1. `ls -lh` → 36MB, 312 pages → **Scale 4**
2. Split into 50-page chunks with `qpdf`
3. Read pages 1–5 of chunk1 → table of contents found
4. Target sections: Executive Summary (pp 8–15), Technical Requirements (pp 45–90), Pricing (pp 200–220)
5. Read each target chunk in 20-page ranges, writing findings to summary file
6. Return consolidated summary
