import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  hideWin: () => ipcRenderer.send('hide_win'),
  registerShortcut: (type: string, shortcut: string) =>
    ipcRenderer.invoke('register_shortcut', type, shortcut),
  openConfig: (themeType: string) => ipcRenderer.send('open_config_win', themeType),
  changeWindow: (height: number) => ipcRenderer.send('change_window', height),
  changeTheme: (themeType: string) => ipcRenderer.send('change_theme', themeType),
  changeThemeFromMain: (fn: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('change_theme_from_main', fn),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
  query: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
