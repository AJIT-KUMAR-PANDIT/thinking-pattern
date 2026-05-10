/**
 * Config loader — merges built-in defaults with user overrides.
 * Part of thinking-patterns — nakprc edition.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const DEFAULTS = {
  output: {
    dir: null,             // null = derive from topic slug
    filePrefix: 'think',
    naming: 'numbered',    // 'numbered' | 'named' | 'datetime'
    includeMetadata: true,
    includeSummary: true,
    summaryLength: 'short',
    includeVisual: false,
    fileExtension: 'md',
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
    custom: {
      label: 'Custom Pattern',
      description: 'Define your own thinking steps',
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
  llm: {
    enabled: false,
    provider: 'openai',
    model: 'gpt-4o',
    systemPrompt: 'You are a thinking pattern generator.',
    perStepPrompt: 'Based on the previous thinking step, generate the next step.',
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

function merge(a, b) {
  const out = { ...a }
  for (const key of Object.keys(b)) {
    if (b[key] && typeof b[key] === 'object' && !Array.isArray(b[key]) && a[key] && typeof a[key] === 'object') {
      out[key] = merge(a[key], b[key])
    } else {
      out[key] = b[key]
    }
  }
  return out
}

export function loadConfig(configPath) {
  let userConfig = {}
  if (configPath) {
    try {
      const raw = readFileSync(configPath, 'utf8')
      const code = raw.replace(/export\s+default\s*/, '')
      const fn = new Function(code + '; return fn()')
      userConfig = fn()
    } catch { /* fall through to defaults */ }
  }
  return merge(DEFAULTS, userConfig)
}

export function getDefaultConfig() {
  return loadConfig()
}

export { DEFAULTS }
