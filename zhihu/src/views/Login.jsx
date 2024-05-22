import React, { useState, useEffect } from "react"
import message from '@/components/message'
import styled from "styled-components"
import { Form, Input, Button } from 'antd-mobile'
import NavBarAgain from "@/components/NavBarAgain"
import ButtonAgain from "@/components/ButtonAgain"
import API from "@/api"
import _ from '@/assets/utils'
import { connect } from 'react-redux'
import action from "@/store/actions"

/* 组件的样式 */
const LoginStyle = styled.div`
    .adm-form {
        padding: 15px;
    }

    .adm-input-element{
        font-size: 14px;
    }

    .adm-form-footer {
        .adm-button {
            display: block;
            margin: 0 auto;
            width: 60%;
            height: 35px;
            font-size: 14px;
            border-radius: 0;
        }
    }

    .adm-form-item {
        font-size: 14px;
    }

    .adm-list-item-content-extra {
        .adm-button {
            width: 100px;
            font-size: 12px;
            border-radius: 0;
        }
    }
`

const Login = function Login({ navigate, queryLoginInfo, query }) {
    // 定义状态
    let [formIns] = Form.useForm()
    let [disabled, setDisabled] = useState(false)
    let [text, seText] = useState('发送验证码')
    let [submitLoading, setSubmitLoading] = useState(false)

    // 表单提交（已经通过校验）
    const submit = async (values) => {
        // values：收集的各个表单的信息
        setSubmitLoading(true)
        try {
            let { phone, code } = values
            let { code: resultCode, token } = await API.userLogin(phone, code)
            if (+resultCode === 0) {
                // 登录成功：存储Token、获取登录者信息到redux中、提示、跳转
                _.storage.set('TK', token)
                await queryLoginInfo()
                message.success('登录/注册成功')
                // 跳转是有特殊处理的
                let to = query.get('to')
                to ? navigate(to, { replace: true }) : navigate('/')
            } else {
                message.error('登录/注册失败')
                formIns.setFieldValue('code', '')
            }
        } catch (_) { }
        setSubmitLoading(false)
    }

    // 发送验证码
    let timer = null
    const countdown = () => {
        setDisabled(true)
        seText('30s后重发')
        let count = 30
        timer = setInterval(() => {
            if (count === 1) {
                clearInterval(timer)
                timer = null
                setDisabled(false)
                seText('发送验证码')
                return
            }
            count--
            seText(`${count}s后重发`)
        }, 1000)
    }
    useEffect(() => {
        return () => {
            // 组件销毁时，如果定时器还存在，我们要手动清除一下
            if (timer) {
                clearInterval(timer)
                timer = null
            }
        }
    }, [])
    const send = async () => {
        try {
            // 先对手机号进行表单校验
            await formIns.validateFields(['phone'])
            // 校验通过:发送请求
            let phone = formIns.getFieldValue('phone')
            let { code } = await API.sendPhoneCode(phone)
            if (+code === 0) {
                // 发送成功
                message.success('发送成功')
                // 开启倒计时
                countdown()
                return
            }
            // 发送失败
            message.error('发送成功')
        } catch (_) { }
    }


    return <LoginStyle>
        <NavBarAgain title="登录/注册" />
        <Form
            layout='horizontal'
            style={{ '--border-top': 'none', '--border-bottom': 'none' }}
            footer={
                <Button color="primary"
                    type="submit"
                    loading={submitLoading}>
                    提交
                </Button>
            }
            form={formIns}
            onFinish={submit}
            initialValues={{ phone: '', code: '' }}
        >
            <Form.Item name='phone' label='手机号'
                rules={[
                    { required: true, message: '手机号是必填项' },
                    { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '手机号格式有误' }
                ]}>
                <Input placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item name='code' label='验证码'
                rules={[
                    { required: true, message: '验证码是必填项' },
                    { pattern: /^\d{6}$/, message: '验证码格式有误' }
                ]}
                extra={
                    <ButtonAgain size='small'
                        color='primary'
                        disabled={disabled}
                        onClick={send}>
                        {text}
                    </ButtonAgain>
                }>
                <Input />
            </Form.Item>
        </Form>
    </LoginStyle>
}
export default connect(
    null,
    action.base
)(Login)