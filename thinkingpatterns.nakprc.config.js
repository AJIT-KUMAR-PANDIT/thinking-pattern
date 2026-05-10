// thinking-patterns Configuration
// Everything that controls the tool is here.

export default {
  // ─── Output ───────────────────────────────────────────────
  output: {
    dir: './thinking-patterns',
    filePrefix: 'think',
    naming: 'numbered',       // 'numbered' | 'named' | 'datetime'
    includeMetadata: true,
    includeSummary: true,
    summaryLength: 'short',  // 'short' | 'medium' | 'long'
    includeVisual: false,     // include a visual thinking map
    fileExtension: 'md',
  },

  // ─── Thinking Patterns ────────────────────────────────────

  // Default pattern to use when none specified
  defaultPattern: 'reverse_engineer',

  // Available patterns
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

    custom: {
      label: 'Custom Pattern',
      description: 'Define your own thinking steps in the config below',
      steps: [
        { id: 'frame', label: 'Frame', desc: 'Define the problem space' },
        { id: 'explore', label: 'Explore', desc: 'Survey possible approaches' },
        { id: 'evaluate', label: 'Evaluate', desc: 'Compare options' },
        { id: 'decide', label: 'Decide', desc: 'Choose the best path' },
        { id: 'execute', label: 'Execute', desc: 'Carry out the plan' },
        { id: 'reflect', label: 'Reflect', desc: 'Review outcomes and learn' },
      ],
    },
  },

  // ─── LLM Integration (Optional) ───────────────────────────
  llm: {
    enabled: false,
    provider: 'openai',       // 'openai' | 'anthropic' | 'ollama'
    model: 'gpt-4o',
    systemPrompt:
      'You are a thinking pattern generator. Your job is to simulate how an AI would reason through a problem step by step. Show your thinking clearly and explicitly.',
    perStepPrompt:
      'Based on the previous thinking step, generate the next step in the reasoning chain. Show your explicit reasoning process.',
    maxTokens: 2000,
    temperature: 0.7,
  },

  // ─── Research Mode ────────────────────────────────────────
  research: {
    enabled: false,
    includeExamples: true,
    includeComparisons: true,
    includeReflections: true,
    paperFormat: true,
  },
}
