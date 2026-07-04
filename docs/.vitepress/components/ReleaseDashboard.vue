<script setup lang="ts">
import { computed } from 'vue'
import { getReleaseWorkflowSummary } from '../data/releaseWorkflow'

const workflow = computed(() => getReleaseWorkflowSummary())
</script>

<template>
  <section class="release-dashboard" aria-label="Release workflow dashboard">
    <div class="release-dashboard__hero docs-panel">
      <div>
        <p class="docs-eyebrow">release workflow</p>
        <h2>{{ workflow.changelogDraft.title }}</h2>
        <p>
          Release Center 把成熟度页的候选组件转换成可执行发布材料：
          package-scoped 版本计划、Stable 状态提升队列、changelog 草稿和发布前命令门禁。
        </p>
      </div>
      <div class="release-dashboard__stats" aria-label="Release workflow summary">
        <span><strong>{{ workflow.candidateCount }}</strong> candidates</span>
        <span><strong>{{ workflow.blockedCount }}</strong> blocked</span>
        <span><strong>{{ workflow.releasePackages.length }}</strong> packages</span>
        <span><strong>{{ workflow.currentVersion }}</strong> current</span>
        <span><strong>{{ workflow.targetVersion }}</strong> target</span>
      </div>
    </div>

    <div class="release-dashboard__layout">
      <section class="release-dashboard__packages" aria-labelledby="release-packages-title">
        <div class="release-dashboard__section-heading">
          <p class="docs-eyebrow">package plans</p>
          <h2 id="release-packages-title">Package release scope</h2>
        </div>
        <article
          v-for="releasePackage in workflow.releasePackages"
          :key="releasePackage.packageName"
          class="release-dashboard__package docs-card"
        >
          <header class="release-dashboard__package-header">
            <div>
              <h3>{{ releasePackage.packageName }}</h3>
              <p>{{ releasePackage.packageLabel }} · {{ releasePackage.currentVersion }} -> {{ releasePackage.targetVersion }}</p>
            </div>
            <strong>{{ releasePackage.components.length }}</strong>
          </header>
          <ul class="release-dashboard__component-list">
            <li v-for="component in releasePackage.components.slice(0, 6)" :key="component.name" class="release-dashboard__component-item">
              <a :href="component.docs">{{ component.title }}</a>
              <span>{{ component.status }} · {{ component.score }}%</span>
            </li>
          </ul>
        </article>
      </section>

      <aside class="release-dashboard__aside" aria-label="Release verification">
        <section class="release-dashboard__checklist docs-card">
          <p class="docs-eyebrow">required gates</p>
          <h3>Publish checklist</h3>
          <ul class="release-dashboard__checklist-list">
            <li v-for="item in workflow.checklist" :key="item.id" class="release-dashboard__checklist-item">
              <strong>{{ item.label }}</strong>
              <code>{{ item.command }}</code>
              <span>{{ item.evidence }}</span>
            </li>
          </ul>
        </section>

        <section class="release-dashboard__artifacts docs-card">
          <p class="docs-eyebrow">dry-run output</p>
          <h3>Generated artifacts</h3>
          <ul class="release-dashboard__artifact-list">
            <li v-for="artifact in workflow.artifacts" :key="artifact.path" class="release-dashboard__artifact-item">
              <strong>{{ artifact.label }}</strong>
              <code>{{ artifact.path }}</code>
              <span>{{ artifact.description }}</span>
            </li>
          </ul>
        </section>

        <section class="release-dashboard__promotion docs-card">
          <p class="docs-eyebrow">status queue</p>
          <h3>Stable promotions</h3>
          <ul class="release-dashboard__promotion-list">
            <li v-for="item in workflow.promotionQueue.slice(0, 10)" :key="item.name" class="release-dashboard__promotion-item">
              <a :href="item.docs">{{ item.title }}</a>
              <span>{{ item.packageLabel }} · {{ item.fromStatus }} -> {{ item.nextStatus }}</span>
            </li>
          </ul>
          <a class="release-dashboard__evidence-link" :href="workflow.promotionQueue[0]?.evidenceHref ?? '/resources/maturity'">
            Review maturity evidence
          </a>
        </section>
      </aside>
    </div>

    <section class="release-dashboard__changelog docs-card" aria-labelledby="release-changelog-title">
      <div class="release-dashboard__section-heading">
        <p class="docs-eyebrow">generated changelog</p>
        <h2 id="release-changelog-title">Changelog draft</h2>
      </div>
      <pre><code>{{ workflow.changelogDraft.markdown }}</code></pre>
    </section>
  </section>
</template>
