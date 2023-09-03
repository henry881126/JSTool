//输配能力监控
import request from '../utils/request'
//管网—管网列表查询接口
export function getPipeList(data) {
  return request({
    url: '/scheduling-pc/distributionMonitor/pipeNetworkDetailList',
    method: 'post',
    data
  })
}
//管网-最大输配能力编辑接口
export function update(data) {
  return request({
    url: '/scheduling-pc/distributionMonitor/updateTransporUp',
    method: 'post',
    data
  })
}
//管网-点击右侧小图标曲线图
export function getChartData(data) {
  return request({
    url: '/scheduling-pc/distributionMonitor/pipeNetworkChart',
    method: 'post',
    data
  })
}

//场站列表查询接口
export function getStationDetailList(data) {
  return request({
    url: '/scheduling-pc/distributionMonitor/stationDetailList',
    method: 'post',
    data
  })
}
//场站点击右侧小图标曲线图
export function getStationChart(data) {
  return request({
    url: '/scheduling-pc/distributionMonitor/stationChart',
    method: 'post',
    data
  })
}
//场站压力折线图设备查询
export function getStationDevice(data) {
  return request({
    url: '/scheduling-pc/dongguan/stationDevice',
    method: 'post',
    data
  })
}
//场站压力折线图数据
export function getStationPressureChart(data) {
  return request({
    url: '/scheduling-pc/dongguan/stationPressureChart',
    method: 'post',
    data
  })
}
//场站瞬流折线图数据
export function getStationInstantFlowChart(data) {
  return request({
    url: '/scheduling-pc/dongguan/stationInstantFlowChart',
    method: 'post',
    data
  })
}
