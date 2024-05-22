import { legacy_createStore, applyMiddleware } from 'redux'
import reduxLogger from 'redux-logger'
import reduxPromise from 'redux-promise'
import reducer from './reducers'

// 使用中间件
const env = process.env.NODE_ENV
const middleware = [reduxPromise]
if (env !== 'production') middleware.push(reduxLogger)

// 创建STORE
const store = legacy_createStore(
    reducer,
    applyMiddleware(...middleware)
)
export default store