import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const selectDocPath = resolve(__dirname, '../../components/select.md')

function readSelectDoc() {
  return readFileSync(selectDocPath, 'utf8')
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

describe('select static examples', () => {
  it('splits Select docs into mainstream component-library example scenarios', () => {
    const source = readSelectDoc()
    const titles = getDocDemoTitles(source)

    expect(titles).toEqual([
      '基础用法',
      'Options 属性',
      '有禁用选项',
      '禁用状态',
      '可清空',
      '尺寸',
      '基础多选',
      '自定义模板',
      '将选项进行分组',
      '筛选选项',
      '远程搜索',
      '创建新的选项',
      '使用值键 value-key 属性',
      '自定义标签',
      '自定义加载',
      '空值配置',
      '大数据列表',
      '表单校验'
    ])

    titles.forEach((title) => {
      const block = getDocDemoBlock(source, title)

      expect(block).toContain(':code=')
      expect(block).toContain(':setup=')
      expect(block).toContain(':usage=')
      expect(block).toContain('YSelect')
    })
  })
})
