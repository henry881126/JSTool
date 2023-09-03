import {request, exportExcel} from './http'
import config from '../config/config'
import axios from 'axios'

const api = {
    //appid登陆
    sso: {
        ssoLogin: function (data, url =  '/auth/api/user/sso/login') {
            return request(url, 'post', {}, data)
        }
    },
    //用气批复接口
    reply: {
        getDateList: function (params, url = config.prefix + '/replay/list') {
            return request(url, 'get', params)
        },
        export: function (params, url = config.prefix + '/replay/export') {
            return exportExcel(url, 'get', params)
        },
        replyPut: function (data, url = config.prefix + '/replay/save') {
            return request(url, 'post', {}, data)
        },
        replyDescPut: function (data, url = config.prefix + '/replay/update/desc') {
            return request(url, 'post', {}, data)
        },
        replySubmit: function (date, url = config.prefix + '/replay/submit') {
          return request(url, 'post', {}, date)
        },
        temporaryStorage: function (date, url = config.prefix + '/replay/save') {
            return request(url, 'post', {}, date)
          },        
        getCompList: function (params, url = config.prefix + '/replay/listComps') {
            return request(url, 'get', params)
        },
        // 驳回操作
        reject: function (params, url = config.prefix + '/replay/reject') {
            return request(url, 'get', params)
        }
    },
    //接口
    dayGasD:{
        getEntys: function (data, url = config.prefix + '/gasJournal/getEntys') {
            return request(url, 'get', data)
        },
        // 气量日报表
        gasReportList:function (data, url = config.prefix + '/gasReport/list') {
            return request(url, 'get', data)
        },
        // 获取日气量计划供应商
        listSupplier:function (data, url = config.prefix + '/gasJournal/listSupplier') {
            return request(url,'get', data)
        },
        // 获取日气量报表供应商
        listSupplierReport:function (data, url = config.prefix + '/gasJournal/getDayGasVolumeReport') {
            return request(url, 'get', data)
        },
        // 获取燃气客户、供应商用气量
        listComps:function (data, url = config.prefix + '/gasJournal/listComps') {
            return request(url, 'post', [], data)
        },
        // 价格日报表-查询列表
        gasPriceRportList:function (data, url = config.prefix + '/gasPriceRport/list') {
            return request(url+ '?lifnr='+data.lifnr+ '&endDate='+data.endDate+'&startDate='+data.startDate, 'get', [], data)
        },
        // 价格日报表-导出
        gasPriceRportExport:function (data, url = config.prefix + '/gasPriceRport/export') {
            return exportExcel(url, 'get', data)
        },
        // 获取供应商价格
        listLinrsPrice:function (data, url = config.prefix + '/gasJournal/listLinrsPrice') {
            return request(url, 'get', data)
        },
        // 供应商价格设置
        saveLifnrsPrice:function (data, url = config.prefix + '/gasJournal/saveLifnrsPrice') {
            return request(url, 'put',[], data)
        },
        // 获取管输价格
        getlistPipelinePrice:function (data, url = config.prefix + '/gasJournal/listPipelinePriceByPipeLineCode') {
            return request(url, 'get', data)
        },
        // 管输方价格设置
        savePipelinePrice:function (data, url = config.prefix + '/gasJournal/savePipelinePrice') {
            return request(url, 'put',[], data)
        },
        // 获取公司价格
        getlistCompPrice:function (data, url = config.prefix + '/gasJournal/listCompPrice') {
            return request(url, 'get', data)
        },
        // 保存公司价格
        saveCompPrice:function (data, url = config.prefix + '/gasJournal/saveCompPrice') {
            return request(url, 'put',[], data)
        },
        // 公司价格导出
        compsExportPrice:function (data, url = config.prefix + '/gasJournal/compsExport') {
            return exportExcel(url, 'get', data)
        },
        // 供应商价格导出
        lifnrsExport:function (data, url = config.prefix + '/gasJournal/lifnrsExport') {
            return exportExcel(url, 'get', data)
        },
        // 保存供应商状态
        saveLinfrsStatus:function (data, url = config.prefix + '/gasJournal/saveLinfrsStatus') {
            return request(url, 'put', data)
        },
        // 保存公司状态
        saveCompStatus:function (data, url = config.prefix + '/gasJournal/saveCompStatus') {
            return request(url, 'put', data)
        },
        // 保存管输状态
        savePipelineStatus:function (data, url = config.prefix + '/gasJournal/savePipelineStatus') {
            return request(url, 'put', data)
        },
        // 保存用气量计划
        savegasJournalPlan:function (data, url = config.prefix + '/gasJournal/save') {
            return request(url, 'put',[], data)
        },
        // 供应商预付费用设置
        setSupplierPricey:function (data, url = config.prefix + '/gasJournal/setSupplierPrice') {
            return request(url, 'post', [], data)
        },
        // 公司预付费用设置
        setCompPriceY:function (data, url = config.prefix + '/gasJournal/setCompPrice') {
            return request(url, 'post', [], data)
        },
        tipPriceE:function (data, url = config.prefix + '/gasJournal/tipPrice') {
            return request(url, 'get', data)
        }, 
        // 预付费用管输
        setPipelinePriceY:function (data, url = config.prefix + '/gasJournal/setPipelinePrice') {
            return request(url, 'post', [], data)
        },
        // 供应商预付费用列表
        supplierPriceList:function (data, url = config.prefix + '/gasJournal/supplierPriceList') {
            return request(url, 'get', data)
        },
        // 公司预付费用列表
        compPriceList:function (data, url = config.prefix + '/gasJournal/compPriceList') {
            return request(url, 'get', data)
        },
        // 管输预付费用列表
        pipelinePriceList:function (data, url = config.prefix + '/gasJournal/pipelinePriceList') {
            return request(url, 'get', data)
        },
        // 获取费用日报表
        gasPrepaidReportList:function (data, url = config.prefix + '/gasPrepaidReport/list') {
            return request(url, 'get', data)
        },
        // 费用日报表导出
        gasPrepaidReport:function (data, url = config.prefix + '/gasPrepaidReport/export') {
            return exportExcel(url, 'get', data)
        },
        // 气量日报表导出
        gasDayReport:function (data, url = config.prefix + '/gasReport/export') {
            return exportExcel(url, 'get', data)
        },
        // 供应商预付费用回显查询
        getPrepaidPriceData:function (data, url = config.prefix + '/gasJournal/getPrepaidPrice') {
            return request(url, 'get', data)
        },
        // 管输预付费用回显查询
        getPipelinePriceData:function (data, url = config.prefix + '/gasJournal/getPipelinePrice') {
            return request(url, 'get', data)
        },
        // 公司预付费用回显查询
        getCompPrepaidPrice:function (data, url = config.prefix + '/gasJournal/getCompPrepaidPrice') {
            return request(url, 'get', data)
        },
        // 日气量优化接口
        // 费用日报表-供应商
        gasPrepaidReportLinrsList:function (data, url = config.prefix + '/gasPrepaidReport/linrsList') {
            return request(url, 'get', data)
        },
        //  费用日报表管输
        gasPrepaidReportPipelineList:function (data, url = config.prefix + '/gasPrepaidReport/pipelineList') {
            return request(url, 'get', data)
        },
        // 费用日报表-用气公司
        gasPrepaidReportCompsList:function (data, url = config.prefix + '/gasPrepaidReport/compsList') {
            return request(url, 'get', data)
        },
        // 供应商气量报表
        gasReportLifnrList:function (data, url = config.prefix + '/gasReport/LifnrList') {
            return request(url, 'get', data)
        },
        // 供应商气量详情
        gasReportLifnrListDetail:function (data, url = config.prefix + '/gasReport/LifnrListDetail') {
            return request(url, 'get', data)
        },
        // 获取用气客户列表
        replayListComps:function (data, url = config.prefix + '/replay/listComps') {
            return request(url, 'get', data)
        },
        // 获取管输方列表
        gasPrepaidReportListSupplier:function (data, url = config.prefix + '/gasPrepaidReport/listSupplier') {
            return request(url, 'get', data)
        },
        // 根据选择 的供应商获取管输名字
        gasReportLifnrPipeline:function (data, url = config.prefix + '/gasReport/lifnrPipeline') {
            return request(url, 'get', data)
        },
        // 气量-用气公司
        gasReportCompsList:function (data, url = config.prefix + '/gasReport/CompsList') {
            return request(url, 'get', data)
        },
        // 用气公司气量详情报表
        gasReportCompsDetail:function (data, url = config.prefix + '/gasReport/compsDetail') {
            return request(url, 'get', data)
        },
        // 供应商气量报表导出
        gasReportLifnrExport:function (data, url = config.prefix + '/gasReport/LifnrExport') {
            return exportExcel(url, 'get', data)
        },
        // 费用日报表-供应商导出
        gasPrepaidReportLinrsExport:function (data, url = config.prefix + '/gasPrepaidReport/linrsExport') {
            return exportExcel(url, 'get', data)
        },
        // 费用日报表-用气公司导出
        gasPrepaidReportCompsExport:function (data, url = config.prefix + '/gasPrepaidReport/compsExport') {
            return exportExcel(url, 'get', data)
        },
        // 费用日报表-管输导出
        gasPrepaidReportPipelineExport:function (data, url = config.prefix + '/gasPrepaidReport/pipelineExport') {
            return exportExcel(url, 'get', data)
        },
        // 用气公司气量报表导出
        gasReportCompsExport:function (data, url = config.prefix + '/gasReport/compsExport') {
            return exportExcel(url, 'get', data)
        },
        // 供应商气量报表合计
        gasReportLifnrDetailTotal:function (data, url = config.prefix + '/gasReport/lifnrDetailTotal') {
            return request(url, 'get', data)
        },
        // 用气公司气量报表合计
        gasReportCompsDetailTotal:function (data, url = config.prefix + '/gasReport/compsDetailTotal') {
            return request(url, 'get', data)
        },
        // ----- 获取燃气客户、供应商用气量（气量调配/用气交割 变更历史交割气量）
        listCompsChangeHistory:function (data, url = config.prefix + '/gasJournalHistory/listComps') {
            return request(url, 'post', [], data)
        },
        // ----- 保存用气量计划（气量调配/用气交割 变更历史交割气量）
        savegasJournalPlanChangeHistory:function (data, url = config.prefix + '/gasJournalHistory/save') {
            return request(url, 'put',[], data)
        },
        getExportDateRange: function (params, url = config.prefix + '/export/queryExportTime') {
            return request(url, 'get', params)
        },
        exportBaobiao: function (params, url = config.prefix + '/export/export') {
            return exportExcel(url, 'get', params)
        },
         // 管输价格导出
         pipelinePriceExport:function (data, url = config.prefix + '/gasJournal/pipelinePriceExport') {
            return exportExcel(url, 'get', data)
        },
    },
    //上报系统接口
    reportSys:{
          // 获取时间
        getTime: function (data, url = config.prefix + '/day') {
            return request(url, 'get', [], data)
        },
        getSpecifiedList:function (params, url = config.prefix + '/day/specifiedList') {
            return request(url, 'get', params)
        },
        // 日指定量提交
        specifiedSubmit:function (data, url = config.prefix + '/day/specifiedSubmit') {
            return request(url, 'post', [], data)
        },
        // 日指定量保存
        specifiedSave:function (data, url = config.prefix + '/day/specifiedSave') {
            return request(url, 'post', [], data)
        },
        //保存备注
        saveDesc:function (data, url = config.prefix + '/day/saveDesc') {
            return request(url, 'post', {}, data)
        },
        // 日指定导出
        exportRzd:function (params, url = config.prefix + '/day/export') {
            return exportExcel(url, 'get', params)
        },
        // 日交接管理
        dayDelivery:function (params, url = config.prefix + '/dayDelivery/list') {
            return request(url, 'get', params)
        },
        // 确认余额
        confirmBalance:function (params, url = config.prefix + '/dayDelivery/submit') {
            return request(url, 'get', params)
        },
        // 余额提醒
        tipPrice: function (params, url = config.prefix + '/dayDelivery/tipPrice') {
            return request(url, 'get', params)
        },
         // 日交割管理导出
        dayDeliveryExport:function (params, url = config.prefix + '/dayDelivery/export') {
            return exportExcel(url, 'get', params)
        }
    },
    psAnalyse: {
        psAnalyseM: function (params, url = config.prefix + '/adoptpin/month/analysis') {
            return request(url, 'get', params)
        },
        psAnalyseQ: function (params, url = config.prefix + '/adoptpin/quarter/analysis') {
            return request(url, 'get', params)
        },
        psAnalyseY: function (params, url = config.prefix + '/adoptpin/year/analysis') {
            return request(url, 'get', params)
        },
        psAnalyseTotal: function (params, url = config.prefix + '/adoptpin/get') {
            return request(url, 'get', params)
        },
        // 气量调配/采销分析 获取业务总结、毛利情况
        psAnalyseGetConclusion: function(params, url = config.prefix + '/adoptpin/month/getConclusion') {
            return request(url,'get',params)
        },
        // /adoptpin/month/saveConclusion
        psAnalyseSaveConclusion: function(params, url = config.prefix + '/adoptpin/month/saveConclusion') {
            return request(url,'post',params)
        }        
    },
    purchasingEstimation: {
        getDataByTotal: function (params, data, url = config.prefix + '/measure/getTotal') {
            return request(url, 'post', params, data)
        },
        getDataByTotalAgain: function (params, data, url = config.prefix + '/measure/getRepatTotal') {
            return request(url, 'post', params, data)
        },
        getStore: function (params, url = config.prefix + '/measure/loadProvisionalPlan') {
            return request(url, 'get', params)
        },
        resetStore: function (params, url = config.prefix + '/measure/resetPlan') {
            return request(url, 'get', params)
        },
        createPlan: function (data, url = config.prefix + '/measure/savePlan') {
            return request(url, 'post', [], data)
        },
        getPlans: function (params, url = config.prefix + '/measure/listPlan') {
            return request(url, 'get', params)
        },
        getPlanById: function (params, url = config.prefix + '/measure/getPlan') {
            return request(url, 'get', params)
        },
        exportStore: function (params, url = config.prefix + '/measure/exportPlan') {
            return exportExcel(url, 'get', params)
        },
        exportCompare: function (params, url = config.prefix + '/measure/exportComparePlan') {
            return exportExcel(url, 'get', params)
        },
        deletePlan: function (params, url = config.prefix + '/measure/deletePlan') {
            return request(url, 'get', params)
        },
        comparePlans: function (params, url = config.prefix + '/measure/comparePlan') {
            return request(url, 'get', params)
        },
        // 保存合同年度用气需求量
        saveAnnualGasDemand: function (params, data, url = config.prefix + '/measure/saveYearGas') {
            return request(url, 'post', params, data)
        },
        // 得到供应商（合同政策）置数量
        getSupplier: function (params, url = config.prefix + '/supplier/getCountSupplier') {
            return request(url, 'get', params)
        },
        // 导出采购方案列表
        exportPruchaseScheme: function (params, url = config.prefix + '/measure/exportListPlan') {
            return exportExcel(url, 'get', params)
        },        
    },
    // 气量预测
    gasDemand: {
        //新版法人公司-日度接口
        getDemandOfDay: function (params, url = config.prefix + '/smart-forecast/select') {
            return request(url, 'get', params)
        },
        getDemandOfYestoday: function (params, url = config.prefix + '/smart-forecast/yesterday/select') {
            return request(url, 'get', params)
        },
        getRecentData: function (params, url = config.prefix + '/pre/predictive/predictive') {
            return request(url, 'get', params)
        },
        saveDemandOfDay: function (data, url = config.prefix + '/smart-forecast/save') {
            return request(url, 'post', [], data)
        },
        saveDataOfYestoday: function (data, url = config.prefix + '/smart-forecast/yesterday/save') {
            return request(url, 'post', [], data)
        },
        getDemandDataOfThreeDay: function (params, url = config.prefix + '/smart-forecast/selectForecast') {
            return request(url, 'get', params)
        },
        //新版法人公司-月度接口
        getOverviewData: function (params, url = config.prefix + '/smart-forecast-month/selectForecast') {
            return request(url, 'get', params)
        },
        getDemandOfMonth: function (params, url = config.prefix + '/smart-forecast-month/select') {
            return request(url, 'get', params)
        },
        saveDemandOfMonth: function (data, url = config.prefix + '/smart-forecast-month/save') {
            return request(url, 'post', [], data)
        },
        //新版管理实体-日度接口
        getDemandDayOfLevel3: function (params, url = config.prefix + '/smart-forecast/cpmo/select/list') {
            return request(url, 'get', params)
        },
        getDemandDayDescOfLevel3: function (params, url = config.prefix + '/smart-forecast/cpmo/select/detail') {
            return request(url, 'get', params)
        },
        saveDataDayOfLevel3: function (data, url = config.prefix + '/smart-forecast/cpmo/update') {
            return request(url, 'post', [], data)
        },
        //新版管理实体-月度接口
        getDemandMonthOfLevel3: function (params, url = config.prefix + '/smart-forecast-month/cpmo/select/list') {
            return request(url, 'get', params)
        },
        getDemandMonthDescOfLevel3: function (params, url = config.prefix + '/smart-forecast-month/cpmo/select/detail') {
            return request(url, 'get', params)
        },
        saveDataMonthOfLevel3: function (data, url = config.prefix + '/smart-forecast-month/cpmo/update') {
            return request(url, 'post', [], data)
        },
        //新版-年度接口
        getDemandOfYear: function (params, url = config.prefix + '/smart-forecast-year/select') {
            return request(url, 'get', params)
        },
        saveDataYear: function (data, url = config.prefix + '/smart-forecast-year/save') {
            return request(url, 'post', [], data)
        },
        //新版预测-权限控制显示
        showBtn: function (params, url = '/auth/api/resources/element') {
            return request(url, 'get', params)
        },
        //老版预测接口
        getRecommend: function (params, url = config.prefix + '/recentGas') {
            return request(url, 'get', params)
        },
        getEchartsTodayChange: function (params, url = config.prefix + '/dailyGasTracking') {
            return request(url, 'get', params)
        },
        getAbnormalOfDay: function (params, url = config.prefix + '/demandForecasting/list') {
            return request(url, 'get', params)
        },
        getAbnormalOfMonth: function (params, url = config.prefix + '/analysis/gas/list') {
            return request(url, 'get', params)
        },
        getAbnormalOfReport: function (params, url = config.prefix + '/demandForecasting/report/list') {
            return request(url, 'get', params)
        },
        putAbnormalOfDay: function (data, url = config.prefix + '/demandForecasting/save') {
            return request(url, 'post', [], data)
        },
        putAbnormalOfDayReport: function (data, url = config.prefix + '/demandForecasting/report/save') {
            return request(url, 'post', [], data)
        },
        putAbnormalOfMonth: function (data, url = config.prefix + '/analysis/gas/save') {
            return request(url, 'put', [], data)
        },
        getAbnormalOfDayState: function (params, url = config.prefix + '/demandForecasting/report/getExceptionMcNameList') {
            return request(url, 'get', params)
        },
        getAbnormalOfDayReportState: function (params, url = config.prefix + '/demandForecasting/report/getReportNameList') {
            return request(url, 'get', params)
        },
        // 查询公司某天的真实用气量
        getDayActualGas: function (params, url = config.prefix + '/dailyGas') {
            return request(url, 'get', params)
        },
        // 查询本月合同量
        currentMonthContract: function (params, url = config.prefix + '/currentMonthContract') {
            return request(url, 'get', params)
        },
        getLineData: function (params, url = config.prefix + '/getAverageList') {
            return request(url, 'get', params)
        },
        getWeatherScope: function (params, url = config.prefix + '/getScopeWeather') {
            return request(url, 'get', params)
        },
        getWeather: function (params, url = config.prefix + '/getWeather') {
            return request(url, 'get', params)
        },
        // 计算器相关接口
        forecastSelect: function (params, url = config.prefix + '/forecast/select') {
            return request(url, 'get', params)
        },
        forecastCalc: function (data, url = config.prefix + '/forecast/calc') {
            return request(url, 'post', [], data)
        },
        getDayBounced: function (data, url = config.prefix + '/gasTracking/getDayBounced') {
            return request(url, 'get', data)
        },
        selectWeather: function (data, url = config.prefix + '/forecast/selectWeather') {
            return request(url, 'get', data)
        },
    },
    // 采购配置相关接口
    purchasesDeploy:{
        supplierList:function (params, url = config.prefix + '/supplier/list') {
            return request(url, 'post',[], params)
        },
        supplierAdd:function (params, url = config.prefix + '/supplier/add') {
            return request(url, 'post',[], params)
        },
        // 获取信息
        getSupperq:function (params, url = config.prefix + '/supplier/get') {
            return request(url, 'get', params)
        },
        supplierUupdate:function (params, url = config.prefix + '/supplier/update') {
            return request(url, 'post',[], params)
        },
        // 获取气量类型
        supplierGetGasType:function (params, url = config.prefix + '/supplier/getGasType') {
            return request(url, 'get', params)
        },
        // 删除供应商列表信息
        supplierDelete:function (params, url = config.prefix + '/supplier/delete') {
            return request(url, 'get', params)
        },
        
        supplierGetCountSupplier:function (params, url = config.prefix + '/supplier/getCountSupplier') {
            return request(url, 'get', params)
        },
        // 获取供应商
        supplierGetProvider:function (params, url = config.prefix + '/supplier/getProvider') {
            return request(url, 'get', params)
        },
        // 获取冬夏供气比
        supplierGetGasSupply:function (params, url = config.prefix + '/supplier/getGasSupply') {
            return request(url, 'get', params)
        },
        // 延用上一年度合同政策
        supplierCopyUpYear:function (params, url = config.prefix + '/supplier/copyUpYear') {
            return request(url, 'get', params)
        },
        
        
        
        
        
        
    },
    // 气量分析下相关接口
    gasReservesAnalysis: {
        getCustomerRiskAnalysis:function(params, url = '/khrzcenter/api/csrBaseMgr/v2/noGrantCustomers') {
            return axios.get(url, {
                params: params
            })
        },
        // 客户用气跟踪 关键指标、雷达图数据
        // getKeyIndicators:function(params,url = 'http://docloud-service-dev.opaas.enncloud.cn/sjzGasDistribution/sales/indicators') {
        getKeyIndicators:function(params,url = '/api/v1/sjzGasDistribution/sales/indicators') {
            return axios.get(url,{
                params
            })
        },
        // 客户用气跟踪 用户销售明细 列表
        getSalesDetails:function(params,url = '/api/v1/sjzGasDistribution/listGasSalesDetails') {
            return axios.get(url,{
                params
            })
        },        
        // 客户用气跟踪 用户销售明细 导出
        customerGasTrackExport:function(params,url = '/api/v1/sjzGasDistribution/exportGasPopulation') {
            return exportExcel(url,'get',params)
        },
        // 客户用气跟踪 工商户 异常客户日用气量分析 导出
        abnormalCustomerDayGasVolumnAnalysisExport:function(params,url = '/api/v1/gasTracking/exportIndustry') {
            return exportExcel(url,'get',params)
        },        
        // 数据解读，补充说明保存 
        saveSupplementExplain:function(params,url = '/api/v1/gasTracking/saveDataExplain') {
            return request(url, 'post',[], params)
        }, 
        
        // 异常客户日用气量
        getAbnormalCustomerDayGasVolume:function(params,url = '/api/v1/gasTracking/listInduCommercial') {
            return axios.get(url,{
                params
            })
        },
        // 同比、环比变化数据
        getYearQuarterVariationData:function(params,url = '/api/v1/gasTracking/sales/induCommercial') {
            return axios.get(url,{
                params
            })
        },
        
        // ------工商用户分类 获取、导出图表数据（除全选外的其他分类：餐饮 采暖 洗浴 工业 福利 能源）
        // 1.1 chart 工商用户分类
        getBusinessUserCategoryChartQuarterData:function(params,url='/api/v1//gasTracking/businessGas') {
            return request(url,'get',params)
        },     

        // 2.1  list 工商用户分类 获取列表数据（环比偏差）
        getBusinessUserCategoryListQuarterData:function(params,url='/api/v1/gasTracking/selectMonthPageList') {
            return request(url,'get',params)
        },        
        // 2.2 list  工商用户分类 获取列表数据（同比偏差）
        getBusinessUserCategoryListYearData:function(params,url='/api/v1/gasTracking/selectYearPageList') {
            return request(url,'get',params)
        },

        // 3.1 export 工商用户分类 导出（环比偏差）
        getBusinessUserCategoryExportQuarterData:function(params,url='/api/v1/gasTracking/selectMonthReportList') {
            return exportExcel(url,'get',params)
        },  
        // 3.2 export  工商用户分类 导出（同比偏差）      
        getBusinessUserCategoryExportYearData:function(params,url='/api/v1/gasTracking/selectYearReportList') {
            return exportExcel(url,'get',params)
        },     
        // 修改客户偏差说明
        editCustomerDeviationExplain:function(params,url='/api/v1/gasTracking/updateInduGas  ') {
            return request(url, 'post',[], params)
        },
        // 获取工商客户类型列表
        getBusinessUserTypeList:function(params,url='/api/v1/gasTracking/getMcList') {
            return request(url,'get',params)
        },
        // 工商户-更新客户用气类型
        editBusinessUserGasType:function(params,url='/api/v1/gasTracking/updateCompsType') {
            return request(url,'post',[],params)
        },       
        // 工商户-异常用户用气跟踪趋势  
        getBusinessUserAbnormalGasTrace:function(params,url='/api/v1/gasTracking/businessTrend') {
            return request(url,'get',params)
        },
        // 民用户全选图表
        getAllSelectChartsOfPerson: function (params, url = config.prefix + '/gasTracking/civilGasVolume') {
            return request(url, 'get', params)
        },
        //民用户普表用气汇总表
        getPBTableOfPerson: function () {
            return request()
        },
        //民用户普表网格用气表
        getPBWGtableOfPerson: function (params, url = config.prefix + '/gasTracking/listCivilOdyGridGas') {
            return request(url, 'get', params)
        },
        //民用户普表网格用气表导出
        getPBWGtableOfPersonexport: function (params, url = config.prefix + '/gasTracking/reportCivilOdyGridGas') {
            return exportExcel(url, 'get', params)
        },
        //民用户卡表charts数据
        getKBChartsOfPerson: function (params, url = config.prefix + '/gasTracking/gasConsumptionOfCardMeter') {
            return request(url, 'get', params)
        },
        //民用户卡表表格
        getKBTableOfPerson: function (params, url = config.prefix + '/gasTracking/gasConsumptionDetails') {
            return request(url, 'get', params)
        },
        //民用户卡表表格导出
        getKBTableOfPersonExport: function (params, url = config.prefix + '/gasTracking/cardExport') {
            return exportExcel(url, 'get', params)
        },
        //民用户物联表echarts数据
        getWLBChartsOfPerson: function (params, url = config.prefix + '/gasTracking/sales/cusyGas') {
            return request(url, 'get', params)
        },
        //民用户物联表表格
        getWLBTableOfPerson: function (params, url = config.prefix + '/gasTracking/listCusyGas') {
            return request(url, 'get', params)
        },
        //民用户物联表表格导出
        getWLBTableOfPersonExport: function (params, url = config.prefix + '/gasTracking/exportCusy') {
            return exportExcel(url, 'get', params)
        },
        // 工商户-客户信息查询(单击同比或环比图表柱子时，调用此接口)
        getBusinessUserInfo:function(params,url='/api/v1/gasTracking/selectCustomer') {
            return request(url,'get',params)
        }        
    },
    // 计划管理模块下接口
    planManagement: {
        // 日计划上报列表
        getDayPlanReportList:function(params, url=config.prefix + '/day/reportSpecifiedListV2') {
            return request(url,'get',params)
        },
        // 日计划上报和暂存接口
        dayPlanReportAndSave:function(params, url=config.prefix + '/day/reportSpecifiedSaveV2') {
            return request(url,'post',[],params)
        },
        // 日交割列表
        getDayDeliveryList:function(params, url=config.prefix + '/dayDelivery/gasList') {
            return request(url,'get',params)
        },
        // 日交割列表 导出
        dayDeliveryExport:function(params, url=config.prefix + '/dayDelivery/exportGas') {
            return exportExcel(url,'get',params)
        },
        // 确认余额：日交割列表每条记录后的“确认”按钮接口
        confirmBallance:function(params, url=config.prefix + '/dayDelivery/submit') {
            return request(url,'get',params)
        },
        dayDeliveryConfirmTips:function(params, url='/api/v1/dayDelivery/gasRemind') {
            return request(url,'get',params)
        },
        // 计划管理/日交割管理 变更历史交割气量 一键确认
        changeHistoryDeliveryGasConsumptionConfirm:function(params,url=config.prefix + '/gasJournalHistory/submit') {
            return request(url,'post',[],params)
        },
        // 计划管理/日交割管理 变更历史交割气量 列表
        getDayDeliveryListChangeHistory:function(params, url=config.prefix + '/gasJournalHistoryComp/list') {
            return request(url,'get',params)
        },
        // 计划管理/日交割管理 变更历史交割气量 导出
        changeHistoryDeliveryGasConsumptionExport:function(params, url=config.prefix + '/gasJournalHistoryComp/changeListExport') {
            return exportExcel(url,'get',params)
        },        
    },
    // 气款管理
    gasMoneyManagement: {
        // 余额列表
        getGasMoneyBalanceList:function(params, url=config.prefix + '/gasDelivery/list') {
            return request(url,'get',params)
        },
        // 余额提醒
        gasMoneyBalanceRemind:function(params, url=config.prefix + '/gasDelivery/tipPrice') {
            return request(url,'get',params)
        },
        // 余额导出
        gasMoneyBalanceExport:function(params, url=config.prefix + '/gasDelivery/exportPrice') {
            return exportExcel(url,'get',params)
        }      
    },  
    extractingContents:{
        // 获取提取量供应商或者用气客户
        gasProgressListComps:function(params, url=config.prefix + '/gasProgress/listComps') {
            return request(url,'get',params)
        },
        // 提取量列表
        gasProgressListByTime:function(params, url=config.prefix + '/gasProgress/listByTime') {
            return request(url,'get',params)
        },
        // 提取量列表导出
        gasProgressListByTimeExport:function(params, url=config.prefix + '/gasProgress/listByTimeExport') {
            return exportExcel(url,'get',params)
        },
        // 提取量周期列表
        gasProgressListCycleHistory:function(params, url=config.prefix + '/gasProgress/listCycleHistory') {
            return request(url,'get',params)
        },
        // 提取量周期列表导出
        gasProgressListCycleHistoryExport:function(params, url=config.prefix + '/gasProgress/listCycleHistoryExport') {
            return exportExcel(url,'get',params)
        },
        // 提取量周期列表详细
        gasProgressListCycleHistoryDetail:function(params, url=config.prefix + '/gasProgress/listCycleHistoryDetail') {
            return request(url,'get',params)
        },
        // 提取量周期列表详细导出
        gasProgressListCycleHistoryDetailExport:function(params, url=config.prefix + '/gasProgress/listCycleHistoryDetailExport') {
            return exportExcel(url,'get',params)
        },
        // 提取量列表详细(当前明细)
        gasProgressListDetail:function(params, url=config.prefix + '/gasProgress/listDetail') {
            return request(url,'get',params)
        },
        // 提取量列表详细(当前明细)导出
        gasProgressListDetailExport:function(params, url=config.prefix + '/gasProgress/listDetailExport') {
            return exportExcel(url,'get',params)
        },
    },  
     //发送验证码
     sendCode:function(params,url = '/api/v1/sendphoneverifycode') {
        return axios.get(url,{
            params
        })
    }, 
    bills: {
        getList: function (params, url = config.prefix + '/gasSettlement/list') {
            return request(url, 'get', params)
        },
        getListOfClients: function (params, url = config.prefix + '/gasSettlement/listforCompany') {
            return request(url, 'get', params)
        },
        getDetailList: function (params, url = config.prefix + '/gasSettlement/detaiLlist') {
            return request(url, 'get', params)
        },
        updateStatusOfBills: function (params, url = config.prefix + '/gasSettlement/updateStatus') {
            return request(url, 'get', params)
        },
        detailName: function (params, url = config.prefix + '/gasSettlement/detailName') {
            return request(url, 'get', params)
        },
        exportDetail: function (params, url = config.prefix + '/gasSettlement/detaiLlistExport') {
            return exportExcel(url, 'get', params)
        }
    },
    // 消息管理 接口前缀是：/htapi/api/v1/docloud-message/
            messageManagement: {
                // 消息列表 相关接口

                // 消息模板 相关接口
                messageTemplate: {
                    // 列表
                    getList:function(params, url='dongwan/smartMessageTemplate/findPage') {
                        return request(url,'get',params)
                    },
                    // 新增
                    addMessage:function(data, url='dongwan/smartMessageTemplate/add') {
                        return request(url, 'post', [], data)
                    },
                    // 查看详情
                    getDetail:function(params, url='dongwan/smartMessageTemplate/select') {
                        return request(url,'get',params)
                    },
                    // 编辑
                    updateMessage:function(data, url='dongwan/smartMessageTemplate/update') {
                        return request(url, 'post', [], data)
                    },
                    // 获取消息模板（新增提醒规则表单中 消息模板 下拉列表中数据）
                    getAllTemplate:function(params, url='dongwan/smartMessageTemplate/listAll') {
                        return request(url, 'get', params)
                    },
                    // 获取消息分类（新增消息模板 消息分类 下拉列表中数据）
                    getMessageCategory:function(data, url='/htapi/api/v1/crm/api/systemMgr/dictionarys') {
                        return request(url, 'post', [], data)
                    },
                    // 停用
                    stopMessage:function(params, url='dongwan/smartMessageTemplate/delete') {
                        return request(url,'get',params)
                    },
                    // 微信消息通知
                    getWxMessageNoticeList:function(params, url='dongwan/smartMessageTemplateWx/list') {
                        return request(url, 'get', params)
                    },
                },
                // 规则设置 相关接口
                messageRules: {
                    getList:function(params, url='/dongwan/messageRule/list') {
                        return request(url,'get',params)
                    },
                    // 规则设置（添加规则）
                    addMessage:function(data, url='/dongwan/messageRule/save') {
                        return request(url, 'post', [], data)
                    },
                    // 规则设置（编辑规则）
                    updateMessage:function(data, url='/dongwan/messageRule/update') {
                        return request(url, 'post', [], data)
                    },
                    // 规则设置（删除规则）
                    deleteMessage:function(params, url='/dongwan/messageRule/delete') {
                        return request(url, 'get', params)
                    },
                },
                // 消息列表
                messageList: {
                    // 待发消息
                    waitToBeSendMessage: {
                        // 列表
                        getList:function(params, url='/dongwan/waitingMessage/list') {
                            return request(url,'get',params)
                        },
                        // 发送
                        sendMessage:function(params, url='/dongwan/waitingMessage/send') {
                            return request(url, 'post', [], params)
                        },
                        // 作废
                        voidMessage:function(params, url='/dongwan/waitingMessage/invalid') {
                            return request(url, 'post', [], params)
                        },
                        // 导出
                        export: function (params, url = '/dongwan/waitingMessage/export') {
                            return exportExcel(url, 'get', params)
                        },
                    },
                    historyMessage: {
                        getList:function(params, url='/dongwan/alreadyMessage/list') {
                            return request(url,'get',params)
                        },
                        // 导出
                        export: function (data, url = '/dongwan/alreadyMessage/export') {
                            return exportExcel(url, 'get', data)
                        },
                        // 重新发送
                        reSendMessage:function(params, url='/dongwan/alreadyMessage/resend') {
                            return request(url, 'post', [], params)
                        }
                    }
                }
            },

    demandPlanTrack: {
        getCompanyList: function (params, url = config.prefix + '/demand/set/getNameAndCodes') {
            return request(url, 'get', params)
        },
        exportDayData: function (data, url = config.prefix + '/demand-supply/export-day') {
            return exportExcel(url, 'post', {}, data)
        },
        exportMonthData: function (data, url = config.prefix + '/demand-supply/export-month') {
            return exportExcel(url, 'post', {}, data)
        }
    },
    // 调度日报模块相关接口
    dispatchDaily: {
        getSupplyGasDaily: function (data, url = config.prefix + '/supplymad/listComps') {
            return request(url, 'post', [], data)
        },
        // 供气日报
        getSupplyGasDailyList: function (params, url = config.prefix + '/unconventional/overview') {
            return request(url, 'get', params)
        },
        // 非常规管道气 导出
        unconventionExport: function (params, url = config.prefix + '/unconventional/overview/export') {
            return exportExcel(url, 'get', params)
        },
        // 供气日报 导出
        supplyGasDailyExport: function (params, url = config.prefix + '/supplymad/listComps/export') {
            return exportExcel(url, 'get', params)
        },
        // // 非常规管道气日报详情
        unconventionDetail: function (params, url = config.prefix + '/unconventional/detail') {
            return request(url, 'get', params)
        },
        // 非常规管道气日报详情 导出
        unconventionDetailExport: function (params, url = config.prefix + '/unconventional/detail/export') {
            return exportExcel(url, 'get', params)
        }
    },
    // 用户执行跟踪
    gasTracking: {
        // 日 相关接口
        day: {
            getDayGasTrackingList: function(params, url = '/dongwan/gasplan/day/list') {
                return request(url, 'get', params)
            },
            // 导出
            export: function (params, url = '/dongwan/gasplan/day/list/export') {
                return exportExcel(url, 'get', params)
            },          
        },
        // 月 相关接口 
        month: {
            getMonthGasTrackingList: function(params, url = '/dongwan/gasplan/month/list') {
                return request(url, 'get', params)
            },
            // 详情 表格
            getMonthGasTrackingDetail: function(params, url = '/dongwan/gasplan/month/detail') {
                return request(url, 'get', params)
            }, 
            // 详情 跟踪图
            getMonthGasTrackingChart: function(params, url = '/dongwan/gasplan/month/detail') {
                return request(url, 'get', params)
            }, 
            // 详情 累计图
            getMonthGasTrackingCumulativeDetail: function(params, url = '/dongwan/gasplan/month/detail') {
                return request(url, 'get', params)
            },
            // 导出
            export: function (params, url = '/dongwan/gasplan/month/listExport') {
                return exportExcel(url, 'get', params)
            },    
            // 月度用气计划发送消息内容查询
            getMonthGasTrackingEarlyWarningContent: function(params, url = '/dongwan/gasplan/month/message') {
                return request(url, 'get', params)
            }, 
            // 月度用气计划发送消息
            sendMonthGasTrackingMessage: function(params, url = '/dongwan/gasplan/month/send') {
                return request(url, 'get', params)
            }, 
                                             
        }
    },
    users: {
        //用户基础信息列表
        userInformationlist: function (params, url = 'dongwan/basicInfo/list') {
            return request(url, 'get', params)
        },
        //基础信息删除
        userDeletion: function (params, url = 'dongwan/basicInfo/delete') {
            return request(url, 'get', params)
        },
        //基础信息ID查询
        userIdQuery: function (params, url = 'dongwan/basicInfo/get') {
            return request(url, 'get', params)
        },
        //基础信息保存
        userSaving: function (params, url = 'dongwan/basicInfo/save') {
            return request(url, 'post', [], params)
        },
        //查询
        userSerch: function (params, url = 'dongwan/basicInfo/search') {
            return request(url, 'get', params)
        },
        //客户列表导出
        exportData: function (params, url = 'dongwan/basicInfo/export') {
            return exportExcel(url, 'get', params)
        },
        //基础信息修改
        userUpdata: function (params, url = 'dongwan/basicInfo/update') {
            return request(url, 'POST',[], params)
        },
        //通过BP查询基本信息
        userSerchBP: function (params, url = 'dongwan/basicInfo/getBasicInfo') {
            return request(url, 'get', params)
        },
    },
    volumeList: {
        //日度气量对账单列表
        volumemationList: function (params, url = 'dongwan/gasDay/list') {
            return request(url, 'get', params)
        },     
   
        //查询日度气量对账单明细
        serchmationList: function (params, url = 'dongwan/gasDay/get') {
            return request(url, 'get', params)
        },
        //日度气量对账单列表导出
      mationListexport: function (params, url = 'dongwan/gasDay/list/export') {
            return exportExcel(url, 'get', params)
        },
        //日气量对账单消息发送
      messageSend: function (params, url = 'dongwan/gasDay/send') {
            return exportExcel(url, 'get', params)
        },
        //getTree
      selectTree: function (params, url = 'dongwan/dictionary/getTree') {
            return exportExcel(url, 'get', params)
        },
    },
    //用气计划与反馈
    gasPlanAndFeedback: {
        // 年
        yearContractlist: function (params, url = '/dongwan/yearContract/list') {
          return request(url, 'get', params)
        },
        yearContractExport: function (params, url = '/dongwan/yearContract/export') {
          return exportExcel(url, 'get', params)
        },
        yearContractGetDetail: function (params, url = '/dongwan/yearContract/getDetail') {
          return request(url, 'get', params)
        },
        // 月
        monthContractList: function (params, url = '/dongwan/monthPlan/list') {
          return request(url, 'get', params)
        },
        monthContractGetDetail: function (params, url = '/dongwan/monthPlan/getDetail') {
          return request(url, 'get', params)
        },
        monthContractExport: function (params, url = '/dongwan/monthPlan/export') {
          return exportExcel(url, 'get', params)
        },
        // 周
        weekContractList: function (params, url = '/dongwan/weekPlan/list') {
          return request(url, 'get', params)
        },
        weekContractGetDetail: function (params, url = '/dongwan/weekPlan/listDetail') {
          return request(url, 'get', params)
        },
        weekContractExport: function (params, url = '/dongwan/weekPlan/export') {
          return exportExcel(url, 'get', params)
        },
        weekContractExamine: function (params, url = '/dongwan/weekPlan/audit') {
          return request(url, 'get', params)
        },
        // 日
        dayContractList: function (params, url = '/dongwan/dayplan/list') {
          return request(url, 'get', params)
        },
        // 日详情审批记录
        dayApproveHistoryList: function (params, url = '/dongwan/dayplan/getPreGasFlowHistoryByPreGasId') {
          return request(url, 'get', params)
        },
        dayContractGetDetail: function (params, url = '/dongwan/dayplan/listDetail') {
          return request(url, 'get', params)
        },
        dayContractExport: function (params, url = '/dongwan/dayplan/export') {
          return exportExcel(url, 'get', params)
        },
        dayContractExamine: function (params, url = '/dongwan/dayplan/audit') {
          return request(url, 'post', [], params)
        },
        getInfoByName: function (params, url = '/auth/api/user/login-infoByName') {
          return request(url, 'get', params)
        },
    },
    //价值列表
    getValueList: {
      getList: function (params, url = '/khrzcenter/api/csrBaseMgr/v2/noGrantCustomers') {
        return request(url, 'get', params)
      },
      getDetail: function (params, url = '/fxpgcenter/customer/label/details') {
        return request(url, 'get', params)
      },
      // getList: function (params, url = '/hehe/api/csrBaseMgr/v2/noGrantCustomers') {
      //   return request(url, 'get', params)
      // },
      // getDetail: function (params, url = '/haha/customer/label/details') {
      //   return request(url, 'get', params)
      // },
  }
}

export default api