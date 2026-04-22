# Editing Standards

Quality assurance rules for all written content. Apply as a three-pass editing workflow.

## Language Rules

Use the language variant specified in `.claude/company/voice.md`. If not specified, default to UK English:

- organise, colour, behaviour, analyse, programme (not program, unless software)
- -ise endings (not -ize): organise, recognise, specialise
- -our endings: colour, behaviour, favour, honour
- -re endings: centre, metre, fibre
- "different from" not "different than"
- Dates: DD Month YYYY (e.g., 15 January 2026)

## Prohibited Language Categories

### Strategic Terminology (vague, overused)
- leverage, synergy, paradigm shift, best-in-class, world-class
- holistic, robust, comprehensive, scalable, innovative

### Action Verbs (inflated)
- empower, unlock, unleash, reimagine, revolutionise
- supercharge, turbocharge, amplify, elevate

### Descriptors (hollow)
- game-changing, transformative, cutting-edge, next-generation
- groundbreaking, disruptive, bleeding-edge, state-of-the-art

### Empowerment Language
- "Unlock your potential", "Take your X to the next level"
- "Empower your team", "Transform your business"

### Vague Intensifiers
- very, really, quite, extremely, incredibly, absolutely
- highly, remarkably, significantly (unless citing data)

### Business Speak
- "Move the needle", "low-hanging fruit", "circle back"
- "Touch base", "deep dive", "at the end of the day"

### Buzzwords Without Substance
- AI-powered (unless explaining what the AI actually does)
- Data-driven (unless citing specific data)
- End-to-end (unless describing a specific process start to finish)

## Readability Standards (Yoast-Aligned)

| Metric | Target |
|--------|--------|
| Passive voice | Max 10% of sentences |
| Sentence beginnings | No more than 2 consecutive sentences starting with the same word |
| Sentence length | Max 25% of sentences over 20 words |
| Paragraph length | Max 150 words |
| Subheading distribution | One per 300 words (articles and long-form) |
| Transition words | Min 30% of sentences contain a transition word |
| Short sentence clusters | Never 3+ consecutive sentences under 8 words |

## Three-Pass Editing Workflow

### Pass 1: Technical

- Language variant consistency
- Grammar and punctuation
- Prohibited language check (replace with specific alternatives)
- Spelling and typos
- Formatting consistency (heading levels, list styles, spacing)

### Pass 2: Structure

- Logical flow from section to section
- Section transitions (natural, not formulaic)
- Heading hierarchy (H1 > H2 > H3, no skipped levels)
- Paragraph focus (one idea per paragraph)
- Opening strength (does the first sentence earn the second?)
- Closing strength (does the piece end with a clear action or takeaway, not a summary?)

### Pass 3: Voice

- Tone consistency throughout (per `.claude/company/voice.md`)
- Audience appropriateness (is this written for the right person?)
- Evidence integration (claims backed by specifics, not generalities)
- AI-tells check (see `ai-tells.md`)
- Read aloud: does it sound like a person or a language model?

## 7-Part Article Structure

For long-form articles and blog posts:

1. **Hook** — open with a specific fact, story, or question (not a definition)
2. **Context** — set the scene, establish why this matters now
3. **Argument** — the core thesis, stated clearly
4. **Evidence** — data, examples, case studies, expert perspectives
5. **Nuance** — acknowledge complexity, address counterarguments
6. **Application** — practical takeaways, how the reader applies this
7. **Close** — end with a forward-looking statement or clear CTA (not a summary)

## Audience-Specific Standards

| Audience | Formality | Jargon | Sentence Length | Evidence Style |
|----------|-----------|--------|-----------------|----------------|
| Executives | High | Industry terms OK | Short, direct | Data and ROI |
| Practitioners | Medium | Domain-specific OK | Medium, varied | How-to and examples |
| General public | Low | Explain everything | Short to medium | Stories and analogies |
| Technical | Medium-high | Expected | Can be longer | Specifications and comparisons |

## Output Format for Editing

When presenting editing results:

1. **Summary** — 2-3 sentences on overall quality
2. **Critical issues** — must fix (errors, prohibited language, structural problems)
3. **Suggestions** — should fix (readability, flow, voice consistency)
4. **Specific edits** — line-by-line or section-by-section changes with before/after
