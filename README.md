<p align="center">
  简体中文 | <a href="README.en.md">English</a>
</p>

<p align="center">
  <strong>Kilo Code Better UI</strong><br>
  基于 <a href="https://github.com/Kilo-Org/kilocode">Kilo-Org/kilocode</a> 的个人 Fork，专注于 VS Code 插件 UI 优化与自定义样式。
</p>

<p align="center">
  <a href="https://github.com/XiaoXianThis/kilocode-better-ui/releases"><img src="https://raster.shields.io/github/v/release/XiaoXianThis/kilocode-better-ui?label=release" alt="GitHub Release" height="20"></a>
  <a href="https://github.com/Kilo-Org/kilocode"><img src="https://raster.shields.io/badge/upstream-Kilo--Org%2Fkilocode-555?style=flat" alt="Upstream" height="20"></a>
</p>

---

## 关于本 Fork

本仓库 fork 自 [Kilo Code](https://github.com/Kilo-Org/kilocode) — 开源 AI 编程助手，支持 VS Code、JetBrains 与 CLI。**本 Fork 仅定制 VS Code 扩展部分**，CLI、JetBrains、文档等其余模块基本与上游保持一致。

| 项目 | 上游 | 本 Fork |
|---|---|---|
| 仓库 | [Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) | [XiaoXianThis/kilocode-better-ui](https://github.com/XiaoXianThis/kilocode-better-ui) |
| 扩展 ID | `kilocode.kilo-code` | `xiaoxianthis.kilocode-better-ui` |
| 扩展名称 | Kilo Code | Kilo Code Better UI |
| VSIX 文件名 | `kilo-vscode-*.vsix` | `kilocode-better-ui-*.vsix` |
| 发布渠道 | VS Code 市场 + 上游 Release | 仅 [GitHub Releases](https://github.com/XiaoXianThis/kilocode-better-ui/releases) |

**Fork 基准提交：** `0134fe1eeb`。当前扩展版本：**7.3.54**。

功能说明、模型配置、CLI 用法等请参考 [kilo.ai 文档](https://kilo.ai/docs) 与 [上游 README](https://github.com/Kilo-Org/kilocode/blob/main/README.md)。

---

## Fork 特有功能

### 1. 内置 Cursor 风格主题

扩展**默认**注入 Cursor 风格 UI 样式，安装即用，**无需任何配置**。

主题文件位于 [`packages/kilo-vscode/themes/cursor.css`](packages/kilo-vscode/themes/cursor.css)，会随 VSIX 一起打包。本地开发时，`esbuild.js` 会在编译前尝试从仓库根目录 `themes/cursor.css` 同步（若存在），便于在 monorepo 根目录维护一份源文件。

### 2. 自定义 CSS 覆盖（可选）

如需覆盖内置主题，可通过 `kilo-code.new.customCssPath` 指定自己的 CSS 文件：

- 支持绝对路径，或相对于**第一个工作区根目录**的相对路径
- CSS 追加在 Webview 内联 `<style>` 末尾，优先级高于内置主题
- 修改设置或保存 CSS 文件后会自动热重载，无需重启扩展
- **留空**则继续使用内置 Cursor 主题

最小自定义示例：

```css
/* 圆角消息气泡 */
[data-component="message"] {
  border-radius: 12px;
}

/* 进一步隐藏标题栏区域 */
[data-slot="sidebar-title-extra"] {
  display: none;
}
```

### 3. 精简侧边栏标题栏

以下侧边栏标题栏按钮已隐藏（`when: "false"`），界面更简洁：

- Agent Manager（代理管理器）
- KiloClaw
- MCP Marketplace（市场）
- Profile（个人资料）

「设置」按钮保留。相关命令仍可通过命令面板调用。

### 4. 聊天自动滚动修复

Agent 流式输出时，在底部附近**缓慢向上滚轮**不再被强制拉回底部；在用户交互 grace 窗口内会尊重向上滚动意图。

### 5. 独立发布流水线

`.github/workflows/release-vscode.yml` 会自动构建多平台 VSIX 并发布到本仓库 GitHub Releases（标签格式：`vscode-v<版本号>`）。

---

## 安装

本 Fork **未**上架 VS Code 市场，请从 GitHub Releases 安装：

1. 打开 [Releases 页面](https://github.com/XiaoXianThis/kilocode-better-ui/releases)
2. 下载对应平台的 VSIX，例如 `kilocode-better-ui-win32-x64.vsix`
3. VS Code：`扩展` → `...` → `从 VSIX 安装...`

命令行安装：

```bash
code --install-extension path/to/kilocode-better-ui-win32-x64.vsix
```

> **注意：** 发布者为 `xiaoxianthis`，扩展 ID 为 `kilocode-better-ui`。可与官方 Kilo Code 扩展共存，但日常使用建议只启用其中一个。

---

## 从源码构建

```bash
# 安装依赖（仓库根目录）
bun install

# 构建并打包进扩展的 CLI 二进制
bun script/local-bin.ts --force

# 构建所有平台 VSIX
cd packages/kilo-vscode
bun script/build.ts
# 输出：packages/kilo-vscode/out/kilocode-better-ui-<platform>.vsix
```

本地开发：

```bash
bun run extension          # 仓库根目录 — 构建并在 VS Code 中加载扩展
```

类型检查（仅扩展，与 pre-push 钩子一致）：

```bash
bun run typecheck:vscode
```

---

## 变更文件清单（相对上游）

Fork 相对上游基准提交 `0134fe1eeb` 共有 **9 个提交**。核心差异如下（不含将上游 workflow 移至 `.github/workflows/disabled/` 的重命名）：

| 文件 | 变更说明 |
|---|---|
| `.github/workflows/release-vscode.yml` | **新增** — 构建 CLI + VSIX，发布 GitHub Release |
| `.github/workflows/test-vscode.yml` | 保留 VS Code 扩展 CI |
| `.husky/pre-push` | pre-push 改为仅跑 `typecheck:vscode` |
| `README.md` / `README.en.md` / `README.zh.md` | Fork 说明文档 |
| `packages/kilo-vscode/themes/cursor.css` | **新增** — 内置 Cursor 风格 UI 主题（默认启用） |
| `packages/kilo-vscode/.vscodeignore` | 打包时包含 `themes/**` |
| `packages/kilo-vscode/esbuild.js` | 编译前同步根目录 `themes/cursor.css`（若存在） |
| `bun.lock` | 锁文件元数据微调 |
| `package.json` | 新增 `typecheck:vscode` 脚本 |
| `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` | 修复底部慢速向上滚轮时被 snap 回底部 |
| `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` | 对应单元测试 |
| `packages/kilo-ui/src/hooks/scroll-user-activity.ts` | 在 grace 窗口内记录向上滚轮意图 |
| `packages/kilo-vscode/package.json` | 重命名扩展；隐藏侧边栏按钮；`customCssPath` 留空时使用内置主题 |
| `packages/kilo-vscode/script/build.ts` | VSIX 输出名改为 `kilocode-better-ui-*.vsix` |
| `packages/kilo-vscode/script/publish.ts` | 同上 |
| `packages/kilo-vscode/src/KiloProvider.ts` | 接入自定义 CSS 监听与重载 |
| `packages/kilo-vscode/src/kilo-provider/font-size.ts` | 新增 `watchCustomCssConfig()` |
| `packages/kilo-vscode/src/utils.ts` | 内置主题 + `customCssPath` 覆盖，注入 Webview HTML |
| `packages/opencode/script/build.ts` | 构建脚本可执行权限（CI 兼容） |
| `script/check-workflows.ts` | 将 `release-vscode.yml` 加入 workflow 白名单 |

**未改动：** CLI（`packages/opencode/`）、JetBrains 插件、SDK、网关、文档等在上游基准提交处与本 Fork 一致（合并新上游提交后可能变化）。

---

## 同步上游（维护说明）

当你说 **「同步上游更新」** 时，应按以下流程操作：

1. **拉取并合并** `https://github.com/Kilo-Org/kilocode` 的 `main` 分支
2. **解决冲突** — 必须保留 Fork 特性：
   - 内置 Cursor 主题（`packages/kilo-vscode/themes/cursor.css`）及 `customCssPath` 覆盖逻辑
   - 侧边栏标题栏 `when: "false"` 隐藏逻辑
   - `packages/kilo-ui/src/hooks/` 中的自动滚动修复
   - 扩展重命名（`kilocode-better-ui`、发布者 `xiaoxianthis`）
   - `release-vscode.yml` 与 VSIX 命名规则
3. **更新本 README** — 基准提交、版本号、变更文件表（如有新增）
4. **构建并发布** — 按需 bump `packages/kilo-vscode/package.json` 版本，打标签 `vscode-v<版本>` 推送以触发 Release，或手动运行 workflow

快速命令：

```bash
git remote add upstream https://github.com/Kilo-Org/kilocode.git   # 首次
git fetch upstream main
git merge upstream/main
# 解决冲突后：
bun run typecheck:vscode
cd packages/kilo-vscode && bun script/build.ts
git tag vscode-v<版本>
git push origin main --tags
```

---

## 许可证

与上游相同：**MIT**。见 [LICENSE](/LICENSE)。

上游项目：[Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) · [kilo.ai](https://kilo.ai)
