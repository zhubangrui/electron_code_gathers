import { IThemeType, useTheme } from '@renderer/context/theme_provider'

const useSetTheme = () => {
  const { setTheme } = useTheme()

  const setThemeHandle = (themeType: string): void => {
    if (themeType === 'light') {
      setTheme('dark')
    } else if (themeType === 'dark') {
      setTheme('light')
    }
  }
  const setSyncTheme = (themeType: IThemeType) => {
    setTheme(themeType)
  }
  return { setThemeHandle, setSyncTheme }
}

export default useSetTheme
