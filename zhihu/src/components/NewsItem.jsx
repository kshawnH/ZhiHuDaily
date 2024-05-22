import React from "react"
import styled from "styled-components"
import { Image } from 'antd-mobile'
import { Link } from 'react-router-dom'
import PT from 'prop-types'

/* 组件的样式 */
const NewsItemStyle = styled.div`
    position: relative;
    margin-bottom: 10px;
    height: 64px;
    overflow: hidden;

    .adm-image{
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 64px;
    }

    .info{
        margin-right: 74px;
        .title{
            max-height: 44px;
            font-size: 15px;
            color: #000;
            line-height: 22px;
            /* 超过两行截取 */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .author{
            font-size: 12px;
            color: #999;
            line-height: 20px;
        }
    }

    a{
        display: block;
        &:visited{
            .info{
                .title{
                    color: #777;
                }
                .author{
                    color: #DDD;
                }
            }
        }
    }
`

const NewsItem = function NewsItem({ info, from }) {
    if (!info) return null
    let { id, title, hint, images } = info
    if (from === 'mystore') images = [info.image]
    return <NewsItemStyle>
        <Link to={`/detail/${id}`}>
            <div className="info">
                <h4 className="title">{title}</h4>
                <p className="author">{hint}</p>
            </div>
            <Image lazy src={Array.isArray(images) && images[0] || ""} />
        </Link>
    </NewsItemStyle>
}
NewsItem.defaultProps = {
    from: ''
}
NewsItem.propTypes = {
    info: PT.object.isRequired,
    from: PT.string
}

export default NewsItem