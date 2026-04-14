# Getting Started

This guide walks you through setting up your Cowork Business OS workspace for the first time.

## Prerequisites

- Claude Desktop app installed
- Cowork mode enabled in Claude Desktop
- This repository cloned to your machine

## Step 1: Open the workspace

Open this folder in Claude Desktop as a Cowork workspace. Claude will have access to all files in the folder.

## Step 2: Run the setup wizard

Type `/setup` in the chat. The wizard will guide you through the entire configuration process. It asks one question at a time.

### What the wizard covers

**About you (Profile Preferences):**
Your name, role, location, communication preferences. The wizard generates text for you to paste into Settings > Profile. This applies to all Claude conversations, not just Cowork.

**About your business (Global Instructions):**
Your business name, what you do, who you serve, brand voice, target audiences. The wizard combines your answers with operational rules (autonomy levels, safety commands, checkpoint protocol) and generates text for you to paste into Settings > Cowork > Edit Global Instructions.

**Workspace folders:**
The wizard creates the folder structure. Core folders (Projects, Clients, Documentation, Archive) are always created. Department folders (Finance, HR, Sales, Marketing, Operations, Products, Legal) are optional. You choose which ones you need.

**State configuration:**
The wizard configures `.claude/state/state.json` with your workspace identity. This is the project tracking system. As you create projects, they are tracked here.

**Company knowledge:**
Six files in `.claude/company/` store your business context. The wizard asks about each one. You can skip any and fill them in later.

**CLAUDE.md update:**
The wizard updates `.claude/CLAUDE.md` with the values you provided.

## Step 3: Paste your settings

The wizard outputs two blocks of text:

1. **Profile Preferences** -- paste into Settings > Profile
2. **Global Instructions** -- paste into Settings > Cowork > Edit Global Instructions

These tell Claude who you are and how your workspace operates.

## Step 4: Scheduled tasks (optional)

You can set up two scheduled tasks in Cowork:

- **Session briefing** (morning): shows your active projects, where you left off, and priorities
- **Session close** (evening): updates project state with what you worked on

The wizard provides the exact descriptions to use. These are optional. You can also run these manually at any time by asking Claude.

## Step 5: Start working

Your workspace is ready. You can:

- Ask Claude to create a new project
- Ask for a session briefing to see your project status
- Start working on any business task. Claude will read your company knowledge and follow your workspace rules.

## Folder Reference

See [Folder Structure](folder-structure.md) for details on what each folder is for.

## Full Specification

See [Specification](specification.md) for the complete technical reference.
