import api from '@/api/index'
// 客户风险列表

const delivery = {
    getters: {
        tips: state => state.tips,
    },
    state: {
        tips:'',
    },

    mutations: {
        SET_TIPS: (state, value) => {
            state.tips = value
        }
    },
    actions: {
        setTips(context, val) {
            context.commit('SET_TIPS',val)
        }
    }
}

export default delivery
