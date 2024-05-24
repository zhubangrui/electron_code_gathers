import { ChangeEvent, KeyboardEvent, useState, MouseEvent, useEffect, useRef } from 'react'
import { useTheme } from '@renderer/context/theme_provider'
import { VscSettingsGear } from 'react-icons/vsc'
import { MdOutlineWbSunny } from 'react-icons/md'
import { GoMoon } from 'react-icons/go'

import { ISearchList } from '@renderer/common/types'
import { useStore } from '@renderer/store'

import useEventListener from '@renderer/hooks/use_event_listener'
import useSetTheme from '@renderer/hooks/use_set_theme'

const Search = () => {
  const [inputValue, setInputValue] = useState('')
  const [list, setList] = useState<ISearchList[]>([])
  const [index, setIndex] = useState(-1)

  const listRef = useRef<HTMLDivElement>(null)
  const { themeType, fontColor, bgColor, hoverColor } = useTheme()
  const {
    errorStore: { setError }
  } = useStore()
  const {
    listStore: { getList }
  } = useStore()

  const { setThemeHandle } = useSetTheme()

  useEffect(() => {
    window.api.changeWindow(listRef.current?.offsetHeight!)
  }, [list, listRef.current])

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dataList = getList().filter((i) => i.content.includes(e.target.value || '***$$$###'))
    if (dataList.length) setIndex(0)
    setList(dataList)
    setInputValue(e.target.value)
  }

  const keyDownHandle = (e: KeyboardEvent) => {
    const dataLength = list.length
    if (dataLength) {
      switch (e.key) {
        case 'ArrowDown': {
          //当方向键向下按时
          setIndex((n) => {
            //当为最后一条时，再按向下的方向键，将跳到第一条
            if (n === dataLength - 1) return 0
            return n < dataLength - 1 ? n + 1 : dataLength
          })
          break
        }
        case 'ArrowUp': {
          //当方向键向上按时
          setIndex((n) => {
            //当为第一条时，再按向上的方向键，将跳至最后一条
            if (n === 0) return dataLength - 1
            return n - 1
          })
          break
        }
        case 'Enter': {
          //当按下回车键时
          if (index > -1) {
            getWirteText(index)
          }
          break
        }
      }
    }
  }

  useEventListener('keydown', keyDownHandle)
  // useEffect(() => {
  //   window.addEventListener('keydown', keyDownHandle as unknown as EventListener)
  //   return () => window.removeEventListener('keydown', keyDownHandle as unknown as EventListener)
  // }, [keyDownHandle])

  //当鼠标移入时，获取当前行的index值，通过冒泡的方式
  const getCurIndex = (e: MouseEvent<HTMLDivElement>) => {
    const index = (e.target as HTMLElement).getAttribute('data-index') as unknown as number
    const i = index ? index * 1 : -1
    return i
  }
  //获取剪切板的内容
  const getWirteText = async (index: number) => {
    const currentData = list[index].content
    if (currentData) {
      //复制到剪切板
      await navigator.clipboard.writeText(currentData)
      //发送事件到主进程
      window.api.hideWin()
      setIndex(-1)
      setList([])
      setInputValue('')
    }
  }
  const mouseEnterHandle = (e: MouseEvent<HTMLDivElement>) => {
    const index = getCurIndex(e)
    setIndex(index)
  }
  const clickHandle = (e: MouseEvent<HTMLDivElement>) => {
    const index = getCurIndex(e)
    getWirteText(index)
  }

  const changeTheme = () => {
    setThemeHandle(themeType)
    const currentTheme = themeType === 'dark' ? 'light' : 'dark'
    window.api.query('update_theme', currentTheme).then(
      (res) => {
        if (res === false) {
          setError('更新主题失败')
        }
      },
      (err) => {
        setError(err)
      }
    )
  }
  useEffect(() => {
    window.api.changeTheme(themeType)
  }, [themeType])
  return (
    <div className={`${bgColor} rounded-md select-none ${list.length && 'pb-4'}`}>
      <div className="drag">
        <div className="p-4">
          <div className="flex items-center">
            <div className=" bg-slate-300 flex rounded-md p-2 w-full items-center">
              <VscSettingsGear
                className="text-2xl pr-2 no-drag cursor-pointer"
                onClick={() => window.api.openConfig(themeType)}
              />
              <input
                type="text"
                className="outline-none w-full text-base bg-transparent"
                value={inputValue}
                onChange={inputChange}
                autoFocus
              />
              <div className="cursor-pointer no-drag" onClick={changeTheme}>
                {themeType === 'light' ? <GoMoon /> : <MdOutlineWbSunny />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>{index}</div> */}
      <div
        ref={listRef}
        onMouseOver={mouseEnterHandle}
        onDoubleClick={clickHandle}
        className=" cursor-pointer"
      >
        {list.map((item, i) => (
          <div
            data-index={i}
            // onMouseEnter={() => mouseEnterHandle(i)}
            key={item.id}
            className={` p-2 ${bgColor}  mx-4 rounded-md truncate ${i === index ? 'bg-slate-400 ' + hoverColor + ' hover:' + hoverColor : fontColor}`}
          >
            {item.content}
          </div>
        ))}
      </div>
      {/* <div className=" bg-gray-100 text-gray-800 hover:bg-slate-400 hover:text-gray-100">light</div>
      <div className=" bg-gray-800 text-gray-100 hover:bg-slate-400 hover:text-gray-800">dark</div> */}
    </div>
  )
}

export default Search
