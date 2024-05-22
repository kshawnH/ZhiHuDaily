import message from '@/components/message'
import styled from "styled-components"
import { Link } from 'react-router-dom'
import { RightOutline } from 'antd-mobile-icons'
import NavBarAgain from '@/components/NavBarAgain'
import { connect } from 'react-redux'
import action from "@/store/actions"
import _ from '@/assets/utils'

/* 组件的样式 */
const PersonalStyle = styled.div`
    .baseInfo {
        box-sizing: border-box;
        margin: 20px 0;
        .pic {
            display: block;
            margin: 0 auto;
            width: 86px;
            height: 86px;
            border-radius: 50%;
        }
        .name {
            line-height: 50px;
            font-size: 18px;
            text-align: center;
            color: #000;
        }
    }
    .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #000;
        border-bottom: 1px solid #EEE;
    }
`

const Personal = function Personal({ navigate, profile, removeLoginInfo, clearStore }) {
    return <PersonalStyle>
        <NavBarAgain title="个人中心" />
        <div className="baseInfo">
            <Link to='/update'>
                <img className="pic" src={profile.pic} alt="" />
                <p className="name">{profile.name}</p>
            </Link>
        </div>
        <div>
            <Link to='/mystore' className="tab">
                我的收藏
                <RightOutline />
            </Link>
            <div className="tab"
                onClick={() => {
                    removeLoginInfo()
                    clearStore()
                    _.storage.remove('TK')
                    message.success('您已安全退出')
                    navigate(`/login?to=/personal&lx=singout`, { replace: true })
                }}>
                退出登录
                <RightOutline />
            </div>
        </div>
    </PersonalStyle>
}
export default connect(
    state => state.base,
    {
        removeLoginInfo: action.base.removeLoginInfo,
        clearStore: action.collect.clearStore
    }
)(Personal)