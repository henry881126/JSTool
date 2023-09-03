import request from '../utils/request'
//库存列表
export function getStockData(data) {
  return request({
    url: '/scheduling-pc/dgHomePage/getLngTankAllData',
    method: 'post',
    data
  })
}
//筛选列表
export function screenList(data) {
  return request({
    url: '/scheduling-pc/idsDict/plainDictDetail',
    method: 'post',
    data
  })
}

//管存详情
export function pipeSaveList(data) {
  return request({
    url: '/scheduling-pc/dgHomePage/getLngPipeStoreAll',
    method: 'post',
    data
  })
}