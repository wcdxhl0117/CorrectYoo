var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    URL_WEB_M: '"http://m.zuoye.web.dev.uxuebao.com"',
    URL_WEB_MH5: '"http://h5.yoomath.dev.uxuebao.com"',
    URL_WEBCOM: '"http://webcom.dev.uxuebao.com"',
    URL_WEIXIN: '"http://wx.web.dev.uxuebao.com"',
    URL_API_M: '"http://h5.yoomath.dev.uxuebao.com"'
})
