import axios from "axios"
import qs from 'qs'
import { Toast } from 'antd-mobile'
import _ from '@/assets/utils'

const http = axios.create({
    baseURL: '/api',
    timeout: 60000
})

http.defaults.transformRequest = data => {
    if (_.isPlainObject(data)) data = qs.stringify(data)
    return data
}

const apiList = ['/user_info', '/upload', '/user_update', '/store', '/store_remove', '/store_list']
http.interceptors.request.use(config => {
    // 对于部分接口请求，需要把本地存储的Token信息，基于请求头authorization传递给服务器
    let token = _.storage.get('TK')
    if (token && apiList.includes(config.url)) {
        config.headers['authorization'] = token
    }
    return config
})

http.interceptors.response.use(response => {
    return response.data
}, reason => {
    Toast.show({
        icon: 'fail',
        content: '网络繁忙,稍后再试'
    })
    return Promise.reject(reason)
})
export default http