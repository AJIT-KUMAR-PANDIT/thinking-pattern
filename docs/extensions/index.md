# Extensions Reference

All plug-and-play extension options for `thinking-patterns` (nakprc edition).

---

## 1. CLI Extension (Built-in)

The CLI is the primary extension — run it anywhere with `npx`:

```bash
npx thinking-patterns generate "your topic"
npx thinking-patterns analyze ./file.txt
npx thinking-patterns list-patterns
npx thinking-patterns config
npx thinking-patterns demo
```

No installation needed when using `npx`.

---

## 2. MCP Server Extension

Self-contained MCP server for LLM integration.

**File:** `mcp-server.mjs`  
**Protocol:** MCP-over-stdio  
**Port:** None (stdio-based)

### Start

```bash
node mcp-server.mjs
```

### Exposed Tools

| Tool | Parameters | Purpose |
|------|------------|-------|
| `generate_thinking_patterns` | `topic: string, pattern?: string` | Generate sequential files for any topic |
| `analyze_ai_response` | `response: string, pattern?: string` | Reverse-engineer thinking from AI text |
| `list_patterns` | _none_ | List available thinking patterns |
| `view_thinking_files` | `directory?: string` | List all generated thinking files |
| `get_thinking_file` | `fileName: string, directory?: string` | View a specific thinking file |
| `get_config` | _none_ | Show current configuration |

### Connect to LLMs

Any MCP-compatible host can connect to the server. See [`.nakprc/INSTALL.md`](../../.nakprc/INSTALL.md) for platform-specific setup.

---

## 3. Claude Code Skill Extension

**File:** `.nakprc/skills/tp.nakprc.md`

Installs as a Claude Code skill that teaches the agent when and how to use thinking patterns.

### Install

```bash
mkdir -p .claude/skills/thinking-patterns
cp .nakprc/skills/tp.nakprc.md .claude/skills/thinking-patterns/tp.nakprc.md
```

### Trigger

The skill activates when:
- Approaching a complex problem
- Analyzing an AI response
- Planning implementation
- Debugging systematically

---

## 4. Claude Code Rule Extension

**File:** `.nakprc/claude-code/rules/thinking-patterns.md`

Rule file for Claude Code that auto-triggers thinking patterns before complex tasks.

### Install

```bash
mkdir -p .claude/rules
cp .nakprc/claude-code/rules/thinking-patterns.md .claude/rules/tp.nakprc.md
```

---

## 5. Setup Auto-Detector

**File:** `.nakprc/installers/tp-setup.mjs`

Auto-detects your IDE and configures MCP connection.

### Usage

```bash
npx tp-setup auto        # Auto-detect IDE
npx tp-setup claude-desktop
npx tp-setup cursor
npx tp-setup windsurf
npx tp-setup cline
npx tp-setup vscode
```

---

## 6. Config Extension

**File:** `thinkingpatterns.nakprc.config.js`

Every aspect of the tool is configurable:
- Output directory (fixed or dynamic)
- File naming (numbered, named, datetime)
- File extension (md, think, txt, etc.)
- Patterns (add custom patterns)
- LLM integration (optional per-step generation)
- Research mode (enable paper generation)

---

## 7. Research Paper Extension

**File:** `research/thinking-patterns-paper.md`

Academic paper on AI reasoning patterns, including:
- Theoretical foundations (dual process theory, Polya's framework, mediated cognition)
- Related work (CoT, Tree of Thoughts, XAI)
- Common AI reasoning patterns discovered through analysis
- The Structural Universality Hypothesis
- References and future work

---

## Extension Architecture

```
thinking-patterns/
├── .nakprc/                  # Plug-and-play extensions
│   ├── manifest.json          # Extension manifest
│   ├── INSTALL.md             # Installation guide
│   ├── skills/
│   │   └── tp.nakprc.md     # Claude Code skill
│   ├── claude-code/
│   │   └── rules/
│   │       └── thinking-patterns.md
│   ├── claude-desktop/
│   │   └── mcp-config-example.json
│   ├── cursor/
│   │   └── cursor-mcp-config.json
│   ├── windsurf/
│   │   └── windsurf-mcp-config.json
│   └── installers/
│       └── tp-setup.mjs      # Auto-detector
├── docs/
│   ├── config/               # Configuration reference
│   ├── setup/                # Setup guide
│   ├── patterns/             # Pattern reference
│   ├── api/                  # MCP API reference
│   └── extensions/           # This file
├── bin/thinking-patterns.mjs  # CLI extension
├── mcp-server.mjs            # MCP server extension
└── src/                      # Core library
    ├── config.js             # Config loader
    ├── generator.js          # File generator
    └── patterns/             # Pattern definitions
        ├── reverse-engineer.js
        ├── guided.js
        └── custom.js
```
