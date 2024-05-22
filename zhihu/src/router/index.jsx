import { Suspense, useEffect, useState } from 'react'
import message from '@/components/message'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import useRouteInfo from './useRouteInfo'
import Loading from '@/components/Loading'
import routes from "./routes"
import store from '@/store'
import action from '@/store/actions'

/* 路由匹配渲染的“前置守卫”：渲染组件之前做的事情 */
const checkList = ['/personal', '/mystore', '/update']
const Element = function Element({ item }) {
    let { meta, component: Component, path } = item
    let profile = store.getState().base.profile
    let [random, setRandom] = useState(+new Date())
    const dispatch = store.dispatch
    const navigate = useNavigate()
    const options = useRouteInfo(item)

    /* 登录态校验 */
    // 记录是否需要“异步派发”来进行登录态校验
    let isCheckLogin = checkList.includes(path) && !profile
    useEffect(() => {
        (async () => {
            if (isCheckLogin) {
                // 获取异步派发的返回值
                let { profile } = await dispatch(action.base.queryLoginInfo())
                if (!profile) {
                    // 当前用户没有登录：跳转到登录页 && 提示
                    message.error('请您先登录')
                    navigate(`/login?to=${path}`, { replace: true })
                    return
                }
                // 已经登录
                setRandom(+new Date())
            }
        })();
    })
    if (isCheckLogin) return <Loading />

    // 修改页面的标题
    let title = meta?.title
    document.title = title ? `${title} - 知乎日报` : `知乎日报`

    // 把路由的相关信息作为属性传递给组件
    return <Component {...options} />
}

/* 路由规则配置 */
const RouterView = function RouterView() {
    return <Suspense fallback={<Loading />}>
        <Routes>
            {routes.map((item, index) => {
                let { path, redirect } = item
                if (redirect) {
                    return <Route
                        key={index}
                        path={path}
                        element={<Navigate to={redirect} />}
                    />
                }
                return <Route
                    key={index}
                    path={path}
                    element={<Element item={item} />}
                />
            })}
        </Routes>
    </Suspense>
}
export default RouterView