import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// import http from './utils/request'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

/* 将http挂载到Vue实例身上，这样所有的vue组件都可以通过this.$http来获取axios实例对象，不用每个组件都引入http了 */
/* 如果有很多组件都通用一个方法，挂载原型身上不失为一个好办法 */
/* 但是我们把请求封装在了api的js文件中，vue文件只处理业务，不写请求代码，方便管理
   所以js文件使用不了this.$http，但这个思想在其他场景下还是值得借鉴的
*/
// Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
