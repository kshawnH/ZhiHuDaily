import { useState } from "react"
import message from '@/components/message'
import styled from "styled-components"
import { ImageUploader, Input, Button } from 'antd-mobile'
import NavBarAgain from '@/components/NavBarAgain'
import { connect } from 'react-redux'
import action from "@/store/actions"
import API from "@/api"
import ButtonAgain from "@/components/ButtonAgain"

/* 组件的样式 */
const UpdateStyle = styled.div`
    .formBox {
        padding: 15px;
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            height: 55px;
            line-height: 55px;
            font-size: 14px;
            &:nth-child(1){
                height: 80px;
                line-height: 80px;
            }
            .label {
                width: 20%;
                text-align: center;
            }
            .input {
                width: 80%;
            }
        }
        .adm-space-item{
            padding-bottom: 0;
        }
    }

    .submit {
        display: block;
        margin: 0 auto;
        width: 60%;
        height: 35px;
        font-size: 14px;
    }
`

const Update = function Update({ profile, queryLoginInfo, navigate }) {
    /* 图片上传的处理 */
    let [fileList, setFileList] = useState([{
        url: profile.pic
    }])
    // 清空已上传的图片
    const handleDelete = () => {
        setFileList([])
    }
    // 上传图片前：限制文件大小
    const beforeUpload = (file) => {
        if (file.size > 1024 * 1024) {
            message.error(`图片不能超过1MB`)
            return null
        }
        return file
    }
    // 图片上传
    const upload = async (file) => {
        try {
            let { code, pic } = await API.upload(file)
            if (+code === 0) {
                message.success('上传成功')
                setFileList([{ url: pic }])
                return {
                    url: pic
                }
            }
            message.error('上传失败')
        } catch (_) { }
        setFileList([])
        return Promise.reject()
    }

    /* 表单处理 */
    let [name, setName] = useState(profile.name)
    const submit = async () => {
        let username = name.trim(),
            pic = ''
        if (Array.isArray(fileList) && fileList.length > 0) pic = fileList[0].url
        // 表单校验
        if (!username || !pic) {
            message.error('姓名/头像不能为空')
            return
        }
        // 发送请求
        try {
            let { code } = await API.updateUserInfo(username, pic)
            if (+code !== 0) {
                message.error('修改失败')
                return
            }
            await queryLoginInfo()
            message.success('修改成功')
            navigate(-1)
        } catch (_) { }
    }

    return <UpdateStyle>
        <NavBarAgain title="修改信息" />
        <div className="formBox">
            <div className="item">
                <div className="label">头像</div>
                <div className="input">
                    <ImageUploader
                        maxCount={1}
                        value={fileList}
                        onDelete={handleDelete}
                        beforeUpload={beforeUpload}
                        upload={upload}
                        showFailed={false} />
                </div>
            </div>
            <div className="item">
                <div className="label">姓名</div>
                <div className="input">
                    <Input
                        placeholder='请输入账号名称'
                        value={name}
                        onChange={value => {
                            setName(value)
                        }} />
                </div>
            </div>
            <ButtonAgain color='primary' className="submit" onClick={submit}>
                提交
            </ButtonAgain>
        </div>
    </UpdateStyle>
}
export default connect(
    state => state.base,
    action.base
)(Update)