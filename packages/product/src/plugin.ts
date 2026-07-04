import type { Component } from 'vue'
import { createYokInstaller } from '@yok-ui/core'
import { YCodeBlock } from './components/code-block'
import { YCommandPalette } from './components/command-palette'
import { YCopyButton } from './components/copy-button'
import { YThemeSwitcher } from './components/theme-switcher'

export const productComponents: Component[] = [
  YCodeBlock,
  YCommandPalette,
  YCopyButton,
  YThemeSwitcher
]

export const YokProduct = createYokInstaller(productComponents)

export default YokProduct
