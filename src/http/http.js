import axios from 'axios'
import config from '../config/config'
import Vue from 'vue'
const CancelToken = axios.CancelToken
Vue.prototype.$cancelAxiosArr = []
Vue.prototype.$cancelAxios = function () {
    for (let v of this.$cancelAxiosArr) {
        v.cancel()
    }
}

export const request = function (url, method = 'get', params = [], data = {}) {
  const source = CancelToken.source()
  Vue.prototype.$cancelAxiosArr.push(source)
  let config = createRequestConfigBody(url, method, params, data, source.token);
  return axios.request(config).then((res) => {
    if (res.status === 200) {
      if (res.data.errorCode === "0") {
        return res.data.data
      } else if (res.data.retCode === "000000") {
        return res.data.result
      } else if (res.data.code === "00") {
        return res.data.result
      } else if (res.data.code === "200") {
        return res
      }
      else {
        Vue.prototype.$message({
          message: res.data.errorMsg || res.data.retMsg,
          type: 'error',
          duration: 3000
        })
      }
    } else {
      Vue.prototype.$message({
        message: res.data.errorMsg,
        type: 'error',
        duration: 3000
      })
      return false
    }
  }).catch((err) => {
    if(err.toString() === 'Cancel') {
      return
    }
    Vue.prototype.$message({
      message: '服务器开小差了,',
      type: 'error',
      duration: 10000
    })
  })
}

export const exportExcel = function (url, method = 'get', params = [], data = {}) {
  let config = createRequestConfigBody(url, method, params, data);
  config.responseType = 'blob';
  return axios.request(config).then(res => {
    return res.data
  })
}
export const requestSecond = function (url, method = 'get', params = [], data = {}) {
  let config = createRequestConfigBody(url, method, params, data);
  return axios.request(config).then((res) => {
    if (res.status === 200) {
      return res.data
    }
  }).catch(() => {
    Vue.prototype.$message({
      message: '服务器开小差了,',
      type: 'error',
      duration: 10000
    })
  })
}

function createRequestConfigBody (url, method, params, data, token) {
  return {
    url,
    method,
    baseURL: config.host,
    params,
    data,
    cancelToken: token
  }
}