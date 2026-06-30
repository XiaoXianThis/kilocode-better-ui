<p align="center">
  <a href="README.md">简体中文</a> | English
</p>

<p align="center">
  <strong>Kilo Code Better UI</strong><br>
  A personal fork of <a href="https://github.com/Kilo-Org/kilocode">Kilo-Org/kilocode</a> focused on VS Code extension UI polish and custom styling.
</p>

<p align="center">
  <a href="https://github.com/XiaoXianThis/kilocode-better-ui/releases"><img src="https://raster.shields.io/github/v/release/XiaoXianThis/kilocode-better-ui?label=release" alt="GitHub Release" height="20"></a>
  <a href="https://github.com/Kilo-Org/kilocode"><img src="https://raster.shields.io/badge/upstream-Kilo--Org%2Fkilocode-555?style=flat" alt="Upstream" height="20"></a>
</p>

---

## About this fork

This repository is a fork of [Kilo Code](https://github.com/Kilo-Org/kilocode) — the open source AI coding agent for VS Code, JetBrains, and the CLI. **Only the VS Code extension is customized here.** CLI, JetBrains, docs, and the rest of the monorepo track upstream with minimal fork-specific changes.

| Item | Upstream | This fork |
|---|---|---|
| Repository | [Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) | [XiaoXianThis/kilocode-better-ui](https://github.com/XiaoXianThis/kilocode-better-ui) |
| Extension ID | `kilocode.kilo-code` | `xiaoxianthis.kilocode-better-ui` |
| Extension name | Kilo Code | Kilo Code Better UI |
| VSIX filename | `kilo-vscode-*.vsix` | `kilocode-better-ui-*.vsix` |
| Distribution | VS Code Marketplace + upstream releases | [GitHub Releases](https://github.com/XiaoXianThis/kilocode-better-ui/releases) only |

**Base upstream commit:** `0134fe1eeb` (merged at fork time). Extension version: **7.3.54**.

Upstream docs, agents, CLI usage, and model/provider setup still apply — see [kilo.ai/docs](https://kilo.ai/docs) and the [upstream README](https://github.com/Kilo-Org/kilocode/blob/main/README.md).

---

## Fork-specific features

### 1. Built-in Cursor-style theme

The extension **ships with** a Cursor-style UI theme enabled **by default** — install and use, no configuration required.

Theme source: [`packages/kilo-vscode/themes/cursor.css`](packages/kilo-vscode/themes/cursor.css), bundled into the VSIX. During local dev, `esbuild.js` optionally syncs from repo-root `themes/cursor.css` before compile if that file exists.

### 2. Custom CSS override (optional)

To override the built-in theme, set `kilo-code.new.customCssPath` to your own stylesheet:

- Absolute path, or path relative to the **first workspace folder**
- CSS is appended last in the webview `<style>` block, so it overrides the built-in theme
- Changing the setting or saving the CSS file triggers a live reload (no extension restart)
- **Leave empty** to keep the built-in Cursor theme

Minimal custom example:

```css
/* Round message bubbles */
[data-component="message"] {
  border-radius: 12px;
}

/* Hide extra sidebar title chrome */
[data-slot="sidebar-title-extra"] {
  display: none;
}
```

### 3. Simplified sidebar header

These sidebar title-bar actions are hidden (`when: "false"`) for a cleaner header:

- Agent Manager
- KiloClaw
- MCP Marketplace
- Profile

Settings remains available. Commands still exist — bind them via the Command Palette if needed.

### 4. Chat auto-scroll fix

While the agent is streaming, a **slow wheel-up** near the bottom no longer snaps the view back to the bottom. Upward wheel intent is respected during the user-interaction grace window.

### 5. Independent release pipeline

GitHub Actions workflow `.github/workflows/release-vscode.yml` builds multi-platform VSIX packages and publishes them to this repo's Releases (tag format: `vscode-v<version>`).

---

## Install

This fork is **not** published to the VS Code Marketplace. Install from GitHub Releases:

1. Open [Releases](https://github.com/XiaoXianThis/kilocode-better-ui/releases)
2. Download the VSIX for your platform, e.g. `kilocode-better-ui-win32-x64.vsix`
3. In VS Code: `Extensions` → `...` → `Install from VSIX...`

Or from the command line:

```bash
code --install-extension path/to/kilocode-better-ui-win32-x64.vsix
```

> **Note:** This extension uses publisher `xiaoxianthis` and ID `kilocode-better-ui`. It can be installed **alongside** the official Kilo Code extension, but only one should be active for daily use.

---

## Build from source

```bash
# Install dependencies (repo root)
bun install

# Build CLI binary bundled into the extension
bun script/local-bin.ts --force

# Build all platform VSIX packages
cd packages/kilo-vscode
bun script/build.ts
# Output: packages/kilo-vscode/out/kilocode-better-ui-<platform>.vsix
```

Local dev:

```bash
bun run extension          # from repo root — build + launch VS Code with the extension
```

Typecheck (extension only, matches pre-push hook):

```bash
bun run typecheck:vscode
```

---

## Changed files (vs upstream)

**9 commits** on top of upstream base `0134fe1eeb`. Core diffs below (excluding renames that move upstream workflows to `.github/workflows/disabled/`):

| File | Change |
|---|---|
| `.github/workflows/release-vscode.yml` | **New** — build CLI + VSIX, publish GitHub Release |
| `.github/workflows/test-vscode.yml` | Keep VS Code extension CI |
| `.husky/pre-push` | Run `typecheck:vscode` instead of full monorepo typecheck |
| `README.md` / `README.en.md` / `README.zh.md` | Fork documentation |
| `packages/kilo-vscode/themes/cursor.css` | **New** — built-in Cursor-style UI theme (enabled by default) |
| `packages/kilo-vscode/.vscodeignore` | Include `themes/**` in VSIX |
| `packages/kilo-vscode/esbuild.js` | Sync repo-root `themes/cursor.css` before compile when present |
| `bun.lock` | Lockfile metadata tweak |
| `package.json` | Add `typecheck:vscode` script |
| `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` | Fix stick-to-bottom during slow wheel-up |
| `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` | Test for wheel-up near bottom band |
| `packages/kilo-ui/src/hooks/scroll-user-activity.ts` | Record upward-wheel intent in grace window |
| `packages/kilo-vscode/package.json` | Rebrand; hide sidebar buttons; empty `customCssPath` uses built-in theme |
| `packages/kilo-vscode/script/build.ts` | VSIX output name → `kilocode-better-ui-*.vsix` |
| `packages/kilo-vscode/script/publish.ts` | Same VSIX naming |
| `packages/kilo-vscode/src/KiloProvider.ts` | Wire custom CSS watch + reload |
| `packages/kilo-vscode/src/kilo-provider/font-size.ts` | Add `watchCustomCssConfig()` |
| `packages/kilo-vscode/src/utils.ts` | Built-in theme + optional `customCssPath` override in webview HTML |
| `packages/opencode/script/build.ts` | Executable bit on build script (CI compatibility) |
| `script/check-workflows.ts` | Register `release-vscode.yml` in allowlist |

**Unchanged:** CLI (`packages/opencode/`), JetBrains plugin, SDK, gateway, docs, and all other packages match upstream at the fork base unless you merge newer upstream commits.

---

## Syncing upstream (maintainer)

When you say **「同步上游更新」**, the expected workflow is:

1. **Fetch & merge** `https://github.com/Kilo-Org/kilocode` `main` into this fork
2. **Resolve conflicts** — always keep fork features:
   - Built-in Cursor theme (`packages/kilo-vscode/themes/cursor.css`) and `customCssPath` override logic
   - Sidebar header `when: "false"` overrides
   - Auto-scroll fixes in `packages/kilo-ui/src/hooks/`
   - Extension rebrand (`kilocode-better-ui`, publisher `xiaoxianthis`)
   - `release-vscode.yml` and VSIX naming
3. **Update this README** — base commit, version, changed-files table if the diff grows
4. **Build & release** — bump `packages/kilo-vscode/package.json` version if needed, tag `vscode-v<version>`, push tag to trigger `.github/workflows/release-vscode.yml`, or run the workflow manually

Quick merge commands:

```bash
git remote add upstream https://github.com/Kilo-Org/kilocode.git   # once
git fetch upstream main
git merge upstream/main
# resolve conflicts, then:
bun run typecheck:vscode
cd packages/kilo-vscode && bun script/build.ts
git tag vscode-v<version>
git push origin main --tags
```

---

## License

Same as upstream: **MIT**. See [LICENSE](/LICENSE).

Upstream project: [Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) · [kilo.ai](https://kilo.ai)
