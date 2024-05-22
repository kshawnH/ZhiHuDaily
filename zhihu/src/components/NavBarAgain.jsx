import React from "react"
import { NavBar } from 'antd-mobile'
import styled from "styled-components"
import { useNavigate, useSearchParams } from 'react-router-dom'

/* 组件的样式 */
const NavBarAgainStyle = styled.div`
    .navbar-again-box {
        padding: 0 10px;
        height: 40px;
        .adm-nav-bar-title {
            font-size: 16px;
        }
        .adm-nav-bar-back-arrow {
            font-size: 18px;
        }
    }
`

const NavBarAgain = function NavBarAgain({ title }) {
    const navigate = useNavigate()
    const query = useSearchParams()[0]
    const handle = () => {
        let to = query.get('to'),
            lx = query.get('lx')
        if (/^\/detail\//.test(to)) {
            navigate(to, { replace: true })
            return
        }
        if (to === '/personal' && lx === 'singout') {
            // 点击退出登录，进入的登录页
            navigate('/', { replace: true })
            return
        }
        navigate(-1)
    }

    return <NavBarAgainStyle>
        <NavBar className="navbar-again-box" onBack={handle}>
            {title}
        </NavBar>
    </NavBarAgainStyle>
}
NavBarAgain.defaultProps = {
    title: '个人中心'
}
export default NavBarAgain