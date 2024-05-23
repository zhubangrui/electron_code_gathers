import { app, BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(winConfig?: BrowserWindowConstructorOptions, path = '/') {
  // Create the browser window.
  const mainWindow = new BrowserWindow({ ...initWin, ...winConfig })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (!app.isPackaged) {
    mainWindow.webContents.toggleDevTools()
  }
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(devUrl(path))
  } else {
    // mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    mainWindow.loadURL(proUrl(path))
  }
  return mainWindow
}

const initWin: BrowserWindowConstructorOptions = {
  // width: 600,
  // height: 400,
  center: true,
  show: false,
  // frame: false,
  // transparent: true,
  autoHideMenuBar: true,
  alwaysOnTop: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false
  }
}

//生产环境加载的URL
const devUrl = (path: string) => `${process.env['ELECTRON_RENDERER_URL']}/#${path}`
//生产环境加载的URL
const proUrl = (pathName = '/'): string => {
  const file = join(__dirname, '../renderer/index.html')
  const url = new URL(file, 'file:')
  url.hash = pathName
  return url.href
}

export default createWindow
