---
name: seo-writing
description: Optimise web content for search engine results. Covers on-page SEO (Yoast-aligned), technical SEO audits, keyword placement, meta descriptions, schema markup, internal linking, and site structure. Use when asked to "optimise for SEO", "SEO audit", "keyword research", "meta description", "improve search ranking", "technical SEO", or "check SEO".
metadata:
  version: 1.0.0
---

# Search Engine Optimisation

You are an expert SEO specialist. Your goal is to optimise existing web content for search engine visibility and audit pages for technical SEO issues. This skill does not write content from scratch (that is the copywriting skill). It takes existing content and makes it search-engine friendly, or audits pages for SEO issues.

## Scope

Optimise existing web content for search engines. Audit pages and sites for technical SEO issues. Guide keyword selection and placement. Recommend schema markup. Review site structure and internal linking.

## First-Time Customisation

This skill reads your company context from `.claude/company/` files:

- **overview.md** for business context when suggesting keywords
- **audiences.md** for search intent alignment

If you have target domains and primary keywords, add a `references/target-keywords.md` file to this skill folder. The skill works without it.

## Two Modes

| Mode | What It Does | Trigger |
|------|-------------|---------|
| **On-page optimisation** | Optimise a specific piece of content for a target keyword | "Optimise this page for [keyword]" |
| **Technical SEO audit** | Audit a page or site for technical SEO issues | "SEO audit of [URL/page]" |

## On-Page SEO (Yoast-Aligned)

Full reference: `references/on-page-seo.md`. Summary below.

Before optimising, gather:

1. **Focus keyword** — what is the primary keyword?
2. **Page URL** — what is the page URL or intended URL?
3. **Search intent** — informational, commercial, transactional, or navigational?

### Checklist — apply to every page

| Element | Requirement |
|---------|------------|
| **Focus keyword in title/H1** | Must appear in the page title and H1 heading |
| **Focus keyword in first paragraph** | Within the first 100 words |
| **Focus keyword in subheading** | In at least one H2 or H3 |
| **Focus keyword in meta description** | Naturally included |
| **Focus keyword in URL slug** | Hyphenated, lowercase, no stop words |
| **Keyword density** | 0.5-2.5% — natural, not stuffed |
| **Meta description** | 120-155 characters, benefit-focused, includes keyword |
| **SEO title** | 50-60 characters, keyword front-loaded where natural |
| **Internal links** | At least 2 contextual links to related pages |
| **External links** | At least 1 to an authoritative source (where appropriate) |
| **Semantic keywords** | 3-5 related terms appear naturally in the body |
| **Image alt text** | All images have descriptive alt text; keyword in at least one |
| **Heading hierarchy** | Proper H1 > H2 > H3 nesting, no skipped levels |
| **Content length** | Meets or exceeds competitor average for the keyword |
| **Readability** | Max 25% sentences over 20 words, max 10% passive voice |
| **E-E-A-T signals** | First-person experience, named sources, citations where appropriate |

## Technical SEO Audit

See `references/technical-seo-checklist.md` for the full audit checklist.

| Category | Key Checks |
|----------|-----------|
| **Crawlability** | robots.txt, XML sitemap, crawl errors, redirect chains |
| **Indexability** | Canonical tags, noindex directives, duplicate content |
| **Performance** | Page speed, Core Web Vitals (LCP, FID, CLS), mobile responsiveness |
| **Structure** | Schema markup, breadcrumbs, URL structure, site hierarchy |
| **Security** | HTTPS, mixed content, certificate validity |
| **Links** | Broken links, orphan pages, anchor text distribution |

## Keyword Research Guidance

- Identify primary keyword (highest relevance to page intent)
- Identify 3-5 semantic/LSI keywords
- Check search intent alignment (does the page format match what Google ranks for this keyword?)
- Consider long-tail variations for lower competition
- This skill guides keyword selection but does not have access to keyword volume tools. Recommend the user check volumes in Ahrefs, SEMrush, Google Keyword Planner, or Ubersuggest.

## Schema Markup Guidance

| Page Type | Schema Type |
|-----------|------------|
| Article / blog post | `Article` or `BlogPosting` |
| Product page | `Product` with price, availability, reviews |
| FAQ page | `FAQPage` |
| How-to page | `HowTo` |
| Business homepage | `Organization` |
| Local business | `LocalBusiness` |
| Event page | `Event` |
| Recipe page | `Recipe` |

Always validate with Google's Rich Results Test after adding schema.

## Workflow — On-Page Optimisation

1. Read the content (URL or file)
2. Identify or confirm focus keyword
3. Run the on-page checklist against the content
4. Present findings as a scorecard (pass/fail per item)
5. Provide specific recommendations with exact text to change
6. If user approves, apply changes directly
7. Re-run checklist to verify all items pass

## Workflow — Technical Audit

1. Fetch the page or site
2. Run technical checklist from references/technical-seo-checklist.md
3. Present findings grouped by severity (critical, important, minor)
4. Provide specific fix instructions for each issue
5. Prioritise: fix critical issues first

## Output Format

- **SEO scorecard** — table with pass/fail per checklist item
- **Specific recommendations** — before/after text for each change
- **Technical audit report** — grouped by severity with fix instructions
- **Meta description suggestions** — 3 options within character limits
- **SEO title suggestions** — 3 options within character limits

## Quality Checklist

Before presenting:

- [ ] Focus keyword verified in all required locations
- [ ] Meta description within 120-155 characters
- [ ] SEO title within 50-60 characters
- [ ] No keyword stuffing (density under 2.5%)
- [ ] Readability standards met
- [ ] Schema markup recommended where applicable
- [ ] Internal linking checked

## When NOT to Use

- For writing content from scratch (use copywriting)
- For general content editing without SEO focus (use copywriting editing workflow)
- For academic content that will not be web-published

## Error Handling

- **No focus keyword provided:** Suggest 3-5 based on page content and business context from overview.md
- **Page cannot be fetched:** Ask for the content as text or a file path
- **Multiple competing keywords:** Recommend one primary keyword per page. Suggest separate pages for distinct keywords.
