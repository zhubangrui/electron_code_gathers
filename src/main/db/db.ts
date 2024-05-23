import { app } from 'electron'
import { join } from 'path'
import { Database } from 'sqlite3'

const dbPath = app.isPackaged
  ? join(process.resourcesPath, 'resources')
  : join(__dirname, '../../resources/')

const db = new Database(dbPath + 'code_gathers.db', (err) => {
  console.log(err)
})

export { db }
