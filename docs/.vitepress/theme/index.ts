import { defineAsyncComponent } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ComponentApiSection from '../components/ComponentApiSection.vue'
import DocDemo from '../components/DocDemo.vue'
import Layout from './Layout.vue'
import { registerAsyncYokComponents } from './yokAsyncComponents'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
import '@yok-ui/themes/yok-candy.css'
import '@yok-ui/themes/yok-mint.css'
import '@yok-ui/themes/yok-ocean.css'
import '@yok-ui/themes/yok-sakura.css'
import '@yok-ui/themes/yok-lavender.css'
import '@yok-ui/themes/yok-sunrise.css'
import '@yok-ui/themes/yok-forest.css'
import '@yok-ui/themes/yok-ink.css'
import '@yok-ui/themes/yok-peach.css'
import '@yok-ui/themes/yok-slate.css'
import '@yok-ui/core/styles/base.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    registerAsyncYokComponents(app)

    app.component('ComponentApiSection', ComponentApiSection)
    app.component('DocDemo', DocDemo)
    app.component('ApiReferenceExplorer', defineAsyncComponent(() => import('../components/ApiReferenceExplorer.vue')))
    app.component('ComponentCatalog', defineAsyncComponent(() => import('../components/ComponentCatalog.vue')))
    app.component('IconGallery', defineAsyncComponent(() => import('../components/IconGallery.vue')))
    app.component('LiveExampleMatrix', defineAsyncComponent(() => import('../components/LiveExampleMatrix.vue')))
    app.component('PackageComponents', defineAsyncComponent(() => import('../components/PackageComponents.vue')))
    app.component('ReleaseDashboard', defineAsyncComponent(() => import('../components/ReleaseDashboard.vue')))
    app.component('ReleaseVerification', defineAsyncComponent(() => import('../components/ReleaseVerification.vue')))
    app.component('SourceFileReference', defineAsyncComponent(() => import('../components/SourceFileReference.vue')))
    app.component('ThemeLab', defineAsyncComponent(() => import('../components/ThemeLab.vue')))
    app.component('VerificationDashboard', defineAsyncComponent(() => import('../components/VerificationDashboard.vue')))
    app.component('VersionHistory', defineAsyncComponent(() => import('../components/VersionHistory.vue')))
  }
}
