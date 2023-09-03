import request from '../utils/request'

//场站列表
export function getStationList(data) {
    return request({
      url: '/scheduling-pc/siteAndClientController/siteMonitoring',
      method: 'post',
      data
    })
}
//重点客户列表
export function getCustomerList(data) {
    return request({
      url: '/scheduling-pc/siteAndClientController/clientMonitoring',
      method: 'post',
      data
    })
}
//地图管线数据
export function getMapPipeData(data) {
    return request({
      url: '/scheduling-pc/situationalController/getPipeNetwork',                           
      method: 'post',
      data
    })
}
//地图撒点数据
export function getMapPointData(data) {
    return request({
      url: '/scheduling-pc/situationalController/stationList',
      method: 'post',
      data
    })
}
//运行监控看板数据
export function getKanbanData(data) {
    return request({
      url: '/scheduling-pc/dgHomePage/dailyGasUsedTrack',
      method: 'post',
      data
    })
}
//运行监控-关键节点
export function getImportantPoint(data) {
  return request({
    url: '/scheduling-pc/siteAndClientController/nodesMapMinDG',
    method: 'post',
    data
  })
}