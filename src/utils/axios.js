
import axios from 'axios'
import Router from '@/router'
import store from '@/store'
import { Message, Loading } from 'element-ui'

let loading = null //定义loading变量


//开始 加载loading
let startLoading = () => {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
    })
}
//结束 取消loading加载
let endLoading = () => {
    loading.close()
}


let needLoadingRequestCount = 0 //声明一个变量

let showFullScreenLoading = () => {
    if (needLoadingRequestCount === 0) { //当等于0时证明第一次请求 这时开启loading
        startLoading()
    }
    needLoadingRequestCount++ //全局变量值++ 
}

let tryHideFullScreenLoading = () => {
    if (needLoadingRequestCount <= 0) return //小于等于0 证明没有开启loading 此时return
    needLoadingRequestCount-- //正常响应后 全局变量 --
    if (needLoadingRequestCount === 0) {  //等于0 时证明全部加载完毕 此时结束loading 加载
        endLoading()
    }
}

function getQueryVariable(variable) {
    let href = window.location.href
    let query = href.substring(href.indexOf('?') + 1)
    let vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === variable) {
            return pair[1]
        }
    }
    return ''
}
const globalConfig = window.globalConfig

// create an axios instance
const request = axios.create({
    baseURL: globalConfig.baseUrl + '/usercenter' // api 的 base_url
})
// const request = axios.create({
//     baseURL: `${process.env.VUE_APP_BASE_API}` // api 的 base_url
// })
// request interceptor
request.interceptors.request.use(
    config => {
        //开启loading加载
        // showFullScreenLoading()
        if (store.getters.loginToken) {
            config.headers['auth'] = store.getters.loginToken
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
)

// response interceptor
request.interceptors.response.use(
    response => {
        if (response.data && (response.data.resultCode == '401' || response.data.resultCode == '403')) {
            Message({
                message: response.data.resultMessage,
                type: 'error',
                duration: 5 * 1000
            })
            Router.push({
                path: '/login'
            })
        }
        //关闭loading加载
        // tryHideFullScreenLoading()
        return response.data
    },
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     */
    response => { },
    error => {
        if (error.response && (error.response.status == '401' || error.response.status == '403')) {
            Router.push({
                path: '/login'
            })
        } else {
            Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000
            })
        }
        return Promise.reject(error)
    }
)

export default request
