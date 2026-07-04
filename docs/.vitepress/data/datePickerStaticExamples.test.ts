import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const datePickerDocPath = resolve(__dirname, '../../components/date-picker.md')

function readDatePickerDoc() {
  return readFileSync(datePickerDocPath, 'utf8')
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

describe('date picker static examples', () => {
  it('splits Date Picker docs into mainstream date-selection scenarios', () => {
    const source = readDatePickerDoc()
    const titles = getDocDemoTitles(source)

    expect(titles).toEqual([
      'Basic usage',
      'Shortcuts',
      'Disabled dates',
      'Clearable and disabled',
      'Size and locale',
      'Form validation'
    ])

    titles.forEach((title) => {
      const block = getDocDemoBlock(source, title)

      expect(block).toContain(':code=')
      expect(block).toContain(':setup=')
      expect(block).toContain(':usage=')
      expect(block).toContain('YDatePicker')
    })
  })
})
