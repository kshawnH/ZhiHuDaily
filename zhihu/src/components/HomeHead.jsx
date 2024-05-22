import { useMemo, useEffect } from "react"
import { connect } from 'react-redux'
import action from "@/store/actions"
import styled from "styled-components"
import defaultPic from '@/assets/images/timg.jpg'
import withRouter from "@/router/withRouter"

/* 组件样式 */
const HomeHeadStyle = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;

    .avatar{
        width: 34px;
        height: 34px;
        border-radius: 50%;
        overflow: hidden;
        img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    .text{
        display: flex;
        .time{
            margin-right: 15px;
            span{
                display: block;
                line-height: 17px;
                text-align: center;
                font-size: 12px;
                &:nth-child(1){
                    font-size: 16px;
                }
            }
        }
        .title{
            padding-left: 15px;
            line-height: 34px;
            font-size: 20px;
            border-left: 1px solid #DDD;
        }
    }
`

const HomeHead = function HomeHead({ today, navigate, profile, queryLoginInfo }) {
    // 依赖于today，计算出需要展示的今天日期
    const time = useMemo(() => {
        let [, month, day] = today.match(/^(?:\d{4})(\d{2})(\d{2})$/),
            area = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
        return {
            day,
            month: area[+month]
        }
    }, [today])

    // 第一次渲染组件，如果profile不存在，则默认派发一次
    useEffect(() => {
        if (!profile) queryLoginInfo()
    }, [])

    // 依赖登录者信息，计算头像的展示
    let pic = useMemo(() => {
        return profile ? profile.pic : defaultPic
    }, [profile])

    return <HomeHeadStyle>
        <div className="text">
            <div className="time">
                <span>{time.day}</span>
                <span>{time.month}月</span>
            </div>
            <h2 className="title">知乎日报</h2>
        </div>
        <div className="avatar"
            onClick={() => {
                navigate('/personal')
            }}>
            <img src={pic} alt="" />
        </div>
    </HomeHeadStyle>
}
export default connect(
    state => {
        return {
            profile: state.base.profile
        }
    },
    {
        queryLoginInfo: action.base.queryLoginInfo
    }
)(withRouter(HomeHead))