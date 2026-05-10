/**
 * Guided thinking pattern — structured scientific reasoning.
 */

export function extractThinkingSteps(response, config) {
  const pattern = config.patterns.guided
  return pattern.steps.map((step, i) => ({
    ...step,
    content: guidedContent(step, i, pattern.steps.length),
    whatDone: guidedWhatDone(step),
    thinkingPattern: guidedThinkingPattern(step),
    keyInsight: guidedKeyInsight(step),
  }))
}

function guidedContent(step, i, total) {
  const contents = {
    observe: `Looking at this problem carefully, several things stand out. The most notable observation is the structure of the problem itself — it has layers that require peeling back one at a time.`,
    question: `From these observations, critical questions emerge. The most pressing is: what assumptions underlie our current understanding? This question cuts to the heart of the problem.`,
    hypothesize: `Guided by our questions, several hypotheses emerge. The leading hypothesis suggests that the core mechanism operates through... Alternative hypotheses propose...`,
    test: `To evaluate these hypotheses, we need concrete tests. The strongest approach would examine... A secondary test could investigate... Each test targets a different aspect of the hypothesis.`,
    learn: `Through this process, several lessons emerge. The primary insight is that the problem is fundamentally about... This changes how we approach similar problems. Key implications include...`,
  }
  return contents[step.id] || `Thinking through this step systematically.`
}

function guidedWhatDone(step) {
  const actions = {
    observe: 'The AI carefully examined the situation, identifying patterns and anomalies worth investigating.',
    question: 'The AI identified knowledge gaps and formulated precise questions to guide the inquiry.',
    hypothesize: 'The AI generated multiple plausible explanations and ranked them by likelihood.',
    test: 'The AI designed verification approaches and considered what evidence would confirm or refute each hypothesis.',
    learn: 'The AI extracted actionable insights and connected them to broader understanding.',
  }
  return actions[step.id] || `The AI worked through the ${step.label} step.`
}

function guidedThinkingPattern(step) {
  return `This step demonstrates **scientific reasoning**: ${step.label}. The AI follows the scientific method — observing carefully, questioning rigorously, hypothesizing creatively, testing systematically, and learning deliberately.`
}

function guidedKeyInsight(step) {
  return `The key insight from ${step.label} is that rigorous thinking requires disciplined attention to each step of the reasoning process.`
}
