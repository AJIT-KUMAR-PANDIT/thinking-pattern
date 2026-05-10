# thinking-patterns (nakprc)

Generate sequential thinking pattern files to study and learn AI reasoning patterns.

🧠 See each AI reasoning step as a numbered file: `1think.md`, `2think.md`, `3think.md`...

## Quick Install

```bash
npm i llm-thinking-patterns-nakprc
```

## Quick Start

```bash
# Generate thinking patterns for any topic
npx thinking-patterns generate "explain quantum computing"

# Analyze an AI response file
npx thinking-patterns analyze response.txt

# Demo with sample data
npx thinking-patterns demo

# List available patterns
npx thinking-patterns list-patterns
```

## Output

Each run creates a **topic-derived output directory** (dynamic slug) with numbered files:

```
machine-learning/           ← derived from "machine learning"
├── 1think.md   # Context & Framing
├── 2think.md   # Analysis
├── 3think.md   # Synthesis
├── 4think.md   # Conclusion
└── index.md    # Summary of all files
```

## Configuration

Everything is controlled by `thinkingpatterns.nakprc.config.js`:

```js
export default {
  output: {
    dir: null,                // null = dynamic (derived from topic)
    filePrefix: 'think',
    naming: 'numbered',       // 'numbered' | 'named' | 'datetime'
  },

  defaultPattern: 'reverse_engineer',

  patterns: {
    reverse_engineer: {
      label: 'Reverse Engineer AI Thinking',
      steps: [
        { id: 'context', label: 'Context & Framing', desc: 'How the AI frames the problem' },
        { id: 'analysis', label: 'Analysis', desc: 'How the AI breaks down the problem' },
        { id: 'synthesis', label: 'Synthesis', desc: 'How the AI combines insights' },
        { id: 'conclusion', label: 'Conclusion', desc: 'How the AI reaches conclusions' },
      ],
    },
    guided: {
      label: 'Guided Thinking',
      steps: [
        { id: 'observe', label: 'Observe', desc: 'What do we see?' },
        { id: 'question', label: 'Question', desc: 'What are we unsure about?' },
        { id: 'hypothesize', label: 'Hypothesize', desc: 'What could be true?' },
        { id: 'test', label: 'Test', desc: 'How do we verify?' },
        { id: 'learn', label: 'Learn', desc: 'What did we discover?' },
      ],
    },
  },

  llm: {
    enabled: false,
    provider: 'openai',
    model: 'gpt-4o',
  },
}
```

## CLI Commands

| Command | Description |
|---------|------|
| `generate <topic>` | Generate thinking patterns for a topic |
| `analyze <file>` | Reverse-engineer thinking from an AI response file |
| `list-patterns` | List all available thinking patterns |
| `config` | Show current configuration |
| `demo` | Run with sample data |

## Available Patterns

- **reverse_engineer** — Extract and expose thinking steps hidden in any AI response
- **guided** — Structured scientific reasoning (observe → question → hypothesize → test → learn)
- **custom** — Define your own thinking steps

## Output Directory Behavior

By default, the output directory is **dynamic** — derived from the topic name:

| Topic | Output Directory |
|-------|-------|
| "machine learning" | `./machine-learning/` |
| "debug memory leak" | `./debug-memory-leak/` |
| "explain quantum" | `./explain-quantum/` |

Override with `config.output.dir` for a fixed directory.

## File Naming

Files use numbered prefix by default:

| Naming Mode | Example |
|-------------|------|
| `numbered` (default) | `1think.md`, `2think.md`, `3think.md` |
| `named` | `think-context.md`, `think-analysis.md` |
| `datetime` | `think-2026-05-11T10-00-00-context.md` |

## Plug & Play Extension

One-command setup for Claude Code, Claude Desktop, Cursor, Windsurf, and any MCP-compatible LLM.

```bash
# Auto-detect your IDE and configure
npx tp-setup auto

# Or specify your IDE
npx tp-setup claude-desktop
npx tp-setup cursor
npx tp-setup windsurf
```

See [`.nakprc/INSTALL.md`](.nakprc/INSTALL.md) for full installation guides for each platform.

## MCP Server (for LLMs)

Connect this to any MCP-compatible client (Claude Desktop, Cursor, Windsurf, etc.) so LLMs can automatically generate thinking patterns.

**Add to your MCP config:**

```json
{
  "mcpServers": {
    "thinking-patterns": {
      "command": "node",
      "args": ["/path/to/thinking-pattern/mcp-server.mjs"]
    }
  }
}
```

**Tools exposed to connected LLMs:**

| Tool | Description |
|------|--|
| `generate_thinking_patterns` | Generate sequential files (1think.md, 2think.md...) for any topic |
| `analyze_ai_response` | Reverse-engineer thinking from any AI response text |
| `list_patterns` | List all available patterns |
| `view_thinking_files` | List all generated thinking files |
| `get_thinking_file` | View content of a specific thinking file |
| `get_config` | Show current configuration |

## Research

This tool is based on research into AI reasoning patterns. Read the full paper: [research/thinking-patterns-paper.md](research/thinking-patterns-paper.md)

**"Thinking Patterns of AI: Making AI Reasoning Visible Through Sequential Analysis"**

## License

MIT
