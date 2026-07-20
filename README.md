# Yok UI

Yok UI 是一个 Vue 3 个人组件库 monorepo，当前包含 `@yok-ui/core`、`@yok-ui/product`、`@yok-ui/admin`、`@yok-ui/brand`、`@yok-ui/icons`、`@yok-ui/themes`、`@yok-ui/hooks` 和 `@yok-ui/resolver` 八个公开包。

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
```

文档站默认由 VitePress 提供，组件示例、API 表、可访问性证据和发布入口都在 `docs/` 下维护。

## 质量验证

提交发布相关改动前至少运行：

```bash
pnpm test
pnpm typecheck
pnpm docs:build
pnpm release:verify
```

`pnpm release:verify` 会构建 8 个 npm tarball，并在临时干净项目中安装验证 ESM import、类型入口和 CSS 入口。

## npm 发布

本仓库使用 `scripts/release/publish-packages.mjs` 统一处理本地首发和 GitHub Actions Trusted Publishing。

本地首发命令：

```bash
pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release
```

注意事项：

- 本地发布需要先执行 `npm login`，并在终端里完成 npm 2FA 提示。
- 不要把 npm token、一次性验证码或认证 URL 写入命令、代码、文档或日志。
- 默认不带 `--confirm-public-release` 时是 dry-run，不会执行 `npm publish`。
- 发布脚本会先查询 registry，只有完全相同 integrity 的版本才会跳过；如果已存在版本但 integrity 不一致，会停止发布。
- 发布收据写入 `outputs/publish/<version>/publish-receipt.json`，该目录不会进入 Git。

## GitHub OIDC 发布

`.github/workflows/publish.yml` 是手动触发的 npm Trusted Publishing 工作流。正式使用前，需要在 GitHub 和 npm 上完成配置：

1. GitHub 仓库创建名为 `npm` 的 Environment，并设置 required reviewer。
2. npm 每个 `@yok-ui/*` 包配置 Trusted Publisher：
   `Owner = yokry-he`，`Repository = yok-ui`，`Workflow filename = publish.yml`，`Environment = npm`。
3. 不要配置 `NPM_TOKEN` 仓库密钥；工作流依赖 GitHub OIDC `id-token: write`。

## Vercel 文档站

Vercel 项目根目录应选择仓库根目录。`vercel.json` 固定了构建契约：

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm docs:build",
  "outputDirectory": "docs/.vitepress/dist"
}
```

`.vercel/` 是本地链接状态，不应提交。首次链接和部署时需要你在浏览器中登录 Vercel 并选择正确账号或团队。
