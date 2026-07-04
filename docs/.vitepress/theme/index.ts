import { defineAsyncComponent } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ComponentAccessibilityEvidence from '../components/ComponentAccessibilityEvidence.vue'
import ComponentApiSection from '../components/ComponentApiSection.vue'
import DocDemo from '../components/DocDemo.vue'
import Layout from './Layout.vue'
import { registerAsyncYokComponents } from './yokAsyncComponents'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
import '@yok-ui/themes/yok-candy.css'
import '@yok-ui/core/styles/base.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    registerAsyncYokComponents(app)

    app.component('ComponentApiSection', ComponentApiSection)
    app.component('ComponentAccessibilityEvidence', ComponentAccessibilityEvidence)
    app.component('DocDemo', DocDemo)
    app.component('ApiReferenceExplorer', defineAsyncComponent(() => import('../components/ApiReferenceExplorer.vue')))
    app.component('ComponentCatalog', defineAsyncComponent(() => import('../components/ComponentCatalog.vue')))
    app.component('LiveExampleRunner', defineAsyncComponent(() => import('../components/LiveExampleRunner.vue')))
    app.component('LiveExampleMatrix', defineAsyncComponent(() => import('../components/LiveExampleMatrix.vue')))
    app.component('MaturityDashboard', defineAsyncComponent(() => import('../components/MaturityDashboard.vue')))
    app.component('PackageComponents', defineAsyncComponent(() => import('../components/PackageComponents.vue')))
    app.component('PlaygroundWorkbench', defineAsyncComponent(() => import('../components/PlaygroundWorkbench.vue')))
    app.component('ReleaseDashboard', defineAsyncComponent(() => import('../components/ReleaseDashboard.vue')))
    app.component('SourceFileReference', defineAsyncComponent(() => import('../components/SourceFileReference.vue')))
    app.component('ThemeLab', defineAsyncComponent(() => import('../components/ThemeLab.vue')))
    app.component('VersionHistory', defineAsyncComponent(() => import('../components/VersionHistory.vue')))
  }
}
