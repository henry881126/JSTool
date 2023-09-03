const router = [
    // 未定义父级菜单如何配置
    // 以下为子级菜单
    {
        path: '/operationSituation',
        name: 'operationSituation',
        component: () => import('./views/operationAndDispatching/operationSituation'),
        meta: { title: '运行监控' },
    },
    {
        path: '/gasVolumeTracking',
        name: 'gasVolumeTracking',
        component: () => import('./views/operationAndDispatching/gasVolumeTracking'),
        meta: { title: '气量执行与跟踪' },
    },
    {
        path: '/monitorAndControl',
        name: 'monitorAndControl',
        component: () => import('./views/operationAndDispatching/monitorAndControl'),
        meta: { title: '输配能力监控' },
    },
    {
        path: '/calculation',
        name: 'calculation',
        component: () => import('./views/operationAndDispatching/calculation'),
        meta: { title: '输配能力测算' },
    },
    {
        path: '/peakShaving',
        name: 'peakShaving',
        component: () => import('./views/operationAndDispatching/peakShaving'),
        meta: { title: '库存及调峰' },
    },
    {
        path: '/prePlanDatabase',
        name: 'prePlanDatabase',
        component: () => import('./views/operationAndDispatching/calculation/prePlanDatabase'),
        meta: { title: '预案库', activeMenu: '/calculation' },
    },
    {
        path: '/prePlanDatabaseDetail',
        name: 'prePlanDatabaseDetail',
        component: () => import('./views/operationAndDispatching/calculation/prePlanDatabaseDetail'),
        meta: { title: '预案库详情', activeMenu: '/calculation' },
    },
    {
        path: '/customerStatusMonitoring',
        name: 'customerStatusMonitoring',
        component: () => import('./views/operationAndDispatching/customerStatusMonitoring'),
        meta: { title: '客户状态监控' },
    },
]

export default router