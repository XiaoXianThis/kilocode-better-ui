import * as vscode from "vscode"
import { getCustomCssPath, getWebviewFontSize } from "../utils"

export function watchFontSizeConfig(
  post: (msg: { type: "fontSizeChanged"; fontSize: number }) => void,
  next?: vscode.Disposable,
) {
  const font = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("kilo-code.new.fontSize"))
      post({ type: "fontSizeChanged", fontSize: getWebviewFontSize() })
  })
  return next ? vscode.Disposable.from(font, next) : font
}

// Watch the custom CSS setting and the referenced file, invoking `reload` so the
// provider can rebuild its webview HTML (which re-reads and re-injects the CSS).
export function watchCustomCssConfig(reload: () => void, next?: vscode.Disposable) {
  const watch = (() => {
    const file = getCustomCssPath()
    if (!file) return undefined
    const fsw = vscode.workspace.createFileSystemWatcher(file)
    fsw.onDidChange(reload)
    fsw.onDidCreate(reload)
    fsw.onDidDelete(reload)
    return fsw
  })()

  const cfg = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("kilo-code.new.customCssPath")) reload()
  })

  const own = watch ? vscode.Disposable.from(cfg, watch) : cfg
  return next ? vscode.Disposable.from(own, next) : own
}
