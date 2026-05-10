#!/usr/bin/env node

/**
 * thinking-patterns CLI — nakprc edition
 * Generate sequential thinking pattern files to study AI reasoning.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileSync, readFileSync, mkdirSync, readdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ── Minimal CLI parser (no dependencies) ──────

function parseArgs(argv) {
  const args = { _: [], config: null, pattern: null }
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        args[key] = next
        i++
      } else {
        args[key] = true
      }
    } else if (arg.startsWith('-')) {
      args[arg.slice(1)] = true
    } else {
      args._.push(arg)
    }
  }
  return args
}

// ── Config loader ──

async function loadConfig(configPath) {
  const DEFAULTS = {
    output: { dir: null, filePrefix: 'think', naming: 'numbered', includeMetadata: true, includeSummary: true, summaryLength: 'short', includeVisual: false, fileExtension: 'md' },
    defaultPattern: 'reverse_engineer',
    patterns: {
      reverse_engineer: { label: 'Reverse Engineer AI Thinking', description: 'Extract thinking steps from an AI response', steps: [{ id: 'context', label: 'Context & Framing', desc: 'How the AI frames the problem' }, { id: 'analysis', label: 'Analysis', desc: 'How the AI breaks down the problem' }, { id: 'synthesis', label: 'Synthesis', desc: 'How the AI combines insights' }, { id: 'conclusion', label: 'Conclusion', desc: 'How the AI reaches conclusions' }] },
      guided: { label: 'Guided Thinking', description: 'Structured scientific reasoning pattern', steps: [{ id: 'observe', label: 'Observe', desc: 'What do we see?' }, { id: 'question', label: 'Question', desc: 'What are we unsure about?' }, { id: 'hypothesize', label: 'Hypothesize', desc: 'What could be true?' }, { id: 'test', label: 'Test', desc: 'How do we verify?' }, { id: 'learn', label: 'Learn', desc: 'What did we discover?' }] },
      custom: { label: 'Custom Pattern', description: 'Define your own thinking steps', steps: [{ id: 'frame', label: 'Frame', desc: 'Define the problem space' }, { id: 'explore', label: 'Explore', desc: 'Survey approaches' }, { id: 'evaluate', label: 'Evaluate', desc: 'Compare options' }, { id: 'decide', label: 'Decide', desc: 'Choose the best path' }, { id: 'execute', label: 'Execute', desc: 'Carry out the plan' }, { id: 'reflect', label: 'Reflect', desc: 'Review and learn' }] },
    },
    llm: { enabled: false, provider: 'openai', model: 'gpt-4o', systemPrompt: '', perStepPrompt: '', maxTokens: 2000, temperature: 0.7 },
    research: { enabled: false, includeExamples: true, includeComparisons: true, includeReflections: true, paperFormat: true },
  }

  let userConfig = {}
  function parseConfig(raw) {
    let code = raw
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\s*export\s+default\s*/g, '')
      .trim()
    const fn = new Function('return (' + code + ')')
    return fn()
  }
  if (configPath) {
    try { userConfig = parseConfig(readFileSync(configPath, 'utf8')) } catch { /* use defaults */ }
  } else {
    try { userConfig = parseConfig(readFileSync(join(root, 'thinkingpatterns.nakprc.config.js'), 'utf8')) } catch { /* use defaults */ }
  }

  const merged = { ...DEFAULTS, ...userConfig }
  merged.output = { ...DEFAULTS.output, ...(userConfig.output || {}) }
  merged.patterns = { ...DEFAULTS.patterns, ...(userConfig.patterns || {}) }
  merged.llm = { ...DEFAULTS.llm, ...(userConfig.llm || {}) }
  merged.research = { ...DEFAULTS.research, ...(userConfig.research || {}) }

  if (userConfig.patterns) {
    for (const key of Object.keys(userConfig.patterns)) {
      if (!merged.patterns[key]) {
        merged.patterns[key] = userConfig.patterns[key]
      } else {
        merged.patterns[key] = { ...merged.patterns[key], ...userConfig.patterns[key] }
      }
    }
  }

  return merged
}

// ── Dynamic output dir from topic ──

function topicToSlug(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'thinking'
}

function resolveOutputDir(config, topic) {
  if (config.output?.dir) return config.output.dir
  return `./${topicToSlug(topic)}`
}

// ── Patterns ──

function describeAIAction(stepId) {
  const map = {
    context: 'The AI establishes context by identifying the core question, scope, and boundaries of the problem.',
    analysis: 'The AI breaks the problem into components, identifying factors, dependencies, and constraints.',
    synthesis: 'The AI connects insights from analysis, finding patterns and relationships across observations.',
    conclusion: 'The AI draws conclusions, articulates position, acknowledges limitations, and suggests next steps.',
    observe: 'The AI carefully examines the situation, identifying what is present, absent, notable, and worth considering.',
    question: 'The AI identifies knowledge gaps and formulates the critical questions that guide inquiry.',
    hypothesize: 'The AI generates multiple plausible explanations and ranks them by likelihood.',
    test: 'The AI designs verification approaches and considers what evidence would confirm or refute hypotheses.',
    learn: 'The AI extracts actionable insights and connects them to broader understanding.',
    frame: 'The AI defines the problem space, establishing the boundaries and key dimensions of the issue.',
    explore: 'The AI surveys possible approaches, mapping the solution space.',
    evaluate: 'The AI compares options systematically, weighing trade-offs and constraints.',
    decide: 'The AI makes a reasoned choice based on the evaluation, articulating the rationale.',
    execute: 'The AI carries out the chosen plan with attention to detail and potential pitfalls.',
    reflect: 'The AI reviews outcomes, extracts lessons, and identifies improvements.',
  }
  return map[stepId] || `The AI applies ${stepId} reasoning.`
}

function generateThinkingPattern(stepId, topic) {
  return `This step applies **${stepId} reasoning** to understand ${topic}. The AI's thinking follows a structured pattern:\n\n1. **Start with known facts**: Anchor in established information\n2. **Identify gaps**: Note what needs discovery\n3. **Apply inference**: Move logically from known to unknown\n4. **Check consistency**: Verify the reasoning holds together\n5. **Extract signal**: Separate important insights from noise`
}

function findKeyInsight(content, stepId) {
  if (!content || content.length < 30) {
    return `Key insight from the ${stepId} step reveals the structure of AI reasoning.`
  }
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 40)
  if (sentences.length > 0) return sentences[0].trim() + '.'
  return content.slice(0, 200) + '..'
}

function generateStepContent(stepId, topic, index, total) {
  const templates = {
    context: [
      `To understand ${topic}, we first need to establish the problem space. The core challenge here is balancing clarity with depth — covering essential aspects without getting lost in details.`,
    ],
    analysis: [
      `Breaking down ${topic}, several key dimensions emerge. We need to understand the foundational concepts, examine practical implications, and consider limitations.`,
    ],
    synthesis: [
      `Bringing these observations together about ${topic}, a clearer picture emerges. Key patterns suggest that the underlying structure is more interconnected than it appears.`,
    ],
    conclusion: [
      `Our exploration of ${topic} reveals key insights. The most important finding is that understanding requires looking beyond surface observations to underlying patterns.`,
    ],
    observe: [
      `Looking carefully at ${topic}, several things stand out. The most notable observation is the complexity hidden beneath apparent simplicity.`,
    ],
    question: [
      `From our observations about ${topic}, critical questions emerge. What assumptions are we making? What are we missing?`,
    ],
    hypothesize: [
      `Guided by our questions, several hypotheses about ${topic} emerge. The leading one suggests that the core mechanism operates through layered reasoning.`,
    ],
    test: [
      `To evaluate these hypotheses about ${topic}, we need concrete tests. The strongest approach examines the prediction most likely to fail.`,
    ],
    learn: [
      `Through this process with ${topic}, the key insight is that rigorous thinking requires disciplined attention to each reasoning step.`,
    ],
  }

  if (templates[stepId]) return templates[stepId][index % templates[stepId].length]

  const intros = [
    `Thinking through this ${stepId} step for ${topic}:`,
    `In the ${stepId} phase of reasoning about ${topic}:`,
    `For the ${stepId} step in understanding ${topic}:`,
  ]
  return `${intros[index % intros.length]} This step reveals how AI reasoning progresses through structured stages.`
}

// ── Generator ──

function renderStep(step, index, total, pattern, config) {
  return `---
pattern: ${pattern.label}
step: ${step.id}
step_number: ${index + 1}
total_steps: ${total}
generated_at: ${new Date().toISOString()}
---

# Step ${index + 1}: ${step.label}

> ${step.desc}

## What the AI Did

${step.whatDone}

## Thinking Pattern

${step.thinkingPattern}

## Key Insight

${step.keyInsight}

## Summary

${step.content}
`
}

function generateFiles(steps, pattern, config, topic) {
  const outputDir = resolveOutputDir(config, topic)
  const filePrefix = config.output?.filePrefix || 'think'
  const naming = config.output?.naming || 'numbered'
  const fileExtension = config.output?.fileExtension || 'md'

  mkdirSync(outputDir, { recursive: true })
  const ext = fileExtension || 'md'
  const files = []

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    let fileName
    if (naming === 'named') {
      fileName = `${filePrefix}-${step.id}.${ext}`
    } else if (naming === 'datetime') {
      const dt = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      fileName = `${filePrefix}-${dt}-${step.id}.${ext}`
    } else {
      fileName = `${filePrefix}${i + 1}.${ext}`
    }
    const filePath = join(outputDir, fileName)
    const content = renderStep(step, i, steps.length, pattern, config)
    writeFileSync(filePath, content, 'utf8')
    files.push({ path: filePath, name: fileName, step: step.label, stepNumber: i + 1 })
  }

  // Index
  const indexContent = `# Thinking Patterns: ${topic}\n\n` +
    `Generated: ${new Date().toISOString()}\n` +
    `Pattern: ${pattern.label}\n` +
    `Output: ${outputDir}\n` +
    `Steps: ${steps.length}\n\n` +
    `## Files\n\n` +
    files.filter(f => f.stepNumber > 0).map((f) => `- [${f.name}](./${f.name}) — Step ${f.stepNumber}: ${f.step}`).join('\n') +
    `\n\n---\n*Generated by thinking-patterns — nakprc*\n`
  writeFileSync(join(outputDir, `index.${ext}`), indexContent, 'utf8')

  return files
}

// ── Sample AI response ──

const SAMPLE_RESPONSE = `Quantum computing represents a fundamental shift in how we process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or qubits, which can exist in superposition — representing both 0 and 1 simultaneously.

This has profound implications. For cryptography, quantum computers could break current encryption methods like RSA, which rely on the difficulty of factoring large numbers. Shor's algorithm demonstrates this threat by showing how a quantum computer could factor large numbers exponentially faster than classical algorithms.

However, quantum computing isn't just about breaking things. It offers new possibilities for optimization problems, drug discovery, material science, and machine learning. Quantum algorithms like Grover's search algorithm provide quadratic speedup for unstructured search problems.

The challenges are significant. Qubits are extremely fragile and prone to decoherence — losing their quantum state due to environmental interference. Error correction in quantum computing requires many physical qubits to create one logical qubit, making current systems limited in scale.

Despite these challenges, major progress is being made. IBM, Google, and others have built increasingly powerful quantum processors. The race is on for "quantum advantage" — the point where quantum computers solve practical problems faster than the best classical algorithms.`

// ── CLI Commands ──

async function cmdGenerate(args, config) {
  const topic = args._.length > 0 ? args._.join(' ') : 'general reasoning'
  const patternName = config.defaultPattern
  const pattern = config.patterns[patternName]

  if (!pattern) {
    console.error(`Pattern "${patternName}" not found.`)
    return
  }

  const outputDir = resolveOutputDir(config, topic)

  console.log(`\n🧠 thinking-patterns (nakprc)`)
  console.log(`   Pattern:  ${pattern.label}`)
  console.log(`   Topic:    ${topic}`)
  console.log(`   Output:   ${outputDir}`)
  console.log(`   Prefix:   ${config.output?.filePrefix || 'think'}1, think2, think3...\n`)

  const input = args._.length > 0 ? args._.join(' ') : SAMPLE_RESPONSE

  const steps = pattern.steps.map((step, i) => ({
    ...step,
    whatDone: describeAIAction(step.id),
    thinkingPattern: generateThinkingPattern(step.id, topic),
    keyInsight: findKeyInsight(input, step.id),
    content: generateStepContent(step.id, topic, i, pattern.steps.length),
  }))

  const files = await generateFiles(steps, pattern, config, topic)

  console.log(`Generated ${files.filter(f => f.stepNumber > 0).length} thinking pattern files:\n`)
  files.forEach((f) => {
    if (f.stepNumber > 0) console.log(`   ✅ ${f.name} — Step ${f.stepNumber}: ${f.step}`)
  })
  console.log(`\n📁 Output directory: ${outputDir}\n`)
}

async function cmdAnalyze(args, config) {
  const filePath = args._.length > 0 ? args._[0] : null
  const input = filePath ? readFileSync(filePath, 'utf8') : SAMPLE_RESPONSE
  const patternName = config.defaultPattern
  const pattern = config.patterns[patternName]

  if (!pattern) {
    console.error(`Pattern "${patternName}" not found.`)
    return
  }

  const outputDir = resolveOutputDir(config, 'analyzed-response')

  console.log(`\n🔍 Analyzing AI response...\n`)

  const sections = input.split(/\n\n+/).filter((s) => s.trim())
  const steps = pattern.steps.map((step, i) => {
    const section = sections[i] || sections[sections.length - 1] || ''
    return {
      ...step,
      whatDone: describeAIAction(step.id),
      thinkingPattern: generateThinkingPattern(step.id, input.slice(0, 100)),
      keyInsight: section.split(/[.!?]+/).filter((s) => s.trim().length > 40)[0]?.trim() + '.' || 'Key insight from analysis.',
      content: section.trim().slice(0, 500) + (section.trim().length > 500 ? '..' : ''),
    }
  })

  const files = await generateFiles(steps, pattern, config, 'Analyzed AI Response')

  console.log(`Generated ${files.filter(f => f.stepNumber > 0).length} thinking pattern files:\n`)
  files.forEach((f) => {
    if (f.stepNumber > 0) console.log(`   ✅ ${f.name} — Step ${f.stepNumber}: ${f.step}`)
  })
  console.log(`\n📁 Output directory: ${outputDir}\n`)
}

async function cmdListPatterns(args, config) {
  console.log(`\n📋 Available Thinking Patterns\n` + '═'.repeat(40) + '\n')
  for (const [key, pattern] of Object.entries(config.patterns)) {
    const count = pattern.steps?.length || 0
    console.log(`  ${key}`)
    console.log(`    ${pattern.label}`)
    console.log(`    ${pattern.description}`)
    console.log(`    ${count} steps: ${pattern.steps?.map(s => s.label).join(', ') || '—'}\n`)
  }
}

async function cmdConfig(args, config) {
  const outputDir = config.output?.dir || '(dynamic — derived from topic)'
  console.log(`\n⚙️  Current Configuration\n` + '═'.repeat(40) + '\n')
  console.log(`  Default pattern: ${config.defaultPattern}`)
  console.log(`  Output dir:      ${outputDir}`)
  console.log(`  File prefix:     ${config.output?.filePrefix || 'think'}`)
  console.log(`  Naming:          ${config.output?.naming || 'numbered'}`)
  console.log(`  File extension:  ${config.output?.fileExtension || 'md'}`)
  console.log(`  LLM enabled:     ${config.llm?.enabled}`)
  console.log(`\n  Patterns (${Object.keys(config.patterns).length}):\n`)
  for (const key of Object.keys(config.patterns)) {
    console.log(`    - ${key}: ${config.patterns[key].label}`)
  }
  console.log()
}

async function cmdDemo(args, config) {
  console.log(`\n🎬 Demo: Generating thinking patterns from a sample AI response...\n`)
  await cmdGenerate({ _: [SAMPLE_RESPONSE] }, config)
}

// ── Main ──

async function main() {
  const args = parseArgs(process.argv)
  const command = args._[0] || 'help'
  const configPath = args.config || args.configPath || null
  const config = await loadConfig(configPath)

  const commands = {
    generate: cmdGenerate,
    analyze: cmdAnalyze,
    'list-patterns': cmdListPatterns,
    config: cmdConfig,
    demo: cmdDemo,
    help: () => {
      console.log(`
🧠 thinking-patterns (nakprc) v1.1.0
Generate sequential thinking pattern files to study AI reasoning.

Usage:
  thinking-patterns generate <topic>          Generate thinking patterns for a topic
  thinking-patterns analyze <file>            Analyze an AI response file
  thinking-patterns list-patterns             List available thinking patterns
  thinking-patterns config                    Show current configuration
  thinking-patterns demo                      Run with sample data
  thinking-patterns help                      Show this help

Options:
  --config <path>   Path to config file (default: ./thinkingpatterns.nakprc.config.js)
  --pattern <name>  Override default pattern (reverse_engineer | guided | custom)

Patterns:
  reverse_engineer  Extract thinking steps from any AI response
  guided            Structured scientific reasoning pattern
  custom            User-defined thinking steps

Output:
  Files use numbered prefix: 1think.md, 2think.md, 3think.md, ...
  Output directory is dynamic — derived from the topic name (sanitized slug).
  Override with config.output.dir.

Examples:
  thinking-patterns generate "explain machine learning"
  thinking-patterns analyze response.txt --pattern guided
  thinking-patterns demo
`)
    },
  }

  if (commands[command]) {
    await commands[command](args, config)
  } else {
    console.error(`Unknown command: ${command}`)
    console.error('Run "thinking-patterns help" for usage.')
    process.exit(1)
  }
}

main().catch(console.error)
