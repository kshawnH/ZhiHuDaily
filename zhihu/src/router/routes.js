import { lazy } from 'react'
import Home from "@/views/Home"
import { withKeepAlive } from 'keepalive-react-component'

const routes = [
    {
        path: '/',
        name: 'home',
        meta: { title: '首页' },
        component: withKeepAlive(Home, { cacheId: 'Home' })
    },
    {
        path: '/detail/:id',
        name: 'detail',
        meta: { title: '详情页' },
        component: lazy(() => import('@/views/Detail'))
    },
    {
        path: '/personal',
        name: 'personal',
        meta: { title: '个人中心' },
        component: lazy(() => import('@/views/Personal'))
    },
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录/注册' },
        component: lazy(() => import('@/views/Login'))
    },
    {
        path: '/mystore',
        name: 'mystore',
        meta: { title: '我的收藏' },
        component: lazy(() => import('@/views/MyStore'))
    },
    {
        path: '/update',
        name: 'update',
        meta: { title: '修改个人信息' },
        component: lazy(() => import('@/views/Update'))
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404页面' },
        component: lazy(() => import('@/views/Page404'))
    },
    {
        path: '*',
        redirect: '/404'
    }
]
export default routes