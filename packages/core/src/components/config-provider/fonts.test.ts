import { describe, expect, it } from 'vitest'
import { builtinYokFonts, resolveYokFontFamily } from './fonts'

describe('Yok UI font runtime', () => {
  it('ships five dependency-free font presets', () => {
    expect(Object.keys(builtinYokFonts)).toEqual(['system', 'humanist', 'rounded', 'serif', 'mono'])
    expect(builtinYokFonts.rounded.family).toContain('ui-rounded')
    expect(builtinYokFonts.mono.family).toContain('ui-monospace')
  })

  it('resolves preset names and preserves custom CSS stacks', () => {
    expect(resolveYokFontFamily('system')).toBe(builtinYokFonts.system.family)
    expect(resolveYokFontFamily('"Noto Sans SC", sans-serif')).toBe('"Noto Sans SC", sans-serif')
  })

  it('falls back to the system preset for empty input', () => {
    expect(resolveYokFontFamily()).toBe(builtinYokFonts.system.family)
    expect(resolveYokFontFamily('   ')).toBe(builtinYokFonts.system.family)
  })
})
