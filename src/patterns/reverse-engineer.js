/**
 * Reverse engineer pattern — extracts thinking steps from AI response text.
 */

/**
 * Parse an AI response and extract logical thinking phases.
 * Splits response into natural reasoning stages.
 */
export function extractThinkingSteps(response, config) {
  const pattern = config.patterns[config.defaultPattern] || config.patterns.reverse_engineer
  const steps = pattern.steps

  // Split response into logical sections by analyzing structure
  const sections = splitIntoSections(response)

  // Map sections to thinking steps
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

/**
 * Generate thinking steps from a topic/prompt (no input response needed).
 * Uses template-based reasoning simulation.
 */
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

/* ── helpers ──────────────────────────────────────────────── */

function splitIntoSections(response) {
  // Split by headers, blank lines, or logical breaks
  const parts = response
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean)

  // Group into logical chunks if fewer sections than needed
  const minSections = 4
  if (parts.length < minSections) {
    const charsPerSection = Math.ceil(response.length / minSections)
    const sections = []
    for (let i = 0; i < minSections; i++) {
      sections.push({
        text: response.slice(i * charsPerSection, (i + 1) * charsPerSection).trim(),
      })
    }
    return sections
  }

  return parts.map((text) => ({ text }))
}

function describeAIAction(stepId, content) {
  const descriptions = {
    context: `The AI begins by establishing context for the problem. It identifies the key question, recognizes the scope, and sets boundaries for the analysis.`,
    analysis: `The AI breaks down the problem into manageable components. It identifies relevant factors, dependencies, and constraints that shape the solution space.`,
    synthesis: `The AI connects insights from the analysis phase. It weaves together disparate observations into a coherent understanding, finding patterns and relationships.`,
    conclusion: `The AI draws conclusions from the synthesized analysis. It articulates a clear position, acknowledges limitations, and suggests next steps.`,
    observe: `The AI carefully examines the situation, identifying what is present, absent, notable, and worth considering.`,
    question: `The AI identifies knowledge gaps and uncertainties. It formulates the right questions that need answering.`,
    hypothesize: `The AI generates possible explanations or approaches. It considers multiple angles and alternatives.`,
    test: `The AI considers how to validate or falsify the hypotheses. It thinks about evidence and verification methods.`,
    learn: `The AI extracts lessons from the analysis. It crystallizes key takeaways and identifies implications.`,
  }
  return descriptions[stepId] || `The AI works through the ${stepId} step.`
}

function extractPattern(stepId, content) {
  const patterns = {
    context: `This step reveals a common AI reasoning pattern: **context-first framing**. The AI always establishes the problem space before diving into solutions. It uses:\n- **Scope definition**: Clearly stating what is and isn't covered\n- **Assumption listing**: Noting implicit premises\n- **Boundary setting**: Defining the limits of the analysis`,
    analysis: `This step shows **decomposition reasoning**. The AI breaks complex problems into smaller, solvable parts:\n- **Factor identification**: What variables matter?\n- **Relationship mapping**: How do factors connect?\n- **Priority ordering**: What needs attention first?`,
    synthesis: `This step demonstrates **integrative reasoning**. The AI combines analytical fragments:\n- **Pattern recognition**: Finding common threads\n- **Relationship building**: Connecting previously separate observations\n- **Abstraction**: Generalizing specific findings`,
    conclusion: `This step reveals **structured conclusion-making**. The AI's conclusions follow a pattern:\n- **Position statement**: Clear main claim\n- **Evidence summary**: Key supporting points\n- **Limitations**: What isn't known\n- **Next steps**: Where to go from here`,
  }
  return patterns[stepId] || `The AI applies ${stepId} reasoning patterns.`
}

function findKeyInsight(content) {
  if (!content) return 'No specific insight identified in this step.'
  // Extract the most significant claim or observation
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  if (sentences.length === 0) return content.slice(0, 200)
  // Return first substantive sentence
  return sentences.find((s) => s.trim().length > 50)?.trim() || sentences[0].trim() || content.slice(0, 200)
}

function generateStepContent(step, topic, index, total) {
  const contextTemplates = [
    `To understand ${topic}, we first need to establish what this means and why it matters. The core challenge here is balancing clarity with depth — we want to cover the essential aspects without getting lost in details.`,
    `When approaching ${topic}, the first thing to recognize is that this sits at the intersection of multiple domains. The key question is: what framework helps us think about this most effectively?`,
  ]

  const analysisTemplates = [
    `Breaking down ${topic}, several key dimensions emerge. First, we need to understand the foundational concepts. Second, we should examine the practical implications. Third, we must consider the limitations and edge cases.`,
    `The analysis of ${topic} reveals several important factors. The primary consideration is... The secondary factor is... Finally, we must account for...`,
  ]

  const synthesisTemplates = [
    `Bringing these observations together about ${topic}, a clearer picture emerges. The key patterns we've identified suggest that... This insight connects the analytical findings into a coherent understanding.`,
    `The synthesis of our analysis reveals a deeper structure in ${topic}. At its core, this is about... The relationships between the components create...`,
  ]

  const conclusionTemplates = [
    `To conclude, our exploration of ${topic} reveals several key insights. The most important finding is that... While there are limitations to this analysis, the implications are clear: we should...`,
    `In summary, ${topic} can be understood through several lenses. The primary takeaway is... Secondary insights include... And the most actionable recommendation is to...`,
  ]

  const guidedTemplates = [
    `**Observation about ${topic}**: Looking carefully at this, I notice several things that stand out. The most significant observation is that...`,
    `**Question about ${topic}**: Given what we've observed, what are the critical uncertainties? The most important question seems to be: what assumptions are we making?`,
    `**Hypothesis about ${topic}**: Based on our observations and questions, several possibilities emerge. The leading hypothesis is that... Alternative explanations include...`,
    `**Test for ${topic}**: How could we verify this hypothesis? Possible approaches include... The most direct test would be to...`,
    `**Learning from ${topic}**: What have we discovered? The key insight is that... This changes our understanding by... The implications are...`,
  ]

  if (step.id === 'observe' || step.id === 'context') return guidedTemplates[0]
  if (step.id === 'question') return guidedTemplates[1]
  if (step.id === 'hypothesize') return guidedTemplates[2]
  if (step.id === 'test') return guidedTemplates[3]
  if (step.id === 'learn') return guidedTemplates[4]
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
