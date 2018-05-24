import { GLOBAL } from '@/store/mutation-type'
import * as types from './mutation-type'
const mutations = {
    'ERROR_MESSAGE': (state, _data) => {
        state.message = _data
    },
    [GLOBAL.ENV]: function (state, _data) {
        state.env = Object.assign(state.env || {}, _data)
        // console.log(state.env)
    },
    [types.SET_SHOW_HEADER](state, showHeader) {
        state.showHeader = showHeader
      }
}

export default mutations
