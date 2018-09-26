import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import * as getters from './getters'
import mutations from './mutations'



Vue.use(Vuex)

const state = {
    message: '',
    env: process.env,
    showHeader: {}
}

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    actions,
    mutations
})
