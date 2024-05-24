import sqlite3, { RunResult } from 'sqlite3'

class SQLiteDatabase {
  private db: sqlite3.Database

  constructor(dbPath: string) {
    // console.log(dbPath)
    this.db = new sqlite3.Database(dbPath)
  }

  // 执行 SQL 查询
  private run(sql: string, params: any[]): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(this)
        }
      })
    })
  }

  // 检查表是否存在
  async tableExists(tableName: string): Promise<boolean> {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
    const rows = await this.all(sql, [tableName])
    return rows.length > 0
  }

  // 创建表
  async createTable(tableName: string, schema: string): Promise<void> {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`
    await this.run(sql, [])
  }

  // 插入数据
  async insert(tableName: string, data: any): Promise<void> {
    const keys = Object.keys(data).join(',')
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(',')
    const values = Object.values(data)
    const sql = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`
    await this.run(sql, values)
  }

  // 更新数据
  async update(tableName: string, data: any, condition: string, params: any[]): Promise<void> {
    const sets = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(',')
    const values = Object.values(data)
    const sql = `UPDATE ${tableName} SET ${sets} WHERE ${condition}`
    await this.run(sql, [...values, ...params])
  }

  // 删除数据
  async delete(tableName: string, condition: string, params: any[]): Promise<void> {
    const sql = `DELETE FROM ${tableName} WHERE ${condition}`
    await this.run(sql, params)
  }

  // 查询数据
  async select(tableName: string, condition: string = '', params: any[] = []): Promise<any[]> {
    let sql = `SELECT * FROM ${tableName}`
    if (condition) {
      sql += ` WHERE ${condition}`
    }

    return await this.all(sql, params)
  }

  // 执行 SQL 查询，并返回结果集
  private all(sql: string, params: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // 关闭数据库连接
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export default SQLiteDatabase
