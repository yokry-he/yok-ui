import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const inputDocPath = resolve(__dirname, '../../components/input.md')

function readInputDoc() {
  return readFileSync(inputDocPath, 'utf8')
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

describe('input static examples', () => {
  it('covers mainstream Input scenarios with complete source handoff', () => {
    const source = readInputDoc()
    const titles = getDocDemoTitles(source)

    expect(titles).toEqual([
      'Basic input',
      'Clearable search and count',
      'Password',
      'Validation and disabled state',
      'Form validation'
    ])

    titles.forEach((title) => {
      const block = getDocDemoBlock(source, title)

      expect(block).toContain(':code=')
      expect(block).toContain(':setup=')
      expect(block).toContain('YInput')
    })

    expect(source).toContain('show-password')
    expect(source).toContain('type="password"')
  })
})
