var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    URL_WEB_M: '"http://m.preview.yoomath.com"',
    URL_WEB_MH5: '"http://h5.preview.yoomath.com"',
    URL_WEBCOM: '"http://webcom.preview.yoomath.com"',
    URL_WEIXIN: '"http://wx.preview.yoomath.com"',
    URL_API_M: '"http://h5.preview.yoomath.com"'
})
