import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import createWindow from './windows'
import ipc from './ipc_main'
import registerShortCut from './register_short_cut'
import { winSize } from './ win_conf'
import { db } from './db/db'

// Menu.setApplicationMenu(null)
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  const mainWin = createWindow({
    width: winSize.width,
    height: winSize.height,
    frame: false,
    transparent: true,
    resizable: false
  })

  ipc(mainWin)
  registerShortCut(mainWin)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close()
    app.quit()
  }
})

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll()
})
