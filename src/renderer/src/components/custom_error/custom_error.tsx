import { useStore } from '@renderer/store'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

const CustomError = observer(() => {
  const {
    errorStore: { getError, setError }
  } = useStore()
  const err = getError()
  // console.log(err)

  useEffect(() => {
    const timer = setTimeout(() => setError(''), 2000)
    return () => clearTimeout(timer)
  }, [err])

  if (!err) return <></>
  return (
    <div className=" bg-red-500 text-white absolute m-5 z-10 py-2 px-14 text-center rounded-md top-0 opacity-90 left-[50%] translate-x-[-50%]">
      {err}
    </div>
  )
})

export default CustomError
