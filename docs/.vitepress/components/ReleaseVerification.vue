<script setup lang="ts">
import { computed } from 'vue'
import { packageLabels, type ComponentPackage } from '../data/componentRegistry'
import { getComponentVerificationItems } from '../data/componentVerification'

const verificationItems = getComponentVerificationItems()

const releaseCommands = [
  { label: 'Release plan dry-run', command: 'pnpm release:dry-run' },
  { label: 'TypeScript contracts', command: 'pnpm typecheck' },
  { label: 'Unit and docs tests', command: 'pnpm test' },
  { label: 'Package artifacts', command: 'pnpm build' },
  { label: 'Documentation build', command: 'pnpm docs:build' },
  {
    label: 'Runtime browser audit',
    command: 'DOCS_A11Y_BASE_URL=http://127.0.0.1:5173 pnpm docs:a11y:runtime'
  }
]

const releaseCandidates = computed(() =>
  verificationItems.filter((item) => item.releaseReady)
)

const blockedComponents = computed(() =>
  verificationItems.filter((item) => item.component.status === 'Stable' && !item.releaseReady)
)

const candidatePackages = computed(() => {
  const packageNames: ComponentPackage[] = ['@yok-ui/core', '@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand']

  return packageNames
    .map((packageName) => ({
      packageName,
      packageLabel: packageLabels[packageName],
      components: releaseCandidates.value.filter((item) => item.component.packageName === packageName)
    }))
    .filter((item) => item.components.length)
})
</script>

<template>
  <section class="release-verification" aria-label="Verified release candidates">
    <div class="catalog-metrics release-verification__metrics">
      <div>
        <strong>{{ releaseCandidates.length }}</strong>
        <span>verified candidates</span>
      </div>
      <div>
        <strong>{{ blockedComponents.length }}</strong>
        <span>stable but blocked</span>
      </div>
      <div>
        <strong>{{ candidatePackages.length }}</strong>
        <span>candidate packages</span>
      </div>
      <div>
        <strong>{{ releaseCommands.length }}</strong>
        <span>required gates</span>
      </div>
    </div>

    <section class="release-verification__band" aria-labelledby="candidate-packages-title">
      <header>
        <p class="docs-eyebrow">Verified scope</p>
        <h2 id="candidate-packages-title">Package candidates</h2>
        <p>只有 Stable、示例完整且通过三视口浏览器审计的组件才会出现在这里。</p>
      </header>
      <div v-if="candidatePackages.length" class="release-verification__packages">
        <article v-for="item in candidatePackages" :key="item.packageName">
          <h3>{{ item.packageLabel }}</h3>
          <code>{{ item.packageName }}</code>
          <ul>
            <li v-for="candidate in item.components" :key="candidate.component.name">
              <a :href="candidate.component.docs">{{ candidate.component.title }}</a>
              <span>{{ candidate.verifiedViewports.join(', ') }}</span>
            </li>
          </ul>
        </article>
      </div>
      <p v-else class="release-verification__empty">
        当前没有满足全部证据门禁的组件。请先运行真实浏览器审计。
      </p>
    </section>

    <section class="release-verification__band" aria-labelledby="release-gates-title">
      <header>
        <p class="docs-eyebrow">Required gates</p>
        <h2 id="release-gates-title">Publish checklist</h2>
      </header>
      <ol class="release-verification__commands">
        <li v-for="item in releaseCommands" :key="item.command">
          <strong>{{ item.label }}</strong>
          <code>{{ item.command }}</code>
        </li>
      </ol>
    </section>

    <section class="release-verification__band" aria-labelledby="blocked-components-title">
      <header>
        <p class="docs-eyebrow">Blocked stable components</p>
        <h2 id="blocked-components-title">仍需补充证据</h2>
      </header>
      <div class="docs-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Current stage</th>
              <th>Missing gate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in blockedComponents.slice(0, 20)" :key="item.component.name">
              <td><a :href="item.component.docs"><code>{{ item.component.name }}</code></a></td>
              <td>{{ item.stage }}</td>
              <td>{{ item.exampleReady ? 'browser verification' : 'complete DocDemo source' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.release-verification {
  display: grid;
  gap: 28px;
  margin: 28px 0;
}

.release-verification__metrics {
  margin: 0;
}

.release-verification__band {
  display: grid;
  gap: 20px;
  padding-block: 24px;
  border-block: 1px solid var(--yok-color-border);
}

.release-verification__band > header {
  display: grid;
  gap: 8px;
}

.release-verification__band > header h2,
.release-verification__band > header p {
  margin: 0;
}

.release-verification__packages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.release-verification__packages article {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--yok-color-border);
  border-radius: 8px;
  background: var(--yok-color-surface);
}

.release-verification__packages h3 {
  margin: 0 0 4px;
}

.release-verification__packages ul {
  display: grid;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.release-verification__packages li,
.release-verification__commands li {
  display: grid;
  gap: 4px;
}

.release-verification__packages span,
.release-verification__empty {
  color: var(--yok-color-text-secondary);
  font-size: 13px;
}

.release-verification__commands {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.release-verification__commands li {
  min-width: 0;
  padding: 14px 0;
  border-bottom: 1px solid var(--yok-color-border);
}

.release-verification__commands code {
  overflow-wrap: anywhere;
}
</style>
