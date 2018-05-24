var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    URL_WEB_M: '"http://m.test1.yoomath.com/"',
    URL_WEB_MH5: '"http://h5.test1.yoomath.com"',
    URL_WEBCOM: '"http://webcom.test1.yoomath.com"',
    URL_WEIXIN: '"http://wx.web.test1.uxuebao.com"',
    // URL_API_M: '"http://192.168.66.69:8080"'
    URL_API_M: '"http://h5.test1.yoomath.com"'
    // URL_API_M: '"http://yoocorrect.test1.yoomath.com"'

})
