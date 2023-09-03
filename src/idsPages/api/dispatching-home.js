/*
 * @Description:首页api
 * @Author:jiawenjin
 * @Date:2021-10-12
 */
import request from '../utils/request'

export default {
    getDailyGasData: (params) => request({//日用气量执行跟踪
        url: '/scheduling-pc/dgHomePage/dailyGasUsedTrack',
        method: 'post',
        data:params
    }),
    getGasStoreInfo: (params) => request({//库存及调峰气量
        url: '/scheduling-pc/dgHomePage/getStoreTotalInfo',
        method: 'post',
        data:params
    }),
    getStationData:(params) => request({//场站
        url: '/scheduling-pc/dgHomePage/homeStationMonitor',
        method: 'post',
        data:params
    }),
    getAirDifference:(params) => request({//实时气差监控
        url: '/scheduling-pc/dgHomePage/gasDifferenceMonitor',
        method: 'post',
        data:params
    }),
    getGasTracking:(params) => request({//客户用气执行跟踪
        url: '/scheduling-pc/dgHomePage/customerMonitor',
        method: 'post',
        data:params
    }),
    getDistributionMonitorList:(params) => request({//输配能力监控—管网/场站查询
        url: '/scheduling-pc/distributionMonitor/distributionMonitorList',
        method: 'post',
        data:params
    }),
}