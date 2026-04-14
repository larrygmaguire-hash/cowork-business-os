# Profile Preferences Template

This is the template that the `/setup` skill uses to generate your Profile Preferences. The wizard collects your answers and produces the final text.

Once generated, paste the output into **Settings > Profile** in the Claude Desktop app.

---

## What goes here

Profile Preferences describe **you** -- they apply to every Claude conversation (Chat, Cowork, everything). They are not about your business or your workspace. Things you want Claude to know about you regardless of which workspace you are in.

Profile Preferences are loaded by Claude before Global Instructions. They set baseline communication preferences. Global Instructions then add business-specific rules on top.

---

## Generated template structure

```
My name is [YOUR_NAME]. I am a [YOUR_ROLE] based in [YOUR_LOCATION].

[1-2 sentences about what you do professionally]


## Communication preferences

- Language: [UK English / US English] only
- Tone: [Direct and factual / Friendly but professional / Formal / etc.]
- Detail level: [Concise / Thorough / Match the complexity of the question]
- Things to avoid: [No sycophancy / No filler phrases / No emojis unless asked / etc.]


## Working style

[How you prefer to work with Claude. For example:]
- Execute without asking permission unless genuinely ambiguous
- Ask one clarifying question if blocked
- Break complex tasks into checkpoints
- Show your reasoning when making non-obvious decisions
```

---

## Setup questions the wizard will ask

1. What is your name?
2. What is your role or title?
3. Where are you based?
4. What do you do professionally? (1-2 sentences)
5. Do you use UK English or US English?
6. How do you prefer Claude to communicate with you? (tone, detail level, things to avoid)
7. Are there any working style preferences? (how you want Claude to handle ambiguity, decisions, etc.)

The wizard combines your answers into the structured format above.

---

## How Profile and Global Instructions work together

| Layer | What it covers | When it applies |
|-------|----------------|-----------------|
| **Profile Preferences** | You as a person, communication style | Every Claude conversation, everywhere |
| **Global Instructions** | Your business, workspace bootstrap, operational rules | Every Cowork task in this workspace |
| **Workspace CLAUDE.md** | Master workspace rules (state, conventions, autonomy) | Read by Claude on every task via Global Instructions bootstrap |
| **Project CLAUDE.md** | Project-specific scope, deliverables | Read by Claude when working in that project folder |
| **Skill SKILL.md** | Workflow for a specific task | Auto-detected and invoked by Cowork when relevant |

Profile = you. Global Instructions = your business. CLAUDE.md = your workspace. Project CLAUDE.md = a specific project.
