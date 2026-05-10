# Configuration Reference

Full configuration options for `thinking-patterns` (nakprc edition).

---

## Config File

The config is stored in `thinkingpatterns.nakprc.config.js` at your project root:

```bash
# In your project root
thinkingpatterns.nakprc.config.js
```

---

## Configuration Options

### output

Controls how output files are generated.

| Option | Type | Default | Description |
|--------|------|---------|-------|
| `dir` | `string \| null` | `null` | Output directory. `null` = derive from topic slug dynamically |
| `filePrefix` | `string` | `'think'` | Prefix for generated files (e.g., `think1.md`) |
| `naming` | `string` | `'numbered'` | Naming convention: `'numbered'`, `'named'`, or `'datetime'` |
| `fileExtension` | `string` | `'md'` | File extension for generated files |
| `includeMetadata` | `boolean` | `true` | Include YAML frontmatter in generated files |
| `includeSummary` | `boolean` | `true` | Include summary section in each file |
| `summaryLength` | `string` | `'short'` | Summary length: `'short'`, `'medium'`, or `'long'` |
| `includeVisual` | `boolean` | `false` | Include a visual thinking map |

### defaultPattern

The pattern to use when `--pattern` is not specified.

| Option | Type | Default |
|--------|------|------|
| `defaultPattern` | `string` | `'reverse_engineer'` |

### patterns

Define or override thinking patterns.

```js
patterns: {
  <pattern_name>: {
    label: string,           // Display name
    description: string,     // What this pattern does
    steps: [                // The thinking steps
      {
        id: string,          // Unique identifier (used in filenames)
        label: string,       // Display name (used in headers)
        desc: string,        // One-line description
      },
      // ... more steps
    ],
  },
}
```

### llm

Optional LLM integration for per-step generation.

| Option | Type | Default | Description |
|--------|------|------|-------|
| `enabled` | `boolean` | `false` | Enable LLM-powered step generation |
| `provider` | `string` | `'openai'` | LLM provider: `'openai'`, `'anthropic'`, `'ollama'` |
| `model` | `string` | `'gpt-4o'` | Model to use |
| `systemPrompt` | `string` | — | System prompt for the LLM |
| `perStepPrompt` | `string` | — | Prompt for each thinking step |
| `maxTokens` | `number` | `2000` | Max tokens per step |
| `temperature` | `number` | `0.7` | LLM temperature |

### research

Research mode options for the output paper.

| Option | Type | Default | Description |
|--------|------|---------|-------|
| `enabled` | `boolean` | `false` | Enable research mode |
| `includeExamples` | `boolean` | `true` | Include examples in research output |
| `includeComparisons` | `boolean` | `true` | Include pattern comparisons |
| `includeReflections` | `boolean` | `true` | Include reflective insights |
| `paperFormat` | `boolean` | `true` | Output as formal research paper |

---

## Complete Example

```js
export default {
  output: {
    dir: null,                      // Dynamic (derived from topic)
    filePrefix: 'think',
    naming: 'numbered',             // 'numbered' | 'named' | 'datetime'
    fileExtension: 'md',
    includeMetadata: true,
    includeSummary: true,
    summaryLength: 'short',
    includeVisual: false,
  },

  defaultPattern: 'reverse_engineer',

  patterns: {
    reverse_engineer: {
      label: 'Reverse Engineer AI Thinking',
      description: 'Extract and expose thinking steps hidden in any AI response',
      steps: [
        { id: 'context', label: 'Context & Framing', desc: 'How the AI frames the problem' },
        { id: 'analysis', label: 'Analysis', desc: 'How the AI breaks down the problem' },
        { id: 'synthesis', label: 'Synthesis', desc: 'How the AI combines insights' },
        { id: 'conclusion', label: 'Conclusion', desc: 'How the AI reaches conclusions' },
      ],
    },
    guided: {
      label: 'Guided Thinking',
      description: 'Structured scientific reasoning pattern for learning how to think',
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
    systemPrompt: 'You are a thinking pattern generator.',
    perStepPrompt: 'Generate the next thinking step.',
    maxTokens: 2000,
    temperature: 0.7,
  },

  research: {
    enabled: false,
    includeExamples: true,
    includeComparisons: true,
    includeReflections: true,
    paperFormat: true,
  },
}
```
