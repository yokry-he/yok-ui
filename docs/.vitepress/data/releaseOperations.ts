export interface ReleasePackageOperation {
  name: string
  level: number
  npmUrl: string
  sourceUrl: string
  description: string
}

export interface ReleaseCommandOperation {
  id: string
  label: string
  command: string
  purpose: string
  caution: string
}

export interface ReleaseMirrorOperation {
  label: string
  command: string
  purpose: string
}

export interface ReleaseOperations {
  version: string
  tag: string
  actionsUrl: string
  repositoryUrl: string
  packages: ReleasePackageOperation[]
  commands: ReleaseCommandOperation[]
  github: {
    environmentName: string
    trustedPublisher: string
    workflowFile: string
    notes: string[]
  }
  vercel: {
    dashboardUrl: string
    buildCommand: string
    outputDirectory: string
    notes: string[]
  }
  mirrors: ReleaseMirrorOperation[]
  cautions: string[]
}

const repositoryUrl = 'https://github.com/yokry-he/yok-ui'
const packageNames = [
  ['@yok-ui/themes', 0, 'Theme tokens and generated CSS themes'],
  ['@yok-ui/hooks', 0, 'Reusable Vue composables'],
  ['@yok-ui/icons', 0, 'SVG icon components and icon paths'],
  ['@yok-ui/resolver', 0, 'Resolver helpers for automatic component imports'],
  ['@yok-ui/core', 1, 'Core Vue components and shared styles'],
  ['@yok-ui/product', 2, 'Productivity components for command and copy workflows'],
  ['@yok-ui/admin', 2, 'Admin page, data and workflow components'],
  ['@yok-ui/brand', 2, 'Brand and marketing-oriented components']
] as const

export const releaseOperations: ReleaseOperations = {
  version: '0.1.0',
  tag: 'latest',
  repositoryUrl,
  actionsUrl: `${repositoryUrl}/actions/workflows/publish.yml`,
  packages: packageNames.map(([name, level, description]) => ({
    name,
    level,
    description,
    npmUrl: `https://www.npmjs.com/package/${encodeURIComponent(name)}`,
    sourceUrl: `${repositoryUrl}/tree/main/packages/${name.replace('@yok-ui/', '')}`
  })),
  commands: [
    {
      id: 'test',
      label: 'Unit and docs tests',
      command: 'pnpm test',
      purpose: '验证组件行为、文档数据、示例源码和发布策略测试。',
      caution: '如果出现端口占用提示，以进程退出码为准；失败时先处理测试原因。'
    },
    {
      id: 'typecheck',
      label: 'TypeScript contracts',
      command: 'pnpm typecheck',
      purpose: '验证八个 workspace package 的声明、泛型和 Vue 组件类型。',
      caution: '发布前不能跳过，类型入口会被干净消费者安装测试复用。'
    },
    {
      id: 'docs-build',
      label: 'Documentation build',
      command: 'pnpm docs:build',
      purpose: '验证 VitePress 生产构建和路由输出。',
      caution: 'Vercel 也会执行同一条命令。'
    },
    {
      id: 'verify',
      label: 'Package artifact verification',
      command: 'pnpm release:verify',
      purpose: '构建 tarball，检查 package exports、CSS、类型入口，并安装到临时干净项目。',
      caution: '这是 npm 发布前最关键的本地验证。'
    },
    {
      id: 'dry-run',
      label: 'Publication dry-run',
      command: 'pnpm release:publish -- --version 0.1.0 --tag latest --dry-run',
      purpose: '构建发布材料并查询 npm registry，不执行 npm publish。',
      caution: '用于确认包顺序、registry 状态和 publish receipt 内容。'
    },
    {
      id: 'publish-local',
      label: 'First local publication',
      command: 'pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release',
      purpose: '首次公开发布八个包。本地终端会由 npm 接管交互。',
      caution: '需要先完成 npm login，并在终端中按 npm 提示完成 2FA。'
    }
  ],
  github: {
    environmentName: 'npm',
    trustedPublisher: 'GitHub Actions -> yokry-he/yok-ui -> publish.yml -> npm',
    workflowFile: '.github/workflows/publish.yml',
    notes: [
      '工作流必须手动触发，并通过 GitHub Environment 审批。',
      '仓库不需要长期 npm 凭据；发布身份来自 GitHub OIDC。',
      'npm 每个 @yok-ui/* 包都需要单独配置 Trusted Publisher。'
    ]
  },
  vercel: {
    dashboardUrl: 'https://vercel.com/dashboard',
    buildCommand: 'pnpm docs:build',
    outputDirectory: 'docs/.vitepress/dist',
    notes: [
      'Vercel 项目根目录选择仓库根目录。',
      'vercel.json 固定 installCommand、buildCommand 和 outputDirectory。',
      '.vercel/ 只保存本地链接状态，不提交到仓库。'
    ]
  },
  mirrors: [
    {
      label: 'Use npmmirror for install verification',
      command: 'npm config set registry https://registry.npmmirror.com',
      purpose: '切换到国内镜像，检查发布包是否已同步。'
    },
    {
      label: 'Restore npm official registry',
      command: 'npm config set registry https://registry.npmjs.org',
      purpose: '发布和 Trusted Publishing 始终使用官方 registry。'
    },
    {
      label: 'Verify package on mirror',
      command: 'npm view @yok-ui/core@0.1.0 version --registry https://registry.npmmirror.com',
      purpose: '确认镜像已经能读取指定版本。'
    }
  ],
  cautions: [
    '不要在网页、命令参数、文档、commit 或日志中写入 npm 凭据和一次性验证码。',
    '已存在版本不可覆盖；脚本只会跳过 registry integrity 完全一致的包。',
    '如果中途失败，修复原因后重新执行发布命令，已发布且 integrity 一致的包会自动跳过。',
    'Vercel 先使用 preview 验证，生产部署必须在确认文档站内容和 npm 包可安装后再执行。'
  ]
}
