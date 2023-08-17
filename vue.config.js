'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

/* 这里使用了settings里面的网站标题，然后通过configureWebpack使用webpack设置index.html里面的title网站名字 */
const name = defaultSettings.title || 'VUE TEMPLATE ADMIN' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528

/* ⭐在.env.development中设置好port，不同的环境可以设置不同的port ，⭐为什么不用VUE_APP_XX格式，是因为webpack可以解析，但是无法打印⭐ */
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  // 开发服务配置，覆盖或者新增webpack的默认配置
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')

    /* 反向代理（辅助开发）
      代码托管于webpack服务器，我们在本地已经启动了一个服务器9528
      由于浏览器的安全策略，如果后端没有设置CORS跨域，在协议域名端口不同的时候，返回的数据会被浏览器拦截
      解决：把浏览器请求的时候直接请求本地的服务器localhost:8000，通过webpack服务器⭐转发⭐到后端的服务器，是因为服务器与服务器之间是不存在跨域问题的

      上线之后不会就没有webpack服务器什么事情了，生产环境的跨域使用nginx代理或node代理或cors
    */
    proxy: {
      // '/api' 设置一个标识，将来请求中只要是包含了/api， 就会帮助我们转发自己设置的代理
      // 他会找url中的 /api， 如果请求地址中包含/api/login，他就会请求http://ihrm-java.itheima.net/api/login
      '/api': {
        target: 'http://ihrm-java.itheima.net'
        // target指的是目标服务器的地址，写的是后端提供的服务器地址

        /* 路径重写 */
        // 代理：localhost:8000/api/sys/login
        // 目标: http://ihrm-java.itheima.net/sys/login
        // 这个api会被干掉
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
      /* 可以设置多个 */
      // '/baidu': {
      //   target: 'http://www.baidu.com'
      //   // target指的是目标服务器的地址，写的是后端提供的服务器地址
      // }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name, // 网页的标题
    resolve: {
      alias: {
        /* 这里配置了@符号为src路径，配置和了路径别名 */
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
