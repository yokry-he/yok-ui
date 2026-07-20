import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const docsDir = new URL('../docs/components/', import.meta.url)
const skippedFiles = new Set(['index.md', 'core.md', 'product.md', 'select.md'])
const genericDemoHeadings = new Set([
  'example',
  'examples',
  'basic',
  'basic usage',
  'usage',
  'demo'
])
const removedNonComponentSections = [
  /^##\s+When to use(?:\s+\{#[^}]+\})?\s*$/i,
  /^##\s+Live runner(?:\s+\{#[^}]+\})?\s*$/i,
  /^##\s+Workflow scenarios(?:\s+\{#[^}]+\})?\s*$/i,
  /^##\s+API reference handoff(?:\s+\{#[^}]+\})?\s*$/i
]

function slugify(value) {
  const normalized = value
    .trim()
    .replace(/`([^`]+)`/g, '$1')
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return normalized || 'section'
}

function stripAnchor(value) {
  return value.replace(/\s+\{#[^}]+\}\s*$/, '').trim()
}

function getPageTitle(markdown) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? ''
}

function getPrimaryComponentName(markdown) {
  const directName = markdown.match(/<ComponentApiSection\s+name="([^"]+)"/)?.[1]

  if (directName) {
    return directName
  }

  return markdown.match(/<ComponentApiSection\s+:names="\[([^\]]+)\]"/)?.[1]
    ?.match(/'([^']+)'/)?.[1] ?? ''
}

function getDocComponentNames(markdown) {
  const names = new Set()

  for (const match of markdown.matchAll(/<ComponentApiSection\s+name="([^"]+)"/g)) {
    names.add(match[1])
  }

  for (const match of markdown.matchAll(/<ComponentApiSection\s+:names="\[([^\]]+)\]"/g)) {
    for (const nameMatch of match[1].matchAll(/'([^']+)'/g)) {
      names.add(nameMatch[1])
    }
  }

  return Array.from(names)
}

function removeLiveExampleSections(markdown) {
  const lines = markdown.split('\n')
  const result = []
  let skipping = false

  for (const line of lines) {
    if (/^##\s+Live example(?:\s+\{#[^}]+\})?\s*$/i.test(line)) {
      skipping = true
      continue
    }

    if (removedNonComponentSections.some((pattern) => pattern.test(line))) {
      skipping = true
      continue
    }

    if (skipping && /^##\s+/.test(line)) {
      skipping = false
    }

    if (!skipping) {
      result.push(line)
    }
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n')
}

function extractDocDemoTitle(lines, startIndex) {
  const block = []

  for (let index = startIndex; index < Math.min(lines.length, startIndex + 24); index += 1) {
    block.push(lines[index])

    if (/^\s*>/.test(lines[index])) {
      break
    }
  }

  return block.join('\n').match(/\btitle="([^"]+)"/)?.[1]?.trim() ?? ''
}

function findPreviousHeadingIndex(lines, startIndex) {
  for (let index = startIndex; index >= 0; index -= 1) {
    const line = lines[index]

    if (/^<DocDemo\b/.test(line) || /^##\s+/.test(line) || /^#\s+/.test(line)) {
      return /^##\s+/.test(line) ? index : -1
    }
  }

  return -1
}

function normalizeDocDemoHeadings(markdown, docSlug) {
  const lines = markdown.split('\n')
  const usedAnchors = new Set()

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^##\s+(.+)$/)

    if (heading?.[1]?.includes('{#')) {
      usedAnchors.add(heading[1].match(/\{#([^}]+)\}/)?.[1])
    }
  }

  function createDemoHeading(title) {
    const base = `${docSlug}-${slugify(title)}`
    let anchor = base
    let suffix = 2

    while (usedAnchors.has(anchor)) {
      anchor = `${base}-${suffix}`
      suffix += 1
    }

    usedAnchors.add(anchor)
    return `## ${title} {#${anchor}}`
  }

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^<DocDemo\b/.test(lines[index])) {
      continue
    }

    const title = extractDocDemoTitle(lines, index)

    if (!title) {
      continue
    }

    const previousHeadingIndex = findPreviousHeadingIndex(lines, index - 1)
    const previousHeading = previousHeadingIndex >= 0 ? lines[previousHeadingIndex] : ''
    const previousHeadingText = stripAnchor(previousHeading.replace(/^##\s+/, ''))
    const hasDocDemoBetweenHeadingAndBlock = previousHeadingIndex >= 0
      ? lines.slice(previousHeadingIndex + 1, index).some((line) => /^<DocDemo\b/.test(line))
      : false

    if (previousHeadingIndex >= 0 && !hasDocDemoBetweenHeadingAndBlock) {
      const normalizedHeading = previousHeadingText.toLowerCase()

      if (genericDemoHeadings.has(normalizedHeading)) {
        if (previousHeading.includes('{#') && previousHeadingText === title) {
          continue
        }

        lines[previousHeadingIndex] = createDemoHeading(title)
        continue
      }

      if (!previousHeading.includes('{#')) {
        const base = `${docSlug}-${slugify(previousHeadingText)}`
        let anchor = base
        let suffix = 2

        while (usedAnchors.has(anchor)) {
          anchor = `${base}-${suffix}`
          suffix += 1
        }

        usedAnchors.add(anchor)
        lines[previousHeadingIndex] = `## ${previousHeadingText} {#${anchor}}`
      }

      continue
    }

    lines.splice(index, 0, createDemoHeading(title), '')
    index += 2
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

function normalizeSecondLevelHeadingAnchors(markdown, docSlug) {
  const lines = markdown.split('\n')
  const usedAnchors = new Set()

  for (const line of lines) {
    const anchor = line.match(/^##\s+.+\s+\{#([^}]+)\}\s*$/)?.[1]

    if (anchor) {
      usedAnchors.add(anchor)
    }
  }

  return lines.map((line) => {
    const heading = line.match(/^##\s+(.+?)\s*$/)

    if (!heading || heading[1].includes('{#')) {
      return line
    }

    const title = stripAnchor(heading[1])
    const base = `${docSlug}-${slugify(title)}`
    let anchor = base
    let suffix = 2

    while (usedAnchors.has(anchor)) {
      anchor = `${base}-${suffix}`
      suffix += 1
    }

    usedAnchors.add(anchor)
    return `## ${title} {#${anchor}}`
  }).join('\n').replace(/\n{3,}/g, '\n\n')
}

function normalizeApiHeading(markdown, pageTitle, docSlug) {
  const title = pageTitle.replace(/\s+[^\x00-\x7F].*$/, '').trim() || pageTitle
  const apiHeading = `## ${title} API {#${docSlug}-api}`

  if (/^##\s+API(?:\s+\{#[^}]+\})?\s*$/m.test(markdown)) {
    return markdown.replace(/^##\s+API(?:\s+\{#[^}]+\})?\s*$/m, apiHeading)
  }

  if (/^##\s+.+\s+API\s+\{#[^}]+\}\s*$/m.test(markdown)) {
    return markdown
  }

  return markdown
}

function normalizeAccessibility(markdown, primaryComponentName) {
  if (!/^##\s+Accessibility(?:\s+\{#[^}]+\})?\s*$/m.test(markdown)) {
    markdown = `${markdown.trim()}\n\n## Accessibility {#accessibility}\n\n- 遵循 Yok UI 的键盘、焦点和语义约定。\n`
  } else {
    markdown = markdown.replace(/^##\s+Accessibility(?:\s+\{#[^}]+\})?\s*$/m, '## Accessibility {#accessibility}')
  }

  return markdown
}

function moveAccessibilityAfterApi(markdown) {
  const lines = markdown.split('\n')
  const apiIndex = lines.findIndex((line) => /^##\s+.+\s+API\s+\{#[^}]+\}\s*$/.test(line))
  const accessibilityIndex = lines.findIndex((line) => /^##\s+Accessibility\s+\{#accessibility\}\s*$/.test(line))

  if (apiIndex === -1 || accessibilityIndex === -1 || apiIndex < accessibilityIndex) {
    return markdown
  }

  const findSectionEnd = (startIndex) => {
    for (let index = startIndex + 1; index < lines.length; index += 1) {
      if (/^##\s+/.test(lines[index])) {
        return index
      }
    }

    return lines.length
  }
  const accessibilityEnd = findSectionEnd(accessibilityIndex)
  const accessibilityBlock = lines.slice(accessibilityIndex, accessibilityEnd)
  const withoutAccessibility = [
    ...lines.slice(0, accessibilityIndex),
    ...lines.slice(accessibilityEnd)
  ]
  const newApiIndex = withoutAccessibility.findIndex((line) => /^##\s+.+\s+API\s+\{#[^}]+\}\s*$/.test(line))
  const apiEnd = (() => {
    for (let index = newApiIndex + 1; index < withoutAccessibility.length; index += 1) {
      if (/^##\s+/.test(withoutAccessibility[index])) {
        return index
      }
    }

    return withoutAccessibility.length
  })()

  withoutAccessibility.splice(apiEnd, 0, '', ...accessibilityBlock)

  return withoutAccessibility.join('\n').replace(/\n{3,}/g, '\n\n')
}

function moveAccessibilityEvidenceIntoSection(markdown) {
  return markdown
    .split('\n')
    .filter((line) => !line.includes('<ComponentAccessibilityEvidence'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
}

function normalizeHeadingSpacing(markdown) {
  return markdown
    .replace(/^(##\s+.+\n)(<ComponentApiSection)/gm, '$1\n$2')
    .replace(/^(##\s+Accessibility\s+\{#accessibility\}\n)(?!\n)/gm, '$1\n')
}

function addComponentTip(markdown, primaryComponentName) {
  if (markdown.includes('::: tip TIP')) {
    return markdown
  }

  const componentLabel = primaryComponentName ? `\`${primaryComponentName}\`` : '当前组件'
  const tip = [
    '::: tip TIP',
    `${componentLabel} 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。`,
    ':::'
  ].join('\n')

  const firstH2Index = markdown.search(/^##\s+/m)

  if (firstH2Index === -1) {
    return `${markdown.trim()}\n\n${tip}\n`
  }

  return `${markdown.slice(0, firstH2Index).trim()}\n\n${tip}\n\n${markdown.slice(firstH2Index).trimStart()}`
}

function normalizeFile(file) {
  const filePath = join(docsDir.pathname, file)
  const original = readFileSync(filePath, 'utf8')

  if (!original.includes('<ComponentApiSection')) {
    return false
  }

  const docSlug = basename(file, '.md')
  const pageTitle = getPageTitle(original)
  const primaryComponentName = getPrimaryComponentName(original)
  const componentNames = getDocComponentNames(original)
  let markdown = original

  markdown = removeLiveExampleSections(markdown)
  markdown = normalizeDocDemoHeadings(markdown, docSlug)
  markdown = normalizeSecondLevelHeadingAnchors(markdown, docSlug)
  markdown = normalizeApiHeading(markdown, pageTitle, docSlug)
  markdown = normalizeAccessibility(markdown, primaryComponentName)
  markdown = moveAccessibilityAfterApi(markdown)
  markdown = moveAccessibilityEvidenceIntoSection(markdown)
  markdown = addComponentTip(markdown, primaryComponentName || componentNames[0])
  markdown = normalizeHeadingSpacing(markdown)
  markdown = `${markdown.trim()}\n`

  if (markdown !== original) {
    writeFileSync(filePath, markdown)
    return true
  }

  return false
}

const changedFiles = readdirSync(docsDir)
  .filter((file) => file.endsWith('.md') && !skippedFiles.has(file))
  .filter(normalizeFile)

console.log(JSON.stringify({
  changed: changedFiles.length,
  files: changedFiles
}, null, 2))
