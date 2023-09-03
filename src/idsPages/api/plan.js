import request from '../utils/request'

// 获取测算所有场站
export function getAllStation() {
  return request({
    url: '/scheduling-pc/dgPlanController/getStationTopologyList',
    method: 'post',
  })
}

// 气量参数获取/配置详情
export function getPlanConfigDetail(data) {
  return request({
    url: '/scheduling-cz/dgPlanController/queryPlanByDate',
    method: 'post',
    data
  })
}

// 气量参数获取/配置-确定
export function savePlanConfig(data) {
  return request({
    url: '/scheduling-cz/dgPlanController/savePlanConfig',
    method: 'post',
    data
  })
}

// 气量参数获取/配置-保存为预案库
export function saveReservePlanConfig(data) {
  return request({
    url: '/scheduling-cz/dgPlanController/saveReservePlanConfig',
    method: 'post',
    data
  })
}

// 仿真开始计算获取version
export function startComputed(data) {
  return request({
    url: '/scheduling-cz/dg/fz/predict/trigger',
    method: 'post',
    data
  })
}

// 轮询获取仿真列表以及数据
export function getComputedResult(data) {
  return request({
    url: '/scheduling-cz/dg/fz/predict/queryResult',
    method: 'post',
    data
  })
}
// 预案库列表获取
export function getPlanLibraryData(data) {
  return request({
    url: '/scheduling-cz/dgPlanController/queryPlanList',
    method: 'post',
    data
  })
}
// 预案库新建
export function createPlanLibrary(data) {
  return request({
    url: '/scheduling-cz/dgPlanController/createPlan',
    method: 'post',
    data
  })
}
// 预案库删除
export function deletePlanLibrary(data) {
  return request({
    url: '/scheduling-cz/dgPlanController/deletePlan',
    method: 'post',
    data
  })
}
