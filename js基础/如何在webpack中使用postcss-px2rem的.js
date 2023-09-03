1. npm install --save-dev postcss-plugin-px2rem
2. 该build目录下vue-loader.config.js中的配置

下面的第5、19-21 行为自己添加。 rootValue中的75为 1 rem所对应的px； 默认为100， 我这里改为75。

'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
var px2rem = require('postcss-plugin-px2rem');
module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: isProduction ?
            config.build.productionSourceMap :
            config.dev.cssSourceMap,
        extract: isProduction
    }),
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    },
    postcss: function() {
        return [px2rem({ rootValue: 75 })];
    }
}