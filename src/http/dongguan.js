import {request,requestSecond, exportExcel} from './http'
import config from '../config/config'
let prefix = '/dongwan'

const dongguanApi = {


 // 合同
 contract:{
    //  合同列表
  contractList: function (params, url = prefix +'/contract/list') {
      return requestSecond(url, 'get', params)
  },
//   删除合同
  contractDelete: function (params, url = prefix +'/contract/delete') {
    return request(url, 'get', params)
  },
  // 添加新增合同
  contractSave: function (params, url = prefix +'/contract/save') {
    return request(url, 'post',{}, params)
  },
//   获取登录token
getTokenGetTokenNew: function (params, url = config.uploadProxy +'getToken/getTokenNew') {
    return requestSecond(url, 'post',{}, params)
  },
//   获取合同详情
contractGet: function (params, url = prefix + '/contract/get') {
    return request(url, 'get', params)
  },
//   修改合同
  contractUpdate: function (params, url =prefix + '/contract/update') {
    return request(url, 'post',{}, params)
  },
//   补充协议添加
agreementSave: function (params, url = prefix + '/agreement/save') {
    return request(url, 'post',{}, params)
  },
//   删除补充协议
agreementDelete: function (params, url = prefix + '/agreement/delete') {
    return request(url, 'get', params)
  },
//   获取补充协议
agreementGet: function (params, url = prefix + '/agreement/get') {
    return request(url, 'get', params)
  },
//   修改补充协议
agreementUpdate: function (params, url = prefix + '/agreement/update') {
    return request(url, 'post',{}, params)
  },
//   根据bp查询所以合同
contractGetByBp: function (params, url = prefix + '/contract/getByBp') {
    return request(url, 'get', params)
  },
  
  contractImportExcel: function (params, url = prefix + '/contract/import-excel') {
    return request(url, 'POST',{}, params)
  },
  contractExportexcel: function (params, url = prefix + '/contract/export-excel') {
    return exportExcel(url, 'get', params)
  },
//   获取保存信息
  contractFindUnSubmitContract: function (params, url = prefix + '/contract/findUnSubmitContract') {
    return request(url, 'get', params)
  },
  contractDeleteUnSubmitContract: function (params, url = prefix + '/contract/deleteUnSubmitContract') {
    return request(url, 'get', params)
  },
  // 获取客户名称
  basicInfoList: function (params, url = prefix + '/basicInfo/list') {
    return request(url, 'get', params)
  },
  // 导出
  exportData: function (params, url = prefix + '/contract/export-contract-data') {
    return exportExcel(url, 'get', params)
  },
    
  
  
 

  
  
  
  
  



 
  
   
},

  gasPerformanceTrack: {
    getList: function (params, url = prefix + '/air/statist/listAll/getData') {
      return request(url, 'get', params)
    },
    getListExport: function (params, url = prefix + '/air/statist/listAll/getData/export') {
      return exportExcel(url, 'get', params)
    },
    getDesc: function (params, url = prefix + '/gasplan/statistic/list/getData') {
      return request(url, 'get', params)
    },
    getDianchangData: function (params, url = prefix + '/gasplan/statistic/list/getCompanyOffset') {
      return request(url, 'get', params)
    },
    getDesc1: function (params, url = prefix + '/gasplan/statistic/list/getCompanyAndTotalOffset') {
      return request(url, 'get', params)
    }
  }

}

export default dongguanApi