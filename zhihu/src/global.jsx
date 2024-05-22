/* 写一些全局通用的信息 */
import React from "react"
import { Toast } from 'antd-mobile'

/* 对Toast的二次封装 */
React.message = {
    success(content) {
        Toast.show({
            icon: 'success',
            content
        })
    },
    error(content) {
        Toast.show({
            icon: 'fail',
            content
        })
    }
}