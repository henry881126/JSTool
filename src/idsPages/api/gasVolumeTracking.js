import request from '../utils/request'

//日用气量执行跟踪
export function dailyGasUsedTrack(data) {
  return request({
    url: '/scheduling-pc/dgHomePage/dailyGasUsedTrack',
    method: 'post',
    data
  })
}

//气量执行与跟踪拓扑关系图-数据
export function gasExecutionTrack(data) {
  return request({
    url: '/scheduling-pc/dongguan/gasExecutionTrack',
    method: 'post',
    data
  })
}
//直销调压力站查询
export function directList(data) {
  return request({
    url: '/scheduling-pc/dongguan/directSalesSurgeStation',
    method: 'post',
    data
  })
}

//代输客户查询
export function transList() {
  return request({
    url: '/scheduling-pc/dongguan/transportCustomer',
    method: 'post'
  })
}

//代销客户查询
export function salesList(data) {
  return request({
    url: '/scheduling-pc/dongguan/agentSalesCustomer',
    method: 'post',
    data
  })
}
// 日指定量编辑查询
export function getVolume(data) {
  return request({
    url: '/scheduling-pc/dongguan/gasStationReplyVolume',
    method: 'post',
    data
  })
}
//日指定量编辑保存
export function saveVolume(data) {
  return request({
    url: '/scheduling-pc/dongguan/gasReplyVolumeSave',
    method: 'post',
    data
  })
}
