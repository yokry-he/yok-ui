import type { Component } from 'vue'
import { createYokInstaller } from '@yok-ui/core'
import { YBrandHero } from './components/brand-hero'
import { YFeatureGrid } from './components/feature-grid'
import { YLogoCloud } from './components/logo-cloud'
import { YProfileCard } from './components/profile-card'

export const brandComponents: Component[] = [
  YBrandHero,
  YFeatureGrid,
  YLogoCloud,
  YProfileCard
]

export const YokBrand = createYokInstaller(brandComponents)

export default YokBrand
