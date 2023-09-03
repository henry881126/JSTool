import axios from 'axios'

// 时间
export const getGasTrackingPriceTime=()=>{
    return axios("/api/v1/gasTrackingPrice/getGasTrackingPriceTime",{
    })
}
// 气款跟踪统计
export const gasTrackingPriceStatistics=(params)=>{
    return axios("/api/v1/gasTrackingPrice/gasTrackingPriceStatistics",{
        params
    })
}
export const gasTrackingPriceStatisticss=(params)=>{
    return axios("/api/v1/gasTrackingPrice/gasTrackingPriceStatistics",{
        params
    })
}
// 获取公司气款跟踪进度
export const getComps=(params)=>{
    return axios("/api/v1/gasTrackingPrice/getComps",{
        params
    })
}
// 获取用气公司气款跟踪明细
export const getCompsDetail=(params)=>{
    return axios("/api/v1/gasTrackingPrice/getCompsDetail",{
        params
    })
}
// 获取供应商气款跟踪进度
export const getLifnrs=(params)=>{
    return axios("/api/v1/gasTrackingPrice/getLifnrs",{
        params
    })
}
// 获取供应商气款跟踪明细
export const getLifnrsDetail=(params)=>{
    return axios("/api/v1/gasTrackingPrice/getLifnrsDetail",{
        params
    })
}