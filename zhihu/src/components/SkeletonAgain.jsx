import React from "react"
import { Skeleton } from 'antd-mobile'
import styled from "styled-components"

/* 组件样式 */
const SkeletonAgainStyle = styled.div`
    padding: 0 10px;
    padding-top: 16px;
    .adm-skeleton-title{
        margin-top: 0;
    }
`

const SkeletonAgain = function SkeletonAgain(props) {
    return <SkeletonAgainStyle>
        <Skeleton.Title animated />
        <Skeleton.Paragraph animated lineCount={props.count} />
    </SkeletonAgainStyle>
};
SkeletonAgain.defaultProps = {
    count: 5
}
export default SkeletonAgain