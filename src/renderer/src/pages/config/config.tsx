import { IThemeType, useTheme } from '@renderer/context/theme_provider'
import useSetTheme from '@renderer/hooks/use_set_theme'
import { useEffect } from 'react'

const Config = () => {
  const { bgColor, fontColor, themeType } = useTheme()
  const { setSyncTheme } = useSetTheme()

  const setTheme = () => {
    window.api.changeThemeFromMain((_, type: string) => {
      setSyncTheme(type as IThemeType)
    })
  }
  const removeListeners = () => window.api.removeAllListeners('change_theme_from_main')

  //主窗口主题切换时
  useEffect(() => {
    setTheme()
    return () => removeListeners()
  }, [themeType])
  //首次打开时
  useEffect(() => {
    setTheme()
    return () => removeListeners()
  }, [])
  return <div className={` w-full h-screen ${bgColor} ${fontColor}`}>config</div>
}

export default Config
