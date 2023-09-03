import api from '@/api/index'
// 客户风险列表

const user = {
    getters: {
        keyword: state => state.keyword,
    },
    state: {
        keyword:'',
    },

    mutations: {
        SET_KEYWORD: (state, value) => {
            state.keyword = value
        }
    },
    actions: {

    }
}

export default user
