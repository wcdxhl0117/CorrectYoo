import Axios from 'axios'
import * as Bridge from './bridge'

const parseObj = (url) => {
    let arUrl = url.split('&')
    let obj = {}
    arUrl.forEach(function (element) {
        obj[element.split('=')[0]] = element.split('=')[1]
    }, this)
    return obj
}

const api = process.env.STATUS === 'server' ? '/api' : '/api'
// 所有请求控制
// const requests = {}

export const $http = {
    /**
     * 获取本地json静态数据
     */
    json: function (url, config) {
        return Axios.get(url, config)
    },
    /**
     * 获取服务器静态数据
     */
    get: function (url, config) {
        return Axios.get(api + url, config)
    },
    /**
     * 获取服务器动态数据
     */
    post: function (url, data, config) {
        return Axios.post(api + url, data, config)
    },
    /**
     * url转client命令
     */
    client: function (url) {
        $client.system(url.match(/\/\/(\S[^/?]*)/, '$1')[1], parseObj((url.match(/\?(\S*)/, '$1') || ['', ''])[1]))
    }
}

export const $client = {
    /**
     * 调用客户端工具
     */
    system: function (name, data) {
        return Bridge.native(name, data)
    },
    /**
     * 事件监听
     */
    event: function (name, callback) {
        Bridge.register(name, callback)
    }
}

export default function install (Vue) {
    Vue.prototype.$http = $http
    Vue.prototype.$client = $client
}
