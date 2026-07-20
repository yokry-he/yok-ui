# Release Center

Release Center 用于管理 Yok UI 的公开发布流程：本地首发 npm、GitHub OIDC 可信发布、Vercel 文档站部署，以及国内镜像同步验证。

<ReleaseDashboard />

## 当前线上状态

- npm scope：`@yok-ui`
- 已发布版本：8 个公开包均为 `0.1.0`
- npm 发布身份：8 个包均已配置 GitHub Trusted Publisher
- GitHub Environment：`npm`，启用 Required reviewer
- Vercel Project：`yokry-projects/yok-ui`
- 生产文档站：<https://yok-ui.vercel.app>
- 源码仓库：<https://github.com/yokry-he/yok-ui>

这里的“已配置”表示配置已写入外部平台并通过读取命令核对，不代表以后可以跳过测试、版本确认或 GitHub Environment 审批。

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

### 一次性配置 8 个包

npm 的 Trusted Publisher 是 package 级配置，因此 8 个包需要分别建立信任关系。当前仓库使用 npm CLI `11.18.0` 管理配置；如果本机全局 npm 版本较旧，可以直接使用 `npx`，不必替换系统 npm：

```bash
for package in themes hooks icons resolver core product admin brand; do
  npx --yes npm@11.18.0 trust github "@yok-ui/$package" \
    --repository yokry-he/yok-ui \
    --file publish.yml \
    --environment npm \
    --allow-publish \
    --yes \
    --registry https://registry.npmjs.org/
done
```

参数含义：

- `--repository yokry-he/yok-ui`：只信任这个 GitHub 仓库。
- `--file publish.yml`：只信任 `.github/workflows/publish.yml`；这里只写文件名，不能写完整路径。
- `--environment npm`：OIDC 声明必须来自 GitHub 的 `npm` Environment。
- `--allow-publish`：允许执行 `npm publish`，与当前 workflow 一致。
- `--yes`：跳过 CLI 对配置摘要的二次确认，不会绕过 npm 2FA。

首次修改通常会要求 Passkey、安全密钥或 OTP。若要连续配置多个包，可以在 npm 官方验证页勾选“接下来 5 分钟内不再挑战 npm trust 操作”，完成一次 2FA 后立刻执行循环。该临时豁免只对当前 IP 和短时间窗口生效；不要在共享电脑或不可信网络使用。

当前 workflow 没有使用 staged publishing，因此不要额外添加 `--allow-stage-publish`。如果以后改用 `npm stage publish`，必须同时修改 workflow、Trusted Publisher 权限和本页说明。

### 逐包验证

```bash
for package in themes hooks icons resolver core product admin brand; do
  echo "=== @yok-ui/$package ==="
  npx --yes npm@11.18.0 trust list "@yok-ui/$package" \
    --json \
    --registry https://registry.npmjs.org/
done
```

每个包都应返回：

```json
{
  "type": "github",
  "file": "publish.yml",
  "repository": "yokry-he/yok-ui",
  "environment": "npm",
  "permissions": ["createPackage"]
}
```

`createPackage` 是 npm API 对正式发布权限的返回名称。npm 保存配置时不会主动验证 workflow 是否真的存在，所以文件名、大小写、仓库名和 Environment 必须由上述命令与仓库文件共同核对。

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

当前生产站点是 <https://yok-ui.vercel.app>，Vercel Project 是 `yokry-projects/yok-ui`，并已连接 GitHub 仓库 `yokry-he/yok-ui`。

### 首次创建和连接

如果 Vercel 中还没有这个 Project，`vercel link --repo` 不会自动创建它。首次应按以下顺序执行：

```bash
pnpm dlx vercel@56.4.0 login
pnpm dlx vercel@56.4.0 teams list --format json
pnpm dlx vercel@56.4.0 link --scope yokry-projects
pnpm dlx vercel@56.4.0 git connect https://github.com/yokry-he/yok-ui --scope yokry-projects
```

`link` 会创建或选择 Vercel Project，并在本机生成 `.vercel/project.json`。`git connect` 才负责建立 GitHub 自动部署关系。两者职责不同，不能只执行其中一个。

链接期间 Vercel CLI 可能生成 `.env.local` 和 `VERCEL_OIDC_TOKEN`。它们只用于当前机器与 Vercel 的短期身份交互，必须由 `.gitignore` 排除；不要读取、复制或提交这些值。

### 手动部署和状态检查

普通部署用于 Preview；只有明确需要生产部署时才加 `--prod`：

```bash
pnpm dlx vercel@56.4.0 deploy . -y --no-wait --scope yokry-projects
pnpm dlx vercel@56.4.0 deploy . --prod -y --no-wait --scope yokry-projects
```

部署命令返回 URL 后，用 `inspect` 等待构建结果：

```bash
pnpm dlx vercel@56.4.0 inspect <deployment-url> --wait --timeout 10m --scope yokry-projects
```

成功结果必须显示 `status Ready`，并且 Project 设置应为：

```text
Root Directory: .
Build Command: pnpm docs:build
Output Directory: docs/.vitepress/dist
Install Command: pnpm install --frozen-lockfile
Node.js Version: 24.x
```

### Git 自动部署

- 推送 `main`：触发 Production Deployment，并更新 `https://yok-ui.vercel.app`。
- 推送其他分支或更新 Pull Request：生成独立 Preview URL，不覆盖生产站。
- 文档只改源码，不提交 `docs/.vitepress/dist`；Vercel 会从仓库根目录重新构建。
- npm 发布和文档部署互相独立。文档部署失败不会撤回 npm 包，npm 发布失败也不会自动回滚文档。

注意事项：

- `.vercel/` 是本地链接状态，不能提交。
- 默认先看 Preview Deployment，确认文档站内容、路由和资源都正确后再考虑生产部署。
- 生产部署通常由 main 分支 git 集成自动触发，除非你明确手动执行 `vercel deploy --prod`。

### 回滚生产文档

先在 Vercel Deployments 页面找到上一个 `Ready` 的生产部署，复制其 URL 或 deployment ID，然后执行：

```bash
pnpm dlx vercel@56.4.0 rollback <deployment-url-or-id> --yes --scope yokry-projects
pnpm dlx vercel@56.4.0 rollback status yok-ui --scope yokry-projects
```

回滚只切换生产别名，不改写 Git 历史。随后仍应修复 `main` 中的问题并正常提交，否则下一次自动部署会再次包含错误。

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
