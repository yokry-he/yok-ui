<script setup lang="ts">
import { ref } from 'vue'
import { releaseOperations } from '../data/releaseOperations'

const copiedCommandId = ref('')

async function copyCommand(commandId: string, command: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  await navigator.clipboard.writeText(command)
  copiedCommandId.value = commandId
  window.setTimeout(() => {
    if (copiedCommandId.value === commandId) copiedCommandId.value = ''
  }, 1800)
}
</script>

<template>
  <section class="release-dashboard" aria-label="Release Operations">
    <div class="release-dashboard__hero docs-panel">
      <div>
        <p class="docs-eyebrow">release operations</p>
        <h2>Release Operations</h2>
        <p>
          这里集中管理 Yok UI 的 npm 发布、GitHub Trusted Publishing、Vercel 文档部署和国内镜像验证入口。
          页面只提供公开链接和可复制命令，不接收任何发布凭据。
        </p>
      </div>
      <div class="release-dashboard__hero-actions" aria-label="Release operation links">
        <a :href="releaseOperations.vercel.siteUrl" target="_blank" rel="noreferrer">Open documentation</a>
        <a :href="releaseOperations.actionsUrl" target="_blank" rel="noreferrer">Open GitHub workflow</a>
        <a :href="releaseOperations.vercel.dashboardUrl" target="_blank" rel="noreferrer">Open Vercel dashboard</a>
      </div>
    </div>

    <section class="release-dashboard__section" aria-labelledby="release-packages-title">
      <div class="release-dashboard__section-heading">
        <p class="docs-eyebrow">npm packages</p>
        <h2 id="release-packages-title">Public package order</h2>
        <p>
          发布脚本按依赖层级处理包：level 0 基础包先发布，Core 随后发布，Product、Admin 和 Brand 最后发布。
        </p>
      </div>
      <div class="release-dashboard__package-grid">
        <article
          v-for="releasePackage in releaseOperations.packages"
          :key="releasePackage.name"
          class="release-dashboard__package docs-card"
        >
          <span class="release-dashboard__level">level {{ releasePackage.level }}</span>
          <h3>{{ releasePackage.name }}</h3>
          <p>{{ releasePackage.description }}</p>
          <div class="release-dashboard__links">
            <a :href="releasePackage.npmUrl" target="_blank" rel="noreferrer">npm</a>
            <a :href="releasePackage.sourceUrl" target="_blank" rel="noreferrer">source</a>
          </div>
        </article>
      </div>
    </section>

    <section class="release-dashboard__section" aria-labelledby="release-commands-title">
      <div class="release-dashboard__section-heading">
        <p class="docs-eyebrow">commands</p>
        <h2 id="release-commands-title">Local verification and first publish</h2>
        <p>
          默认发布命令是 dry-run；只有显式添加 <code>--confirm-public-release</code> 才会进入真实 npm 发布流程。
        </p>
      </div>
      <div class="release-dashboard__command-list">
        <article
          v-for="command in releaseOperations.commands"
          :key="command.id"
          class="release-dashboard__command docs-card"
        >
          <div>
            <h3>{{ command.label }}</h3>
            <p>{{ command.purpose }}</p>
          </div>
          <div class="release-dashboard__command-code">
            <code>{{ command.command }}</code>
            <button type="button" @click="copyCommand(command.id, command.command)">
              {{ copiedCommandId === command.id ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="release-dashboard__caution">{{ command.caution }}</p>
        </article>
      </div>
    </section>

    <div class="release-dashboard__columns">
      <section class="release-dashboard__panel docs-card" aria-labelledby="github-publish-title">
        <p class="docs-eyebrow">github oidc</p>
        <h2 id="github-publish-title">GitHub Trusted Publishing</h2>
        <dl>
          <div>
            <dt>Environment</dt>
            <dd>{{ releaseOperations.github.environmentName }}</dd>
          </div>
          <div>
            <dt>Workflow</dt>
            <dd>{{ releaseOperations.github.workflowFile }}</dd>
          </div>
          <div>
            <dt>Trusted Publisher</dt>
            <dd>{{ releaseOperations.github.trustedPublisher }}</dd>
          </div>
        </dl>
        <ul>
          <li v-for="note in releaseOperations.github.notes" :key="note">{{ note }}</li>
        </ul>
      </section>

      <section class="release-dashboard__panel docs-card" aria-labelledby="vercel-docs-title">
        <p class="docs-eyebrow">vercel</p>
        <h2 id="vercel-docs-title">Vercel documentation</h2>
        <dl>
          <div>
            <dt>Production site</dt>
            <dd>
              <a :href="releaseOperations.vercel.siteUrl" target="_blank" rel="noreferrer">
                {{ releaseOperations.vercel.siteUrl }}
              </a>
            </dd>
          </div>
          <div>
            <dt>Build command</dt>
            <dd>{{ releaseOperations.vercel.buildCommand }}</dd>
          </div>
          <div>
            <dt>Output directory</dt>
            <dd>{{ releaseOperations.vercel.outputDirectory }}</dd>
          </div>
        </dl>
        <ul>
          <li v-for="note in releaseOperations.vercel.notes" :key="note">{{ note }}</li>
        </ul>
      </section>
    </div>

    <section class="release-dashboard__section" aria-labelledby="mirror-title">
      <div class="release-dashboard__section-heading">
        <p class="docs-eyebrow">registry mirrors</p>
        <h2 id="mirror-title">npmmirror verification</h2>
        <p>
          国内镜像只用于安装和同步验证。发布、Trusted Publishing 和 integrity 判断始终以 npm 官方 registry 为准。
        </p>
      </div>
      <div class="release-dashboard__mirror-list">
        <article v-for="mirror in releaseOperations.mirrors" :key="mirror.command" class="release-dashboard__command docs-card">
          <h3>{{ mirror.label }}</h3>
          <p>{{ mirror.purpose }}</p>
          <div class="release-dashboard__command-code">
            <code>{{ mirror.command }}</code>
            <button type="button" @click="copyCommand(mirror.command, mirror.command)">
              {{ copiedCommandId === mirror.command ? 'Copied' : 'Copy' }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="release-dashboard__section release-dashboard__cautions docs-panel" aria-labelledby="release-cautions-title">
      <p class="docs-eyebrow">safety boundary</p>
      <h2 id="release-cautions-title">Operational cautions</h2>
      <ul>
        <li v-for="caution in releaseOperations.cautions" :key="caution">{{ caution }}</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.release-dashboard {
  display: grid;
  gap: 32px;
}

.release-dashboard__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.release-dashboard__hero h2,
.release-dashboard__section-heading h2,
.release-dashboard__panel h2 {
  margin: 0;
}

.release-dashboard__hero p,
.release-dashboard__section-heading p,
.release-dashboard__package p,
.release-dashboard__command p,
.release-dashboard__panel li,
.release-dashboard__cautions li {
  color: var(--yok-text-muted);
}

.release-dashboard__hero-actions,
.release-dashboard__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.release-dashboard__hero-actions a,
.release-dashboard__links a,
.release-dashboard__command-code button {
  border: 1px solid var(--yok-border);
  border-radius: 8px;
  background: var(--yok-surface);
  color: var(--yok-primary);
  font: inherit;
  font-weight: 700;
  padding: 8px 12px;
  text-decoration: none;
}

.release-dashboard__section {
  display: grid;
  gap: 18px;
}

.release-dashboard__section-heading {
  display: grid;
  gap: 8px;
}

.release-dashboard__package-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.release-dashboard__package,
.release-dashboard__command,
.release-dashboard__panel {
  display: grid;
  gap: 12px;
}

.release-dashboard__level {
  color: var(--yok-primary);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.release-dashboard__command-list,
.release-dashboard__mirror-list {
  display: grid;
  gap: 12px;
}

.release-dashboard__command-code {
  align-items: center;
  background: var(--yok-surface-soft);
  border: 1px solid var(--yok-border);
  border-radius: 8px;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 10px;
}

.release-dashboard__command-code code {
  overflow-wrap: anywhere;
}

.release-dashboard__caution {
  margin: 0;
}

.release-dashboard__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.release-dashboard__panel dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.release-dashboard__panel dl div {
  display: grid;
  gap: 4px;
}

.release-dashboard__panel dt {
  color: var(--yok-text-muted);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.release-dashboard__panel dd {
  margin: 0;
}

.release-dashboard__panel ul,
.release-dashboard__cautions ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
}

@media (max-width: 1100px) {
  .release-dashboard__package-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .release-dashboard__hero,
  .release-dashboard__columns {
    grid-template-columns: 1fr;
  }

  .release-dashboard__hero {
    display: grid;
  }

  .release-dashboard__package-grid {
    grid-template-columns: 1fr;
  }
}
</style>
