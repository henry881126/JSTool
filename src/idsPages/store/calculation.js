import {
  getPlanId,
  getPlanConfigDetail,
  getPlanConfigDetailInit,
  savePlanConfig,
  saveReservePlanConfig,
  startComputed,
  getComputedResult,
  getStatisticsSummary,
  cancelComputed,
} from '../api/calculation';

const state = {
  planId: "",   // 输配能力测算planId
  version: 0,
  isAllGasConfigDone: false, // 气量参数设置是否全部完成
  isComputing: false, // 是否在仿真计算中
  isTimeOver: true,  // 终止计算后，2分钟间隔期状态是否结束：true结束false未结束
}

const mutations = {
  SET_PLAN_ID: (state, data) => {
    state.planId = data;
  },
  SET_VERSION: (state, data) => {
    state.version = data;
  },
  IS_ALL_GAS_CONFIG_DONE: (state, data) => {
    state.isAllGasConfigDone = data;
  },
  IS_COMPUTING: (state, data) => {
    state.isComputing = data;
  },
  IS_TIMEOVER: (state, data) => {
    state.isTimeOver = data;
  },
}

const actions = {
  // 获取planId
  getPlanId({ commit }) {
    return new Promise((resolve, reject) => {
      getPlanId({}).then(res => {
        const { resultCode, data } = res;
        if (resultCode == 0) {
          commit('SET_PLAN_ID', data.planId);
          commit('SET_VERSION', data.version);
        }
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 初始化获取气量参数获取/配置详情
  getPlanConfigDetailInit({ commit }, params) {
    return new Promise((resolve, reject) => {
      getPlanConfigDetailInit(params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 选择日期获取气量参数获取/配置详情
  getPlanConfigDetail({ commit }, params) {
    return new Promise((resolve, reject) => {
      getPlanConfigDetail(params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 气量参数获取/配置-确定
  savePlanConfig({ commit }, params) {
    return new Promise((resolve, reject) => {
      savePlanConfig(params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 气量参数获取/配置-保存为预案库
  saveReservePlanConfig({ commit }, params) {
    return new Promise((resolve, reject) => {
      saveReservePlanConfig(params).then(res => {
        const { resultCode, data } = res;
        if (resultCode == 0) {
          // 设置是否全部完成
          commit('IS_ALL_GAS_CONFIG_DONE', data.setupComplete);
        }
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 仿真开始计算获取version
  startComputed({ commit }, params) {
    return new Promise((resolve, reject) => {
      startComputed(params).then(res => {
        const { resultCode, data } = res;
        if (resultCode == 0 && data) {
          commit('SET_VERSION', data.version);
        }
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 轮询获取仿真列表以及数据
  getComputedResult({ commit }, params) {
    return new Promise((resolve, reject) => {
      getComputedResult(params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取统计信息
  getStatisticsSummary({ commit }, params) {
    return new Promise((resolve, reject) => {
      getStatisticsSummary(params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 结束仿真计算
  cancelComputed({ commit }, params) {
    return new Promise((resolve, reject) => {
      cancelComputed(params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
