/**
 * Custom pattern — user-defined thinking steps.
 */

export function extractThinkingSteps(response, config) {
  const pattern = config.patterns.custom
  return pattern.steps.map((step, i) => ({
    ...step,
    content: customContent(step, i, pattern.steps.length),
    whatDone: `The AI applied the custom ${step.label} step.`,
    thinkingPattern: `Custom ${step.label} reasoning applied.`,
    keyInsight: `Key insight from the ${step.label} step.`,
  }))
}

function customContent(step, i, total) {
  return `This is the ${step.label} step (step ${i + 1} of ${total}) in the custom thinking pattern. The user has defined this step as part of their personalized reasoning framework.`
}
