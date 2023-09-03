import request from '@/utils/axios'

const prefix = '/api/distribution-service/v2'

export default {
    // 获取客户信息列表
    getResources: () => request.get(`${prefix}/StaffController/getResources`),
}