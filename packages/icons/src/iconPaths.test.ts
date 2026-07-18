import { describe, expect, it } from 'vitest'
import {
  getYokIconComponentName,
  getYokIconEntries,
  searchYokIcons,
  yokIconCategories,
  yokIconPaths,
  type YokIconName
} from './iconPaths'

describe('yok icon registry', () => {
  it('keeps categories in sync with registered icon paths', () => {
    const iconNames = new Set(Object.keys(yokIconPaths))

    for (const names of Object.values(yokIconCategories)) {
      for (const name of names) {
        expect(iconNames.has(name)).toBe(true)
      }
    }
  })

  it('exposes common business and document icons through searchable metadata', () => {
    const names = new Set(Object.keys(yokIconPaths))
    const expected: YokIconName[] = [
      'mail',
      'phone',
      'mapPin',
      'globe',
      'save',
      'print',
      'undo',
      'redo',
      'sortAsc',
      'sortDesc',
      'calculator',
      'kanban',
      'briefcase',
      'building',
      'palette'
    ]

    for (const name of expected) {
      expect(names.has(name)).toBe(true)
      expect(getYokIconComponentName(name)).toMatch(/^Y[A-Z].*Icon$/)
    }
  })

  it('searches by name, tag, and category without leaking path internals', () => {
    expect(searchYokIcons('email').map((icon) => icon.name)).toContain('mail')
    expect(searchYokIcons('workflow').map((icon) => icon.name)).toContain('kanban')
    expect(searchYokIcons('document', 'file').map((icon) => icon.name)).toContain('fileText')
    expect(searchYokIcons('', 'business').map((icon) => icon.name)).toContain('briefcase')
    expect(getYokIconEntries()[0]).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        componentName: expect.stringMatching(/^Y[A-Z].*Icon$/),
        category: expect.any(String),
        tags: expect.any(Array)
      })
    )
  })
})
