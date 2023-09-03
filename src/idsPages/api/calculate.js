import request from '../utils/request'
//测算折线图

// 管段输配能力变化曲线
export function generatePipeCurve(data) {
    return request({
      url: '/scheduling-pc/dg/fz/predict/generatePipeCurve',
      method: 'post',
      data
    })
  }
//管网末端压力变化曲线
export function generateCustomerCurve(data) {
    return request({
      url: '/scheduling-pc/dg/fz/predict/generateCustomerCurve',
      method: 'post',
      data
    })
}
//门站下气变化曲线
export function generateStationCurve(data) {
    return request({
      url: '/scheduling-pc/dg/fz/predict/generateStationCurve',
      method: 'post',
      data
    })
}

// 输配能力测算报告详情信息Excel导出
export function getStatisticsExportReport(data) {
    return request({
        responseType: 'blob',
        url: `/scheduling-pc/dg/fz/predict/exportReport`,
        method: 'post',
        data
    })
}
