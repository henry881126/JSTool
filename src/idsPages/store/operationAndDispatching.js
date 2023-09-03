import { getList } from '../api/operationAndDispatching'

const operationAndDispatching = {
	getters: {
		list: state => state.list
	},
	state: {
		list: []
	},
	mutations: {
		SET_LIST: (state, data) => {
			state.list = data
		},
	},
	actions: {
		getListTemp({ commit }, params) {
			return new Promise((resolve, reject) => {
				getList({ id: params.id || '123456' }).then(res => {
					if (res.errorCode === '200') {
						const data = res.data;
						commit('SET_LIST', data.list);
						resolve(data)
					} else {
						reject(res.errorMsg)
					}
				}).catch(error => {
					reject(error)
				})
			})
		},
	}
}

export default operationAndDispatching
