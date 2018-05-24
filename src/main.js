// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import router from '@/router'
import store from '@/store/index'
import ajax from '@/libs/ajax'
import App from './App'
import flexible from './libs/flexible'
import cookie from 'js-cookie'
// 手势
// import AlloyFinger from 'alloyfinger'
// import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
// Vue.use(AlloyFingerPlugin, {
//     AlloyFinger
// })

import axios from 'axios'
Vue.prototype.$axios = axios

// fastclick
// import fastclick from 'fastclick'
// fastclick.attach(document.body)

import { sync } from 'vuex-router-sync'

import '@/assets/css/reset.css'

import {
  wxSetTitle
} from '@/libs/title'
import {
  GLOBAL
} from '@/store/mutation-type'

Vue.use(ajax)

/**
 * rem自适应
 */
Vue.use(flexible)

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
        wxSetTitle(to.meta.title)
    }
    next()
})

if (process.env.NODE_ENV !== 'production') {
    cookie.set('APP', 'MATH_TEACHER')
    cookie.set('_VERSION', '1.1.1')
    cookie.set('DEVICE_TYPE', 'IOS')
} else {
    store.dispatch(GLOBAL.ENV)
}

sync(store, router)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
  // template: '<router-view></router-view>'
})
