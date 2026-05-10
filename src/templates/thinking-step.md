---
pattern: {{pattern}}
step: {{stepId}}
step_number: {{stepNumber}}
total_steps: {{totalSteps}}
generated_at: {{generatedAt}}
---

# Step {{stepNumber}}: {{stepLabel}}

> {{stepDesc}}

## What the AI Did

{{whatDone}}

## Thinking Pattern

{{thinkingPattern}}

## Key Insight

{{keyInsight}}

## Previous

{{#ifPrev}}→ [Step {{prevStep}}]({{prevFile}}){{/ifPrev}}

## Next

{{#ifNext}}→ [Step {{nextStep}}]({{nextFile}}){{/ifNext}}
