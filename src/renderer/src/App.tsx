import { useRoutes } from 'react-router-dom'
import useRegisterShortcut from './hooks/use_register_shortcut'
import router from './router'

const App = () => {
  const { regShortcut } = useRegisterShortcut()
  regShortcut('search', 'CommandOrControl+Shift+;')
  const outlet = useRoutes(router)
  return <>{outlet}</>
}

export default App
