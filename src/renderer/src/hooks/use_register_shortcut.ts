import { useStore } from '@renderer/store'
import { runInAction } from 'mobx'

const useRegisterShortcut = () => {
  const {
    errorStore: { setError }
  } = useStore()
  const regShortcut = async (type: string, shortcut: string) => {
    const res = await window.api.registerShortcut(type, shortcut)
    // console.log(res)
    // return res
    if (!res) {
      runInAction(() => {
        console.log('123123123')
        setError('快捷键注册失败')
      })
    }
  }

  return { regShortcut }
}

export default useRegisterShortcut
