/* 检测数据类型 */
const toString = Object.prototype.toString,
    isArray = Array.isArray,
    typeReg = /^(object|function)$/,
    fnToString = Function.prototype.toString

// 万能检测数据类型的方法
const isType = function isType(obj) {
    if (obj == null) return obj + ''
    let type = typeof obj,
        reg = /^\[object (\w+)\]$/
    return !typeReg.test(type) ?
        type :
        reg.exec(toString.call(obj))[1].toLowerCase()
}

// 检测是否为对象
const isObject = function isObject(obj) {
    return obj !== null && typeReg.test(typeof obj)
}

// 检测是否是window对象
const isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window
}

// 检测是否为函数
const isFunction = function isFunction(obj) {
    return typeof obj === "function"
}

// 检测是否为数组或者伪数组
const isArrayLike = function isArrayLike(obj) {
    if (isArray(obj)) return true
    let length = !!obj && 'length' in obj && obj.length
    if (isFunction(obj) || isWindow(obj)) return false
    return length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj
}

// 检测是否为一个纯粹的对象(标准普通对象)
const isPlainObject = function isPlainObject(obj) {
    if (isType(obj) !== "object") return false
    let proto, Ctor
    proto = Object.getPrototypeOf(obj)
    if (!proto) return true
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor
    return isFunction(Ctor) && fnToString.call(Ctor) === fnToString.call(Object)
}

// 检测是否为空对象
const isEmptyObject = function isEmptyObject(obj) {
    if (!isObject(obj)) throw new TypeError(`obj is not an object`)
    let keys = Object.getOwnPropertyNames(obj)
    if (typeof Symbol !== 'undefined') keys = keys.concat(Object.getOwnPropertySymbols(obj))
    return keys.length === 0
}

// 检测是否为有效数字
const isNumeric = function isNumeric(obj) {
    let type = isType(obj)
    return (type === "number" || type === "string") && !isNaN(+obj)
}


/* 其它基础方法 */
// 迭代数组/伪数组/对象「支持中途结束循环」
const each = function each(obj, callback) {
    if (typeof callback !== "function") callback = () => { }
    if (typeof obj === "number" && !isNaN(obj) && obj > 0) obj = new Array(obj)
    if (typeof obj === "string") obj = Object(obj)
    if (!isObject(obj)) return obj
    if (isArrayLike(obj)) {
        for (let i = 0; i < obj.length; i++) {
            let item = obj[i]
            let res = callback.call(obj, item, i)
            if (res === false) break
        }
        return obj
    }
    let keys = Object.getOwnPropertyNames(obj)
    if (typeof Symbol !== 'undefined') keys = keys.concat(Object.getOwnPropertySymbols(obj))
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i],
            value = obj[key]
        let res = callback.call(obj, value, key)
        if (res === false) break
    }
    return obj
}

// 具备有效期的LocalStorage存储
const storage = {
    set(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify({
                time: +new Date(),
                value
            })
        )
    },
    get(key, cycle = 2592000000) {
        cycle = +cycle
        if (isNaN(cycle)) cycle = 2592000000
        let data = localStorage.getItem(key)
        if (!data) return null
        let { time, value } = JSON.parse(data)
        if ((+new Date() - time) > cycle) {
            storage.remove(key)
            return null
        }
        return value
    },
    remove(key) {
        localStorage.removeItem(key)
    }
}

// 万能的日期格式化工具
const formatTime = function formatTime(time, template) {
    try {
        if (time == null) time = new Date().toLocaleString('zh-CN', { hour12: false })
        if (typeof template !== "string") template = "{0}/{1}/{2} {3}:{4}:{5}"
        let arr = []
        if (/^\d{8}$/.test(time)) {
            let [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time)
            arr.push($1, $2, $3)
        } else {
            arr = time.match(/\d+/g)
        }
        return template.replace(/\{(\d+)\}/g, (_, $1) => {
            let item = arr[$1] || "00"
            if (item.length < 2) item = "0" + item
            return item
        })
    } catch (_) {
        return ''
    }
}

// 为对象设置不可枚举的属性
const define = function define(obj, key, value) {
    Object.defineProperty(obj, key, {
        writable: true,
        configurable: true,
        enumerable: false,
        value
    })
}

// 延迟处理函数
const delay = function delay(interval = 1000) {
    return new Promise(resolve => {
        let timer = setTimeout(() => {
            resolve()
            clearTimeout(timer)
        }, interval)
    })
}

/* 发布订阅设计模式 */
let listeners = {}
// 向事件池中加入自定义事件及方法
const on = function on(name, callback) {
    if (typeof name !== 'string') throw new TypeError('name is not a string')
    if (typeof callback !== 'function') throw new TypeError('callback is not a function')
    if (!listeners.hasOwnProperty(name)) listeners[name] = []
    let arr = listeners[name]
    if (arr.includes(callback)) return
    arr.push(callback)
}
// 从事件池中移除自定义事件及方法
const off = function off(name, callback) {
    if (typeof name !== 'string') throw new TypeError('name is not a string')
    if (typeof callback !== 'function') throw new TypeError('callback is not a function')
    let arr = listeners[name],
        index
    if (!Array.isArray(arr)) return
    index = arr.indexOf(callback)
    if (index >= 0) arr[index] = null
}
// 通知指定的自定义事件(绑定的方法)执行
const emit = function emit(name, ...params) {
    if (typeof name !== 'string') throw new TypeError('name is not a string')
    let arr = listeners[name]
    if (!Array.isArray(arr)) return
    for (let i = 0; i < arr.length; i++) {
        let callback = arr[i]
        if (typeof callback !== 'function') {
            arr.splice(i, 1)
            i--
            continue
        }
        callback(...params)
    }
}

/* 暴露API */
const utils = {
    isType,
    isObject,
    isArray,
    isArrayLike,
    isWindow,
    isFunction,
    isPlainObject,
    isEmptyObject,
    isNumeric,
    each,
    storage,
    formatTime,
    define,
    delay,
    on,
    off,
    emit
}

export default utils