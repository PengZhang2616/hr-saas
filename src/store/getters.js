const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 由于在vue中很多地方要访问token，使用$store.state.user.token太复杂了，所以是使用getter派发状态，
  token: state => state.user.token
}
export default getters
