import Vue from 'vue'
import Router from 'vue-router'
import IdsRouter from '../idsPages/router'

Vue.use(Router)
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => {
//       console.log('err:',err,'location:',location)
//   })
// }
const routes = [
    {
        path: '/',
        name: 'index',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/pages/login'),
        meta:{ title: '登录页' }
    },
    {
        path: '/overView',
        name: 'overView',
        component: () => import(/* webpackChunkName: "overView" */ '@/pages/overView/index'),
        meta: { title: '总览' }
    },
    {
        path: '/sso',
        name: 'sso',
        component: () => import(/* webpackChunkName: "overView" */ '@/pages/sso/index'),
        meta: { title: 'sso' }
    },
    {
        path: '/dispatchingHome',
        name: 'dispatchingHome',
        component: () => import('@/idsPages/views/operationAndDispatching/dispatchingHome'),
        meta: { title: '调度首页' },
    },
    {
        path: '/layout',
        name: 'layout',
        component: () => import('@/components/layOut/index'),
        children: [
            {
                path: '/customerMap',
                name: 'customerMap',
                component: () => import('@/pages/customerMap'),
                meta:{ title: '资源通路客户地图' }
            },
            // 资源中心/气源市场动态
            {
                path: '/gasMap',
                name: 'gasMap',
                component: () => import('@/pages/customerMap/gasMap'),
                meta:{ title: '气源市场动态' }
            },            
            {
                path: '/resourceInfoMaintain',
                name: 'resourceInfoMaintain',
                component: () => import('@/pages/resourceInfoMaintain'),
                meta:{ title: '资源信息维护' }
            },
            {
                path: '/tubeCapacity',
                name: 'tubeCapacity',
                component: () => import('@/pages/tubeCapacity'),
                meta:{ title: '储量核算' }
            },
            {
                path: '/gasDemand',
                name: 'gasDemand',
                component: () => import('@/pages/gasDemand/index'),
                meta:{ title: '气量预测' }
            },
            {
                path: '/gasMeasureTrail',
                name: 'gasMeasureTrail',
                component: () => import('@/pages/gasMeasureTrail'),
                meta:{ title: '企业用气跟踪' }
            },
            {
                path: '/purchaseAnalysis',
                name: 'purchaseAnalysis',
                component: () => import('@/pages/purchaseAnalysis/index'),
                meta:{ title: '采购分析' }
            },
            {
                path: '/clientAnalyse',
                name: 'clientAnalyse',
                component: () => import('@/pages/clientAnalysis'),
                meta:{ title: 'clientAnalyse' }
            },
            {
                path: '/gasReply',
                name: 'gasReply',
                component: () => import('@/pages/reply/v2'),
                meta:{ title: '用气批复' }
            },
            {
                path: '/dayGasDelivery',
                name: 'dayGasDelivery',
                component: () => import('@/pages/dayGasDelivery/gasDelivery'),
                meta:{ title: '用气交割' }
            },
            {
                path: '/dailyReport',
                name: 'dailyReport',
                component: () => import('@/pages/dayGasDelivery/dailyReport'),
                meta:{ title: '日气量报表' }
            },
            {
                path: '/dayConnectManagement',
                name: 'dayConnectManagement',
                component: () => import('@/pages/separateReportingSystem/dayConnectManagement'),
                meta:{ title: '用气上报' }
            },
            {
                path: '/psAnalyse',
                name: 'psAnalyse',
                component: () => import('@/pages/psAnalyse/psAnalyse'),
                meta:{ title: '采销分析' }
            },
            {
                path: '/purchasesDeploy',//采购配置
                name: 'purchasesDeploy',
                component: () => import('@/pages/purchasesDeploy/index'),
                meta:{ title: '采购配置' }
            },
            {
                path: '/purchasingEstimation',//采购测算
                name: 'purchasingEstimation',
                component: () => import('@/pages/purchasingEstimation/v2'),
                meta:{ title: '气源采购方案' }
            },
            {
                path: '/customerRiskAnalysis',//客户风险价值分析列表
                name: 'customerRiskAnalysis',
                component: () => import('@/pages/customerRiskAnalysis/index.vue'),
                meta:{ title: '客户风险价值分析列表' }
            },
            {
              path: '/valueList',//价值列表
              name: 'valueList',
              component: () => import('@/pages/valueList/index.vue'),
              meta:{ title: '价值列表' }
            },
            {
              path: '/valueDetail',//价值详情
              name: 'valueDetail',
              component: () => import('@/pages/valueList/detail.vue'),
              meta:{ title: '价值列表' }
            },
            {
                path: '/customerRiskAnalysisDetail',//客户风险价值详情
                name: 'customerRiskAnalysisDetail',
                component: () => import('@/pages/customerRiskAnalysis/detail.vue'),
                meta:{ title: '客户风险价值详情' }
            },{
                path: '/PredictionDeviation',
                name: 'PredictionDeviation',
                component: () => import('@/pages/PredictionDeviation/PredictionDeviation.vue'),
                meta:{ title: '预测偏差分析' }
            },{
                path: '/traceOfClients',            // 客户用气跟踪
                name: 'traceOfClients',
                component: () => import('@/pages/traceOfClients/index.vue'),
                meta:{ title: '客户用气跟踪' }
            },
            {
                path: '/businessUserTypeList',            // 客户用气跟踪 工商客户 类型列表
                name: 'businessUserTypeList',
                component: () => import('@/pages/traceOfClients/BusinessUserTypeList.vue'),
                meta:{ title: '客户用气跟踪/工商客户/类型列表' }
            },
            {
                path: '/dayPlan',            // 计划管理 日计划
                name: 'dayPlan',
                component: () => import('@/pages/planManagement/index.vue'),
                meta:{ title: '日计划' }               
            },   
            {
                path: '/dayDelivery',            // 计划管理 日交割
                name: 'dayDelivery',
                component: () => import('@/pages/planManagement/dayDelivery.vue'),
                meta:{ title: '日交割' }
            },
            {
                path: '/gasMoneyBalance',            // 气款管理 余额查询
                name: 'gasMoneyBalance',
                component: () => import('@/pages/gasMoneyManagement/index.vue'),
                meta:{ title: '气款管理' }
            },  
            {
                path: '/gasvolumeTrack',            // 客户用气跟踪 工商客户 类型列表
                name: 'gasvolumeTrack',
                component: () => import('@/pages/gasvolumeTrack/index.vue'),
                meta:{ title: '气款跟踪' }
            },
            {
                path: '/extractingContents',            //  提取量跟踪
                name: 'extractingContents',
                component: () => import('@/pages/extractingContents/index.vue'),
                meta:{ title: '提取量跟踪' }
            },{
                path: '/billsOfGas',            // 气量对账单
                name: 'billsOfGas',
                component: () => import('@/pages/duizhangdan/yongqiqiye/index.vue'),
                meta:{ title: '气量对账单' }
            },{
                path: '/billsOfGasClients',            // 气量对账单
                name: 'billsOfGasClients',
                component: () => import('@/pages/duizhangdan/yongqikehu/index.vue'),
                meta:{ title: '气量对账单' }
            }, {
                path: '/DemandPlanTrack',            // 气量对账单
                name: 'DemandPlanTrack',
                component: () => import('@/pages/demandPlanTrack/index.vue'),
                meta:{ title: '需供计划跟踪' }
            },{
                path: '/dispatchDaily',            // 调度日报
                name: 'dispatchDaily',
                component: () => import('@/pages/dispatchDaily/index.vue'),
                meta:{ title: '调度日报' }
            },
            {
                path: '/unconventionalDailyDetail',            // 调度日报--非常规 详情
                name: 'unconventionalDailyDetail',
                component: () => import('@/pages/dispatchDaily/unconventionalDailyDetail.vue'),
                meta:{ title: '调度日报' }
            },
            {
                path: '/DemandDeploy',            // 需供企业配置
                name: 'DemandDeploy',
                component: () => import('@/pages/businessDisplay/businessDisplay.vue'),
                meta:{ title: '需供企业配置' }
            },
            {
                path: '/gasPerformanceTrack',            // 需供企业配置
                name: 'gasPerformanceTrack',
                component: () => import('@/pages/gasPerformanceTrack/index.vue'),
                meta:{ title: '气源执行跟踪' }
            }, {
                path: '/Agreement',            // 需供企业配置
                name: 'Agreement',
                component: () => import('@/pages/agreementM/agreement.vue'),
                meta:{ title: '合同管理' }
            },
            {
                path: '/messageList',            // 东莞 消息管理 消息列表
                name: 'messageList',
                component: () => import('@/pages/messageManagement/messageList/index.vue'),
                meta:{ title: '消息列表' }
            },{
                path: '/messageTemplate',            // 东莞 消息管理 消息模板
                name: 'messageTemplate',
                component: () => import('@/pages/messageManagement/messageTemplate/index.vue'),
                meta:{ title: '消息列表' }
            },{
                path: '/ruleSettings',            // 东莞 消息管理 消息规则设置
                name: 'ruleSettings',
                component: () => import('@/pages/messageManagement/ruleSettings/index.vue'),
                meta:{ title: '消息列表' }
            },{
                path: '/addRemindMessage',            // 东莞 消息管理 规则设置 新增提醒消息
                name: 'addRemindMessage',
                component: () => import('@/pages/messageManagement/ruleSettings/addForm.vue'),
                meta:{ title: '规则设置' }
            },{
                path: '/viewRemindMessage',            // 东莞 消息管理 规则设置 新增提醒消息
                name: 'viewRemindMessage',
                component: () => import('@/pages/messageManagement/ruleSettings/detail.vue'),
                meta:{ title: '规则查看' }
            },{
                path: '/addMessageTemplate',            // 东莞 消息管理 消息模板 新增消息模板
                name: 'addMessageTemplate',
                component: () => import('@/pages/messageManagement/messageTemplate/addForm.vue'),
                meta:{ title: '规则设置' }
            }, 
            {
                path: '/gasTracking',            // 客户管理/用气执行跟踪 
                name: 'gasTracking',
                component: () => import('@/pages/gasTracking/index.vue'),
                meta:{ title: '用气执行跟踪' }
            },
            {
                path: '/customerlist',
                name: 'customerlist',
                component: () => import('@/pages/Customerlist/index'),
                meta:{ title: '客户列表' }
            },
            {
                path: '/gasVolumeList',            // 气量对账单 列表
                name: 'gasVolumeList',
                component: () => import('@/pages/gasvolume/index'),
                meta:{ title: '气量对账单',keepAlive: true }
            },
            {
                path: '/gasVolumeDetail',            // 气量对账单 详情
                name: 'gasVolumeDetail',
                component: () => import('@/pages/gasvolume/detail'),
                meta:{ title: '气量对账单' }
            },
            {
                path: '/gasPlanAndFeedback',            // 用气计划与反馈
                name: 'gasPlanAndFeedback',
                component: () => import('@/pages/gasPlanAndFeedback/index.vue'),
                meta:{ title: '用气计划及反馈' }
            },
            {
                path: '/pageOne',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: 'iframe页'}
            },
            // 气源 基础配置
            {
                path: '/qiyuan_gysgl',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 供应商管理'}
            },    
            {
                path: '/qiyuan_htgl',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 合同管理'}
            },
            {
                path: '/qiyuan_tfssgl',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 调峰设施管理'}
            },   
            {
                path: '/qiyuan_zdgl',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 站点管理'}
            },  
            {
                path: '/qiyuan_tfss',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 调峰设施'}
            },     
            // 气源 供需匹配
            {
                path: '/qiyuan_xqjhyc',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 需求计划预测'}
            },   
            {
                path: '/qiyuan_gynlyc',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 供应能力预测'}
            },  
            {
                path: '/qiyuan_gxpp',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 供需匹配'}
            }, 
            // 气源 冬季保障
            {
                path: '/qiyuan_dbxzmd',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 冬保小组名单'}
            },  
            {
                path: '/qiyuan_dbfa',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 冬保方案'}
            },     
            {
                path: '/qiyuan_dbtbsh',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 冬保填报审核'}
            },   
            {
                path: '/qiyuan_dbxzmd_sgs_kg',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 冬保小组名单-省公司/控股'}
            },  
            {
                path: '/qiyuan_dbfa_sgs_kg',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 冬保方案-省公司/控股'}
            },                     
            // 气源 气源采购
            {
                path: '/qiyuan_cgcbgs',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 采购成本估算'}
            },          
            {
                path: '/qiyuan_cgcbgs_sgs_kg',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 采购成本估算-省公司/控股'}
            },                 
            // 气源 气量跟踪
            {
                path: '/qiyuan_qlrb',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 气量日报'}
            },   
            // 切换组织（省公司 或 法人公司）后，单击分销下气量日报菜单时，加载气源不同页面（daily-group或daily），所以这里配置了两个气量日报路由，同时权限系统中也配置了两个气量日报
            {
                path: '/qiyuan_qlrb1',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 气量日报'}
            },  
            {
                path: '/qiyuan_qlfx',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 气量分析'}
            },
            {
                path: '/qiyuan_ndxqjh',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 年度需求计划'}
            },   
            {
                path: '/qiyuan_ydxqjh',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 月度需求计划'}
            },  
            {
                path: '/qiyuan_ydzypz',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 月度资源配置'}
            },  
            {
                path: '/qiyuan_ydqlzx',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 月度气量执行'}
            },  
            {
                path: '/qiyuan_ndhtzx',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 年度合同执行'}
            },      
            {
                path: '/qiyuan_rbtbqk',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 日报填报情况'}
            },        
            // 气源 数据应用
            {
                path: '/qiyuan_cgkc',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 储罐库存'}
            },  
            {
                path: '/qiyuan_qlfxbb',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 气量分析报表'}
            },   
            {
                path: '/qiyuan_dbyc',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 冬保预测'}
            },  
            {
                path: '/qiyuan_qlzxfx',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 气量执行分析'}
            },  
            // 气源 系统管理    
            {
                path: '/qiyuan_tzxx',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 通知消息'}
            },  
            {
                path: '/qiyuan_qybz',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 企业配置'}
            },   
            {
                path: '/qiyuan_bbth',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 报表退回'}
            },  
            {
                path: '/qiyuan_ndhtzzth',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 年度合同执行退回'}
            },  
            {
                path: '/qiyuan_htgcpz',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 合同构成配置'}
            },   
            {
                path: '/qiyuan_jfdgl',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 交付点管理'}
            },  
            {
                path: '/qiyuan_jqgxgl',
                component: () => import('@/pages/pageOne/index.vue'),
                meta: {title: '气源 接气管线管理'}
            },   
            {
                path: '/agreementDeploy',//合同政策配置
                name: 'agreementDeploy',
                component: () => import('@/pages/purchasesDeploy/indexNew'),
                meta:{ title: '合同政策配置' }
            },
            // 资源管理/年度采购方案/采购方案
            {
                path: '/procurementScheme',
                name: 'procurementScheme',
                component: () => import('@/pages/annualProcurementScheme/index.vue'),
                meta: {title: '采购方案'}
            },   
            {
                path: '/agreementDeploy',//合同政策配置
                name: 'agreementDeploy',
                component: () => import('@/pages/purchasesDeploy/indexNew'),
                meta:{ title: '合同政策配置' }
            },
            // 资源管理/年度采购方案/方案列表
            {
                path: '/schemeList',
                name: 'schemeList',
                component: () => import('@/pages/annualProcurementScheme/schemeList/index.vue'),
                meta: {title: '采购方案'}
            },
            // 资源管理/年度采购方案/方案对比
            {
                path: '/schemeComparison',
                name: 'schemeComparison',
                component: () => import('@/pages/annualProcurementScheme/schemeList/schemeComparison.vue'),
                meta: {title: '采购方案'}
            },
            {
                path: '/noAccess',
                name: 'noAccess',
                component: () => import('@/pages/noAccess/index.vue'),
                meta: {title: '采购方案'}
            },
            ...IdsRouter
        ]
    }

]

const router = new Router({
    mode: 'history',
    base: process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_BASE_PATH,
    routes
})


export default router
