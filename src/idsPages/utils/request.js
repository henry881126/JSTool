import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@store'
import { getToken } from './auth'
import { message } from './restMessage'
import { Encrypt } from './crypto'
let showMsg = true;

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_IDS_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 70000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.loginToken) {
      config.headers['token'] = "671731611386974891003313552334381667273736089911";
      config.headers['cpmoCop'] = "10010600";
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.resultCode === 1 || res.resultCode === 2 || res.resultCode === 3) {
      message.error(res.resultMessage || 'Error')
      return Promise.reject(new Error(res.resultMessage || 'Error'))
    }
    if (res.resultCode === 6) {
      message.warning(res.resultMessage)
      return Promise.reject(new Error(res.resultMessage))
    }
    if (res.resultCode === 4 || res.resultCode === 5) {
      if (showMsg) {
        MessageBox.confirm('您已登出，请重新登录', {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          title: '提示',
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        })
        showMsg = false
        setTimeout(() => {
          showMsg = true;
        }, 3000);
      }
    }
    else {
      return res
    }
  },
  error => {
    let data = error.response.data || '服务器开小差啦！';
    let status = error.response.status
    if (status === 9999) {
      message({
        message: '没查到对应的数据',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      message({
        message: data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
