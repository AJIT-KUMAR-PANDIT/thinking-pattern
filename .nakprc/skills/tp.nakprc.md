---
name: tp.nakprc
description: Use the thinking-patterns tool (nakprc) to generate sequential thinking files for studying AI reasoning. Use when approaching complex reasoning tasks, analyzing AI responses, or learning structured problem-solving.
version: 1.1.0
---

# Thinking Patterns — nakprc Skill

## Overview

The `thinking-patterns` CLI generates sequential thinking pattern files to study and learn AI reasoning patterns. It breaks any problem into numbered reasoning steps, producing one markdown file per step (`1think.md`, `2think.md`, `3think.md`, etc.).

## Prerequisites

The package must be installed in the project:

```bash
npm i llm-thinking-patterns-nakprc
```

## Configuration

A project-level config file (`thinkingpatterns.nakprc.config.js`) controls behavior:

```js
export default {
  output: {
    dir: null,                  // null = derive from topic slug dynamically
    filePrefix: 'think',
    naming: 'numbered',         // 'numbered' | 'named' | 'datetime'
    fileExtension: 'md',
  },
  defaultPattern: 'reverse_engineer',
  patterns: { /* define or override */ },
}
```

- **Dynamic output dir**: When `output.dir` is `null`, the output folder is derived from the topic name (sanitized slug, e.g., `./machine-learning`, `./debug-memory-leak`).
- **File prefix**: Files are named with numbered prefix: `1think.md`, `2think.md`, `3think.md`, ...
- **Naming modes**: `numbered` (default), `named` (e.g., `think-context.md`), `datetime` (e.g., `think-2026-05-11T10-00-00-context.md`)

## Available Patterns

### reverse_engineer (default)
Extract thinking steps from any AI response.
- Context & Framing → Analysis → Synthesis → Conclusion

### guided
Structured scientific reasoning.
- Observe → Question → Hypothesize → Test → Learn

### custom
User-defined steps (defined in config).
- Frame → Explore → Evaluate → Decide → Execute → Reflect

## Commands

| Command | Description |
|---------|------|------|
| `npx thinking-patterns generate <topic>` | Generate thinking patterns for a topic |
| `npx thinking-patterns analyze <file>` | Reverse-engineer thinking from an AI response file |
| `npx thinking-patterns list-patterns` | List available patterns |
| `npx thinking-patterns config` | Show current configuration |
| `npx thinking-patterns demo` | Run with sample data |

### Config flag

```bash
npx thinking-patterns generate "my topic" --config ./thinkingpatterns.nakprc.config.js
```

## When to Use This Skill

Use this skill when:

1. **Approaching a complex problem** — generate thinking patterns first to structure your approach before diving in
2. **Analyzing an AI response** — use `analyze` to reverse-engineer the reasoning behind an AI's answer
3. **Learning reasoning** — study the generated pattern files to understand structured thinking
4. **Planning implementation** — run thinking patterns on a design or spec before coding
5. **Debugging** — use the guided pattern (observe → question → hypothesize → test → learn) for systematic debugging

## How to Use

### For a new task or problem:

```bash
npx thinking-patterns generate "implement user authentication with JWT" \
  --config ./thinkingpatterns.nakprc.config.js
```

Then read the generated files:

```bash
cat machine-learning/1think.md
cat machine-learning/2think.md
# ... continue through each file
```

### For analyzing an existing AI response:

```bash
npx thinking-patterns analyze ./response.txt \
  --config ./thinkingpatterns.nakprc.config.js
```

### Use a different pattern:

```bash
npx thinking-patterns generate "debug memory leak" \
  --pattern guided \
  --config ./thinkingpatterns.nakprc.config.js
```

## Output Structure

Each run creates a **topic-derived output directory** (e.g., `./machine-learning/`):

```
machine-learning/
  index.md       — summary of all files
  1think.md      — Step 1 content
  2think.md      — Step 2 content
  3think.md      — Step 3 content
  ...
```

Each file contains:
- The thinking step label and description
- What the AI did in this step
- The thinking pattern applied
- Key insight
- Summary content

## Tips

- The output directory is **dynamic** — it derives from the topic name (sanitized slug). Override with `config.output.dir`.
- Use `named` naming mode for descriptive filenames: `think-context.md`, `think-analysis.md`
- Use `reverse_engineer` when you have an AI response to study
- Use `guided` for scientific/systematic investigation
- Use `custom` for domain-specific reasoning steps
- Combine with the `simplify` skill to review generated plans
- The config file is JS — you can add logic if needed (dynamic step counts, etc.)
