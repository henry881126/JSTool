import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import dic from './modules/dic.js'
import risk from './modules/risk.js'
import delivery from './modules/delivery.js'
import operationAndDispatching from '../idsPages/store/operationAndDispatching'
import calculation from '../idsPages/store/calculation'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        dic,
        risk,
        delivery,
        operationAndDispatching,
        calculation,
    },
});

export default store;
