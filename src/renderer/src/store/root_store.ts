import ErrorStore from './error_store'
import ListStore from './list_store'

export interface IRootStore {
  listStore: ListStore
  errorStore: ErrorStore
}

class RootStore implements IRootStore {
  listStore: ListStore
  errorStore: ErrorStore
  constructor() {
    this.listStore = new ListStore()
    this.errorStore = new ErrorStore()
  }
}

export default new RootStore()
