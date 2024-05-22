import http from './http'

// 获取今日新闻&轮播图数据&今天日期
const queryNewsLatest = () => http.get('/news_latest')

// 获取往日的新闻列表
const queryNewsBefore = (time) => {
    return http.get('/news_before', {
        params: {
            time
        }
    })
}

// 获取新闻详细信息
const queryNewsInfo = (id) => {
    return http.get('/news_info', {
        params: {
            id
        }
    })
}

// 获取新闻评论/点赞信息
const queryNewsStory = (id) => {
    return http.get('/story_extra', {
        params: {
            id
        }
    })
}

// 发送验证码
const sendPhoneCode = (phone) => {
    return http.post('/phone_code', {
        phone
    })
}

// 用户登录/注册
const userLogin = (phone, code) => {
    return http.post('/login', {
        phone,
        code
    })
}

// ------------
// 获取登录者信息
const queryUserInfo = () => http.get('/user_info')

// 上传头像
const upload = (file) => {
    let fm = new FormData
    fm.append('file', file)
    return http.post('/upload', fm)
}

// 修改登录者信息
const updateUserInfo = (username, pic) => {
    return http.post('/user_update', {
        username,
        pic
    })
}

// 收藏新闻
const addStore = (newsId) => {
    return http.post('/store', {
        newsId
    })
}

// 移除收藏
const removeStore = (id) => {
    return http.get('/store_remove', {
        params: {
            id
        }
    })
}

// 获取收藏列表
const queryStoreList = () => http.get('/store_list')

/* 导出接口 */
const API = {
    queryNewsLatest,
    queryNewsBefore,
    queryNewsInfo,
    queryNewsStory,
    sendPhoneCode,
    userLogin,

    queryUserInfo,
    upload,
    updateUserInfo,
    addStore,
    removeStore,
    queryStoreList
}
export default API