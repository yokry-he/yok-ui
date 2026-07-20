<script setup lang="ts">
import { computed } from 'vue'
import runtimeReport from '../data/a11y-runtime-report.generated.json'
import {
  getComponentVerificationItems,
  getComponentVerificationSummary,
  type ComponentVerificationStage
} from '../data/componentVerification'

const verificationItems = getComponentVerificationItems()
const summary = getComponentVerificationSummary()

const stageMeta: Record<ComponentVerificationStage, { label: string; description: string }> = {
  registered: {
    label: 'Registered',
    description: '组件只进入目录，不代表已经具备可交付文档或测试证据。'
  },
  documented: {
    label: 'Documented',
    description: '存在真实组件文档和示例，但源码交接仍未达到完整要求。'
  },
  'example-ready': {
    label: 'Example ready',
    description: 'DocDemo 已提供可复制的 Vue SFC 源码和完整 setup。'
  },
  'browser-verified': {
    label: 'Browser verified',
    description: '最近一次生成报告已通过桌面、平板和手机视口检查。'
  },
  'release-ready': {
    label: 'Release ready',
    description: 'Stable 组件同时具备完整示例和三视口浏览器证据。'
  }
}

const stageCounts = computed(() =>
  (Object.keys(stageMeta) as ComponentVerificationStage[]).map((stage) => ({
    stage,
    ...stageMeta[stage],
    count: verificationItems.filter((item) => item.stage === stage).length
  }))
)

const nextVerificationQueue = computed(() => {
  const stageOrder: Record<ComponentVerificationStage, number> = {
    registered: 0,
    documented: 1,
    'example-ready': 2,
    'browser-verified': 3,
    'release-ready': 4
  }

  return verificationItems
    .filter((item) => !item.releaseReady)
    .sort((left, right) =>
      stageOrder[right.stage] - stageOrder[left.stage] ||
      left.component.title.localeCompare(right.component.title)
    )
    .slice(0, 16)
})

const reportGeneratedAt = computed(() => {
  const value = new Date(runtimeReport.generatedAt)

  return Number.isNaN(value.getTime()) ? runtimeReport.generatedAt : value.toLocaleString()
})
</script>

<template>
  <section class="verification-dashboard" aria-label="Component verification maturity">
    <div class="catalog-metrics verification-dashboard__metrics">
      <div>
        <strong>{{ summary.registeredComponents }}</strong>
        <span>registered components</span>
      </div>
      <div>
        <strong>{{ summary.exampleReadyRoutes }}</strong>
        <span>example ready routes</span>
      </div>
      <div>
        <strong>{{ summary.browserVerifiedRoutes }}</strong>
        <span>browser verified routes</span>
      </div>
      <div>
        <strong>{{ summary.releaseReadyComponents }}</strong>
        <span>release ready components</span>
      </div>
    </div>

    <section class="verification-dashboard__band" aria-labelledby="verification-ladder-title">
      <header>
        <p class="docs-eyebrow">Evidence ladder</p>
        <h2 id="verification-ladder-title">登记不等于验证</h2>
        <p>每个阶段都要求上一阶段的证据，浏览器验证只读取生成的运行时报告。</p>
      </header>
      <div class="verification-dashboard__stages">
        <article v-for="item in stageCounts" :key="item.stage">
          <strong>{{ item.count }}</strong>
          <h3>{{ item.label }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="verification-dashboard__band" aria-labelledby="browser-report-title">
      <header>
        <p class="docs-eyebrow">Browser report</p>
        <h2 id="browser-report-title">最近一次真实页面审计</h2>
      </header>
      <dl class="verification-dashboard__report">
        <div>
          <dt>Generated</dt>
          <dd>{{ reportGeneratedAt }}</dd>
        </div>
        <div>
          <dt>Routes and viewports</dt>
          <dd>{{ runtimeReport.summary.passed }} / {{ runtimeReport.summary.total }} passed</dd>
        </div>
        <div>
          <dt>Issues</dt>
          <dd>{{ runtimeReport.summary.issueCount }}</dd>
        </div>
      </dl>
    </section>

    <section class="verification-dashboard__band" aria-labelledby="verification-queue-title">
      <header>
        <p class="docs-eyebrow">Next verification queue</p>
        <h2 id="verification-queue-title">下一批需要真实浏览器证据的组件</h2>
      </header>
      <div class="docs-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Stage</th>
              <th>Example</th>
              <th>Browser</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in nextVerificationQueue" :key="item.component.name">
              <td><a :href="item.component.docs"><code>{{ item.component.name }}</code></a></td>
              <td>{{ stageMeta[item.stage].label }}</td>
              <td>{{ item.exampleReady ? 'ready' : 'needed' }}</td>
              <td>{{ item.browserVerified ? item.verifiedViewports.join(', ') : 'not verified' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.verification-dashboard {
  display: grid;
  gap: 28px;
  margin: 28px 0;
}

.verification-dashboard__metrics {
  margin: 0;
}

.verification-dashboard__band {
  display: grid;
  gap: 20px;
  padding-block: 24px;
  border-block: 1px solid var(--yok-color-border);
}

.verification-dashboard__band > header h2,
.verification-dashboard__band > header p {
  margin: 0;
}

.verification-dashboard__band > header {
  display: grid;
  gap: 8px;
}

.verification-dashboard__stages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.verification-dashboard__stages article {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--yok-color-border);
  border-radius: 8px;
  background: var(--yok-color-surface);
}

.verification-dashboard__stages strong {
  color: var(--yok-color-primary);
  font-size: 28px;
}

.verification-dashboard__stages h3 {
  margin: 8px 0 4px;
  font-size: 16px;
}

.verification-dashboard__stages p {
  margin: 0;
  color: var(--yok-color-text-secondary);
  font-size: 14px;
}

.verification-dashboard__report {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 0;
}

.verification-dashboard__report div {
  padding: 12px 0;
}

.verification-dashboard__report dt {
  color: var(--yok-color-text-secondary);
  font-size: 13px;
}

.verification-dashboard__report dd {
  margin: 4px 0 0;
  font-weight: 700;
}
</style>
