# Department Folders — How to Use Them

Cowork Business OS ships with seven department folders at the workspace root:

- `01 Finance`
- `02 Human Resources`
- `03 Sales`
- `04 Marketing`
- `05 Operations`
- `06 Products`
- `07 Legal`

They are optional. This guide explains what they are for, when to use them, how they fit alongside `Projects/` and `Clients/`, and how to customise or remove them.

---

## What department folders are for

Department folders hold **workspace-wide business-function material** — the kind of content that supports the whole organisation and is not tied to a single project or a single client.

Examples of what belongs in a department folder:

- A marketing brand guidelines document (applies to everything you produce)
- An HR handbook (applies to every employee)
- The standard proposal template (used across many sales conversations)
- A supplier contact list (used across many operational decisions)
- Annual budgets (span the whole business)

Examples of what does **not** belong in a department folder:

- A single marketing campaign with a start and end date — that is a `Project`
- A draft contract for one specific client — that goes in `Clients/[Client Name]/Contracts/`
- A day's session notes — those stay in project or client folders

Department folders are for **standing material**. Projects are for **discrete bodies of work with a defined scope**. Clients are for **relationship-specific material**.

---

## When to use them — and when not to

### Use department folders if…

- Your business has distinct ongoing functions (finance, sales, marketing, operations, etc.)
- You generate recurring material that spans many projects or clients (templates, policies, reports)
- You have more than one person working in the workspace and want functional separation
- You already think about your work in terms of departments

### Skip them if…

- You are a solo creator with no formal departments
- Your work is almost entirely project-based (every piece of output is a deliverable)
- You only have two or three broad categories of work and departments feel like overkill
- You prefer to flatten everything into `Projects/` and `Clients/`

If you are unsure, start without them. Delete the seven folders during setup and add them back later if you find you need them. The template works fine with no department folders at all.

---

## The numbering convention

Department folders are prefixed with a two-digit number (`01 Finance`, `02 Human Resources`). Subfolders inside each department use decimal numbering (`01.1 Accounts Payable`, `01.2 Accounts Receivable`).

**Why numbers:**

- File browsers sort folders alphabetically by default. Numbered prefixes give you a stable, predictable order.
- Numbering makes references unambiguous. "Check 01.4" is clearer than "check Tax and Compliance" when multiple folders have similar names.
- You can reorder by renumbering without the file browser re-sorting unpredictably.

**You can:**

- Change the numbers (e.g., swap the order of Marketing and Sales)
- Remove the numbers entirely if you prefer alphabetical ordering
- Add your own departments with higher numbers (`08 Research`, `09 IT`, etc.)
- Rename folders to match your business (`06 Products` → `06 Services` for a service business)

---

## Departments vs Projects vs Clients

| If the work is… | It belongs in… |
|-----------------|----------------|
| An ongoing function of the business | A department folder |
| A discrete body of work with a start and end | `Projects/P### Project Name/` |
| Relationship-specific material for one client | `Clients/C### Client Name/` |
| Something specific to one client's project | `Clients/C### Client Name/Projects/` or `Projects/P### Project Name/` (with client tagged in state.json) |

**Example — running a recruitment drive:**

- The HR handbook and general recruitment policies → `02 Human Resources/02.3 Policies/`
- The specific drive itself (timeline, candidates, offers) → `Projects/P0## Q3 Hiring Drive/`

**Example — a marketing agency handling a client campaign:**

- The agency's own brand guidelines → `04 Marketing/04.3 Brand Assets/`
- The client's campaign — briefs, creative, analytics → `Clients/C0## Client Name/Projects/P0## Campaign Name/`

**Example — an operations SOP for closing out a month:**

- Permanent SOP → `05 Operations/05.1 Processes/`
- The specific instance of running that SOP in March — not needed as a separate location; it's just one execution of the SOP

---

## How Cowork interacts with department folders

When you work inside a department folder (or one of its subfolders), Cowork reads:

1. `.claude/CLAUDE.md` — master workspace instructions (always)
2. The department's own `CLAUDE.md` — purpose, subfolders, configuration notes
3. `.claude/company/` files — business context (voice, brand, audiences, etc.)

The department `CLAUDE.md` overrides nothing — it adds context. If you configure a department (by editing its `CLAUDE.md` with your specifics), Cowork respects that when producing content inside the folder.

Example: if you set "**Brand voice:** formal, technical, no hedging" in `04 Marketing/CLAUDE.md`, content you ask Cowork to write inside `04 Marketing/04.2 Content/` will reflect that preference.

---

## Customising department folders

Every department ships with:

1. A `CLAUDE.md` at the top level describing the department's purpose, default subfolders, and configuration notes
2. Two to five default subfolders with placeholder `.gitkeep` files
3. Guidance in the `CLAUDE.md` about what to customise

**To customise a department:**

1. Open its `CLAUDE.md` and fill in the configuration items at the bottom (sensitive data rules, CRM integration notes, brand voice specifics, etc.)
2. Add, rename, or remove subfolders as needed
3. Update the Subfolders table in the `CLAUDE.md` to reflect your changes
4. Save the file — Cowork reads it on the next task

**To remove a department you don't need:**

1. Delete the folder (e.g., `rm -rf "07 Legal"` from the repo root, or just drag to Trash)
2. That's it — no other configuration to update

**To add a new department:**

1. Create a folder at the repo root with your chosen prefix (`08 Research`, `09 IT`, etc.)
2. Create a `CLAUDE.md` inside it following the pattern of the shipped departments
3. Add any subfolders you need
4. Save

---

## The setup skill handles this for you

If you run the `setup` skill when the workspace is new, it will ask:

- Which departments do you want to keep?
- Do you want to rename any?
- Do you want to add any of your own?

The skill then removes unwanted departments, renames kept ones if requested, and prompts you to configure each one you keep. You can re-run setup later to change your mind.

---

## Summary

| Decision | What to do |
|----------|-----------|
| Want all seven as shipped | Leave them alone |
| Want none of them | Delete all seven folders |
| Want some, not others | Delete the ones you don't want |
| Want to rename a few | Rename the folder and update its `CLAUDE.md` |
| Want to add your own | Create new folders following the numbered pattern |
| Want help deciding | Run the setup skill — it walks you through it |

Department folders are a convenience, not a requirement. Use them if they help you organise; skip them if they get in the way.
