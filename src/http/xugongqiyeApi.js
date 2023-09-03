import {request,requestSecond, exportExcel} from './http'
import config from '../config/config'
import axios from 'axios'

const api = {
    // 需供企业配置
    demandDisplay:{
        demandSetSelect:function (params, url = config.prefix + '/demand/set/select') {
            return request(url, 'get', params)
        },
        demandSetGetNameAndCodes:function (params, url = config.prefix + '/demand/set/getNameAndCodes') {
            return request(url, 'get', params)
        },
        demandExAuthorg:function (params, url = config.prefix + '/gsm-manage-api//ex/authorg') {
            return request(url, 'get', params)
        },
        demandSetAdd:function (params, url = config.prefix + '/demand/set/add') {
            return requestSecond(url, 'post',{}, params)
        },
        demandSetDel:function (params, url = config.prefix + '/demand/set/del') {
            return request(url, 'get', params)
        },
        demandSetUpdate:function (params, url = config.prefix + '/demand/set/update') {
            return requestSecond(url, 'post',{}, params)
        },    
        
    }

}

export default api