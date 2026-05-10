# Thinking Patterns Reference

All available thinking patterns for the `thinking-patterns` CLI (nakprc edition).

---

## Table of Contents

1. [reverse_engineer](#reverse_engineer)
2. [guided](#guided)
3. [custom](#custom)
4. [Pattern Comparison](#pattern-comparison)

---

## reverse_engineer

**Label:** Reverse Engineer AI Thinking  
**Description:** Extract and expose thinking steps hidden in any AI response

### Steps

| # | Step ID | Label | Description |
|---|---------|---|-------|
| 1 | `context` | Context & Framing | How the AI frames the problem |
| 2 | `analysis` | Analysis | How the AI breaks down the problem |
| 3 | `synthesis` | Synthesis | How the AI combines insights |
| 4 | `conclusion` | Conclusion | How the AI reaches conclusions |

### When to Use

- Analyzing an AI response to understand its reasoning structure
- Studying how AI approaches different problem types
- Learning to improve your own analytical thinking

### Example

```bash
npx thinking-patterns analyze ./response.txt
```

---

## guided

**Label:** Guided Thinking  
**Description:** Structured scientific reasoning pattern for learning how to think

### Steps

| # | Step ID | Label | Description |
|---|---------|-------|
| 1 | `observe` | Observe | What do we see? |
| 2 | `question` | Question | What are we unsure about? |
| 3 | `hypothesize` | Hypothesize | What could be true? |
| 4 | `test` | Test | How do we verify? |
| 5 | `learn` | Learn | What did we discover? |

### When to Use

- Systematic debugging sessions
- Scientific investigation
- Learning how to think through complex problems step by step

### Example

```bash
npx thinking-patterns generate "debug memory leak" --pattern guided
```

---

## custom

**Label:** Custom Pattern  
**Description:** Define your own thinking steps in the config

### Default Steps

| # | Step ID | Label | Description |
|---|---------|------|
| 1 | `frame` | Frame | Define the problem space |
| 2 | `explore` | Explore | Survey possible approaches |
| 3 | `evaluate` | Evaluate | Compare options |
| 4 | `decide` | Decide | Choose the best path |
| 5 | `execute` | Execute | Carry out the plan |
| 6 | `reflect` | Reflect | Review outcomes and learn |

### When to Use

- Domain-specific reasoning workflows
- Custom development processes
- Team-specific problem-solving frameworks

### Customization

Edit `thinkingpatterns.nakprc.config.js`:

```js
export default {
  patterns: {
    custom: {
      label: 'My Team Process',
      steps: [
        { id: 'plan', label: 'Plan', desc: 'Define scope and goals' },
        { id: 'build', label: 'Build', desc: 'Implement the solution' },
        { id: 'test', label: 'Test', desc: 'Validate the implementation' },
        { id: 'deploy', label: 'Deploy', desc: 'Ship to production' },
      ],
    },
  },
}
```

---

## Pattern Comparison

| Feature | reverse_engineer | guided | custom |
|---------|-------|------|----|
| Steps | 4 | 5 | 6+ (configurable) |
| Best for | Analysis | Scientific reasoning | Domain-specific |
| Input | AI response text | Topic description | Topic description |
| Flexibility | Fixed steps | Fixed steps | Fully configurable |
| Output dir | Dynamic | Dynamic | Dynamic |

---

## Output File Format

Each step generates a numbered file (`1think.md`, `2think.md`, etc.) with:

```yaml
---
pattern: <pattern_label>
step: <step_id>
step_number: <n>
total_steps: <total>
generated_at: <ISO-8601-timestamp>
---
```

Plus sections:
- **What the AI Did** — description of the step's action
- **Thinking Pattern** — the reasoning strategy
- **Key Insight** — critical insight from this step
- **Summary** — full content of this thinking step
