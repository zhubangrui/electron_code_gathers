import { BrowserWindow, globalShortcut, ipcMain } from 'electron'

const registerShortCut = (win: BrowserWindow) => {
  // 注册一个'CommandOrControl+X' 快捷键监听器  CommandOrControl+Shift+;
  ipcMain.handle('register_shortcut', (_, type, value) => {
    switch (type) {
      case 'search': {
        globalShortcut.register(value, () => {
          win.isVisible() ? win.hide() : win.show()
        })
        return globalShortcut.isRegistered(value)
      }
      default:
        return false
    }
  })
  // const ret = globalShortcut.register('CommandOrControl+Shift+;', () => {
  //   console.log('CommandOrControl+Shift+X is pressed')
  //   win.isVisible() ? win.hide() : win.show()
  // })

  // if (!ret) {
  //   console.log('registration failed')
  // }

  // // 检查快捷键是否注册成功
  // console.log(globalShortcut.isRegistered('CommandOrControl+X'))
}
export default registerShortCut
