import * as AT from '../action-types'
import API from '@/api'
import message from '@/components/message'

const collectAction = {
    // 异步获取全部收藏列表
    async queryStoreList() {
        let list = []
        try {
            let { code, data } = await API.queryStoreList()
            if (+code === 0) list = data
        } catch (_) { }
        return {
            type: AT.COLLECT_QUERY,
            list
        }
    },
    // 异步删除某条收藏信息
    async removeStore(id) {
        let flag = false
        try {
            let { code } = await API.removeStore(id)
            if (+code === 0) {
                flag = true
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        } catch (_) { }
        return {
            type: AT.COLLECT_REMOVE,
            id,
            flag
        }
    },
    // 同步清除收藏列表
    clearStore() {
        return {
            type: AT.COLLECT_CLEAR
        }
    }
}
export default collectAction