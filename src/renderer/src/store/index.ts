import { createContext, useContext } from 'react'
import root_store, { IRootStore } from './root_store'

export const rootStoreContext = createContext(root_store)
export const useStore = (): IRootStore => useContext(rootStoreContext)
