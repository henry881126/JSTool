import request from '@/utils/axios'
import overView from './overView'
import gasTrail from './gasTrail'
import purchaseAnalysis from './purchaseAnalysis'
import dic from './dic'
import clientAnalyse from './clientAnalyse'
import axios from 'axios'

export default {
  login: (params) => {
    // return axios.get(`/usercenter/api/distribution-service/v2/StaffController/userlogin`, {
      // 因登录功能从原系统中分离出来，服务器改变，故需更改接口前缀
      // 再次修改登录接口地址（20211013修改） 由“`/api/v1/user/login`” 修改为 http://docloud-authorization-test.ipaas.enncloud.cn:80/api/user/login
      return axios.get('/auth/api/user/login', {
      params,
    }).then(res => {
      if(res) {
        return res.data
      }
    })
  },
  loginMsg: (params) => {
    return axios.get(`api/v1/phone/login`, {
      params,
    }).then(res => {
      if(res) {
        return res.data
      }
    })
  },
  logout: () => request.get('/api/distribution-service/v2/StaffController/loggedOut'),

  // 大屏api
  ...overView,
  ...gasTrail,
  ...purchaseAnalysis,
  ...dic,
  ...clientAnalyse
}
