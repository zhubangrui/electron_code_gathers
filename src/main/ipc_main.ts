import { BrowserWindow, ipcMain } from 'electron'
import createWindow from './windows'
import { winSize } from './ win_conf'
import { initDb } from './db'

const getTheme = async () => {
  return await initDb.select('theme_table', 'id=?', [1])
}
const ipc = (win: BrowserWindow) => {
  //初始化主题，添加到表中
  ipcMain.handle('init_theme', async (_, themeType: string) => {
    try {
      const res = await getTheme()
      if (res.length === 0) {
        const row = await initDb.insert('theme_table', { theme: themeType })
        if (row !== undefined) {
          return false
        } else {
          return true
        }
      } else {
        return res[0].theme
      }
    } catch (err) {
      return false
    }
  })

  //更改主题，更新到表中
  ipcMain.handle('update_theme', async (_, themeType: string) => {
    try {
      const res = await getTheme()
      if (res.length) {
        const row = await initDb.update('theme_table', { theme: themeType }, 'id=?', [1])
        if (row !== undefined) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  })

  ipcMain.on('hide_win', () => {
    win?.hide()
  })
  //根据渲染进程输入的内容动态改变窗口的大小
  ipcMain.on('change_window', (_, height) => {
    win.setSize(winSize.width, winSize.height + height)
  })
  let configWin: BrowserWindow | null = null
  const createConfigWin = () => {
    configWin = createWindow({ width: 700, height: 500 }, '/config')

    // configWin.on('show', () => {
    //   //当窗口打开时，由主进程往渲染进程发送
    //   syncTheme(configWin!, themeType!)
    //   configWin?.setTitle('数据配置')
    // })

    configWin.on('close', () => {
      configWin = null
    })
  }
  ipcMain.on('open_config_win', () => {
    if (!configWin) {
      createConfigWin()
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
