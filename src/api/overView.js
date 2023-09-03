import request from '@/utils/axios'
import axios from 'axios'

export default {
    //年累计销售气量/年累计经营利润
    getSalesVolumeProfitList: (params) => request.post('/api/distribution-service/v2/CockpitController/getSalesVolumeProfitList', params),
    
    // 城燃企业年累计销售完成比/城燃企业年累计利润完成比
    getPercentCompleteRank: (params) => request.post('/api/distribution-service/v2/CockpitController/getPercentCompleteRank', params),
    
    // 年累计民用户/工商用户 发展/安装
    getInstallAndDevelopmentList: (params) => request.post('/api/distribution-service/v2/CockpitController/getInstallAndDevelopmentList', params),
    
    //城燃企业年累(民用户安装/发展完成比)/城燃企业年累(工商户安装/发展完成比)
    getInstallAndDevelopmentRank: (params) => request.post('/api/distribution-service/v2/CockpitController/getInstallAndDevelopmentRank', params),

    //年累计销售气量明细查看
    getPercentDetail:  (params) => request.get(`/api/distribution-service/v2/CockpitController/getPercentDetail?salesId=${params}`),

    // 客户投诉处理率
    getCustomerComplaint: (params) => request.get(`/api/distribution-service/v2/CockpitController/getCustomerComplaint?companyCode=${params}`),
    //安全管控
    getSecurityControls: (params1,params2) => request.get(`/api/distribution-service/v2/CockpitController/getSecurityControls?companyCode=${params1}&date=${params2}`),
    //大客户商机/预警
    // getBigBusiness: (params) => request.get(`/api/distribution-service/v2/CockpitController/getBigBusiness?companyCode=${params}`),
    // 修改接口调用地址，请求接口的域名与本项目接口域名不一致，临时将域名写死
    getBigBusiness: (params) => axios.get(`/khrzcenter/api/csrRiskMgr/result/count/${params}`),
    
    getDayGasTrack: (params) => request.post('/api/distribution-service/v2/CockpitController/getDayGasTrack', params),
    getActualLiftGasRank: (params) => request.get(`/api/distribution-service/v2/CockpitController/getActualLiftGasRank?time=${params.data}&companyCode=${params.companyCode}`), 
    getDeviationAssessmentRank: (params) => request.get(`/api/distribution-service/v2/CockpitController/getDeviationAssessmentRank?time=${params.data}&companyCode=${params.companyCode}`),
    getPast7DaysActualLiftGas: (params) => request.get(`/api/distribution-service/v2/CockpitController/getPast7DaysActualLiftGas?companyCode=${params}`),
    getPast7DaysDeviationAssessment: (params) => request.get(`/api/distribution-service/v2/CockpitController/getPast7DaysDeviationAssessment?companyCode=${params}`),
    getGasPurchase: (params) => request.post('/api/distribution-service/v2/CockpitController/getGasPurchase',params),
}
