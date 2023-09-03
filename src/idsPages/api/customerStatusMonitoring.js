import request from '../utils/request'
//获取selectOption
export function getKeyCustomer(data) {
    return request({
        url: '/scheduling-pc/idsDict/dictTypeDetail',
        method: 'post',
        data
    })
}
//获取selectOption
export function getKeyCustomerLabels(data) {
    return request({
        url: '/scheduling-pc/dongguan/customerLabels',
        method: 'post',
        data
    })
}
//获取客户监控列表
export function getCustomerMonitorList(data) {
    return request({
        url: '/scheduling-pc/dongguan/customerMonitorList',
        method: 'post',
        data
    })
}
//客户监控压力折线
export function getCustomerPressureChart(data) {
    return request({
        url: '/scheduling-pc/dongguan/customerPressureChart',
        method: 'post',
        data
    })
}
//客户监控压力折线
export function getCustomercustomerGasChart(data) {
    return request({
        url: '/scheduling-pc/dongguan/customerGasChart',
        method: 'post',
        data
    })
}
