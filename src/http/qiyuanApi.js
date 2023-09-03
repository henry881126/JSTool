import {request, exportExcel} from './http'

let prefix = '/htapi/api/v1/gsm-manage-api'

const qiyuanApi = {

  demandPlanTrack: {
    getDayPlanTrack: function (data, url = prefix + '/ex/demand-supply/show-day') {
      return request(url, 'post', {}, data)
    },
    getMonthPlanTrack: function (data, url = prefix + '/ex/demand-supply/show-month') {
      return request(url, 'post', {}, data)
    },
    getGasSourceList: function (params, url = prefix + '/ex/dictionary') {
      return request(url, 'post', params)
    },
    exportMonthData: function (data, url = prefix + '/ex/demand-supply/export-month') {
      return exportExcel(url, 'post', {}, data)
    }
  },
  // 需供企业配置
  demandDisplay:{
    demandExAuthorg:function (params, url = prefix + '/ex/authorg') {
        return request(url, 'POST',{}, params)
    },
    stationSelect:function (params, url = prefix + '/ex/station/select') {
      return request(url, 'get', params)
  },
    

    
    
    
}

}

export default qiyuanApi