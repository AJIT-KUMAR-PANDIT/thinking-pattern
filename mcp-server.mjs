#!/usr/bin/env node

/**
 * thinking-patterns MCP Server — nakprc edition
 * Exposes thinking pattern generation as MCP tools.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── Config ──

function loadConfig() {
  const defaultConfig = {
    output: { dir: null, filePrefix: "think", naming: "numbered", fileExtension: "md" },
    defaultPattern: "reverse_engineer",
    patterns: {
      reverse_engineer: {
        label: "Reverse Engineer AI Thinking",
        steps: [
          { id: "context", label: "Context & Framing", desc: "How the AI frames the problem" },
          { id: "analysis", label: "Analysis", desc: "How the AI breaks down the problem" },
          { id: "synthesis", label: "Synthesis", desc: "How the AI combines insights" },
          { id: "conclusion", label: "Conclusion", desc: "How the AI reaches conclusions" },
        ],
      },
      guided: {
        label: "Guided Thinking",
        steps: [
          { id: "observe", label: "Observe", desc: "What do we see?" },
          { id: "question", label: "Question", desc: "What are we unsure about?" },
          { id: "hypothesize", label: "Hypothesize", desc: "What could be true?" },
          { id: "test", label: "Test", desc: "How do we verify?" },
          { id: "learn", label: "Learn", desc: "What did we discover?" },
        ],
      },
      custom: {
        label: "Custom Pattern",
        steps: [
          { id: "frame", label: "Frame", desc: "Define the problem space" },
          { id: "explore", label: "Explore", desc: "Survey approaches" },
          { id: "evaluate", label: "Evaluate", desc: "Compare options" },
          { id: "decide", label: "Decide", desc: "Choose the best path" },
          { id: "execute", label: "Execute", desc: "Carry out the plan" },
          { id: "reflect", label: "Reflect", desc: "Review and learn" },
        ],
      },
    },
  };

  let userConfig = {};
  try {
    const raw = readFileSync(join(root, "thinkingpatterns.nakprc.config.js"), "utf8");
    const code = raw.replace(/\s*export\s+default\s*/g, "").trim();
    userConfig = new Function("return (" + code + ")")();
  } catch {}

  const merged = {
    output: { ...defaultConfig.output, ...(userConfig.output || {}) },
    defaultPattern: userConfig.defaultPattern || defaultConfig.defaultPattern,
    patterns: { ...defaultConfig.patterns, ...(userConfig.patterns || {}) },
  };
  return merged;
}

function topicToSlug(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "thinking";
}

function resolveOutputDir(config, topic) {
  if (config.output?.dir) return config.output.dir;
  return `./${topicToSlug(topic)}`;
}

// ── Core logic ──

function describeAIAction(stepId) {
  const map = {
    context: "The AI establishes context by identifying the core question, scope, and boundaries of the problem.",
    analysis: "The AI breaks the problem into components, identifying factors, dependencies, and constraints.",
    synthesis: "The AI connects insights from analysis, finding patterns and relationships across observations.",
    conclusion: "The AI draws conclusions, articulates position, acknowledges limitations, and suggests next steps.",
    observe: "The AI carefully examines the situation, identifying what is present, absent, notable, and worth considering.",
    question: "The AI identifies knowledge gaps and formulates the critical questions that guide inquiry.",
    hypothesize: "The AI generates multiple plausible explanations and ranks them by likelihood.",
    test: "The AI designs verification approaches and considers what evidence would confirm or refute hypotheses.",
    learn: "The AI extracts actionable insights and connects them to broader understanding.",
    frame: "The AI defines the problem space, establishing the boundaries and key dimensions of the issue.",
    explore: "The AI surveys possible approaches, mapping the solution space.",
    evaluate: "The AI compares options systematically, weighing trade-offs and constraints.",
    decide: "The AI makes a reasoned choice based on the evaluation, articulating the rationale.",
    execute: "The AI carries out the chosen plan with attention to detail and potential pitfalls.",
    reflect: "The AI reviews outcomes, extracts lessons, and identifies improvements.",
  };
  return map[stepId] || `The AI applies ${stepId} reasoning.`;
}

function generateStepContent(stepId, topic, index, total) {
  const templates = {
    context: [`To understand ${topic}, we first need to establish the problem space.`],
    analysis: [`Breaking down ${topic}, several key dimensions emerge.`],
    synthesis: [`Bringing these observations together about ${topic}, a clearer picture emerges.`],
    conclusion: [`Our exploration of ${topic} reveals key insights.`],
    observe: [`Looking carefully at ${topic}, several things stand out.`],
    question: [`From our observations about ${topic}, critical questions emerge.`],
    hypothesize: [`Guided by our questions, several hypotheses about ${topic} emerge.`],
    test: [`To evaluate these hypotheses about ${topic}, we need concrete tests.`],
    learn: [`Through this process with ${topic}, the key insight is that rigorous thinking requires disciplined attention.`],
  };
  const t = templates[stepId] || [`${stepId} step for ${topic}: structured reasoning.`];
  return t[index % t.length];
}

function generateThinkingPattern(stepId, topic) {
  return `This step applies **${stepId} reasoning** to ${topic}. The AI's thinking follows a structured pattern:\n\n1. **Start with known facts**: Anchor in established information\n2. **Identify gaps**: Note what needs discovery\n3. **Apply inference**: Move logically from known to unknown\n4. **Check consistency**: Verify reasoning holds together\n5. **Extract signal**: Separate important insights from noise`;
}

function findKeyInsight(topic) {
  return `Key insight: understanding ${topic} requires looking beyond surface observations to underlying patterns.`;
}

function generateFiles(steps, pattern, topic) {
  const config = loadConfig();
  const outputDir = resolveOutputDir(config, topic);
  const filePrefix = config.output.filePrefix;
  const naming = config.output.naming;
  const ext = config.output.fileExtension || "md";

  mkdirSync(outputDir, { recursive: true });
  const files = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let fileName;
    if (naming === "named") {
      fileName = `${filePrefix}-${step.id}.${ext}`;
    } else if (naming === "datetime") {
      const dt = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      fileName = `${filePrefix}-${dt}-${step.id}.${ext}`;
    } else {
      fileName = `${filePrefix}${i + 1}.${ext}`;
    }

    const filePath = join(outputDir, fileName);
    const content = `---
pattern: ${pattern.label}
step: ${step.id}
step_number: ${i + 1}
total_steps: ${steps.length}
generated_at: ${new Date().toISOString()}
---

# Step ${i + 1}: ${step.label}

> ${step.desc}

## What the AI Did

${step.whatDone}

## Thinking Pattern

${step.thinkingPattern}

## Key Insight

${step.keyInsight}

## Summary

${step.content}
`;
    writeFileSync(filePath, content, "utf8");
    files.push({ path: filePath, name: fileName, step: step.label, stepNumber: i + 1 });
  }

  const indexContent = `# Thinking Patterns: ${topic}\n\nGenerated: ${new Date().toISOString()}\nPattern: ${pattern.label}\nOutput: ${outputDir}\nSteps: ${steps.length}\n\n## Files\n\n` +
    files.filter((f) => f.stepNumber > 0).map((f) => `- [${f.name}](./${f.name}) — Step ${f.stepNumber}: ${f.step}`).join("\n") +
    `\n\n---\n*Generated by thinking-patterns MCP (nakprc)*\n`;
  writeFileSync(join(outputDir, `index.${ext}`), indexContent, "utf8");

  return files;
}

// ── MCP Server ──

const server = new McpServer(
  { name: "thinking-patterns-nakprc", version: "1.1.0" },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.tool(
  "generate_thinking_patterns",
  "Generate sequential thinking pattern files (1think.md, 2think.md, etc.) for a given topic or prompt. The output directory is dynamic — derived from the topic name. Makes AI reasoning visible and study-able.",
  {
    topic: z.string().describe("The topic or question to generate thinking patterns for"),
    pattern: z.string().optional().describe("Pattern name: reverse_engineer, guided, or custom"),
  },
  async ({ topic, pattern }) => {
    const config = loadConfig();
    const patternName = pattern || config.defaultPattern;
    const patternDef = config.patterns[patternName];
    if (!patternDef) {
      return { content: [{ type: "text", text: `Error: pattern "${patternName}" not found.` }], isError: true };
    }
    const steps = patternDef.steps.map((step) => ({
      ...step,
      whatDone: describeAIAction(step.id),
      thinkingPattern: generateThinkingPattern(step.id, topic),
      keyInsight: findKeyInsight(topic),
      content: generateStepContent(step.id, topic, patternDef.steps.indexOf(step), patternDef.steps.length),
    }));
    const files = generateFiles(steps, patternDef, topic);
    return {
      content: [{
        type: "text",
        text: `Generated ${files.filter((f) => f.stepNumber > 0).length} thinking pattern files for "${topic}":\n\n${files.filter((f) => f.stepNumber > 0).map((f) => `✅ ${f.name} — Step ${f.stepNumber}: ${f.step}`).join("\n")}\n\nOutput directory: ${files[0]?.path?.replace(files[0].name, '') || config.output.dir}`,
      }],
    };
  },
);

server.tool(
  "analyze_ai_response",
  "Analyze an AI response text and extract the hidden thinking patterns into sequential files.",
  {
    response: z.string().describe("The full AI response text to analyze"),
    pattern: z.string().optional().describe("Pattern to use for structuring the analysis"),
  },
  async ({ response, pattern }) => {
    const config = loadConfig();
    const patternName = pattern || config.defaultPattern;
    const patternDef = config.patterns[patternName];
    if (!patternDef) {
      return { content: [{ type: "text", text: `Error: pattern "${patternName}" not found.` }], isError: true };
    }
    const sections = response.split(/\n\n+/).filter((s) => s.trim());
    const analysisTopic = sections[0]?.slice(0, 80) || "the response";
    const steps = patternDef.steps.map((step, i) => ({
      ...step,
      whatDone: describeAIAction(step.id),
      thinkingPattern: generateThinkingPattern(step.id, analysisTopic),
      keyInsight: findKeyInsight(analysisTopic),
      content: (sections[i]?.trim() || sections[sections.length - 1]?.trim() || "").slice(0, 500),
    }));
    const files = generateFiles(steps, patternDef, "Analyzed AI Response");
    return {
      content: [{
        type: "text",
        text: `Analyzed AI response and generated ${files.filter((f) => f.stepNumber > 0).length} thinking pattern files:\n\n${files.filter((f) => f.stepNumber > 0).map((f) => `✅ ${f.name} — Step ${f.stepNumber}: ${f.step}`).join("\n")}`,
      }],
    };
  },
);

server.tool(
  "list_patterns",
  "List all available thinking patterns with their steps.",
  {},
  async () => {
    const config = loadConfig();
    const text = Object.entries(config.patterns)
      .map(([key, p]) => `${key}: ${p.label} (${p.steps.length} steps: ${p.steps.map((s) => s.label).join(", ")})`)
      .join("\n");
    return { content: [{ type: "text", text: `Available patterns:\n\n${text}` }] };
  },
);

server.tool(
  "view_thinking_files",
  "List all generated thinking pattern files in the output directory.",
  { directory: z.string().optional().describe("Override the output directory (defaults to config or topic-derived)") },
  async ({ directory }) => {
    const config = loadConfig();
    const dir = directory || config.output.dir;
    try {
      const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f.startsWith("think")).sort();
      return {
        content: [{
          type: "text",
          text: files.length > 0 ? `Generated thinking files in ${dir}:\n\n${files.map((f) => `- ${f}`).join("\n")}` : `No thinking files found. Generate some first.`,
        }],
      };
    } catch {
      return { content: [{ type: "text", text: `Directory not found: ${dir || '(dynamic — no output yet)'}` }] };
    }
  },
);

server.tool(
  "get_thinking_file",
  "Get the full content of a specific generated thinking file.",
  {
    fileName: z.string().describe("The thinking file name, e.g. 'think1.md' or 'think-context.md'"),
    directory: z.string().optional().describe("Output directory (defaults to config or topic-derived)"),
  },
  async ({ fileName, directory }) => {
    const config = loadConfig();
    const dir = directory || config.output.dir;
    try {
      const content = readFileSync(join(dir, fileName), "utf8");
      return { content: [{ type: "text", text: `--- ${fileName} ---\n\n${content}` }] };
    } catch {
      return { content: [{ type: "text", text: `File not found: ${join(dir || '.', fileName)}` }], isError: true };
    }
  },
);

server.tool(
  "get_config",
  "Show the current thinking-patterns configuration.",
  {},
  async () => {
    const config = loadConfig();
    const text = `defaultPattern: ${config.defaultPattern}\noutput dir: ${config.output.dir || '(dynamic)'}\nfile prefix: ${config.output.filePrefix}\nnaming: ${config.output.naming}\npatterns: ${Object.keys(config.patterns).join(", ")}`;
    return { content: [{ type: "text", text: `Current configuration:\n\n${text}` }] };
  },
);

// ── Start ──

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("thinking-patterns MCP server (nakprc) running on stdio");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
