const https = require('https')

const pkgJson = require('./package.json')
process.env.VUE_APP_VERSION = pkgJson.version
console.info('APP VERSION:', process.env.VUE_APP_VERSION)

const merge = require('webpack-merge')

const outputDir = 'dist'
const assetsDir = 'static'

module.exports = {
  outputDir,
  assetsDir,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      return {
        devServer: {
          public: `https://localhost:${process.env.WEB_APP_PORT}`, // For docker host
          // host: 'localhost',
          https: true,
          port: process.env.WEB_APP_PORT,
          watchOptions: {poll: true, ignored: /(node_modules|languages|dist|build|vendor|Docker|tests|backup|\.lock|\.git)/},
          disableHostCheck: true,
          historyApiFallback: true
        },
        devtool: 'source-map'
      }
    } else {
      return {
      }
    }
  },
  pwa: {
    name: pkgJson.appName || pkgJson.name,
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      exclude: [
        /\/\.\w+$/,
        /\.(map|md|txt|ts|es6|lock)$/,
        /img\/icons\//,
        /favicon\.ico$/,
        /manifest\.json$/,
        /package\.json$/
      ]
    }
  },
  chainWebpack: config => {
    // Pug loader
    config.module
      .rule('pug')
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .end()
  }
}
