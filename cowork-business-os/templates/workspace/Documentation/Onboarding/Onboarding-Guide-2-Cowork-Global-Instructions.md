# Onboarding Guide 2 — Cowork Global Instructions

**Where this applies:** Claude Desktop → Settings → Cowork → Global Instructions
**Time to complete with Claude:** ~20 minutes (or ~8 minutes using the Fast Path)

---

## What Cowork Is

Cowork is a mode inside Claude Desktop where Claude does not just chat with you — it **works alongside you on your computer**. Instead of only writing text back into a chat window, Claude can read files on your machine, create and edit documents, organise folders, run small automations, and produce real working outputs that live on disk.

If a normal Claude conversation is a *meeting*, Cowork is a *shared desk*. You are still in control, but Claude has a keyboard.

Because Cowork sessions can read and change files on your machine, you want Claude to operate with clear standing instructions — what to do, what never to do, how to ask when it is uncertain, and the conventions your organisation follows. That is what **Global Instructions** is for.

## What Global Instructions Is

**Settings → Cowork → Global Instructions** is a plain-text field. The description inside the app reads:

> *"Instructions here apply to all Cowork sessions. Use this for preferences, conventions, or context that Claude should always know."*

Every time you open a new Cowork session, these instructions load automatically. They are the equivalent of handing Claude a short staff handbook before it sits down at the desk.

## How This Differs from Personal Preferences

This is the part most people confuse. The two fields look similar but do completely different jobs.

| | **Personal Preferences** | **Cowork Global Instructions** |
|---|---|---|
| **Where it lives** | Settings → General → Personal Preferences | Settings → Cowork → Global Instructions |
| **What it describes** | *You, the human.* Facts about who you are, your role, your organisation, your work. | *How Claude should work.* Rules, conventions, standing instructions for Cowork sessions. |
| **Grammatical subject** | "The user is…", "I work on…" | "Always…", "Never…", "Before…", "Ask before…" |
| **When it applies** | Every Claude conversation (chat and Cowork) | Only inside Cowork sessions |
| **Why it exists** | So Claude knows who it is talking to. | So Claude behaves correctly when it has access to your machine. |
| **Content type** | Biographical, factual, contextual | Behavioural, procedural, operational |

Simple test: if the sentence describes *you*, it goes in Personal Preferences. If the sentence tells Claude *what to do or not do*, it goes in Cowork Global Instructions.

### Why two fields and not one

Personal Preferences applies to every conversation — including casual chats where Claude is not touching your machine. You don't want "never delete a file without asking" loaded into a conversation about drafting a birthday message.

Cowork Global Instructions applies only when Claude is doing real work on your computer. That's the right place for the rules that matter when files are at stake.

---

## How to Use This Document

1. Open Claude Desktop.
2. Start a **new conversation** (fresh chat window — not inside any Project, and not inside your Cowork Business OS workspace).
3. Copy everything below the line that says `--- PASTE FROM HERE ---` into the chat and send it.
4. Claude will interview you one question at a time.
5. At the end, Claude will produce a clean block of text in a code block.
6. Open **Settings → Cowork → Global Instructions**, paste the block in, save.

You do this once per machine, per user. Each person does their own.

### Two ways to complete this

- **Fast Path** — if you have anything that already describes how your organisation works or how you want Claude to behave, upload or link it at the start. Useful sources include: an internal style guide, a house-writing guide, a brand or editorial guideline document, an IT acceptable-use policy, a folder-structure or file-naming standard, an AI usage policy, or even a short note you have written before on "how I want tools to work for me". Claude will read it, extract whatever rules and conventions it can, and only ask you about what is missing. This typically takes about eight minutes.
- **Interview Path** — if you have nothing to upload, skip the uploads and Claude will walk you through every question one at a time. This takes about twenty minutes.

Both produce the same final block. Pick whichever suits you.

---

--- PASTE FROM HERE ---

# Task — Help Me Write My Cowork Global Instructions

You are helping me write the content for **Claude Desktop → Settings → Cowork → Global Instructions**. This is the standing brief that loads into every Cowork session — the mode where you work directly on my computer, read and edit files, and produce real outputs on disk.

## What Belongs in Cowork Global Instructions

The field description in the app reads: *"Instructions here apply to all Cowork sessions. Use this for preferences, conventions, or context that Claude should always know."*

This is **rules for you, Claude**, not facts about me. Facts about me live elsewhere (Personal Preferences under Settings → General). Global Instructions is where I tell you how to work when you are acting on my machine.

Categories of content that belong here:

- **Language and conventions** — spelling, date formats, terminology
- **Tone and writing style** — how responses and generated documents should read
- **File and folder conventions** — where things live, naming rules, what to archive
- **Operational rules** — what to do before editing or deleting, when to ask before acting
- **Things to avoid** — words, phrases, habits, assumptions I do not want
- **Source handling** — when to cite, when to flag uncertainty, never fabricate
- **How to handle ambiguity** — ask one clear question, do not guess

Categories that do **not** belong here:

- Facts about me as a person — those are in Personal Preferences
- Rules for one specific project only — those belong in that Project's instructions
- Technical configuration (MCP servers, model selection) — those are handled separately

## How We Will Do This

Before you ask any questions, do this first:

**Step 0 — Offer the Fast Path.** Your first message to me must ask whether I want to use the Fast Path or the Interview Path. Phrase it like this:

> *"Before we start, do you have any material that already describes how your organisation works or how you want tools like me to behave — a style guide, an editorial or house-writing guide, an IT acceptable-use policy, an AI usage policy, a file-naming or folder-structure standard, or anything similar? If so, upload the file or paste the URL now and I will read it first, then only ask you about what is missing. If not, just say 'interview' and I will walk you through every question one at a time."*

Wait for my reply.

- **If I upload a file or give you a URL:** read it carefully. Extract anything relevant to the thirteen questions below — language and spelling conventions, tone, formatting habits, banned words, rules for editing or deleting files, naming conventions, source-handling rules, and stopping rules. Then tell me, in one short message, what you were able to pull from the source and which of the questions below you still need me to answer. Ask those remaining questions **one at a time**, in the order listed, skipping the ones already covered. Do not re-ask anything the source answered unless the source was ambiguous.
- **If I say "interview" or give you nothing usable:** proceed with every question below, one at a time.

Either way, the **Project Context Rule** section below is non-negotiable and must appear in the final block regardless of what the source said. And once you reach the end, follow the "After the Final Answer" section exactly.

Now, the questions. Ask each of these **one at a time**, skipping any already answered by the uploaded source. Wait for my answer before moving on. One question per message. Do not batch. Do not offer examples unless I ask.

### Language and Style

1. What language and spelling conventions should I always use? (UK English, US English, specific date formats, 24-hour clock, and similar.)
2. What tone do you want me to use in writing — both in chat and in any documents I produce? (Direct, plain, no marketing language, no filler openers like "Certainly!" or "Great question!", no exclamation marks, and so on.)
3. What formatting habits do you want by default? (Short paragraphs, bullets only when helpful, headings for longer outputs, tables when comparing things.)
4. Are there specific words, phrases, or writing habits you want me to avoid? (Hype language like "leverage", "robust", "unlock"; em dashes; filler phrases.)

### Operating Rules for My Machine

5. Before I edit or overwrite a file, what should I do? (Show you the change first, ask before replacing, never delete without confirmation, and similar.)
6. Before I create a new folder or reorganise files, what should I do?
7. How should I handle requests that are ambiguous? (Ask one short clarifying question before acting — never guess and never invent.)
8. How should I handle tasks I cannot complete or am uncertain about? (Say so plainly, flag what I would need to proceed, do not make something up.)

### Project Context Rule — Include This in the Final Block

Regardless of how I answer the other questions, the final block you produce **must include** the following standing rule under Operating Rules. This applies whenever you are working inside a project folder — whether the folder is loaded directly into a Cowork session, or attached as a Cowork Project via the native Projects feature:

> *Whenever you enter or are pointed at a project folder, look for a file named `CLAUDE.md` at the root of that folder and read it first. That file tells you what the project is about, who is involved, where the content lives, and the current state. Do this before acting on any request inside the project. If no `CLAUDE.md` exists, say so and ask what the project is about before proceeding.*

Confirm you have noted this before moving on.

### Conventions

9. Are there file and folder naming conventions I should always follow? (ISO dates YYYY-MM-DD, kebab-case for filenames, specific folder structures.)
10. Are there conventions about where certain types of work live? (e.g. project files under a Projects folder, reference material under Knowledge-Base, finished deliverables in a specific place.)
11. How should I handle sources and evidence in documents I produce? (Cite when making factual claims, never fabricate references, flag opinion vs established fact.)

### Stopping Rules

12. What should I never do without explicit permission? (Push to a shared repository, send an email, delete anything, commit a financial figure, change a client-facing document.)
13. Is there anything else about how you want me to work with you inside Cowork that I should always follow?

## After the Final Answer

Produce a clean **Cowork Global Instructions** block in plain text, written as direct instructions to me (starting with verbs — "Always…", "Never…", "Ask…", "Before…", "Avoid…").

Structure it with short headings so it is easy to scan and easy to update later:

```
## Language and Style
[spelling, tone, formatting, words to avoid]

## Operating Rules
[what to do before editing, creating, deleting; how to handle ambiguity; how to handle uncertainty]

## Conventions
[file and folder naming, where things live, how sources are handled]

## Stopping Rules
[things I must never do without explicit permission]
```

Each item should be one or two short sentences. Rule-like. No padding, no flourishes. Put the whole block in a single code block so I can copy it cleanly.

## Final Step — Walk Me Through Saving It

After you produce the code block, stop and walk me through saving it. Do not assume I know where to click. Give me the steps one at a time and wait for me to confirm each one before moving on:

1. Tell me: *"Copy the block above — click inside the code block, select all, copy."* Wait for me to say done.
2. Tell me: *"Click your initials in the bottom-left corner of Claude Desktop."* Wait for me to say done.
3. Tell me: *"Click **Settings**."* Wait for me to say done.
4. Tell me: *"Click **Cowork** in the settings menu."* Wait for me to say done.
5. Tell me: *"Find the **Global Instructions** field."* Wait for me to say done.
6. Tell me: *"Paste the block into that field, then click Save (or whatever confirms the change)."* Wait for me to say done.
7. Confirm it is saved. Tell me to close Settings and open a new Cowork session to test.

Do not skip steps. Do not combine steps. If I get stuck, help me before moving on.

## Rules for You During This Exercise

- One question per message. Wait for my answer.
- Plain English. No jargon.
- If an answer is vague, ask one short follow-up to sharpen it before moving on.
- Do not summarise my answers back to me after each question. Just move to the next one.
- No praise, no "great answer", no filler. Just the next question.
- At the end, produce the final block in a single code block.
- Write the final block as direct instructions **to you, Claude** — not as a description of me.

Start with question 1.
