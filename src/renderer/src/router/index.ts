import { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
const Home = lazy(() => import('@renderer/pages/home/home'))
const Config = lazy(() => import('@renderer/pages/config/config'))
const router: RouteObject[] = [
  {
    path: '/',
    Component: Home
  },
  {
    path: '/config',
    Component: Config
  }
]

export default router
