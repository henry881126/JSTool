import api from '@/api/index'
import { Message } from 'element-ui'

// 字典信息
const dic = {
    namespaced: true,
    getters: {
        menuList: state => state.menuList,
    },
    state: {
        menuList: [],
        companyList: [],
    },

    mutations: {
        SET_MENU_LIST: (state, menuList) => {
            state.menuList = menuList
        },
    },
    actions: {
        async getDicResources({ commit }) {
            //查询组件配置
            let res = await api.getResources()
            let resData = res
            if (resData.resultCode === 0) {
                commit('SET_MENU_LIST', resData.data[0].menu);
            } else {
                Message.error(resData.resultMessage)
            }
        },
    }
}

export default dic