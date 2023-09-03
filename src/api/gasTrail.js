import request from '@/utils/axios'

const prefixGas = '/api/distribution-service/v2/GasDeviationController'
const prefixContract = '/api/distribution-service/v2/ContractDevitionController'
const customerPrefix= '/api/distribution-service/v1/CustomerInfoController'

export default {
    // 获取客户信息列表
    getCustomerInfoList: (params) => request.post(`${customerPrefix}/getCustomerInfoList`, params),   
    //用气偏差

    //用气偏差柱状图和表格数据
    getGasDeviationTableData: (params) => request.post(`${prefixGas}/getGasDeviationTableData`, params),
    //省公司用气偏差排名
    getRankWithGasDeviation: (params) => request.post(`${prefixGas}/getRankWithGasDeviation`, params),
    //用气偏差同比
    getYearonyearData: (params) => request.post(`${prefixGas}/getYearonyearData`, params),
    //导出
    exportGas: (params) => request.post(`${prefixGas}/export`, params),

    //合同偏差
    //合同偏差柱状图(省公司和城燃企业通用)
    getContractDevitionBarChart:(companyCode, year) => request.get(`${prefixContract}/getContractDevitionBarChart?companyCode=${companyCode}&year=${year}`),
    //查询合同偏差省公司列表
    getContractDevitionProvinceList:(year,companyCode) => request.get(`${prefixContract}/getContractDevitionProvinceList2?year=${year}&companyCode=${companyCode}`),
    //查询合同偏差城燃企业列表
    getContractDevitionSubsidiaryList:(companyCode,year) => request.get(`${prefixContract}/getContractDevitionSubsidiaryList?companyCode=${companyCode}&year=${year}`),

    //导出
    exportContractforProvince: (year,companyCode) => request.get(`${prefixContract}/exportContractDevitionProvinceList?year=${year}&companyCode=${companyCode}`),
    //导出
    exportContractforSubsidiary: (companyCode,year) => request.get(`${prefixContract}/exportContractDevitionSubsidiaryList?companyCode=${companyCode}&year=${year}`),

}
