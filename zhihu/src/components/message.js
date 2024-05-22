import { Toast } from 'antd-mobile'

const message = {
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
export default message