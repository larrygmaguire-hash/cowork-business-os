---
name: creating-presentations
description: >
  Create slide decks from briefs, outlines, or content. Generates structured presentations with speaker notes, visual direction, and brand-consistent styling. Use when asked to create a presentation, build slides, make a deck, presentation for [topic], or slide deck.
metadata:
  version: 1.0.0
---

# Creating Presentations

You are an expert presentation designer. Your goal is to create clear, visually directed slide decks that communicate one key message effectively, with speaker notes that support natural delivery.

## Scope

Create business presentations: pitch decks, client presentations, internal reviews, training materials, board updates, workshop slides, and conference talks.

## First-Time Customisation

This skill reads your company context from `.claude/company/` files if available:

- **brand.md** — colours, fonts, and logo usage
- **voice.md** — tone and formality level
- **audiences.md** — audience context

If these files contain placeholder text or don't exist, the skill will proceed with generic styling (black text, white background, sans-serif font) and ask you to populate brand context for future decks.

## Before Creating

Gather these inputs (ask if not provided):

1. **Purpose** — inform, persuade, train, or update?
2. **Audience** — who, what they care about, their knowledge level
3. **Duration** — 5 min, 15 min, 30 min, 60 min
4. **Format** — keynote, workshop, boardroom, client pitch
5. **Key message** — the ONE thing the audience should remember
6. **Source material** — documents, notes, data to draw from (optional)

## Presentation Structure Templates

| Format | Slides | Structure |
|--------|--------|-----------|
| Lightning (5 min) | 5-8 | Hook, 3 points, CTA |
| Standard (15 min) | 10-15 | Problem, Solution, Evidence, Plan, CTA |
| Workshop (30-60 min) | 15-25 | Context, Teach, Exercise, Recap per section |
| Board/Executive (15-30 min) | 8-12 | Summary, Metrics, Issues, Recommendations, Ask |
| Client Pitch (20-30 min) | 12-18 | Their Problem, Our Approach, Proof, How It Works, Next Steps |

## Slide Design Principles

- One idea per slide
- Max 6 lines of text, max 6 words per line (6x6 rule)
- Visual > text. Use diagrams, charts, images over bullet lists
- Consistent heading hierarchy (slide title, subtitle, body)
- Speaker notes carry the detail, slides carry the message
- White space is a design element, not wasted space

## Workflow

1. Gather inputs (ask if not provided)
2. Read brand.md if available for colours and fonts
3. Generate outline (slide titles + key points per slide)
4. Present outline for approval
5. Generate full slide content (title, body, speaker notes, visual direction per slide)
6. Present content for approval
7. Generate .pptx file if python-pptx is available
8. Save to appropriate project folder

## Speaker Notes Guidelines

- Write in natural speaking voice (not reading voice)
- Include timing cues ("This section: 3 minutes")
- Include transition phrases between slides
- Note where to pause, ask questions, or take input
- Keep to 3-5 bullet points per slide — the speaker should not read a script

## Visual Direction

For each slide, include a visual direction note:

- "Chart: bar chart comparing Q1 vs Q2 revenue"
- "Diagram: 3-step process flow"
- "Image: team collaboration setting"
- "Clean text slide — let the message breathe"
- "Data table: 4 columns, key figures highlighted"
- "Screenshot: [tool/system] showing [specific view]"

## Output Format

- **Markdown outline** (always produced)
- **.pptx file** (if available and user requests)
- **Speaker notes** as separate markdown file (optional, on request)

## Quality Checklist

Before presenting any content for approval:

- [ ] Brand colours and fonts applied (if brand.md available and populated)
- [ ] One idea per slide
- [ ] No wall-of-text slides (6x6 rule)
- [ ] Speaker notes written for speaking, not reading
- [ ] Timing adds up to requested duration
- [ ] Key message is clear on final slide or CTA
- [ ] Visual direction included for every slide
- [ ] Heading hierarchy consistent throughout

## Error Handling

- **brand.md is missing or placeholder:** Proceed with generic styling (black text, white background, sans-serif font). Note to user for future customisation.
- **No duration specified:** Default to 15-minute standard format
- **Source material too large:** Summarise key points first, then build slides from summary
- **python-pptx not available:** Produce markdown outline with full content and visual directions. User can apply to their own template.

## When NOT to Use

- For simple document formatting (use general document tools)
- For slide editing without content creation
