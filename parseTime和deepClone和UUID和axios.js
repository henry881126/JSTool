// one = this.parseTime((new Date(now).getTime() - 6 * 86400000), '{yyyy}/{mm}/{dd}')
// last = this.parseTime((new Date(today).getTime()), '{yyyy}/{mm}/{dd}')
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function getUUID () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
//---------axios-----------------------------------------------------
import axios from 'axios'
import {
  Message
} from 'element-ui'
import router from '@/router/index.js'
import {
  getToken
} from '@/utils/auth'

/**
 * 防重复点击发送请求
 */
//声明一个数组用于存储每个请求的取消函数和标识
let pending = [];
let cancelToken = axios.CancelToken;
// 入参ever为拦截器的config
let removePending = (ever) => {
  // 读取peding数组得下标，
  for (let p in pending) {
    //当前请求在数组中存在时执行函数体
    // endsWith判断字符串是否以指定的子字符串结尾（区分大小写）
    // 第一次config没有pending[p].u，所以第一次不会取消
    if (`${ever.url}&${ever.method}`.endsWith(pending[p].u) && JSON.stringify(pending[p].d) === ever.data) {
      //执行取消操作
      // pending[p].f();
      ever.cancelToken = new cancelToken(c => c());
      //把这条记录从数组中移除
      pending.splice(p, 1);
    }
  }
}
const service = axios.create({
  // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API,
  // request timeout
  timeout: 50000 // request timeout
})

// requets拦截
service.interceptors.request.use(
  config => {
    const token = getToken();
    //在一个发送前执行一下取消操作
    removePending(config);
    if (typeof config.headers['Content-Type'] == 'undefined') {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    // if (token) {
    //   // config.headers['X-Token'] = getToken()
    // }
    // config添加取消方法标识
    config.cancelToken = new cancelToken((c) => {
      pending.push({
        u: `${config.url}&${config.method}`,
        d: config.data,
        f: c
      });
    });
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//response 拦截
service.interceptors.response.use(
  response => {
    /**
     * @param {statusCode}  若存在表示调用node接口，否则调用Java接口
     */
    const res = Object.prototype.hasOwnProperty.call(response.data, "statusCode") ? response.data.data : response.data;
    removePending(response.config);
    if (response.data.code != 200) {
      // Message({
      //   message: res.msg,
      //   type: 'error',
      //   duration: 3 * 1000
      // })
    }
    return res
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service

