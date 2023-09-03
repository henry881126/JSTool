export const decimalMixin = {
    methods: {
        /**
         * 保留4位小数，且去除末尾0，
         * 如：原值为123.45678，处理后为123.4568；
         *     原值为123.45000，处理后为123.45；
         *     原值为123.000，处理后为123
         */
        reserveFourDecimal(val) {
            let result = val
            if(!isNaN(val) && val !== null) {
                // 处理toFixed四舍五入问题，toFixed采用银行家舍入法
                if(val.toString().indexOf('.') != -1) {
                    let arr = val.toString().split('.')
                    if(arr[1].length === 5) {
                        arr[1] = arr[1].toString() + '1'
                        result = arr.join('.')
                    }
                }
                return parseFloat(parseFloat(result).toFixed(4))
            }
            return result
        },

        /**
         * 保留6位小数，且去除末尾0
         */
        reserveSixDecimal(val) {
            if(!isNaN(val)) {
                return parseFloat(parseFloat(val).toFixed(6))
            }
            return val
        },
        /**
         * 气款管理 余额查询 采购单价字段专用处理方法
         * 当priceTypew值为1时，gasPrice（采购单价）值的格式为：234.56
         * 当priceTypew值为2时，gasPrice（采购单价）值的格式为：23/23/23/8/8
         */
        processPurchaseUnitPrice(priceType,val) {
            if(priceType === "1") {
                return this.reserveFourDecimal(val)
            }else if(priceType === "2") {
                let arr = val.split('/')
                arr = arr.map(item => this.reserveFourDecimal(item))
                return arr.join('/')
            }
        }
    }
}

export const companyMixin = {
    methods: {
        /**
         * 判断是否是省公司，是则返回true，不是则返回false
         * curComCode String 当前公司编号
         */
        isProvinceCompany(curComCode) {
            const companyList = this.$store.getters['companyList']          // 当前登录用户对应的各公司
            const curComObj = companyList.find(company => company.code === curComCode)           // 根据当前公司code获取到当前公司对象
            // cpmo_cop 的值为true表示是省公司，否则是非省公司
            if(curComObj['cpmo_cop'].toString() === 'true') {    
                console.log('current company obj:',curComObj)                       
                return true
            }else {
                console.log('current company obj:',curComObj)                       
                return false
            }
        }
    }
}
// 分销埋点 统计页面停留时长
export const buriedPointOfStayTimeMixin = {
    data() {
        return {
            browerTime:0,
            timer:null,
            title: '',
            desc: '',
            routeArr: [
                {
                    path: 'psAnalyse',
                    title: '气量调配-采销分析页面停留时长',
                    desc: '采销分析页面停留时长',
                },
                {
                    path: 'gasvolumeTrack',
                    title: '气量调配-气款跟踪页面停留时长',
                    desc: '气款跟踪页面停留时长',
                },
                {
                    path: 'billsOfGas',
                    title: '气量调配-气量对账单页面停留时长',
                    desc: '气量对账单页面停留时长',
                },  
                {
                    path: 'extractingContents',
                    title: '气量调配-提取量跟踪页面停留时长',
                    desc: '提取量跟踪页面停留时长',
                },  
                {
                    path: 'DemandPlanTrack',
                    title: '需供计划管理-需供计划跟踪页面停留时长',
                    desc: '需供计划跟踪页面停留时长',
                },  
                {
                    path: 'DemandDeploy',
                    title: '需供计划管理-需供企业配置页面停留时长',
                    desc: '需供企业配置页面停留时长',
                },  
                {
                    path: 'DispatchDaily',
                    title: '需供计划管理-调度日报页面停留时长',
                    desc: '调度日报页面停留时长',
                },  
                {
                    path: 'dispatchingHome',
                    title: '分销中心-调度首页页面停留时长',
                    desc: '调度首页页面停留时长',
                },  
                {
                    path: 'operationSituation',
                    title: '分销中心-运行监控页面停留时长',
                    desc: '运行监控页面停留时长',
                },  
                {
                    path: 'gasVolumeTracking',
                    title: '分销中心-气量执行与跟踪页面停留时长',
                    desc: '气量执行与跟踪页面停留时长',
                },  
                {
                    path: 'monitorAndControl',
                    title: '分销中心-输配能力监控页面停留时长',
                    desc: '输配能力监控页面停留时长',
                },  
                {
                    path: 'calculation',
                    title: '分销中心-输配能力测算页面停留时长',
                    desc: '输配能力测算页面停留时长',
                },  
                {
                    path: 'gasPerformanceTrack',
                    title: '气源管理-气源执行与跟踪页面停留时长',
                    desc: '气源执行与跟踪页面停留时长',
                },   
                {
                    path: 'customerlist',
                    title: '客户管理-客户列表页面停留时长',
                    desc: '客户列表页面停留时长',
                },  
                {
                    path: 'Agreement',
                    title: '客户管理-合同管理页面停留时长',
                    desc: '合同管理页面停留时长',
                },  
                {
                    path: 'gasPlanAndFeedback',
                    title: '客户管理-用气计划反馈页面停留时长',
                    desc: '用气计划反馈页面停留时长',
                },   
                {
                    path: 'gasTracking',
                    title: '客户管理-用气执行跟踪页面停留时长',
                    desc: '用气执行跟踪页面停留时长',
                },  
                {
                    path: 'gasvolumelist',
                    title: '客户管理-对账单页面停留时长',
                    desc: '对账单页面停留时长',
                },  
                {
                    path: 'messageList',
                    title: '客户管理-消息管理-消息列表页面停留时长 ',
                    desc: '消息列表页面停留时长',
                },   
                {
                    path: 'messageTemplate',
                    title: '客户管理-消息管理-消息模板页面停留时长',
                    desc: '消息模板页面停留时长',
                },  
                {
                    path: 'ruleSettings',
                    title: '客户管理-消息管理-规则设置页面停留时长',
                    desc: '规则设置页面停留时长',
                }                                                                                                                                                                                        
            ]
        }
    },
    mounted() {
        console.log('start brower time1', this.browerTime)
        this.getBrowerTime()
    },
    beforeDestroy() {
        clearInterval(this.timer)
        window.zhuge.track(this.title,{[this.desc]:this.browerTime})
        console.log('end brower time2', this.browerTime)
    },
    methods: {
        getBrowerTime() {
            this.timer = setInterval(() => {
              this.browerTime++
            }, 1000);
        }        
    },
    beforeRouteEnter(to, from, next) {
        const toPath = to.path.toLowerCase()
        console.log('route to:', to, toPath)
        next(vm => {
            const currentRouteObj = vm.routeArr.filter(item => toPath.indexOf(item.path.toLowerCase()) !== -1)[0]
            console.log('match route:', currentRouteObj)
            vm.title = currentRouteObj.title
            vm.desc = currentRouteObj.desc
        })

    }
}
// 分销埋点 进入页面事件
export const buriedPointOfEnterPageMixin = {
    data() {
        return {
            browerTime:0,
            routeArrOfEnterPage: {
                '/psAnalyse':{
                    path: 'psAnalyse',
                    title: '气量调配-进入采销分析页面',
                    desc: '采销分析页面',
                },
                '/gasvolumeTrack':{
                    path: 'gasvolumeTrack',
                    title: '气量调配-进入气款跟踪页面',
                    desc: '气款跟踪页面',
                },                
                '/billsOfGas':{
                    path: 'billsOfGas',
                    title: '气量调配-进入气量对账单页面',
                    desc: '气量对账单页面',
                },  
                '/extractingContents':{
                    path: 'extractingContents',
                    title: '气量调配-进入提取量跟踪页面',
                    desc: '提取量跟踪页面',
                },  
                '/DemandPlanTrack':{
                    path: 'DemandPlanTrack',
                    title: '需供计划管理-进入需供计划跟踪页面',
                    desc: '需供计划跟踪页面',
                },  
                '/DemandDeploy':{
                    path: 'DemandDeploy',
                    title: '需供计划管理-进入需供企业配置页面',
                    desc: '需供企业配置页面',
                },  
                '/DispatchDaily':{
                    path: 'DispatchDaily',
                    title: '需供计划管理-进入调度日报页面',
                    desc: '调度日报页面',
                },  
                '/dispatchingHome':{
                    path: 'dispatchingHome',
                    title: '分销中心-进入调度首页页面',
                    desc: '调度首页页面',
                },  
                '/operationSituation':{
                    path: 'operationSituation',
                    title: '分销中心-进入运行监控页面',
                    desc: '运行监控页面',
                },  
                '/gasVolumeTracking':{
                    path: 'gasVolumeTracking',
                    title: '分销中心-进入气量执行与跟踪页面',
                    desc: '气量执行与跟踪页面',
                },  
                '/monitorAndControl':{
                    path: 'monitorAndControl',
                    title: '分销中心-进入输配能力监控页面',
                    desc: '输配能力监控页面',
                },  
                '/calculation':{
                    path: 'calculation',
                    title: '分销中心-进入输配能力测算',
                    desc: '输配能力测算',
                },  
                '/gasPerformanceTrack':{
                    path: 'gasPerformanceTrack',
                    title: '气源管理-进入气源执行与跟踪页面',
                    desc: '气源执行与跟踪页面',
                },   
                '/customerlist':{
                    path: 'customerlist',
                    title: '客户管理-进入客户列表页面',
                    desc: '客户列表页面',
                },  
                '/Agreement':{
                    path: 'Agreement',
                    title: '客户管理-进入合同管理页面',
                    desc: '合同管理页面',
                },  
                '/gasPlanAndFeedback':{
                    path: 'gasPlanAndFeedback',
                    title: '客户管理-进入用气计划反馈页面',
                    desc: '用气计划反馈页面',
                },   
                '/gasTracking':{
                    path: 'gasTracking',
                    title: '客户管理-进入用气执行跟踪页面',
                    desc: '用气执行跟踪页面',
                },  
                '/gasvolumelist':{
                    path: 'gasvolumelist',
                    title: '客户管理-进入对账单页面',
                    desc: '对账单页面',
                },  
                '/messageList':{
                    path: 'messageList',
                    title: '客户管理-消息管理-进入消息列表页面 ',
                    desc: '消息列表页面',
                },   
                '/messageTemplate':{
                    path: 'messageTemplate',
                    title: '客户管理-消息管理-进入消息模板页面',
                    desc: '消息模板页面',
                },  
                '/ruleSettings':{
                    path: 'ruleSettings',
                    title: '客户管理-消息管理-进入规则设置页面',
                    desc: '规则设置页面',
                }                                                                                        
            }
        }
    },
    created() {
        const routeName = this.$route.path
        const currentRouteObj = this.routeArrOfEnterPage[routeName]
        window.zhuge.track(currentRouteObj.title,{'页面名称':[currentRouteObj.desc]})
    }
}