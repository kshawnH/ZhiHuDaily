import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { Swiper, Divider, DotLoading, Image } from 'antd-mobile'
import HomeHead from "@/components/HomeHead"
import NewsItem from "@/components/NewsItem"
import SkeletonAgain from "@/components/SkeletonAgain"
import API from "@/api"
import dayjs from 'dayjs'

/* 组件样式 */
const HomeStyle = styled.div`
    .banner-box{
        height: 375px;
        background: #EEE;
        .adm-swiper{
            height: 100%;
        }
        .adm-swiper-item{
            position: relative;
            .adm-image,
            img{
                display: block;
                width: 100%;
                height: 100%;
            }
            .content{
                position: absolute;
                bottom: 20px;
                left: 0;
                z-index: 999;
                box-sizing: border-box;
                padding: 0 10px;
                width: 100%;
                .title{
                    font-size: 18px;
                    color: #FFF;
                    line-height: 28px;
                }
                .author{
                    font-size: 12px;
                    color: rgba(255,255,255,.7);
                    line-height: 28px;
                }
            }
        }
        .adm-swiper-indicator{
            left: auto;
            transform: none;
            right: 12px;
            bottom: 12px;
            .adm-page-indicator-dot{
                margin-right: 6px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: rgba(255,255,255,.5);
                &.adm-page-indicator-dot-active{
                    width: 18px;
                    border-radius: 3px;
                    background: #FFF;
                }
            }
        }
    }

    .news-box{
        margin-top: 20px;
        padding: 0 10px;
        .adm-divider-horizontal{
            font-size: 12px;
        }
    }

    .load-more{
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 12px;
        color: #999;
        background: #EEE;
        letter-spacing: 3px;
    }
`

const Home = function Home({ navigate }) {
    // 定义状态
    let [today, setToday] = useState(() => dayjs().format('YYYYMMDD'))
    let [bannerData, setBannerData] = useState([])
    let [newsList, setNewsList] = useState([])
    let loadBox = useRef()

    // 第一次渲染完组件：向服务器发送请求，获取今日新闻列表
    const initData = async () => {
        try {
            let { date, stories, top_stories } = await API.queryNewsLatest()
            setToday(date)
            setBannerData(top_stories)
            setNewsList([{
                date,
                stories
            }])
        } catch (_) { }
    }
    useEffect(() => {
        initData()
    }, [])

    // 第一次渲染完组件：获取加载更多的元素，基于 IntersectionObserver 进行监听，实现触底加载
    let isRun = false
    const queryMoreData = async () => {
        try {
            let time = newsList[newsList.length - 1].date
            let result = await API.queryNewsBefore(time)
            newsList.push(result)
            setNewsList([...newsList])
        } catch (_) { }
    }
    useEffect(() => {
        let temp = loadBox.current
        let ob = new IntersectionObserver(async changes => {
            let item = changes[0]
            if (item.isIntersecting) {
                // 滚动到底部了
                if (isRun) return
                isRun = true
                await queryMoreData()
                isRun = false
            }
        })
        ob.observe(temp)

        return () => {
            // 组件销毁后 或者 newsList状态改变(产生新闭包之前)，都会执行这个函数
            ob.unobserve(temp)
            ob = null
        }
    }, [newsList])

    return <HomeStyle>
        {/* 头部 */}
        <HomeHead today={today} />

        {/* 轮播图 */}
        <div className="banner-box">
            {bannerData.length > 0 ?
                <Swiper autoplay loop>
                    {bannerData.map(item => {
                        let { id, image, title, hint } = item
                        return <Swiper.Item key={id}
                            onClick={() => {
                                navigate(`/detail/${id}`)
                            }}>
                            <Image src={image} lazy />
                            <div className="content">
                                <h3 className="title">{title}</h3>
                                <p className="author">{hint}</p>
                            </div>
                        </Swiper.Item>
                    })}
                </Swiper> :
                null
            }
        </div>

        {/* 新闻列表 */}
        {newsList.length > 0 ?
            <>
                {newsList.map((item, index) => {
                    let { date, stories } = item
                    return <div className="news-box" key={date}>
                        {index > 0 ?
                            <Divider contentPosition="left">
                                {dayjs(date).format('MM月DD日')}
                            </Divider> :
                            null
                        }
                        <div className="news-list">
                            {stories.map(item => {
                                return <NewsItem key={item.id} info={item} />
                            })}
                        </div>
                    </div>
                })}
            </> :
            <SkeletonAgain />
        }

        {/* 加载更多 */}
        <div className="load-more" ref={loadBox}
            style={{
                display: newsList.length > 0 ? 'block' : 'none'
            }}>
            数据加载中
            <DotLoading />
        </div>
    </HomeStyle>
}
export default Home