import { useEffect } from "react"
import message from '@/components/message'
import styled from "styled-components"
import { SwipeAction } from 'antd-mobile'
import NavBarAgain from '@/components/NavBarAgain'
import NewsItem from '@/components/NewsItem'
import SkeletonAgain from '@/components/SkeletonAgain'
import { connect } from 'react-redux'
import action from "@/store/actions"

/* 组件的样式 */
const MyStoreStyle = styled.div`
    .box {
        padding:15px;
    }
`

const MyStore = function MyStore({ list, queryStoreList, removeStore }) {
    // 第一次渲染完毕，如果redux中没有收藏列表，则派发任务获取
    useEffect(() => {
        if (!list) queryStoreList()
    }, [])

    return <MyStoreStyle>
        <NavBarAgain title="我的收藏" />
        {!list ?
            <SkeletonAgain /> :
            <div className="box">
                {list.map(item => {
                    let { id, news } = item
                    return <SwipeAction key={id}
                        rightActions={[{
                            key: 'delete',
                            text: '删除',
                            color: 'danger',
                            onClick: removeStore.bind(null, id)
                        }]}>
                        <NewsItem info={news} from="mystore" />
                    </SwipeAction>
                })}
            </div>
        }
    </MyStoreStyle>
}
export default connect(
    state => state.collect,
    action.collect
)(MyStore)