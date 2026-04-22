---
name: analysing-research
description: Analyse academic papers, verify sources, format APA7 citations, and synthesise research findings. Use when reviewing a paper, checking citations, doing a literature review, or summarising research evidence.
---

# Research Analysis

Analyse research materials, verify sources, format citations, and synthesise findings from academic literature.

**CRITICAL:** Never invent or construct citations from memory. If a source cannot be verified, state this explicitly rather than fabricating a reference.

## When to Use

- Analysing or reviewing academic papers
- Verifying sources and citations
- Formatting references in APA7
- Synthesising findings across multiple studies
- Conducting or supporting literature reviews
- Summarising research evidence for a specific topic

## Workflow

### Step 1: Identify Materials and Scope

Determine what the user needs analysed — a single paper, multiple sources, or a topic requiring literature search. Clarify the research question or focus area if not stated.

### Step 2: Analyse Sources

For each paper or source:

- Extract key findings, methodology, and limitations
- Identify theoretical frameworks and how they are applied
- Note sample sizes, study designs, and statistical approaches
- Flag potential biases or methodological concerns

### Step 3: Verify and Format Citations

- Search for and verify academic sources before citing
- Format all references in APA7 style
- Include DOIs where available
- Maintain consistency across reference lists
- Flag incomplete citation information

### Step 4: Tag Confidence Levels

Every finding or claim must be tagged with a confidence level:

| Level | Criteria | Display |
|-------|----------|---------|
| **HIGH** | Official documentation, verified primary source, peer-reviewed with replication | `[HIGH]` |
| **MEDIUM** | Multiple credible sources agree, peer-reviewed but single study, well-established secondary source | `[MEDIUM]` |
| **LOW** | Single source, unverified, pre-print, blog/commentary, or contradicted by other evidence | `[LOW]` |

**Format in output:**
- "Self-determination theory identifies three basic needs: autonomy, competence, and relatedness (Deci & Ryan, 2000) `[HIGH]`"
- "Remote workers report 15% higher productivity (Buffer, 2024 survey) `[MEDIUM]`"
- "Some practitioners suggest journaling improves focus within 7 days `[LOW]`"

Tag every factual claim. If confidence cannot be determined, default to `[LOW]` and note why.

### Step 5: Synthesise Findings

- Identify patterns across multiple studies
- Note contradictions or gaps in the literature
- Summarise evidence strength for key claims, using confidence tags to weight conclusions
- Organise findings thematically

### Step 6: Produce Output

Deliver results using the appropriate output format (see below). Use UK English throughout. Be precise with technical terminology. Distinguish between findings and interpretations. Acknowledge limitations and uncertainties. Provide page numbers for direct quotes.

## Output Format

### Single Paper Analysis

Return the following structure:

1. **Citation** (APA7 format)
2. **Research Question/Aim**
3. **Methodology** (design, sample, measures)
4. **Key Findings**
5. **Theoretical Framework**
6. **Limitations**
7. **Relevance** (to the user's research focus)

### Literature Review / Multi-Source Synthesis

Return:

1. **Overview** — scope and research question
2. **Thematic Summary** — findings organised by theme
3. **Evidence Strength** — assessment of convergence/divergence across studies
4. **Gaps and Contradictions** — areas requiring further research
5. **Reference List** — full APA7 reference list

## Examples

### Example 1: Single paper analysis

**User says:** "Analyse this paper on self-determination theory in the workplace"
**Actions:**
1. Read the paper or provided extract
2. Extract methodology, findings, theoretical framework, and limitations
3. Format APA7 citation
4. Assess relevance to user's research focus
**Result:** Structured analysis using the single paper format above

### Example 2: Source verification

**User says:** "Check if this citation is correct — Deci & Ryan, 2000, SDT overview"
**Actions:**
1. Search for the source to verify authors, year, title, and journal
2. Compare against the user's citation
3. Provide corrected APA7 citation or flag if source cannot be verified
**Result:** Verified or corrected APA7 citation, or explicit statement that the source could not be found

## Troubleshooting

### Source cannot be verified
**Cause:** The paper may not exist, or details (author, year, title) may be incorrect.
**Solution:** State explicitly that the source could not be verified. Suggest alternative search terms or related papers if possible. Never fabricate a citation.

### Incomplete citation information
**Cause:** The user provides partial details (e.g., author and year but no title).
**Solution:** Search with available details. If multiple matches are found, present options. If no match is found, flag what information is missing.

## Domains of Expertise

- Psychology (organisational, performance, personality)
- Workplace behaviour and motivation
- Human performance and skill acquisition
- AI/technology adoption in organisations
- Research methodology and statistics
