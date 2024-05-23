import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      hideWin: () => void
      registerShortcut: (type: string, shortut: string) => Promise<boolean>
      openConfig: (themeType: string) => void
      changeWindow: (height: number) => void
      changeTheme: (themeType: string) => void
      changeThemeFromMain: (fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
      removeAllListeners: (channel: string) => void
    }
  }
}
