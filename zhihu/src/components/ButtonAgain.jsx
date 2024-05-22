import { useState } from 'react'
import { Button } from 'antd-mobile'
import _ from '@/assets/utils'

export default function ButtonAgain(props) {
    // 定义状态
    let { children, onClick: handle } = props
    let [loading, setLoading] = useState(false)

    // 把除了特定之外的其它属性，放在attrs中，最后统一给组件库中的Button
    let attrs = {}
    _.each(props, (value, key) => {
        if (key === 'loading' || key === 'children' || key === 'onClick') return
        attrs[key] = value
    })

    return <Button {...attrs}
        loading={loading}
        onClick={async (ev) => {
            if (typeof handle !== 'function') return
            setLoading(true)
            await handle(ev)
            setLoading(false)
        }}>
        {children}
    </Button>
}