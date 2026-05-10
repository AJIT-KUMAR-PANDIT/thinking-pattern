# MCP API Reference

Complete API reference for the `thinking-patterns` MCP server (nakprc edition).

---

## Server

```
Name: thinking-patterns-nakprc
Version: 1.1.0
Protocol: MCP-over-stdio
```

---

## Tools

### `generate_thinking_patterns`

Generate sequential thinking pattern files for a given topic. Output directory is dynamic (derived from topic name).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------|
| `topic` | `string` | Yes | The topic or question to generate thinking patterns for |
| `pattern` | `string` | No | Pattern name: `reverse_engineer`, `guided`, or `custom` (defaults to configured default) |

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Generated 4 thinking pattern files for 'machine learning':\n\n✅ think1.md — Step 1: Context & Framing\n✅ think2.md — Step 2: Analysis\n✅ think3.md — Step 3: Synthesis\n✅ think4.md — Step 4: Conclusion\n\nOutput directory: ./machine-learning"
    }
  ]
}
```

---

### `analyze_ai_response`

Analyze an AI response text and extract the hidden thinking patterns into sequential files.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------|
| `response` | `string` | Yes | The full AI response text to analyze |
| `pattern` | `string` | No | Pattern to use for structuring the analysis |

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Analyzed AI response and generated 4 thinking pattern files:\n\n✅ think1.md — Step 1: Context & Framing\n✅ think2.md — Step 2: Analysis\n✅ think3.md — Step 3: Synthesis\n✅ think4.md — Step 4: Conclusion"
    }
  ]
}
```

---

### `list_patterns`

List all available thinking patterns with their steps.

**Parameters:** None

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Available patterns:\n\nreverse_engineer: Reverse Engineer AI Thinking (4 steps: Context & Framing, Analysis, Synthesis, Conclusion)\nguided: Guided Thinking (5 steps: Observe, Question, Hypothesize, Test, Learn)\ncustom: Custom Pattern (6 steps: Frame, Explore, Evaluate, Decide, Execute, Reflect)"
    }
  ]
}
```

---

### `view_thinking_files`

List all generated thinking pattern files in the output directory.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------|
| `directory` | `string` | No | Override the output directory (defaults to config or topic-derived) |

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Generated thinking files in ./machine-learning:\n\n1think.md\n2think.md\n3think.md\n4think.md\nindex.md"
    }
  ]
}
```

---

### `get_thinking_file`

Get the full content of a specific generated thinking file.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------|
| `fileName` | `string` | Yes | The thinking file name, e.g. `think1.md` or `think-context.md` |
| `directory` | `string` | No | Output directory (defaults to config or topic-derived) |

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "--- think1.md ---\n\n---\npattern: Reverse Engineer AI Thinking\nstep: context\nstep_number: 1\ntotal_steps: 4\ngenerated_at: 2026-05-11T10:00:00.000Z\n---\n\n# Step 1: Context & Framing\n\n> How the AI frames the problem\n...\n"
    }
  ]
}
```

---

### `get_config`

Show the current thinking-patterns configuration.

**Parameters:** None

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Current configuration:\n\ndefaultPattern: reverse_engineer\noutput dir: (dynamic)\nfile prefix: think\nnaming: numbered\npatterns: reverse_engineer, guided, custom"
    }
  ]
}
```

---

## Error Responses

All tools return errors in this format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: <error message>"
    }
  ],
  "isError": true
}
```

---

## Server Lifecycle

The server runs on stdio and does not exit. Start it with:

```bash
node mcp-server.mjs
```

The server logs startup to stderr:

```
thinking-patterns MCP server (nakprc) running on stdio
```
