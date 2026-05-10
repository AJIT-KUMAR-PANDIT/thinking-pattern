#!/usr/bin/env node

/**
 * tp-setup — auto-detect and configure thinking-patterns for your IDE
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function detectIDE() {
  const ides = ['claude-desktop', 'cursor', 'windsurf', 'vscode', 'cline']
  for (const ide of ides) {
    if (process.env[ide.toUpperCase() + '_CONFIG']) {
      return ide
    }
  }
  // Check common paths
  const paths = {
    'claude-desktop': '~/.config/cline/mcp.json',
    cursor: '~/.cursor/mcp.json',
    windsurf: '~/.windsurf/mcp.json',
    cline: '~/.config/cline/mcp.json',
  }
  for (const [name, path] of Object.entries(paths)) {
    const home = process.env.HOME || ''
    const fullPath = path.replace('~', home)
    if (existsSync(fullPath)) return name
  }
  return 'auto'
}

function setupMCP(ide) {
  const serverPath = resolve(__dirname, '..', 'mcp-server.mjs')
  const config = {
    mcpServers: {
      'thinking-patterns': {
        command: 'node',
        args: [serverPath],
      },
    },
  }

  if (ide === 'claude-desktop' || ide === 'cline') {
    const home = process.env.HOME || ''
    const configPath = join(home, '.config', 'cline', 'mcp.json')
    mkdirSync(dirname(configPath), { recursive: true })
    writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log(`  Configured: ${configPath}`)
  } else if (ide === 'cursor') {
    const home = process.env.HOME || ''
    const configPath = join(home, '.cursor', 'mcp.json')
    mkdirSync(dirname(configPath), { recursive: true })
    writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log(`  Configured: ${configPath}`)
  } else if (ide === 'windsurf') {
    const home = process.env.HOME || ''
    const configPath = join(home, '.windsurf', 'mcp.json')
    mkdirSync(dirname(configPath), { recursive: true })
    writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log(`  Configured: ${configPath}`)
  }
  console.log(`  MCP server: ${serverPath}\n`)
}

async function main() {
  console.log('\n🧠 thinking-patterns — Plug & Play Setup (nakprc)\n')

  const ide = detectIDE()
  console.log(`  Detected IDE: ${ide}\n`)

  if (ide === 'auto') {
    console.log('  No IDE config found. Use one of these:')
    console.log('    npx tp-setup claude-desktop')
    console.log('    npx tp-setup cursor')
    console.log('    npx tp-setup windsurf')
    console.log('    npx tp-setup cline')
    console.log('    npx tp-setup vscode\n')
    return
  }

  console.log('  Setting up MCP server...\n')
  setupMCP(ide)
  console.log('  ✅ Done! Restart your IDE to pick up the MCP server.')
}

main().catch(console.error)
