import { makeAutoObservable } from 'mobx'

class ErrorStore {
  private error = ''
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  getError() {
    return this.error
  }
  setError(err: string) {
    this.error = err
  }
}

export default ErrorStore
