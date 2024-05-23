import { BrowserWindow, ipcMain } from 'electron'
import createWindow from './windows'
import { winSize } from './ win_conf'
const ipc = (win: BrowserWindow) => {
  ipcMain.on('hide_win', () => {
    win?.hide()
  })
  //根据渲染进程输入的内容动态改变窗口的大小
  ipcMain.on('change_window', (_, height) => {
    win.setSize(winSize.width, winSize.height + height)
  })
  let configWin: BrowserWindow | null = null
  const createConfigWin = (themeType?: string) => {
    configWin = createWindow({ width: 700, height: 500 }, '/config')

    configWin.on('show', () => {
      //当窗口打开时，由主进程往渲染进程发送
      syncTheme(configWin!, themeType!)
      configWin?.setTitle('数据配置')
    })

    configWin.on('close', () => {
      configWin = null
    })
  }
  ipcMain.on('open_config_win', (_, themeType: string) => {
    if (!configWin) {
      createConfigWin(themeType)
    }
  })
  //判断当主窗口关闭，配置窗口也要关闭
  win.on('close', () => {
    if (configWin) configWin.close()
  })

  ipcMain.on('change_theme', (_, themeType: string) => {
    if (configWin) {
      syncTheme(configWin, themeType)
    }
  })
}
const syncTheme = (win: BrowserWindow, themeType: string) => {
  win.webContents.send('change_theme_from_main', themeType)
}
export default ipc
