/**
 * Reverse engineer pattern — extracts thinking steps from AI response text.
 * Part of thinking-patterns — nakprc edition.
 */

function topicToSlug(topic) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'thinking'
}

function resolveOutputDir(config, topic) {
  if (config.output?.dir) return config.output.dir
  return `./${topicToSlug(topic)}`
}

export function extractThinkingSteps(response, config) {
  const pattern = config.patterns[config.defaultPattern] || config.patterns.reverse_engineer
  const steps = pattern.steps

  const sections = splitIntoSections(response)

  const mappedSteps = steps.map((step, i) => {
    const section = sections[i] || sections[sections.length - 1]
    return {
      ...step,
      content: section?.text || '',
      whatDone: describeAIAction(step.id, section?.text || ''),
      thinkingPattern: extractPattern(step.id, section?.text || ''),
      keyInsight: findKeyInsight(section?.text || ''),
    }
  })

  return mappedSteps
}

export function generateFromTopic(topic, config) {
  const pattern = config.patterns[config.defaultPattern] || config.patterns.reverse_engineer

  return pattern.steps.map((step, i) => ({
    ...step,
    content: generateStepContent(step, topic, i, pattern.steps.length),
    whatDone: describeAIAction(step.id, topic),
    thinkingPattern: generateThinkingPattern(step, topic, i),
    keyInsight: generateKeyInsight(step, topic),
  }))
}

function splitIntoSections(response) {
  const parts = response.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)
  const minSections = 4
  if (parts.length < minSections) {
    const charsPerSection = Math.ceil(response.length / minSections)
    const sections = []
    for (let i = 0; i < minSections; i++) {
      sections.push({ text: response.slice(i * charsPerSection, (i + 1) * charsPerSection).trim() })
    }
    return sections
  }
  return parts.map((text) => ({ text }))
}

function describeAIAction(stepId, content) {
  const descriptions = {
    context: `The AI begins by establishing context for the problem. It identifies the key question, recognizes the scope, and sets boundaries for the analysis.`,
    analysis: `The AI breaks down the problem into manageable components. It identifies relevant factors, dependencies, and constraints.`,
    synthesis: `The AI connects insights from the analysis phase, weaving together disparate observations into a coherent understanding.`,
    conclusion: `The AI draws conclusions from the synthesized analysis, articulating a clear position and suggesting next steps.`,
    observe: `The AI carefully examines the situation, identifying patterns and anomalies worth investigating.`,
    question: `The AI identifies knowledge gaps and formulates precise questions to guide the inquiry.`,
    hypothesize: `The AI generates possible explanations or approaches, considering multiple angles.`,
    test: `The AI considers how to validate or falsify the hypotheses, thinking about evidence and verification methods.`,
    learn: `The AI extracts lessons from the analysis, crystallizing key takeaways and identifying implications.`,
  }
  return descriptions[stepId] || `The AI works through the ${stepId} step.`
}

function extractPattern(stepId, content) {
  const patterns = {
    context: `This step reveals a common AI reasoning pattern: **context-first framing**. The AI always establishes the problem space before diving into solutions.`,
    analysis: `This step shows **decomposition reasoning**. The AI breaks complex problems into smaller, solvable parts.`,
    synthesis: `This step demonstrates **integrative reasoning**. The AI combines analytical fragments into a coherent understanding.`,
    conclusion: `This step reveals **structured conclusion-making**. The AI's conclusions follow: position statement → evidence summary → limitations → next steps.`,
  }
  return patterns[stepId] || `The AI applies ${stepId} reasoning patterns.`
}

function findKeyInsight(content) {
  if (!content) return 'No specific insight identified in this step.'
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  if (sentences.length === 0) return content.slice(0, 200)
  return sentences.find((s) => s.trim().length > 50)?.trim() || sentences[0].trim() || content.slice(0, 200)
}

function generateStepContent(step, topic, index, total) {
  const contextTemplates = [
    `To understand ${topic}, we first need to establish what this means and why it matters.`,
    `When approaching ${topic}, the first thing to recognize is that this sits at the intersection of multiple domains.`,
  ]
  const analysisTemplates = [
    `Breaking down ${topic}, several key dimensions emerge: foundational concepts, practical implications, and edge cases.`,
    `The analysis of ${topic} reveals several important factors.`,
  ]
  const synthesisTemplates = [
    `Bringing these observations together about ${topic}, a clearer picture emerges. The key patterns suggest interconnected structure.`,
  ]
  const conclusionTemplates = [
    `To conclude, our exploration of ${topic} reveals key insights. The most important finding is that...`,
  ]

  if (step.id === 'context') return contextTemplates[index % contextTemplates.length]
  if (step.id === 'analysis') return analysisTemplates[index % analysisTemplates.length]
  if (step.id === 'synthesis') return synthesisTemplates[index % synthesisTemplates.length]
  return conclusionTemplates[index % conclusionTemplates.length]
}

function generateThinkingPattern(step, topic, index) {
  return `This step applies ${step.label.toLowerCase()} reasoning to ${topic}. The AI's thinking follows a structured pattern:\n\n1. **Start with what is known**: Anchor the reasoning in established facts\n2. **Identify gaps**: Note what needs to be figured out\n3. **Apply logical inference**: Move from known to unknown\n4. **Check consistency**: Ensure the reasoning doesn't contradict itself`
}

function generateKeyInsight(step, topic) {
  return `The most important insight from the ${step.label.toLowerCase()} step is that understanding ${topic} requires looking beyond surface-level observations to the underlying structure and relationships.`
}
