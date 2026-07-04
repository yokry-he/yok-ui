import { defineAsyncComponent, type App, type Component } from 'vue'
import { components, type ComponentPackage } from '../data/componentRegistry'

type YokComponentModule = Record<string, Component>
type YokPackageLoader = () => Promise<YokComponentModule>

const yokPackageLoaders = {
  '@yok-ui/core': () => import('@yok-ui/core') as Promise<YokComponentModule>,
  '@yok-ui/product': () => import('@yok-ui/product') as Promise<YokComponentModule>,
  '@yok-ui/admin': () => import('@yok-ui/admin') as Promise<YokComponentModule>,
  '@yok-ui/brand': () => import('@yok-ui/brand') as Promise<YokComponentModule>
} satisfies Record<ComponentPackage, YokPackageLoader>

const samePageComponentPackages = {
  YCheckboxGroup: '@yok-ui/core',
  YHeader: '@yok-ui/core',
  YAside: '@yok-ui/core',
  YMain: '@yok-ui/core',
  YFooter: '@yok-ui/core'
} satisfies Record<string, ComponentPackage>

export const yokComponentPackages = Object.fromEntries(
  [
    ...components.map((component) => [component.name, component.packageName]),
    ...Object.entries(samePageComponentPackages)
  ]
) as Record<string, ComponentPackage>

export function registerAsyncYokComponents(app: App) {
  Object.entries(yokComponentPackages).forEach(([componentName, packageName]) => {
    app.component(
      componentName,
      defineAsyncComponent(async () => {
        const componentModule = await yokPackageLoaders[packageName]()
        const component = componentModule[componentName]

        if (!component) {
          throw new Error(`Missing ${componentName} export from ${packageName}.`)
        }

        return component
      })
    )
  })
}
