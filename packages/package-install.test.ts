import { createApp } from 'vue'
import YokCore, { YokCore as NamedYokCore } from '@yok-ui/core'
import YokProduct, { YokProduct as NamedYokProduct } from '@yok-ui/product'
import YokAdmin, { YokAdmin as NamedYokAdmin } from '@yok-ui/admin'
import YokBrand, { YokBrand as NamedYokBrand } from '@yok-ui/brand'
import { describe, expect, it } from 'vitest'
import { components, type ComponentPackage } from '../docs/.vitepress/data/componentRegistry'

const installers = {
  '@yok-ui/core': YokCore,
  '@yok-ui/product': YokProduct,
  '@yok-ui/admin': YokAdmin,
  '@yok-ui/brand': YokBrand
} satisfies Record<ComponentPackage, typeof YokCore>

describe('package installers', () => {
  it('exports default and named Vue plugins for every component package', () => {
    expect(YokCore).toBe(NamedYokCore)
    expect(YokProduct).toBe(NamedYokProduct)
    expect(YokAdmin).toBe(NamedYokAdmin)
    expect(YokBrand).toBe(NamedYokBrand)
  })

  it('registers every documented component through its package installer', () => {
    Object.entries(installers).forEach(([packageName, installer]) => {
      const app = createApp({})
      const packageComponents = components.filter((component) => component.packageName === packageName)

      app.use(installer)

      packageComponents.forEach((component) => {
        expect(
          app.component(component.name),
          `${component.name} should be registered by ${packageName}`
        ).toBeTruthy()
      })
    })
  })
})
