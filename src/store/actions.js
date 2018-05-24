import * as api from '@/api/global'
import { GLOBAL } from '@/store/mutation-type'
// import * as types from './mutation-type'

const actions = {
    'ERROR_MESSAGE': ({ state, commit }, msg) => {
        commit('ERROR_MESSAGE', msg)
        setTimeout(() => { commit('ERROR_MESSAGE', '') }, 2000)
    },
    [GLOBAL.ENV]: ({ state, commit, dispatch }) => {
        api.sysEvn({}, (_data) => {
            commit(GLOBAL.ENV, _data)
        })
    }
}

export default actions
