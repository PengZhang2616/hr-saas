import { reqLogin } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

export default {
  // 用戶的数据 状态
  state: {
    /* 这里先取cookie中是否有token，保持刷新不丢失 */
    token: getToken() || ''
  },
  // 同步
  mutations: {
    setUserToken(state, token) {
      state.token = token
      // 因为vuex刷新会丢失，所以在设置token的时候同时使用cookie持久化存储
      setToken(token)
    }
  },
  // 异步
  actions: {
    // 登陆请求 - 存储token
    login(context, form) {
      // 此处的return new Promise是因为login页面路由跳转时候同步的，不会等到登陆成功后再跳转，他直接跳转了，所以要返回一个promise
      return new Promise((resolve, reject) => {
        reqLogin(form).then(res => {
          // 由于这里无论是密码正确或者密码错误，都会跳转路由，所以在拦截器中统一处理
          context.commit('setUserToken', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  // 基于state重新整合出的数据 状态
  getters: {},
  // 命名空间
  namespaced: true
}
