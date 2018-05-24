import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login'
import tel_check from '@/pages/phoneNum/tel_check'
import check_success from '@/pages/phoneNum/check_success'
import balance from '@/pages/balance/balance'
import balance_detail from '@/pages/balance/balance_detail'
import home from '@/pages/home/home'
import change_pwd from '@/pages/change_info/change_pwd'
import change_tel from '@/pages/change_info/change_tel'
import help from '@/pages/other/help'
import personal from '@/pages/personal/personal'
import withdrawal from '@/pages/balance/withdrawal'
import teacherCert from '@/pages/teacherCertification/teacherCert'
import auditing from '@/pages/teacherCertification/auditing'
import audited from '@/pages/teacherCertification/audited'
import IDcard from '@/pages/IDcard/IDcard'
import IDwating from '@/pages/IDcard/IDwating'
import IDpass from '@/pages/IDcard/IDpass'
import Correct from '@/pages/Correct/Correct'
import mock from '@/pages/mock/Correct'
import province from '@/pages/SchoolGrade/province'
import city from '@/pages/SchoolGrade/city'
import area from '@/pages/SchoolGrade/area'
import school from '@/pages/SchoolGrade/school'
import wrongInfo from '@/pages/wrong-info/wrong-info'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/login',
        meta: {
            title: '登录'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/tel_check',
        name: 'tel_check',
        component: tel_check,
        meta: {
            title: '手机认证'
        }
    },
    {
        path: '/check_success',
        name: 'check_success',
        component: check_success,
        meta: {
            title: '手机认证'
        }
    },
    {
        path: '/balance',
        name: 'balance',
        component: balance,
        meta: {
            title: '我的余额'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: home,
        meta: {
            title: '小悠快批',
            keepAlive: false
        }
    },
    {
        path: '/balance_detail',
        name: 'balance_detail',
        component: balance_detail,
        meta: {
            title: '余额明细'
        }
    },
    {
        path: '/change_pwd',
        name: 'change_pwd',
        component: change_pwd,
        meta: {
            title: '修改密码'
        }
    },
    {
        path: '/change_tel',
        name: 'change_tel',
        component: change_tel,
        meta: {
            title: '修改手机号'
        }
    },
    {
        path: '/help',
        name: 'help',
        component: help,
        meta: {
            title: '帮助中心'
        }
    },
    {
        path: '/personal',
        name: 'personal',
        component: personal,
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/withdrawal',
        name: 'withdrawal',
        component: withdrawal,
        meta: {
            title: '提现'
        }
    },
    {
        path: '/teacherCert',
        name: 'teacherCert',
        component: teacherCert,
        meta: {
            title: '教师认证'
        }
    },
    {
        path: '/auditing',
        name: 'auditing',
        component: auditing,
        meta: {
            title: '教师认证'
        }
    },
    {
        path: '/audited',
        name: 'auditied',
        component: audited,
        meta: {
            title: '教师认证'
        }
    },
    {
        path: '/IDcard',
        name: 'IDcard',
        component: IDcard,
        meta: {
            title: '实名认证'
        }
    },
    {
        path: '/IDwating',
        name: 'IDwating',
        component: IDwating,
        meta: {
            title: '实名认证'
        }
    },
    {
        path: '/IDpass',
        name: 'IDpass',
        component: IDpass,
        meta: {
            title: '实名认证'
        }
    },
    {
        path: '/Correct',
        name: 'Correct',
        component: Correct,
        meta: {
            title: '批改中',
            keepAlive: false
        }
    },
    {
        path: '/mock',
        name: 'mock',
        component: mock,
        meta: {
            title: '模拟批改',
            keepAlive: false
        }
    },
    {
        path: '/school',
        name: 'school',
        component: school,
        meta: {
            title: '选择学校'
        }
    },
    {
        path: '/province',
        name: 'province',
        component: province
    },
    {
        path: '/city',
        name: 'city',
        component: city
    },
    {
        path: '/area',
        name: 'area',
        component: area
    },
    {
        path: '/wrongInfo',
        name: 'wrongInfo',
        component: wrongInfo,
        meta: {
            title: '详情'
        }
    }

    ]
})
