import * as crypto from "crypto"
import * as fs from "fs"
import * as path from "path"
import * as vscode from "vscode"
import { buildCspString } from "./webview-html-utils"

function getNonce(): string {
  return crypto.randomBytes(16).toString("hex")
}

const SIZES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

function clamp(size: number) {
  if (!Number.isFinite(size)) return 13
  return Math.min(24, Math.max(10, Math.round(size)))
}

export function getWebviewFontSize(): number {
  const raw = vscode.workspace.getConfiguration("kilo-code.new").get<number>("fontSize", 13)
  return clamp(raw)
}

function customCssSetting() {
  return vscode.workspace.getConfiguration("kilo-code.new").get<string>("customCssPath", "").trim()
}

// Resolve the CSS file to inject. Uses customCssPath when set; otherwise the
// bundled cursor theme shipped with the extension.
export function getCustomCssPath(extensionUri: vscode.Uri): string | undefined {
  const raw = customCssSetting()
  if (raw) {
    if (path.isAbsolute(raw)) return raw
    const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    return root ? path.join(root, raw) : undefined
  }
  return vscode.Uri.joinPath(extensionUri, "themes", "cursor.css").fsPath
}

// Read the active webview stylesheet. Returns an empty string on any failure so
// a missing or unreadable file never breaks the webview.
export function readCustomCss(extensionUri: vscode.Uri): string {
  const file = getCustomCssPath(extensionUri)
  if (!file) return ""
  const css = (() => {
    try {
      return fs.readFileSync(file, "utf-8")
    } catch (err) {
      console.error(`[Kilo New] failed to read custom CSS at ${file}`, err)
      return ""
    }
  })()
  if (!css.trim()) return ""
  const label = customCssSetting() ? "kilo-code.new.customCssPath" : "kilo-code builtin theme (cursor.css)"
  return `\n    /* ${label} */\n    ${css}`
}

function fontStyle(): string {
  const base = getWebviewFontSize()
  const vars = SIZES.map((size) => `--kilo-font-size-${size}: ${(base * size) / 13}px;`).join("\n      ")
  return `:root {
      ${vars}
      --kilo-font-scale: ${base / 13};
      --font-size-x-small: var(--kilo-font-size-10);
      --font-size-small: var(--kilo-font-size-11);
      --font-size-base: var(--kilo-font-size-13);
      --font-size-large: var(--kilo-font-size-16);
    }`
}

export function buildWebviewHtml(
  webview: vscode.Webview,
  opts: {
    extensionUri: vscode.Uri
    scriptUri: vscode.Uri
    styleUri: vscode.Uri
    iconsBaseUri: vscode.Uri
    workerUri: vscode.Uri
    title: string
    port?: number
    extraStyles?: string
  },
): string {
  const nonce = getNonce()
  const csp = buildCspString(webview.cspSource, nonce, opts.port)

  return `<!DOCTYPE html>
<html lang="en" data-theme="kilo-vscode">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <link rel="stylesheet" href="${opts.styleUri}">
  <title>${opts.title}</title>
  <style>
    ${fontStyle()}
    html {
      scrollbar-color: auto;

      ::-webkit-scrollbar-thumb {
        border: 3px solid transparent !important;
        background-clip: padding-box !important;
      }
    }
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    body {
      background-color: var(--vscode-sideBar-background, var(--vscode-editor-background));
      color: var(--vscode-foreground);
      font-family: var(--vscode-font-family);
    }
    #root {
      height: 100%;
    }${opts.extraStyles ? `\n    ${opts.extraStyles}` : ""}${readCustomCss(opts.extensionUri)}
  </style>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}">window.ICONS_BASE_URI = "${opts.iconsBaseUri}"; window.KILO_SHIKI_WORKER_URI = "${opts.workerUri}";</script>
  <script nonce="${nonce}" src="${opts.scriptUri}"></script>
</body>
</html>`
}
