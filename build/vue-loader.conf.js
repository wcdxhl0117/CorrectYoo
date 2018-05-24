var utils = require('./utils')
var config = require('../config')
var px2rem = require('postcss-px2rem')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: process.env.NODE_ENV === 'production'
      ? config.build.productionSourceMap
      : config.server.cssSourceMap,
    extract: process.env.NODE_ENV === 'production'
  }),
  vue: {
    postcss: [
      require('postcss-px2rem')({remUnit: 75})
    ]
  },
  postcss: function() {
        return [px2rem({remUnit: 75})]
  }
}
