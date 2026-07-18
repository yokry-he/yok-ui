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
      '基础用法',
      '朴素按钮',
      '禁用状态',
      '链接按钮',
      '文字按钮',
      '图标按钮',
      '按钮组',
      '加载状态按钮',
      '调整尺寸',
      '圆角和虚线按钮',
      '原生类型和块级按钮',
      '自定义颜色'
    ])

    titles.forEach((title) => {
      const block = getDocDemoBlock(source, title)

      expect(block).toContain(':code=')
      expect(block).toContain(':setup=')
      expect(block).toMatch(/YButton|YIconButton/)
    })

    expect(source).toContain('block')
    expect(source).toContain('native-type="submit"')
    expect(source).toContain('link')
    expect(source).toContain('plain')
    expect(source).toContain('loading-icon')
    expect(source).toContain('YButtonGroup')
    expect(source).toContain('YSearchIcon')
  })
})
