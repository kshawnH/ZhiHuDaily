import React from 'react'
import ReactDOM from 'react-dom/client'
// import './global'

/* ANTD-MOBILE */
import { ConfigProvider } from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'

/* REDUX */
import { Provider } from 'react-redux'
import store from './store'

/* 组件&样式 */
import '@/assets/flexible'
import './index.less'
import App from './App'

/* 解决click事件300ms延迟的问题 */
import FastClick from 'fastclick'
FastClick.attach(document.body)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
)