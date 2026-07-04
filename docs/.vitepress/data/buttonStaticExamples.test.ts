import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const buttonDocPath = resolve(__dirname, '../../components/button.md')

function readButtonDoc() {
  return readFileSync(buttonDocPath, 'utf8')
}

function getDocDemoTitles(source: string) {
  return Array.from(source.matchAll(/<DocDemo[\s\S]*?title="([^"]+)"/g)).map((match) => match[1])
}

function getDocDemoBlock(source: string, title: string) {
  const titleIndex = source.indexOf(`title="${title}"`)

  if (titleIndex === -1) {
    return ''
  }

  const start = source.lastIndexOf('<DocDemo', titleIndex)
  const end = source.indexOf('</DocDemo>', titleIndex)

  return source.slice(start, end + '</DocDemo>'.length)
}

describe('button static examples', () => {
  it('covers mainstream Button docs scenarios with complete source handoff', () => {
    const source = readButtonDoc()
    const titles = getDocDemoTitles(source)

    expect(titles).toEqual([
      'Variants',
      'Sizes',
      'Loading and disabled',
      'Native type and block',
      'Icon buttons'
    ])

    titles.forEach((title) => {
      const block = getDocDemoBlock(source, title)

      expect(block).toContain(':code=')
      expect(block).toContain(':setup=')
      expect(block).toMatch(/YButton|YIconButton/)
    })

    expect(source).toContain('block')
    expect(source).toContain('type="submit"')
    expect(source).toContain('YIconButton')
  })
})
