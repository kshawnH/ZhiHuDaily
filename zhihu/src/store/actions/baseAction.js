import * as AT from '../action-types'
import API from '@/api'

const baseAction = {
    // 异步获取登录者信息
    async queryLoginInfo() {
        let profile = null
        try {
            let { code, data } = await API.queryUserInfo()
            if (+code === 0) profile = data
        } catch (_) { }
        return {
            type: AT.BASE_QUERY_USER_INFO,
            profile
        }
    },
    // 移除登录者信息
    removeLoginInfo() {
        return {
            type: AT.BASE_REMOVE_USER_INFO
        }
    }
}
export default baseAction