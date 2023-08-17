// import axios from 'axios'
// // import { MessageBox, Message } from 'element-ui'
// // import store from '@/store'
// // import { getToken } from '@/utils/auth'

// // 创建了一个axios实例
// const http = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// export default http

/*  --------------------------------  分割线  ------------------------------------ */
/* 改造requrst ⭐⭐⭐⭐
  之前常用的：
    1. 引入axios
    1.1. axios.get(url, ...).then(res =>{})
    1.2 配置根路径 axios.default.baseURL = ...
    1.3 axios({method: 'get}, data:{}.....)

  针对中大型项目，有一种更好的方式
    1. 创建1个aixos实例 -> ⭐因为可能一个项目中有很多不同的根路径，所以可以创建2个3个4个以上的实例，这样就可以配置很多路径 -> aixos.create({ ... ... })⭐
    2. const http1 = axios.create({...})
       const http2 = axios.create({...})
*/
import axios from 'axios'
import { Message } from 'element-ui'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// 创建了一个axios实例
const http = axios.create({
  /* 设置当前axios实例的根路径 ->  -> -> -> */
  /* process.env.VUE_APP_BASE_API ->
     和.env.development  .env.product  .env.staging 内的VUE_APP_BASE_API有关 -> 这里设置之后在项目中任意地方都能访问到process.env
     -> 如果文件中的命名没有按照VUE_APP_XXX这种形式，页面级是获取不到的（打印不出来），但是webpack可以解析
     process.env 打印出来如下：
     process.env: {
      BASE_API: '/',
      NODE_ENV: 'development',
      VUE_APP_BASE_API: '/dev-api'
     }
  */
  /* process.env.VUE_APP_BASE_API -> 根据环境变量的配置 -> 设置不同的根路径 */
  // 最终的请求路径是 http://localhost:8000 + env文件中的配置路径 + 请求的地址：比如 '/sys/login'
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url

  // withCredentials: true, // send cookies when cross-domain requests

  /* 接口的超时时间 -> 作用: 当前接口如果5s内没有返回数据，直接断开链接 -> 如果不设置这个东西 -> 接口可能会崩       如果没有返回数据 -> 正常5s内可以访问到数据了，说明接口可能出现问题了或者网络有问题了 */
  timeout: 5000

  // ....  其他配置
})

// 添加请求拦截器
http.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(function(response) {
  // 对响应数据做点什么

  /*
  1. 响应成功 状态码为200的情况下
    1.1 业务成功，业务状态码为10000的情况下，继续
    1.2 业务失败，业务状态码为20001的情况系， 统一处理，统一走某些逻辑
  */
  if (!response.data.success) {
    Message.error(response.data.message)
    // 这里返回一个错误的promise，
    return Promise.reject(response.data.message)
    // 括号里面写不写res.message的区别就是  Uncaught (in promise) 用户名或密码错误 中是否存在 ‘用户名或密码错误’ 这几个字
  }
  return response
}, function(error) {
  // 对响应错误做点什么
  /*
    响应失败，响应状态码是400 500，最好也进行统一处理
    弹框 => 提示用户登录失败
  */
  // 此处怎么知道提示的消息是error.message，这个是后端后端设置的
  Message.error(error.message)
  return Promise.reject(error)
})

export default http
