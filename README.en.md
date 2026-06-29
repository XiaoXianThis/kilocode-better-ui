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

### 1. Custom CSS injection

Inject your own stylesheet into the Kilo sidebar webview to tweak layout, spacing, border radius, or hide UI elements.

**Setting:** `kilo-code.new.customCssPath`

- Absolute path, or path relative to the **first workspace folder**
- CSS is appended last in the webview `<style>` block, so it overrides defaults
- Changing the setting or saving the CSS file triggers a live reload (no extension restart)

Example (`settings.json`):

```json
{
  "kilo-code.new.customCssPath": ".kilo/custom.css"
}
```

Example (`.kilo/custom.css`):

```css
/* Round message bubbles, tighten padding */
[data-component="message"] {
  border-radius: 12px;
}

/* Hide sidebar title-bar shortcuts this fork already removes from the header */
[data-slot="sidebar-title-extra"] {
  display: none;
}
```

### 2. Simplified sidebar header

These sidebar title-bar actions are hidden (`when: "false"`) for a cleaner header:

- Agent Manager
- KiloClaw
- MCP Marketplace
- Profile

Settings remains available. Commands still exist — bind them via the Command Palette if needed.

### 3. Chat auto-scroll fix

While the agent is streaming, a **slow wheel-up** near the bottom no longer snaps the view back to the bottom. Upward wheel intent is respected during the user-interaction grace window.

### 4. Independent release pipeline

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

All fork diffs are in **3 commits** on top of upstream `main`. Only **14 files** differ:

| File | Change |
|---|---|
| `.github/workflows/release-vscode.yml` | **New** — build CLI + VSIX, publish GitHub Release |
| `.husky/pre-push` | Run `typecheck:vscode` instead of full monorepo typecheck |
| `bun.lock` | Lockfile metadata tweak (xlsx entry) |
| `package.json` | Add `typecheck:vscode` script |
| `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` | Fix stick-to-bottom during slow wheel-up |
| `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` | Test for wheel-up near bottom band |
| `packages/kilo-ui/src/hooks/scroll-user-activity.ts` | Record upward-wheel intent in grace window |
| `packages/kilo-vscode/package.json` | Rebrand (name, publisher, repo); hide sidebar buttons; add `customCssPath` setting |
| `packages/kilo-vscode/script/build.ts` | VSIX output name → `kilocode-better-ui-*.vsix` |
| `packages/kilo-vscode/script/publish.ts` | Same VSIX naming |
| `packages/kilo-vscode/src/KiloProvider.ts` | Wire custom CSS watch + reload |
| `packages/kilo-vscode/src/kilo-provider/font-size.ts` | Add `watchCustomCssConfig()` |
| `packages/kilo-vscode/src/utils.ts` | `getCustomCssPath()`, `readCustomCss()`, inject into webview HTML |
| `script/check-workflows.ts` | Register `release-vscode.yml` in allowlist |

**Unchanged:** CLI (`packages/opencode/`), JetBrains plugin, SDK, gateway, docs, and all other packages match upstream at the fork base unless you merge newer upstream commits.

---

## Syncing upstream (maintainer)

When you say **「同步上游更新」**, the expected workflow is:

1. **Fetch & merge** `https://github.com/Kilo-Org/kilocode` `main` into this fork
2. **Resolve conflicts** — always keep fork features:
   - `kilo-code.new.customCssPath` and CSS injection code
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
