import request from '../utils/request'

// 获取planId
export function getPlanId(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/getPlanId',
    method: 'post',
    data
  })
}

// 初始化弹框获取气量参数获取/配置详情
export function getPlanConfigDetailInit(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/queryPlanByPlanId',
    method: 'post',
    data
  })
}

// 选择日期获取气量参数获取/配置详情
export function getPlanConfigDetail(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/queryPlanByPlanDate',
    method: 'post',
    data
  })
}

// 气量参数获取/配置-确定
export function savePlanConfig(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/savePlanConfig',
    method: 'post',
    data
  })
}

// 气量参数获取/配置-保存为预案库
export function saveReservePlanConfig(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/saveReservePlanConfig',
    method: 'post',
    data
  })
}

// 仿真开始计算获取version
export function startComputed(data) {
  return request({
    url: '/scheduling-pc/dg/fz/predict/trigger',
    method: 'post',
    data
  })
}

// 轮询获取仿真列表以及数据
export function getComputedResult(data) {
  return request({
    url: '/scheduling-pc/dg/fz/predict/queryResult',
    method: 'post',
    data
  })
}

// 统计信息接口
export function getStatisticsSummary(data) {
  return request({
    url: '/scheduling-pc/dg/fz/predict/statisticsSummary',
    method: 'post',
    data
  })
}

// 预案库列表获取
export function getPlanLibraryData(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/queryPlanList',
    method: 'post',
    data
  })
}

// 预案库新建
export function createPlanLibrary(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/createPlan',
    method: 'post',
    data
  })
}

// 预案库删除
export function deletePlanLibrary(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/deletePlan',
    method: 'post',
    data
  })
}

// 点击门站/客户详细设置
export function getClientConfigList(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/queryPlanConfigDetail',
    method: 'post',
    data
  })
}

// 保存场站或客户详细设置
export function getClientConfigListEdit(data) {
  return request({
    url: '/scheduling-pc/dgPlanController/savePlanTopicDetail',
    method: 'post',
    data
  })
}

// 输配能力测算报告详情信息
export function getStatisticsDetail(data) {
  return request({
    url: '/scheduling-pc/dg/fz/predict/statisticsDetail',
    method: 'post',
    data
  })
}

// 结束仿真计算
export function cancelComputed(data) {
  return request({
    url: '/scheduling-pc/dg/fz/predict/cancel',
    method: 'post',
    data
  })
}
