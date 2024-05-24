import { app } from 'electron'
import { join } from 'path'
import SQLiteDatabase from './db'

const dbPath = app.isPackaged
  ? join(process.resourcesPath, 'resources')
  : join(__dirname, '../../resources/')

const initDb = new SQLiteDatabase(dbPath + 'init_data.db')
const dataDb = new SQLiteDatabase(dbPath + 'code_grthers.db')

export { initDb, dataDb }
