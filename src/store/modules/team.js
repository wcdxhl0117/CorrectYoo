import * as api from '@/api/team'

export const CHAPTER_INFO = ''
export const TEAM = {}
const state = {
    allChapterList: []
}
const getters = {
    [TEAM]: (state) => {
        return state.allChapterList
    }
}
const actions = {
    [CHAPTER_INFO]: ({ commit }) => {
        api.chapterData({}, (_data) => commit(CHAPTER_INFO, _data))
    }
}
const mutations = {
    [CHAPTER_INFO]: function (state, _data) {
        state.allChapterList = _data
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
