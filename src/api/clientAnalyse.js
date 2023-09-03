import request from '@/utils/axios'

const prefix = '/api/distribution-service/v2/CustomerPerceptionController'

export default {
  // 获取域外/域内客户概况
  getCustomerSurvey: (params) =>
    request.post(`${prefix}/getCustomerSurvey`, params),

  //域外/域内客户详情
  getCustomerDetail: (params) =>
    request.post(`${prefix}/getCustomerDetail`, params),

  //获取域外/域内潜力分析
  getPotentialAnalysis: (params) =>
    request.post(`${prefix}/getPotentialAnalysis`, params),
  /* 张爱玲添加 */
  // 域外机会客户经营状况识别与策略/域外风险客户经营风险识别与应对
  getOperatingStrategyList: (params) =>
    request.post(
      `${prefix}/getOperatingStrategyList
    `,
      params
    ),

  //获取重要客户风险列表
  getImportantCustomerRiskList: (params1, params2) =>
    request.get(
      `${prefix}/getImportantCustomerRiskList?companyCode=${params1}&keyword=${params2}`
    ),

  // 获取域外/域内客户概况
  getBusinessOptimizationList: (params) =>
    request.post(`${prefix}/getBusinessOptimizationList`, params),
  // 域外价值生产规律识别/域内价值生产规律识别
  getProductionRuleList: (params) =>
    request.post(`${prefix}/getProductionRuleList`, params),
  // 获取客户直供风险识别与应对/客户开发机会与策略
  getStraightRiskList: (params) =>
    request.post(`${prefix}/getStraightRiskList`, params),
  accuracyAnalysis: (params) =>
    request.post(`${prefix}/accuracyAnalysis`, params),
  exportAccuracyAnalysis: (params) =>
    request.post(`${prefix}/exportAccuracyAnalysis`, params),
}
