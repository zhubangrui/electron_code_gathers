import { makeAutoObservable } from 'mobx'
import { ISearchList } from '@renderer/common/types'
import { tempData } from '@renderer/common/data'

class ListStore {
  private dataList: ISearchList[] = []
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.dataList = tempData
  }

  getList(): ISearchList[] {
    return this.dataList
  }
}

export default ListStore
