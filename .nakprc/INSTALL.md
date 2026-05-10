# thinking-patterns — Plug & Play Extensions

One-command setup for Claude Code, Claude Desktop, Cursor, Windsurf, and any MCP-compatible LLM client.

## Quick Install

```bash
# Install the CLI
npm i llm-thinking-patterns-nakprc

# Auto-detect and setup for your IDE
npx tp-setup auto
```

Or install manually for your platform below.

---

## 1. Claude Code

**For Claude Code (CLAUDE.md)** — add to your project's `CLAUDE.md`:

```markdown
## Thinking Patterns

Use `thinking-patterns` CLI to generate sequential thinking patterns before tackling complex problems:

\`\`\`bash
npx thinking-patterns generate "your topic" --config ./thinkingpatterns.nakprc.config.js
\`\`\`

Files are output to a topic-derived directory with numbered prefix:
- `1think.md` — Step 1
- `2think.md` — Step 2
- `3think.md` — Step 3
...

Install: npm i llm-thinking-patterns-nakprc
Config: thinkingpatterns.nakprc.config.js
Skill:  .nakprc/skills/tp.nakprc.md
```

**For Claude Code rules** — copy `.nakprc/claude-code/rules/thinking-patterns.md`:

```bash
cp .nakprc/claude-code/rules/thinking-patterns.md .claude/rules/tp.nakprc.md
```

---

## 2. Claude Desktop

Add to your Claude Desktop MCP config (`~/Library/Application Support/com.anthropic.clipboard/CLAUDE.md` or `~/.config/cline/mcp.json`):

```bash
cp .nakprc/claude-desktop/mcp-config-example.json ~/claude-desktop-mcp.json
```

Then edit the JSON to point to your project's `mcp-server.mjs`:

```json
{
  "mcpServers": {
    "thinking-patterns": {
      "command": "node",
      "args": ["/absolute/path/to/your/thinking-pattern/mcp-server.mjs"],
      "env": {}
    }
  }
}
```

**Tools exposed to Claude Desktop:**

| Tool | Purpose |
|------|-----|
| `generate_thinking_patterns` | Generate sequential thinking files for any topic |
| `analyze_ai_response` | Reverse-engineer thinking from AI response text |
| `list_patterns` | List available thinking patterns |
| `view_thinking_files` | List all generated thinking files |
| `get_thinking_file` | View content of a specific thinking file |
| `get_config` | Show current configuration |

---

## 3. Cursor

Add to your Cursor MCP config (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "thinking-patterns": {
      "command": "node",
      "args": ["/absolute/path/to/your/thinking-pattern/mcp-server.mjs"]
    }
  }
}
```

---

## 4. Windsurf

Add to your Windsurf MCP config (`~/.windsurf/mcp.json`):

```json
{
  "mcpServers": {
    "thinking-patterns": {
      "command": "node",
      "args": ["/absolute/path/to/your/thinking-pattern/mcp-server.mjs"]
    }
  }
}
```

---

## 5. VS Code + Continue

Add to your `.continue/config.yaml`:

```yaml
mcpServers:
  thinking-patterns:
    url: "stdio"
    command: "node"
    args:
      - "/absolute/path/to/your/thinking-pattern/mcp-server.mjs"
```

---

## 6. Cline

Add to your Cline MCP config (`~/.config/cline/mcp.json`):

```json
{
  "mcpServers": {
    "thinking-patterns": {
      "command": "node",
      "args": ["/absolute/path/to/your/thinking-pattern/mcp-server.mjs"]
    }
  }
}
```

---

## 7. Any MCP-Compatible Client

All you need is the MCP server. The `mcp-server.mjs` is self-contained and requires no external config.

```bash
node mcp-server.mjs
```

It speaks MCP-over-stdio. Connect it to any MCP host.

---

## Dynamic Output Directory

By default, the output directory is derived from the topic name (sanitized slug):

| Topic | Output Dir |
|-------|---------|
| "machine learning" | `./machine-learning/` |
| "debug memory leak" | `./debug-memory-leak/` |
| "explain quantum computing" | `./explain-quantum-computing/` |

Override in `thinkingpatterns.nakprc.config.js`:

```js
export default {
  output: {
    dir: './my-custom-output-dir',  // fixed override
  }
}
```

---

## File Naming

Files use numbered prefix by default:

| Mode | Example File |
|------|-----------|
| `numbered` (default) | `1think.md`, `2think.md`, `3think.md` |
| `named` | `think-context.md`, `think-analysis.md` |
| `datetime` | `think-2026-05-11T10-00-00-context.md` |

---

## Uninstall

```bash
npm uninstall llm-thinking-patterns-nakprc
rm -f thinkingpatterns.nakprc.config.js
# Remove MCP config entries from your IDE
```
