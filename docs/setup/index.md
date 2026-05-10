# Setup Guide

Step-by-step setup for `thinking-patterns` (nakprc edition).

---

## Step 1: Install the CLI

```bash
npm i llm-thinking-patterns-nakprc
```

This adds:
- `thinking-patterns` CLI command
- `tp-setup` auto-detector
- `mcp-server.mjs` for LLM integration
- `thinkingpatterns.nakprc.config.js` config loader

---

## Step 2: Create Config (optional)

Create `thinkingpatterns.nakprc.config.js` in your project root:

```bash
# Copy the default config
cp node_modules/llm-thinking-patterns-nakprc/thinkingpatterns.nakprc.config.js .

# Or write your own
touch thinkingpatterns.nakprc.config.js
```

See [docs/config/index.md](../config/index.md) for all options.

---

## Step 3: Try It

```bash
# Generate thinking patterns
npx thinking-patterns generate "machine learning basics"

# List the output
ls machine-learning-basics/
# → 1think.md  2think.md  3think.md  4think.md  index.md

# Analyze an AI response
npx thinking-patterns analyze ./response.txt
```

---

## Step 4: Set Up for Your IDE

### Auto-detect

```bash
npx tp-setup auto
```

### Manual

See [`.nakprc/INSTALL.md`](../../.nakprc/INSTALL.md) for platform-specific guides.

| Platform | Config File |
|----------|-------|
| Claude Desktop | `~/.config/cline/mcp.json` |
| Cursor | `~/.cursor/mcp.json` |
| Windsurf | `~/.windsurf/mcp.json` |
| VS Code + Continue | `.continue/config.yaml` |
| Cline | `~/.config/cline/mcp.json` |

---

## Step 5: Install the Skill (for Claude Code)

Copy the skill file to your project:

```bash
mkdir -p .claude/skills/thinking-patterns
cp .nakprc/skills/tp.nakprc.md .claude/skills/thinking-patterns/tp.nakprc.md
```

---

## Verification

```bash
# Test CLI
npx thinking-patterns help

# Test patterns
npx thinking-patterns list-patterns

# Test demo
npx thinking-patterns demo

# Test MCP server (in a separate terminal)
node mcp-server.mjs
```
