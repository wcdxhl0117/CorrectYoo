var path = require('path')
var merge = require('webpack-merge')
var env = {}
// console.log(process.argv[2])
if (process.argv[2]) {
    env = require('./' + process.argv[2] + '.env')
}

module.exports = {
    build: {
        env: merge(env, { NODE_ENV: '"production"' }),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    server: {
        env,
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                target: (env.URL_API_M || '').replace(/\"/g, ''),
                changeOrigin: true,
                router: {
                    'localhost:8080': (env.URL_API_M || '').replace(/\"/g, '')
                }
                // pathRewrite: {
                //     '^/api': ''
                // }
            },
            '/fs': {
                target: (env.URL_WEB_M || '').replace(/\"/g, ''),
                changeOrigin: true,
                router: {
                    'localhost:8080': (env.URL_WEB_M || '').replace(/\"/g, '')
                }
            },
            '/webcom': {
                target: (env.URL_WEBCOM || '').replace(/\"/g, ''),
                changeOrigin: true,
                router: {
                    'localhost:8080': (env.URL_WEBCOM || '').replace(/\"/g, '')
                }
            }
        },
        cssSourceMap: false
    }
}
