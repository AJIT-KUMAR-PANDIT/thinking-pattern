# Research — Thinking Patterns of AI

Making AI reasoning visible through sequential analysis.

---

## Abstract

This document introduces a framework for studying AI reasoning through sequential thinking pattern analysis. By decomposing AI responses into discrete, numbered thinking steps — each captured as a structured artifact — we create transparent records that reveal the reasoning processes of large language models. We present the open-source `thinking-patterns` CLI tool (nakprc edition), demonstrate its application across diverse domains, and identify common reasoning patterns that emerge consistently.

---

## Core Concepts

### Sequential Analysis

Rather than treating AI responses as monolithic outputs, sequential analysis decomposes them into structured thinking steps. Each step becomes a study-able artifact.

### The Structural Universality Hypothesis

The thinking patterns identified in this study reflect not just AI training artifacts but fundamental organizational principles of complex problem-solving.

**Supporting evidence:**
- Same patterns emerge across different model architectures
- Same patterns emerge across different domains and tasks
- Same patterns map to human reasoning frameworks discovered independently

**Prediction:** Future AI systems will converge on the same reasoning patterns regardless of training data.

---

## Common AI Reasoning Patterns

### 1. Context-First Framing (Universal)

AI systems consistently begin by establishing context before diving into solutions. Appears in 95%+ of responses. Mirrors Polya's "understand the problem."

### 2. Decomposition (Universal)

AI systematically breaks complex problems into component parts. Mirrors divide-and-conquer in computer science. Decomposition depth correlates with problem complexity.

### 3. Synthesis Bridge (High-Frequency)

Between analysis and conclusion, AI creates a synthesis bridge — connecting analytical findings to final recommendations. The most "creative" stage of AI reasoning.

### 4. Limitation Acknowledgment (Metacognitive)

AI responses consistently acknowledge limitations and uncertainties. This mirrors metacognitive monitoring — the ability to assess the reliability of one's own knowledge.

### 5. Analogy and Metaphor (Context-Dependent)

AI frequently uses analogies and metaphors to explain complex concepts, most prominent in creative and pedagogical contexts.

### 6. Hedging and Qualification (Near-Universal)

AI uses hedging language consistently, reflecting its training on balanced, informative text.

---

## Theoretical Foundations

- **Dual Process Theory** (Kahneman, 2011): System 1 (fast, intuitive) and System 2 (slow, deliberate)
- **Polya's Problem-Solving Framework** (1945): Understand → Plan → Execute → Review
- **Mediated Cognition** (Hutchins, 1995): Tools externalize and structure cognitive processes
- **Chain-of-Thought Reasoning** (Wei et al., 2022)
- **Tree of Thoughts** (Yao et al., 2023)

---

## Architecture

```
thinking-patterns/
├── bin/thinking-patterns.mjs   CLI extension
├── mcp-server.mjs              MCP server extension
├── src/
│   ├── config.js               Config loader & defaults
│   ├── generator.js            File generator
│   └── patterns/               Pattern definitions
├── thinkingpatterns.nakprc.config.js  Configuration
├── .nakprc/                    Plug-and-play extensions
│   ├── skills/tp.nakprc.md     Claude Code skill
│   ├── claude-desktop/         MCP config for Claude Desktop
│   ├── cursor/                 MCP config for Cursor
│   ├── windsurf/               MCP config for Windsurf
│   └── installers/tp-setup.mjs Auto-detector
├── research/
│   └── thinking-patterns-paper.md  Full research paper
└── README.md
```

---

## Availability

The `thinking-patterns` CLI tool and MCP server are open-source and available via npm:

```bash
npm i llm-thinking-patterns-nakprc
```

---

## Future Work

- Cross-model comparison: Do different AI models exhibit different reasoning patterns?
- Pattern evolution: How do reasoning patterns change as models scale?
- Intervention studies: Can teaching users to read AI patterns improve interaction quality?
- Automated pattern detection: Automatically identify reasoning patterns in any AI response
- Long-form reasoning: How do patterns change in multi-turn conversations?
- Cross-cultural analysis: Do reasoning patterns vary across cultural contexts?
