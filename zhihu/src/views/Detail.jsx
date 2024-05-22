import { useState, useEffect, useMemo } from "react"
import message from '@/components/message'
import { flushSync } from 'react-dom'
import styled from "styled-components"
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from 'antd-mobile-icons'
import { Badge, SpinLoading } from 'antd-mobile'
import SkeletonAgain from "@/components/SkeletonAgain"
import API from "@/api"
import { connect } from 'react-redux'
import action from "@/store/actions"

/* 组件的样式 */
const DetailStyle = styled.div`
    .content {
        overflow-x: hidden;
        margin: 0;
        padding-bottom: 45px;
        .img-place-holder {
            overflow: hidden;
            img {
                margin: 0;
                width: 100%;
                min-height: 100%;
            }
        }
        .meta {
            .avatar {
                display: inline-block;
                margin-top: 0;
                margin-bottom: 0;
            }
        }
    }

    .tab-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
        box-sizing: border-box;
        width: 100%;
        height: 45px;
        background: #DDD;
        display: flex;
        align-items: center;
        .back {
            box-sizing: border-box;
            width: 50px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            font-size: 20px;
            font-weight: 900;
            border-right: 1px solid #CCC;
        }
        .icons {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 25px;
            line-height: 25px;
            .adm-badge-wrapper,
            span {
                flex-grow: 1;
                text-align: center;
                font-size: 20px;
            }
            span {
                &:nth-last-of-type(1) {
                    color: #AAA;
                }
                &:nth-of-type(1) {
                    &.stored {
                        color: #108ee9;
                    }
                }
            }
            .adm-badge-wrapper {
                .adm-badge-fixed {
                    right: 12.5%;
                }
                .adm-badge {
                    background: none;
                    .adm-badge-content {
                        color: #555;
                    }
                }
            }
        }
        .adm-spin-loading{
            margin: 0 auto;
            width: 20px;
            height: 20px;
        }
    }
`

const Detail = function Detail({
    navigate, params, location,
    profile, queryLoginInfo,
    collectList, queryStoreList, removeStore
}) {
    /* 新闻信息的常规处置 */
    // 定义状态
    let { id } = params
    let [info, setInfo] = useState(null)
    let [story, setStory] = useState(null)
    // 动态创建Link
    let link = null
    const createLink = ({ css }) => {
        css = Array.isArray(css) && css[0] || ""
        if (!css) return
        link = document.createElement('link')
        link.rel = "stylesheet"
        link.href = css
        document.head.appendChild(link)
    }
    useEffect(() => {
        return () => {
            // 组件销毁的时候，把创建的Link移除掉
            if (link) document.head.removeChild(link)
        }
    }, [])
    // 处理头图信息
    const handleImageHeader = ({ image }) => {
        let imgPlaceHolder = document.querySelector('.img-place-holder')
        if (!imgPlaceHolder) return
        let imgTemp = new Image()
        imgTemp.src = image
        imgTemp.onload = () => {
            imgPlaceHolder.appendChild(imgTemp)
        }
        imgTemp.onerror = () => {
            imgPlaceHolder.parentNode.removeChild(imgPlaceHolder)
        }
    }
    // 第一次渲染完毕：从服务器获取数据
    const initInfo = async () => {
        try {
            let result = await API.queryNewsInfo(id)
            flushSync(() => {
                setInfo(result)
                createLink(result)
            })
            handleImageHeader(result)
        } catch (_) { }
    }
    const initStory = async () => {
        try {
            let result = await API.queryNewsStory(id)
            setStory(result)
        } catch (_) { }
    }
    useEffect(() => {
        initInfo()
        initStory()
    }, [])


    /* 新闻收藏的处理 */
    let [loading, setLoading] = useState(false)
    // 第一次渲染完毕：处理是否登录、以及收藏列表
    useEffect(() => {
        (async () => {
            if (!profile) {
                let result = await queryLoginInfo()
                profile = result.profile
            }
            if (profile && !collectList) {
                await queryStoreList()
            }
        })();
    }, [])
    // 根据收藏列表，计算出当前文章是否收藏
    let isCollect = useMemo(() => {
        if (!collectList || collectList.length === 0) return false
        return collectList.some(item => {
            return +item.news.id === +id
        })
    }, [collectList])
    // 新增或者删除徐收藏记录
    const collectHandle = async () => {
        // 首先校验是否登录
        if (!profile) {
            message.error(`请您先登录`)
            navigate(`/login?to=${location.pathname}`, { replace: true })
            return
        }
        // 然后根据是否收藏，决定如何处理
        if (isCollect) {
            // 这篇文章收藏过：则移除收藏
            let item = collectList.find(item => +item.news.id === +id)
            if (!item) {
                message.error('移除收藏失败')
                return
            }
            setLoading(true)
            await removeStore(item.id)
            setLoading(false)
            return
        }
        // 这篇文章没收藏过：则进行收藏
        setLoading(true)
        try {
            let { code } = await API.addStore(id)
            if (+code !== 0) {
                message.error('收藏失败')
            } else {
                message.success('收藏成功')
                await queryStoreList()
            }
        } catch (_) { }
        setLoading(false)
    }

    return <DetailStyle>
        {/* 新闻内容 */}
        {info ?
            <div className="content" dangerouslySetInnerHTML={{
                __html: info.body
            }}></div> :
            <SkeletonAgain />
        }

        {/* 底部图标 */}
        <div className="tab-bar">
            <div className="back"
                onClick={() => {
                    navigate(-1)
                }}>
                <LeftOutline />
            </div>
            <div className="icons">
                <Badge content={story?.comments || 0}><MessageOutline /></Badge>
                <Badge content={story && story.popularity || 0}><LikeOutline /></Badge>
                <span className={isCollect ? 'stored' : ''}
                    onClick={collectHandle}>
                    {loading ? <SpinLoading /> : <StarOutline />}
                </span>
                <span><MoreOutline /></span>
            </div>
        </div>
    </DetailStyle>
}

export default connect(
    state => {
        return {
            profile: state.base.profile,
            collectList: state.collect.list
        }
    },
    {
        queryLoginInfo: action.base.queryLoginInfo,
        queryStoreList: action.collect.queryStoreList,
        removeStore: action.collect.removeStore
    }
)(Detail)