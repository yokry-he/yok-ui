import { describe, expect, it } from 'vitest'
import { components } from '../../../docs/.vitepress/data/componentRegistry'
import {
  YokUiResolver,
  yokUiComponentPackages,
  yokUiPackageStyles,
  type YokUiPackageName
} from './index'

describe('YokUiResolver', () => {
  it('resolves core, product, admin and brand components with package style side effects', () => {
    const resolver = YokUiResolver()

    expect(resolver('YButton')).toEqual({
      name: 'YButton',
      from: '@yok-ui/core',
      sideEffects: '@yok-ui/core/style.css'
    })
    expect(resolver('YCommandPalette')).toEqual({
      name: 'YCommandPalette',
      from: '@yok-ui/product',
      sideEffects: '@yok-ui/product/style.css'
    })
    expect(resolver('YDataTable')).toEqual({
      name: 'YDataTable',
      from: '@yok-ui/admin',
      sideEffects: '@yok-ui/admin/style.css'
    })
    expect(resolver('YBrandHero')).toEqual({
      name: 'YBrandHero',
      from: '@yok-ui/brand',
      sideEffects: '@yok-ui/brand/style.css'
    })
  })

  it('supports disabling style imports and filtering packages', () => {
    const noStyleResolver = YokUiResolver({ importStyle: false })
    const coreOnlyResolver = YokUiResolver({ packages: ['@yok-ui/core'] })

    expect(noStyleResolver('YButton')).toEqual({
      name: 'YButton',
      from: '@yok-ui/core'
    })
    expect(coreOnlyResolver('YButton')).toBeTruthy()
    expect(coreOnlyResolver('YDataTable')).toBeUndefined()
  })

  it('supports explicit component exclusions', () => {
    const resolver = YokUiResolver({ exclude: ['YButton'] })

    expect(resolver('YButton')).toBeUndefined()
    expect(resolver('YInput')).toEqual({
      name: 'YInput',
      from: '@yok-ui/core',
      sideEffects: '@yok-ui/core/style.css'
    })
  })

  it('keeps every documented component available to auto import', () => {
    const resolver = YokUiResolver()

    components.forEach((component) => {
      expect(yokUiComponentPackages, `${component.name} should exist in resolver map`).toHaveProperty(component.name)
      expect(resolver(component.name), `${component.name} should resolve from ${component.packageName}`).toEqual({
        name: component.name,
        from: component.packageName,
        sideEffects: yokUiPackageStyles[component.packageName as YokUiPackageName]
      })
    })
  })

  it('does not resolve API type names as Vue components', () => {
    expect(YokUiResolver()('YTableColumn')).toBeUndefined()
    expect(YokUiResolver()('YFormRule')).toBeUndefined()
  })
})
