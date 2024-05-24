import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { themeInit } from '../common/config'
import { useStore } from '@renderer/store'

export type IThemeType = 'light' | 'dark'
interface ITheme {
  themeType: IThemeType
  fontColor: string
  bgColor: string
  hoverColor: string
  setTheme: (type: IThemeType) => void
}

const ThemeContext = createContext<ITheme>({
  themeType: 'light',
  fontColor: '',
  bgColor: '',
  hoverColor: '',
  setTheme: () => {}
})

const ThemeProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [fontColor, setFontColor] = useState('')
  const [bgColor, setBgColor] = useState('')
  const [hoverColor, setHover] = useState('')
  const [themeType, setThemeType] = useState<IThemeType>('light')
  const {
    errorStore: { setError }
  } = useStore()

  //第一次加载时，将主题写入数据库
  useEffect(() => {
    window.api.query<boolean | string>('init_theme', themeType).then(
      (res) => {
        console.log(res)
        if (res === false) {
          setError('数据初始化失败')
        } else {
          if (res === 'light' || res === 'dark') {
            setTheme(res as IThemeType)
          }
        }
      },
      (err) => {
        setError(err)
      }
    )
  }, [])
  const {
    lightBgColor,
    lightFontColor,
    lightHoverColor,
    darkBgColor,
    darkFontColor,
    darkHoverColor
  } = themeInit

  useEffect(() => {
    setBgColor(lightBgColor)
    setFontColor(lightFontColor)
    setHover(lightHoverColor)
  }, [])

  const setTheme = (type: IThemeType): void => {
    setThemeType(type)
    switch (type) {
      case 'light': {
        setFontColor(lightFontColor)
        setBgColor(lightBgColor)
        setHover(lightHoverColor)
        break
      }

      case 'dark':
        setFontColor(darkFontColor)
        setBgColor(darkBgColor)
        setHover(darkHoverColor)
        break

      default:
        throw new Error('error')
    }
  }
  const data = {
    themeType,
    fontColor,
    bgColor,
    hoverColor,
    setTheme
  }

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ITheme => useContext(ThemeContext)

export default ThemeProvider
