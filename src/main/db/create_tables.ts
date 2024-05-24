import { initDb } from './index'
// import { tableConfig } from '../config'
//创建数据表
const createTable = async (db: any, tableName: string, createSql: string): Promise<void> => {
  try {
    // 检查表是否存在
    const tableExists = await db.tableExists(tableName)

    if (!tableExists) {
      // 创建表
      await db.createTable(tableName, createSql)
      console.log(`Table '${tableName}' created successfully.`)
    } else {
      console.log(`Table '${tableName}' already exists.`)
    }

    // 执行其他操作，例如插入数据、查询数据等
  } catch (err) {
    console.error('Error:', err)
  } finally {
    // 关闭数据库连接
    // await db.close()
  }
}

//循环创建
export default (): void => {
  createTable(
    initDb,
    'theme_table',
    `id INTEGER PRIMARY KEY AUTOINCREMENT, theme TEXT,code_data_path TEXT`
  )
}
