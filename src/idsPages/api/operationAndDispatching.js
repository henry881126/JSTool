import request from '../utils/request'

// **request示例
export function postQuery(data) {
  return request({
    url: '/scheduling-pc/situationalController/stationList',
    method: 'post',
    data
  })
}
