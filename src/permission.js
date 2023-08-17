// /*
//   permission文件的作用：
//   权限 -> 登陆拦截

//   如果有token，
//     如果访问login页面，直接去首页
//     如果去的首页 -> 想去就去

//   如果没有token
//     判断是否为白名单(比如登录页，404等)的路径
//     是 -> 直接去
//     不是 -> 拦截，重定向到登录页

//   白名单一般放一些没有权限的路径，比如 '/login' , '/404' 。。。等
// */

import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
console.log(store)

const whiteList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  // console.log('to---', to)
  // console.log('from---', from)
  // console.log('next---', next)

  /* 开启进度条 */
  NProgress.start()

  if (store.getters.token) {
    /* 有token */
    if (to.path === '/login') { // 有token，访问login页面
      // next({ path: '/' })
      next('/') // 去首页
      NProgress.done() // 注意点：此处因为不会触发路由后置守卫，所以要手动结束进度条
    } else {
      next()
    }
  } else {
    /* 没有token */
    if (whiteList.indexOf(to.path) !== -1) { // 这里也可以写whiteList.includs('login')
      next()
    } else {
      next('/login')
      NProgress.done() // 注意点：此处因为不会触发路由后置守卫，所以要手动结束进度条
    }
  }
})

router.afterEach((to, from) => {
  // console.log(to) // 是一个对象，包含了要去（当前）的路由信息
  // console.log(from)// 是一个对象，包含了来（从哪来）的路由信息
  // 由于afterEach不需要跳转，所以不需要next()
  // 只要进入了窗口展示之后，立刻会触发后置守卫，可以在这里执行一些相关的逻辑

  /* 1. 关闭进度条 */
  console.log(1)
  NProgress.done()
})

// import store from './store'
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// /* 确定白名单 */
// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
