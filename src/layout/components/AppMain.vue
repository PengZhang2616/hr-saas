<template>
  <section class="app-main">
    <!-- transition的作用
      切换的时候router-view页面会有动态切换效果
     -->
    <transition name="fade-transform" mode="out-in">
      <!-- key的作用
        key这里设置了paath，当路径变化了，组件会销毁并重建，不会缓存
        优势: 及时获取最新的内容，如果走缓存可能会出现内容不更新（以为是bug）
       -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
