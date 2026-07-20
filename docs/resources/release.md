# Release Center

Release Center 用于管理 Yok UI 的公开发布流程：本地首发 npm、GitHub OIDC 可信发布、Vercel 文档站部署，以及国内镜像同步验证。

<ReleaseDashboard />

## 先理解这套流程

Yok UI 当前拆成 8 个 npm 包：`@yok-ui/themes`、`@yok-ui/hooks`、`@yok-ui/icons`、`@yok-ui/resolver`、`@yok-ui/core`、`@yok-ui/product`、`@yok-ui/admin`、`@yok-ui/brand`。

发布顺序不是随意的：

1. `themes`、`hooks`、`icons`、`resolver` 没有依赖其他 Yok UI 包，先发布。
2. `core` 依赖基础包，第二层发布。
3. `product`、`admin`、`brand` 依赖 Core，最后发布。

发布脚本会按这个顺序构建 tarball、查询 npm registry、发布缺失包、校验发布后的 `dist.integrity`。如果某个版本已经存在并且 integrity 完全一致，脚本会跳过；如果版本存在但 integrity 不一致，脚本会停止，因为 npm 版本不可覆盖。

## 本地发布前检查

在任何真实发布前，先执行：

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm docs:build
pnpm release:verify
pnpm release:publish -- --version 0.1.0 --tag latest --dry-run
```

这些命令分别验证：

- `pnpm test`：组件行为、文档数据、发布策略和示例工具链。
- `pnpm typecheck`：所有 workspace package 的 TypeScript 与 Vue 类型。
- `pnpm docs:build`：VitePress 文档站是否能生产构建。
- `pnpm release:verify`：构建 8 个 tarball，并在临时干净项目中安装验证 ESM、类型入口和 CSS 入口。
- `--dry-run`：查询 npm registry 并生成发布收据，但不会执行 `npm publish`。

## 首次 npm 公开发布

首次发布需要你本地登录 npm，因为包还没有配置 Trusted Publishing。

```bash
npm login --auth-type=web --registry https://registry.npmjs.org/
npm whoami --registry https://registry.npmjs.org/
npm access list packages yok-ui --registry https://registry.npmjs.org/
```

确认账号具备 `yok-ui` 组织发布权限后执行：

```bash
pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release
```

注意事项：

- 真实发布必须显式加 `--confirm-public-release`。
- 不要在命令中传 npm token 或 OTP。npm 如需 2FA，会在终端里提示你输入。
- `npm login --auth-type=web` 会把一次性认证页面交给浏览器。认证完成后，凭据由 npm CLI 写入用户级配置；不要把 `~/.npmrc`、token 或认证 URL 提交到仓库。
- 发布脚本会写入 `outputs/publish/0.1.0/publish-receipt.json`，该文件记录每个包的状态、tarball integrity、字节大小和失败阶段。
- 如果中途失败，先看 receipt 的 `failure.stage`。修复后重新执行同一条命令，已发布且 integrity 一致的包会自动跳过。
- 新建 scoped package 首次发布后，npm 网页可能已经显示成功，但 registry 读取仍会短暂返回 `E404`。脚本会以线性退避等待约 4.6 分钟；若仍超时，不要再次手工执行 `npm publish`，先等待 registry 同步，再重跑同一条发布命令。脚本会核对 integrity 并安全跳过已发布包。

发布后验证：

```bash
npm view @yok-ui/core@0.1.0 version dist.integrity repository --json --registry https://registry.npmjs.org/
pnpm release:verify --registry --version 0.1.0
```

第一条命令确认版本、产物 integrity 和源码仓库信息；第二条命令会从 npm 官方 registry 安装全部 8 个真实发布版本，而不是安装本地 tarball，并验证 ESM、类型声明和 CSS exports。

## GitHub Trusted Publishing

首次本地发布成功后，为每个 `@yok-ui/*` 包配置 npm Trusted Publisher。配置值必须一致：

```text
Provider: GitHub Actions
Owner: yokry-he
Repository: yok-ui
Workflow filename: publish.yml
Environment: npm
```

GitHub 仓库还需要创建名为 `npm` 的 Environment，并设置 required reviewer。这样手动触发 `.github/workflows/publish.yml` 后，GitHub 会先等待审批，通过后才进入发布 job。

这套方式的意义：

- 不需要在 GitHub 仓库保存 `NPM_TOKEN`。
- GitHub Actions 使用 `id-token: write` 向 npm 证明工作流身份。
- npm 根据 Trusted Publisher 配置判断该 workflow 是否允许发布对应 package。

触发发布时使用 GitHub Actions 页面：

```text
Actions -> Publish packages -> Run workflow
version: 0.1.0
tag: latest
```

工作流内部会执行：

```bash
pnpm test
pnpm typecheck
pnpm docs:build
pnpm release:verify
pnpm release:publish -- --version "<version>" --tag "<tag>" --provenance --confirm-public-release
```

## Vercel 文档站

Vercel 项目根目录选择仓库根目录，不要选择 `docs/` 子目录。仓库根目录的 `vercel.json` 已固定构建方式：

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm docs:build",
  "outputDirectory": "docs/.vitepress/dist"
}
```

首次链接：

```bash
vercel login
vercel teams list --format json
vercel link --repo --scope <你的 Vercel scope>
```

注意事项：

- `.vercel/` 是本地链接状态，不能提交。
- 默认先看 Preview Deployment，确认文档站内容、路由和资源都正确后再考虑生产部署。
- 生产部署通常由 main 分支 git 集成自动触发，除非你明确手动执行 `vercel deploy --prod`。

## 国内镜像验证

npm 发布仍以官方 registry 为准，国内镜像只用于安装体验验证。

临时切换 npmmirror：

```bash
npm config set registry https://registry.npmmirror.com
npm view @yok-ui/core@0.1.0 version --registry https://registry.npmmirror.com
```

恢复官方 registry：

```bash
npm config set registry https://registry.npmjs.org
```

如果镜像暂时查不到版本，通常是同步延迟。先用官方 registry 验证真实发布状态，再过一段时间重试镜像查询。

## 常见失败和恢复

### registry 查询失败

先确认网络、npm 登录状态和组织权限：

```bash
npm whoami --registry https://registry.npmjs.org/
npm access list packages yok-ui --registry https://registry.npmjs.org/
npm view @yok-ui/core@0.1.0 version --json --registry https://registry.npmjs.org/
```

如果是权限问题，不要重复发布。先修复 npm 组织成员权限或 package 权限。

### 发布中途失败

查看收据：

```bash
cat outputs/publish/0.1.0/publish-receipt.json
```

根据 `failure.stage` 判断：

- `artifacts`：构建或 tarball 校验失败，先修代码或 package manifest。
- `registry`：npm registry 查询失败，先确认网络和权限。
- `publish`：npm publish 失败，通常是权限、2FA 或 package ownership。
- `verification`：publish 后 registry 没有暴露匹配 integrity，等待同步后重试。

重试时使用同一条发布命令。脚本会重新查询 registry，已成功的包会跳过。

### integrity 冲突

如果脚本提示已有版本 integrity 不一致，停止发布。npm 包版本不可覆盖，需要：

1. 确认是否发布了错误 tarball。
2. 如果 npm 上的版本应该保留，升级 package version 后重新走完整发布流程。
3. 不要尝试删除后复用同一版本作为常规方案，依赖方可能已经缓存旧包。

## 安全边界

- 不要把 npm token、OTP、Vercel token、GitHub token 写进代码、文档、issue、commit 或聊天记录。
- 不要把 `.vercel/`、`outputs/publish/`、`*.tgz` 提交到 Git。
- 不要绕过 `pnpm release:verify`，它是发现 package exports、类型入口和 CSS 入口问题的最后本地门禁。
- 不要在未确认 npm 包可安装前发布文档站生产版本，否则用户会看到无法安装的文档。
