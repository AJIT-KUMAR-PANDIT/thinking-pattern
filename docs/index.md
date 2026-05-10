# thinking-patterns (nakprc) — Documentation

Complete documentation for the `thinking-patterns` CLI tool — a plug-and-play extension for generating sequential thinking pattern files to study and learn AI reasoning.

---

## Documentation Index

### Setup & Installation

| Doc | Description |
|-----|-----|
| [Setup Guide](setup/index.md) | Step-by-step setup: install, configure, verify |
| [Installation](../.nakprc/INSTALL.md) | Plug-and-play extensions for all platforms |

### Configuration

| Doc | Description |
|-----|-----|
| [Configuration Reference](config/index.md) | All config options: output, patterns, LLM, research |
| [Config File](../thinkingpatterns.nakprc.config.js) | The actual config file for your project |

### Patterns

| Doc | Description |
|-----|-----|
| [Patterns Reference](patterns/index.md) | All thinking patterns: reverse_engineer, guided, custom |

### API

| Doc | Description |
|-----|-----|
| [MCP API Reference](api/index.md) | All MCP tools: parameters, responses, error format |

### Extensions

| Doc | Description |
|-----|-----|
| [Extensions Reference](extensions/index.md) | All plug-and-play extension types: CLI, MCP, Skill, Rule, Setup |

### Research

| Doc | Description |
|-----|-----|
| [Research Summary](research/index.md) | Common AI reasoning patterns, theoretical foundations |
| [Research Paper](../research/thinking-patterns-paper.md) | Full academic paper on AI reasoning analysis |

---

## Quick Links

- **Install:** `npm i llm-thinking-patterns-nakprc`
- **Config:** `thinkingpatterns.nakprc.config.js`
- **Skill:** `.nakprc/skills/tp.nakprc.md`
- **Setup:** `npx tp-setup auto`
- **Help:** `npx thinking-patterns help`
- **MCP:** `node mcp-server.mjs`

---

## File Structure

```
thinking-patterns/
├── .nakprc/                      # Plug-and-play extensions
│   ├── manifest.json             # Extension manifest
│   ├── INSTALL.md                # Installation guide
│   ├── skills/tp.nakprc.md       # Claude Code skill
│   ├── claude-code/rules/        # Claude Code rule
│   ├── claude-desktop/           # Claude Desktop MCP config
│   ├── cursor/                   # Cursor MCP config
│   ├── windsurf/                 # Windsurf MCP config
│   └── installers/tp-setup.mjs   # IDE auto-detector
├── docs/                         # This documentation
│   ├── index.md                  # This file
│   ├── setup/index.md            # Setup guide
│   ├── config/index.md           # Configuration reference
│   ├── patterns/index.md         # Patterns reference
│   ├── api/index.md              # MCP API reference
│   ├── extensions/index.md       # Extensions reference
│   └── research/index.md         # Research summary
├── bin/thinking-patterns.mjs     # CLI
├── mcp-server.mjs                # MCP server
├── src/                          # Core library
│   ├── config.js                 # Config loader
│   ├── generator.js              # File generator
│   └── patterns/                 # Pattern definitions
├── research/                     # Research paper
├── thinkingpatterns.nakprc.config.js
├── package.json
└── README.md
```
