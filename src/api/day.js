import request from '@/utils/axios'

const prefix = '/api/distribution-service/v2'

export default {
    // 获取燃气客户、供应商用气量
    getEntys8898: () => request.get(`/gasJournal/getEntys`), 
    // 获取客户信息列表
    // getResources: () => request.get(`${prefix}/StaffController/getResources`),
}