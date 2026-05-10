# tp.nakprc — Claude Code Rule

## When to use

Before any complex task (multi-step implementation, architecture decision, debugging session):

1. Generate thinking patterns: `npx thinking-patterns generate "<task>" --config ./thinkingpatterns.nakprc.config.js`
2. Read the generated files (`1think.md`, `2think.md`, etc.)
3. Use the thinking structure as a planning scaffold

## How it works

- Generates numbered thinking files (`1think.md`, `2think.md`, ...)
- Output directory is dynamic — derived from the task name (e.g., `./user-auth/` for "implement user auth")
- Each file represents one thinking step with metadata, pattern, key insight, and summary
- Default pattern: `reverse_engineer` (context → analysis → synthesis → conclusion)
