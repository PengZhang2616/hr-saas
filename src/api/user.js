/* usr模块是和用户请求相关的所有接口
    本来是在login页面写以下请求的，但是本着一个函数只处理一个业务(单一原则)，所以抽离封装

handleLogin() {
  this.$refs.loginForm.validate(boo => {
      if (!boo) return this.$message.warning('请输入合法数据')
      this.$http({
        method: 'POST',
        url: '/api/sys/login',
        data: this.loginForm
      }).then(res => {
        console.log(res)
      })
    })
  }

*/

import http from '@/utils/request'

/* 此处不能使用this了，在vue文件中可以访问到this实例对象
    所以不能使用this.$http了，原型上的Vue.prototype.$http不用设置了
*/
// export function reqLogin(data) {
//   return http({
//     method: 'POST',
//     url: '/api/sys/login',
//     data
//   })
// }
export const reqLogin = data => http({
  method: 'POST',
  // 这里的url路径是简写，意味着请求自己，即http://localhost:8000
  // 最终的请求路径是 http://localhost:8000 + env文件中的配置路径 + /sys/login
  // 即 'http://localhost:8000/api/sys/login',然后在通过反向代理转发
  url: '/sys/login',
  data
})

